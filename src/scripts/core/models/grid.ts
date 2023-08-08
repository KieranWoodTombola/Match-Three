import { Container, Point } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";
import { gsap } from "gsap";

export class Grid extends Container {

    private availWidth: number;
    private gridSize: number;
    private swapTweenPair: [Token, Token];
    private columns: Column[] = [];
    private selectedTokens: [Token | undefined, Token | undefined] = [undefined, undefined];

    constructor (gridSize: number, availWidth: number) {
        super ()

        eventEmitter.on('clickCheck', this.clickCheck, this)
        eventEmitter.on('lazyCallbackFirst', this.lazyCallbackFirst, this);
        eventEmitter.on('lazyCallbackLast', this.lazyCallbackLast, this);

        this.availWidth = availWidth;
        this.gridSize = gridSize;
        this.swapTweenPair = [new Token(-1, -1, gridSize, availWidth, availWidth), new Token(-1, -1, gridSize, availWidth, availWidth)];
        this.swapTweenPair.forEach(token => {
            token.alpha = 0;
            this.addChild(token)
        });
        
        for(var i = 0; i < this.gridSize; i++) {
            const newColumn = new Column(i, this.gridSize, this.availWidth, this.availWidth);
            newColumn.x = (availWidth / (gridSize/i));
            this.columns.push(newColumn);
            this.addChild(newColumn);
        }
        this.position.set(this.getToken(0,0).width * 0.5, this.getToken(0,0).height * 0.5);

    }

    private clickCheck(targetToken: Token): void {
        if(targetToken.matched) {
            return;
        }

        //on FirstClick
        if(!this.selectedTokens[0]) {
            this.selectedTokens[0] = targetToken;
            this.swapTweenPair[1] = targetToken;
            return;
        }

        //on SecondClick
        if(this.selectedTokens[0] && !this.selectedTokens[1]) {

            this.selectedTokens[1] = targetToken;
            this.swapTweenPair[0] = targetToken;

            const origin = new Point(0, 0);
            this.swapTweenPair.forEach(token => {
                token.setParent(this);
                token.position.set(0,0);
                token.interactive = true;
            });

            this.veryCoolTween(this.selectedTokens[0], this.selectedTokens[1], this.swapTweenPair[0], this.swapTweenPair[1]);
            return;
        }
    }

    private veryCoolTween(firstSwapToken: Token, secondSwapToken: Token, firstTweeningToken: Token, secondTweeningToken: Token): void {
        let swapTween = gsap.timeline( {
            duration: 2,
            ease: "back",
            onStart: function(): void {
                eventEmitter.emit('lazyCallbackFirst', firstSwapToken, secondSwapToken);
            },
            onComplete: function(): void {
                eventEmitter.emit('lazyCallbackLast', firstSwapToken, secondSwapToken);
            }
        } );
        swapTween.fromTo(firstTweeningToken,
            {
                x:  (this.availWidth / (this.gridSize/firstSwapToken.parentID)) ,
                y: (this.availWidth / (this.gridSize/firstSwapToken._verticalIndex))
            },
            {
                ease: "back",
                x: (this.availWidth / (this.gridSize/secondSwapToken.parentID)),
                y: (this.availWidth / (this.gridSize/secondSwapToken._verticalIndex))
            }, 0);
        swapTween.fromTo(secondTweeningToken,
            {
                x:  (this.availWidth / (this.gridSize/secondSwapToken.parentID)) ,
                y: (this.availWidth / (this.gridSize/secondSwapToken._verticalIndex)) 
            },
            {
                ease: "back",
                x: (this.availWidth / (this.gridSize/firstSwapToken.parentID)),
                y: (this.availWidth / (this.gridSize/firstSwapToken._verticalIndex))
            }, 0)
    }

    private lazyCallbackFirst(firstSwapToken: Token, secondSwapToken: Token): void {
        firstSwapToken.alpha = 0;
        secondSwapToken.alpha = 0;
        this.swapTweenPair.forEach(token => {token.alpha = 1;})
        const firstSkIndex = firstSwapToken.skIndex;
        const secondSkIndex = secondSwapToken.skIndex;
        firstSwapToken.setToken(secondSkIndex);
        secondSwapToken.setToken(firstSkIndex);
        this.columns.forEach( column => {column.deactivateAllTokens()});
    }

    private lazyCallbackLast(firstSwapToken: Token, secondSwapToken: Token): void {
        this.swapTweenPair.forEach(token => {token.alpha = 0;});
        firstSwapToken.alpha = 1;
        secondSwapToken.alpha = 1;
        this.columns.forEach( column => {column.activateUnMatchedTokens()});
        this.selectedTokens = [undefined, undefined];
        this.resolveMatches();
    }

    /**
     * Use the matchLine function to find matches on columns and then rows
     */
    private resolveMatches(): void {
        //Y Matches
        this.columns.forEach(column => {
            column.tokens = this.matchLine(column.tokens);
        })
        //X Matches
        for(var i = 0; i < this.gridSize; i++) {
            let horizontalArray: Token [] = [];
            this.columns.forEach(column => {
                horizontalArray.push (column.tokens[i]);
            })
            horizontalArray = this.matchLine(horizontalArray);
        }

        //Animate the board using detected matches
        this.columns.forEach(column => {
            column.processMatches();
        })

        //Only use the first Column for testing
        // this.columns[0].tokens = this.matchLine(this.columns[0].tokens);
        // this.columns[0].processMatches();
        // this.columns[0].tokens.forEach(token => {token.matched = false;})
    }

    /**
     * Identifies rows/columns of tokens where there are at least
     * 3 adjacent to eachother.
     * 
     * Identified tokens are marked with highLight()
     * and their matched status is set
     * 
     * @param Token[] - Array of Tokens to be searched for matches
     */
    private matchLine(tokens: Token[]): Token [] {
        let cacheSkIndex: number | undefined = undefined;
        let currentComboTokens: Token[] = [];
        const totalComboTokens: Token[] = [];

        function checkForCombo(): void {
            if(currentComboTokens.length >= 3 ){
                currentComboTokens.forEach(comboToken => {
                    totalComboTokens.push(comboToken);
                })
            }
        }

        tokens.forEach(token => {
            //new token
            if(!cacheSkIndex) {
                cacheSkIndex = token.skIndex;
                currentComboTokens.push(token);
                return;
            }

            //matching token
            if(token.skIndex === cacheSkIndex) {
                currentComboTokens.push(token);
            }

            //last token in the array
            if(token === tokens[this.gridSize-1]) {
                checkForCombo();
                return;
            }

            //cache defined but match failed
            if(token.skIndex !== cacheSkIndex){
                checkForCombo();
                currentComboTokens = [];
                cacheSkIndex = token.skIndex;
                currentComboTokens.push(token);
                return;
            }
        });

        tokens.forEach(token => {
            totalComboTokens.forEach(comboToken => {
                if(token === comboToken) {
                    token.matched = true;
                }
            });
        });

        return tokens;
        
    }

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }

}