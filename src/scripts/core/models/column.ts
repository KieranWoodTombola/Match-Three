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

    public removeAllTokens(): void {
        this.tokens = [];
    }

    public replaceAllTokens(newTokens: Token[]): void {
        if(newTokens.length != this.tokens.length) {
            console.log("error on replaceAllTokens: input length does not match");
            return;
        }
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }

    public veryCoolTokenReplacement(): void {

        this.tokens.forEach(token => {
            if(token.matched) {
                token.hide();
            }
        })


        function isMatched(token: Token) {
            return (token.matched);
        }

        function isNotMatched(token: Token) {
            return (!token.matched);
        }
        
        const newTokenArray = this.getAllTokens();

        const matched = this.getAllTokens().filter(isMatched);
        matched.forEach(token => {
            token.shuffleSkin();
            newTokenArray.push(token);
        });

        const unmatched = this.getAllTokens().filter(isNotMatched);
        unmatched.forEach(token => {
            newTokenArray.push(token);
        });

        newTokenArray.forEach(token => {
            token.matched = false;
        })

        this.replaceAllTokens(newTokenArray);
}

}