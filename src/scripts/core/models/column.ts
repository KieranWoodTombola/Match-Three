import { Container } from "pixi.js";
import { Token } from "./token";

export class Column extends Container{

    public tokens: Token[] = [];
    private columnID: number;
    private columnSize: number;
    private availHeight: number;

    constructor(columnID: number, columnSize: number, availWidth: number, availHeight: number) {
        super()

        this.columnID = columnID;
        this.columnSize = columnSize;
        this.availHeight = availHeight;

        for(var i = 0; i < this.columnSize; i++) {
            const randomNumber = Math.round(Math.random() * (9 - 1) + 1);

            const newToken = new Token(this.columnID, i, this.columnSize, randomNumber, availWidth, availHeight)
            newToken.y = (availHeight / (this.columnSize/i));

            this.tokens.push(newToken);
            this.addChild(newToken);
        }
    }

    public processMatches(): void {
            const matchedTokens: Token [] = [];
            const unmatchedTokens: Token [] = [];
            
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

            //move tokens from original positions in to the furthest matched token position
            for(let columnInspector: number = 0; columnInspector < this.tokens.length-1; columnInspector++) {
                if(!this.tokens[columnInspector].matched) {
                    let combo = columnInspector+1;
                    for(let combo = columnInspector+1; combo <= this.tokens.length-1; combo++) {
                        if(!this.tokens[combo].matched) { 
                            break; 
                        }
                        else {
                            console.log("combo: ", combo);
                            this.tokens[columnInspector].moveTo(combo);
                        }
                    }
                }
            }

            this.tokens.forEach(token => {
                token.matched = false;
            })
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
                token.matched = false;
            }
        });
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }

    public removeAllTokens(): void {
        this.tokens = [];
    }

    public replaceAllTokens(newTokens: Token[]): void {
        if(newTokens.length != this.tokens.length) {
            return;
        }
    }

}