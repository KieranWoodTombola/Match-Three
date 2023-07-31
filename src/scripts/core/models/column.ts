import { Container } from "pixi.js";
import { Token } from "./token";


export class Column extends Container{

    private tokens: Token[];
    private columnID: number;
    private columnSize: number;
    // private viewWidth: number;
    // private viewHeight: number;


    constructor(columnID: number, columnSize: number, availWidth: number, availHeight: number) {
        super()

        this.columnID = columnID;
        this.columnSize = columnSize;
        // this.viewWidth = viewWidth;
        // this.viewHeight = viewHeight;

        this.tokens = [];
        for(var i = 0; i < this.columnSize; i++) {
            const randomNumber = Math.round(Math.random() * (9 - 1) + 1);

            //const newToken = new Token(ran, this.columnID, availWidth, columnSize,);
            //parentID: number, locationIndex: number, size: number, skIndex: number, availWidth: number
            const newToken = new Token(this.columnID, i, this.columnSize, randomNumber, availWidth)
            newToken.y = (availHeight / (columnSize/i));

            this.tokens.push(newToken);
            this.addChild(newToken);
        }
    }

    public getAllTokens(): Token[] {
        return this.tokens;
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }

}