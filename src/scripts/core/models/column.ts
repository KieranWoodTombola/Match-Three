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

        for(var i = 0; i < this.columnSize; i++) {
            const randomNumber = Math.round(Math.random() * (9 - 1) + 1);

            const newToken = new Token(this.columnID, i, this.columnSize, randomNumber, availWidth)
            newToken.y = (availHeight / (columnSize/i));

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