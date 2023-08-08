import { Container } from "pixi.js";
import { Token } from "./token";

export class Column extends Container{

    public tokens: Token[] = [];
    private columnID: number;
    private columnSize: number;
    private availHeight: number;

    constructor(columnID: number, columnSize: number, availWidth: number, availHeight: number) {
        super();

        this.columnID = columnID;
        this.columnSize = columnSize;
        this.availHeight = availHeight;

        for(var i = 0; i < this.columnSize; i++) {
            const newToken = new Token(this.columnID, i, this.columnSize, availWidth, availHeight)
            newToken.y = (availHeight / (this.columnSize/i));

            this.tokens.push(newToken);
            this.addChild(newToken);
        }
    }

    public processMatches(): void {
            //move tokens from original positions in to the furthest matched token position
            this.columnTweens();

            //rebuild and reset the column's tokens
            this.rebuildTokens();

    }

    private columnTweens(): void {
        const nonMatchCombo: Token [] = [];
        for(let columnInspector: number = 0; columnInspector < this.tokens.length-1; columnInspector++) {
            const target = this.tokens[columnInspector];
            if(!target.matched) {
                nonMatchCombo.unshift(target);
                for(let combo = columnInspector+1; combo <= this.tokens.length-1; combo++) {
                    if(!this.tokens[combo].matched){ break; }
                    for(let i = 0; i < nonMatchCombo.length; i++){
                        nonMatchCombo[i].moveTo(combo-i);
                    }
                }
            }
        }
    }

    private rebuildTokens(): void {
        const matchedTokens: Token [] = [];
        const unmatchedTokens: Token [] = [];
        for(let i = 0; i < this.tokens.length; i++) {
            const target = this.tokens[i]
            if(target.matched) {
                target.hide();
                target.interactive = false;
                matchedTokens.push(target);
            }

            else {
                unmatchedTokens.push(target);
            }
        }
        const newTokens = [...matchedTokens, ...unmatchedTokens]
        for(var i = 0; i < this.columnSize; i++) {
            newTokens[i]._verticalIndex = i;
            newTokens[i].matched = false;
        }
        this.tokens = newTokens;
    }

    public hideMatches(): void {
        this.tokens.forEach(token => {
            if(token.matched) {
                token.hide()
            }
        });
    }

    public revealMatches(): void {
        this.tokens.forEach(token => {
            if(token.matched) {
                token.reveal()
            }
        });
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }

    public processMatches(): void {
            const matchedTokens: Token [] = [];
            const unmatchedTokens: Token [] = [];

            //this.hideMatches();
            
            //build an array of matched tokens and an array of unmatched tokens
            for(let i = 0; i < this.tokens.length; i++) {
                const target = this.tokens[i]
                if(target.matched) {
                    target.shuffleSkin();
                    target.hide();
                    matchedTokens.push(target);
                }

                if(!target.matched) {
                    unmatchedTokens.push(target);
                }
            }

            //the unmatched tokens on the screen
            //find coordinate of the place to move to
            for(let columnInspector: number = 0; columnInspector < this.tokens.length-1; columnInspector++) {

                if(//columnInspector+1 <= this.tokens.length-1 
                     !this.tokens[columnInspector].matched 
                    ) {
                        console.log("columnInspector: ", columnInspector);
                        let combo = columnInspector+1;
                        for(let combo = columnInspector+1; combo <= this.tokens.length-1; combo++) {
                            if(!this.tokens[combo].matched) { 
                                break; 
                            }
                            else 
                                console.log("combo: ", combo);
                                this.tokens[columnInspector].moveTo(combo);
                        }
                }
            }
            //tween there

            this.tokens.forEach(token => {
                token.matched = false;
            })

            // this.tokens = [...matchedTokens, ...unmatchedTokens];
            // console.log(this.tokens);
            // for(var i = 0; i < this.columnSize; i++) {
            //     this.tokens[i].y = (this.availHeight / (this.columnSize/i));
            //     this.tokens[i]._verticalIndex = i;
            // }

            //this.revealMatches();
    }

    public hideMatches(): void {
        this.tokens.forEach(token => {
            if(token.matched) {
                token.hide()
            }
        });
    }

    public replaceAllTokens(newTokens: Token[]): void {
        if(newTokens.length != this.tokens.length) {
            return;
        }
    }

    private rebuildTokens(): void {
        const matchedTokens: Token [] = [];
        const unmatchedTokens: Token [] = [];
        for(let i = 0; i < this.tokens.length; i++) {
            const target = this.tokens[i]
            if(target.matched) {
                target.hide();
                target.interactive = false;
                matchedTokens.push(target);
            }

            if(!target.matched) {
                unmatchedTokens.push(target);
            }
        }
        const newTokens = [...matchedTokens, ...unmatchedTokens]
        for(var i = 0; i < this.columnSize; i++) {
            newTokens[i]._verticalIndex = i;
        }
        this.tokens = newTokens;
    }

    public hideMatches(): void {
        this.tokens.forEach(token => {
            if(token.matched) {
                token.hide()
            }
        });
    }

    public deactivateAllTokens(): void {
        this.tokens.forEach(token => { token.interactive = false });
    }

    public activateUnMatchedTokens(): void {
        this.tokens.forEach(token => {
            if(!token.matched) {
                token.interactive = true;
            }
        });
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }

}