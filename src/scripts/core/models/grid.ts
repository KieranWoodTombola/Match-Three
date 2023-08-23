import { Container } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/all";
gsap.registerPlugin(MotionPathPlugin);
import { Curve } from "../services/curve"

export class Grid extends Container {

    private _availWidth: number;
    private _gridSize: number;
    private _columns: Column[] = [];
    private _selectedTokens: [Token | undefined, Token | undefined] = [undefined, undefined];
    private _matchedTokens: Token[] = [];

    get gridSize() {
        return this._gridSize;
    }

    constructor(gridSize: number, availWidth: number) {
        super()
        eventEmitter.on('clickCheck', this.clickCheck, this);
        this._availWidth = availWidth;
        this._gridSize = gridSize;
        for (let i = 0; i < this._gridSize; i++) {
            const newColumn = new Column(i, this._gridSize, this._availWidth);
            newColumn.x = (availWidth / (gridSize / i));
            this._columns.push(newColumn);
            this.addChild(newColumn);
        }
        this.position.set(this.getToken(0, 0).width * 0.5, this.getToken(0, 0).height * 0.5);
    }

    private clickCheck(targetToken: Token): void {
        if (targetToken.matched) {
            return;
        }
        targetToken.animate(false);

        //on FirstClick
        if (!this._selectedTokens[0]) {
            this._selectedTokens[0] = targetToken;
            return;
        }

        //on SecondClick
        if (this._selectedTokens[0] && !this._selectedTokens[1]) {

            this._selectedTokens[1] = targetToken;
            this._selectedTokens.forEach(token => {
                if (!token) { return; }
                token.setParent(this);
                token.interactive = true;
            });
            //snap the tokens to their destination
            const firstX = (this._availWidth / (this._gridSize / this._selectedTokens[0].parentID))
            const firstY = (this._availWidth / (this._gridSize / this._selectedTokens[0].verticalIndex))
            const secondX = (this._availWidth / (this._gridSize / this._selectedTokens[1].parentID))
            const secondY = (this._availWidth / (this._gridSize / this._selectedTokens[1].verticalIndex))

            this._selectedTokens[0].position = { x: secondX, y: secondY }
            this._selectedTokens[1].position = { x: firstX, y: firstY }

            //set the tokens' skins
            const firstSkIndex = this._selectedTokens[0].skIndex;
            const secondSkIndex = this._selectedTokens[1].skIndex;

            this._selectedTokens[0].setSkin(secondSkIndex);
            this._selectedTokens[1].setSkin(firstSkIndex);

            //THE TOKENS SWAP POSITIONS FIRST!
            const tweenCurve = new Curve(
                [this._selectedTokens[0].x, this._selectedTokens[0].y],
                [this._selectedTokens[1].x, this._selectedTokens[1].y]
            );

            const rotateFirst = tweenCurve.rotate90(this._selectedTokens[0].x, this._selectedTokens[0].y);
            const rotateSecond = tweenCurve.rotate90(this._selectedTokens[1].x, this._selectedTokens[1].y);

            //tween the tokens from their DESTINATION to their ORIGIN
            const swapTween = gsap.timeline({
                ease: "back",
                onStart:( () => {
                    this._columns.forEach(column => { 
                        column.deactivateAllTokens() 
                    });
                }),
                onComplete:( () => {
                    this._columns.forEach(column => {
                        column.activateAllTokens()
                    });
                    this._selectedTokens = [undefined, undefined];
                    this.resolveMatches();
                    eventEmitter.emit('onSwapComplete');
                }),
            });

            swapTween.to(this._selectedTokens[0],
                {
                    motionPath: {
                        curviness: 2,
                        path: [
                            { x: rotateFirst[0], y: rotateFirst[1] },
                            { x: firstX, y: firstY }
                        ]
                    },
                    duration: 1.5,
                }, 0);

            swapTween.to(this._selectedTokens[1],
                {
                    motionPath: {
                        curviness: 2,
                        path: [
                            { x: rotateSecond[0], y: rotateSecond[1] },
                            { x: secondX, y: secondY }
                        ]
                    },
                    duration: 1.5,
                }, 0);
            return;
        }
    }

    private resolveMatches(): void {
        //Y Matches
        this._columns.forEach(column => {
            this.matchLine(column.tokens);
        });

        //X Matches
        for (let i = 0; i < this._gridSize; i++) {
            const horizontalArray: Token[] = [];
            this._columns.forEach(column => {
                horizontalArray.push(column.tokens[i]);
            });
            this.matchLine(horizontalArray);
        }

        //Animate the board using detected matches
        eventEmitter.emit('onMatch', this._matchedTokens);
        this._matchedTokens = [];
        this._columns.forEach(column => {
            column.processMatches();
        });

        //Only use the first Column for testing
        // this.columns[0].tokens = this.matchLine(this.columns[0].tokens);
        // this.columns[0].processMatches();
        // this.columns[0].tokens.forEach(token => {token.matched = false;})
    }

    private matchLine(tokens: Token[]): void {
        let cacheSkIndex: number | undefined = undefined;
        let currentComboTokens: Token[] = [];
        const totalComboTokens: Token[] = [];

        function checkForCombo(): void {
            if (currentComboTokens.length >= 3) {
                currentComboTokens.forEach(comboToken => {
                    totalComboTokens.push(comboToken);
                });
            }
        }

        tokens.forEach(token => {
            //new token
            if (!cacheSkIndex) {
                cacheSkIndex = token.skIndex;
                currentComboTokens.push(token);
                return;
            }

            //matching token
            if (token.skIndex === cacheSkIndex) {
                currentComboTokens.push(token);
            }

            //last token in the array
            if (token === tokens[this._gridSize - 1]) {
                checkForCombo();
                return;
            }
            
            //cache defined but match failed
            if (token.skIndex !== cacheSkIndex) {
                checkForCombo();
                currentComboTokens = [];
                cacheSkIndex = token.skIndex;
                currentComboTokens.push(token);
                return;
            }
        });

        tokens.forEach(token => {
            totalComboTokens.forEach(comboToken => {
                if (token === comboToken) {
                    token.matched = true;
                    this._matchedTokens.push(comboToken);
                }
            });
        });
    }

    public getToken(X: number, Y: number): Token {
        return this._columns[X].getToken(Y);
    }
}
