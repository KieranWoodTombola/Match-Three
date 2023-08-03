import { Container } from "pixi.js";
import { Token } from "./token";

export class Column extends Container{

    public tokens: Token[] = [];
    private columnID: number;
    private columnSize: number;


    constructor(columnID: number, columnSize: number, availWidth: number, availHeight: number) {
        super()

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




    public removeAllTokens(): void {
        this.tokens = [];
    }

    public replaceAllTokens(newTokens: Token[]): void {
        if(newTokens.length != this.tokens.length) {
            return;
        }
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }
}