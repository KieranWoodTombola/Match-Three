import { Container } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";

export class Grid extends Container {

    private gridSize: number;
    private columns: Column[];
    private activeToken: number;


    constructor (gridSize: number, availWidth: number) {
        super ()

        //for fixing context issues
        //eventEmitter.on('clickCheck', this.clickCheck.bind(this))
        //eventEmitter.on('clickCheck', this.clickCheck, this)

        eventEmitter.on('clickCheck', this.clickCheck, this)
        // eventEmitter.on('tokenFirstClicked', this.swapPrepare);
        //eventEmitter.on('tokenSecondClicked', this.swapCheck);

        this.gridSize = gridSize;
        this.columns = [];
        this.activeToken = 0;

        for(var i = 0; i < this.gridSize; i++) {
            const newColumn = new Column(i, this.gridSize, availWidth, availWidth);
            newColumn.x = (availWidth / (gridSize/i));
            this.columns.push(newColumn);
            this.addChild(newColumn);
        }
        
        this.position.set(this.getToken(0,0).width * 0.5, this.getToken(0,0).height * 0.5);

    }

    private clickCheck(tokenX: number, tokenY: number): void {
        //on first click, despite being defined in the constructor, activeToken appears undefined
        if(this.activeToken === undefined) {
            this.activeToken = 0;
        }

        const location = [tokenX, tokenY];
        this.matchCheck(location);

        // if(this.activeToken === 0) {
        //     this.activeToken = 1; 
        //     eventEmitter.emit('tokenFirstClicked', tokenX, tokenY);
        //     console.log("FirstClick", this.activeToken)
        //     return;
        // }

        // if(this.activeToken === 1) {
        //     this.activeToken = 2; 
        //     eventEmitter.emit('tokenSecondClicked', tokenX, tokenY); 
        //     console.log("SecondClick", this.activeToken)
        //     return; 
        // }
    }

    private swapPrepare(): void {

    }

    private matchCheck(inputCoords: number[]): void {

        const originX = inputCoords[0];
        const originY = inputCoords[1];
        const origin = this.getToken(originX, originY);
        let xMatches = []; xMatches.push(origin);
        let yMatches = []; yMatches.push(origin);

        //check token's right
        for(let i = originX+1; i <= this.gridSize-1; i++) {
            if(!this.isMatch(origin, this.getToken(i, originY))) {
                break;
            }
            xMatches.push(this.getToken(i, originY))
        }

        //token's left
        for(let i = originX-1; i >= 0; i--) {
            if(!this.isMatch(origin, this.getToken(i, originY))) {
                break;
            }
            xMatches.push(this.getToken(i, originY))
        }

        //beneath token
        for(let i = originY+1; i <= this.gridSize-1; i++) {
            if(!this.isMatch(origin, this.getToken(originX, i))) {
                break;
            }
            yMatches.push(this.getToken(originX, i))
        }

        //above token
        for(let i = originY-1; i >= 0; i--) {
            if(!this.isMatch(origin, this.getToken(originX, i))) {
                break;
            }
            yMatches.push(this.getToken(originX, i))
        }

        if(xMatches.length >= 3) {
            this.purgeTokens(xMatches)
        }
        if(yMatches.length >= 3) {
            this.purgeTokens(yMatches)
        }
        if( (xMatches.length >= 3) || (yMatches.length >= 3)) {
            this.nukeBoard();
        }

    }

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }

    private purgeTokens(inputTokens: Token[]): void {
        inputTokens.forEach(element => {
            element.matched = true;
        });
    }

    private isMatch(originToken: Token, comparisonToken: Token): boolean {
        if(originToken.getSkIndex() === comparisonToken.getSkIndex()) {
            return true;
        }
        else {
            return false;
        }
    }

    private nukeBoard(): void {

        function isMatched(token: Token) {
            return (token.matched);
        }

        function isNotMatched(token: Token) {
            return (!token.matched);
        }

        this.columns.forEach(column => {
            const unmatched = column.getAllTokens().filter(isNotMatched);
            const matched = column.getAllTokens().filter(isMatched);
            matched.forEach(token => {
                token.shuffleSkin();
            });
            const newColumn = column.getAllTokens();
            matched.forEach(token => {
                newColumn.push(token);
            });
            unmatched.forEach(token => {
                newColumn.push(token);
            });
        });

    }

    // private checkMatch(): void {

    // }


}