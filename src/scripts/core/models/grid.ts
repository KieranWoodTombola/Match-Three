import { Container, Point } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/all";
gsap.registerPlugin(MotionPathPlugin);


export class Grid extends Container {

    private availWidth: number;
    private gridSize: number;
    private columns: Column[] = [];
    private selectedTokens: [Token | undefined, Token | undefined] = [undefined, undefined];

    constructor (gridSize: number, availWidth: number) {
        super ()

        eventEmitter.on('clickCheck', this.clickCheck, this)
        eventEmitter.on('onSwapStart', this.onSwapStart, this);
        eventEmitter.on('onSwapComplete', this.onSwapComplete, this);

        this.availWidth = availWidth;
        this.gridSize = gridSize;
        
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
            return;
        }

        //on SecondClick
        if(this.selectedTokens[0] && !this.selectedTokens[1]) {

            this.selectedTokens[1] = targetToken;
            this.selectedTokens.forEach(token => {
                if(token){
                    token.setParent(this);
                    token.interactive = true;
                }
            });
            //snap the tokens to their destination
            const firstX = (this.availWidth / (this.gridSize/this.selectedTokens[0].parentID))
            const firstY = (this.availWidth / (this.gridSize/this.selectedTokens[0]._verticalIndex))
            const secondX = (this.availWidth / (this.gridSize/this.selectedTokens[1].parentID))
            const secondY = (this.availWidth / (this.gridSize/this.selectedTokens[1]._verticalIndex))
            this.selectedTokens[0].position = {x: secondX, y: secondY}
            this.selectedTokens[1].position = {x: firstX, y: firstY}

            //set the tokens' skins
            const firstSkIndex = this.selectedTokens[0].skIndex;
            const secondSkIndex = this.selectedTokens[1].skIndex;
            this.selectedTokens[0].setSkin(secondSkIndex);
            this.selectedTokens[1].setSkin(firstSkIndex);

            //tween the tokens from their DESTINATION to their ORIGIN
            const swapTween = gsap.timeline( {
                ease: "back",
                onStart: function(): void {
                    eventEmitter.emit('onSwapStart');
                },
                onComplete: function(): void {
                    eventEmitter.emit('onSwapComplete');
                }
            } );

            swapTween.to(this.selectedTokens[0],
                {
                    motionPath: {
                        curviness: 1,
                        path: [
                            {x: secondX, y: secondY},
                            {x: secondX, y: firstY}, 
                            {x: firstX, y: firstY}
                        ]
                    },
                    duration: 1.5
                }, 0)
            swapTween.to(this.selectedTokens[1],
                {
                    motionPath: {
                        curviness: 1,
                        path: [
                            {x: firstX, y: firstY}, 
                            {x: firstX , y: secondY}, 
                            {x: secondX, y: secondY}
                        ]
                    },
                    duration: 1.5
                }, 0)

            return;
        }
    }

    private onSwapStart(): void {
        this.columns.forEach( column => {column.deactivateAllTokens()});
    }

    private onSwapComplete(): void {
        this.selectedTokens = [undefined, undefined];
        this.resolveMatches();
        this.columns.forEach( column => {column.activateUnMatchedTokens()});
    }

    private resolveMatches(): void {
        //Y Matches
        this.columns.forEach(column => {
            this.matchLine(column.tokens);
        })
        //X Matches
        for(var i = 0; i < this.gridSize; i++) {
            let horizontalArray: Token [] = [];
            this.columns.forEach(column => {
                horizontalArray.push (column.tokens[i]);
            })
            this.matchLine(horizontalArray);
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
    private matchLine(tokens: Token[]): void{
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
    }

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }
}