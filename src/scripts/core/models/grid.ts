import { Container } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";

export class Grid extends Container {

    private gridSize: number;
    private columns: Column[];
    private activeToken: number;
    private firstToken: Token;

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
        this.firstToken = new Token(-1, -1, -1, 1, 0);

        for(var i = 0; i < this.gridSize; i++) {
            const newColumn = new Column(i, this.gridSize, availWidth, availWidth);
            newColumn.x = (availWidth / (gridSize/i));
            this.columns.push(newColumn);
            this.addChild(newColumn);
        }
        
        this.position.set(this.getToken(0,0).width * 0.5, this.getToken(0,0).height * 0.5);

    }

    private clickCheck(targetToken: Token): void {

        const targetCoords = targetToken.getLocation();
        const targetX = targetCoords[0];
        const targetY = targetCoords[1];
        const targetSkIndex = targetToken.getSkIndex();

        //on SecondClick
        if(this.activeToken === 1) {
            console.log("second token selected at:", targetX, targetY);

            this.activeToken = 2
            const secondToken = targetToken;
            if(this.firstToken === secondToken) {
                this.activeToken = 0;
                return;
            }
            const previousCoords = this.firstToken.getLocation();
            const previousX = previousCoords[0];
            const previousY = previousCoords[1];
            const previousSkIndex = this.firstToken.getSkIndex();

            this.getToken(previousX, previousY).setToken(targetX, targetY, targetSkIndex);
            targetToken.setToken(previousX, previousY, previousSkIndex);

            console.log(this.firstToken.getSkIndex(), targetToken.getSkIndex());

            this.matchCheck(previousCoords);
            this.matchCheck(targetCoords);
            this.activeToken = 0;
            return;
        }

        //on FirstClick
        if(this.activeToken === 0) {
            this.activeToken = 1;
            this.firstToken = targetToken
            console.log("first token selected at:", targetX, targetY);
            return;
        }

        //on first click, despite being defined in the constructor, activeToken appears undefined
        if(this.activeToken === undefined) {
            this.activeToken = 0;
            return;
        }
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
            if(!this.isMatch(origin, this.getToken(i, originY))) {break;}
            xMatches.push(this.getToken(i, originY))
        }

        //token's left
        for(let i = originX-1; i >= 0; i--) {
            if(!this.isMatch(origin, this.getToken(i, originY))) {break;}
            xMatches.push(this.getToken(i, originY))
        }

        //beneath token
        for(let i = originY+1; i <= this.gridSize-1; i++) {
            if(!this.isMatch(origin, this.getToken(originX, i))) {break;}
            yMatches.push(this.getToken(originX, i))
        }

        //above token
        for(let i = originY-1; i >= 0; i--) {
            if(!this.isMatch(origin, this.getToken(originX, i))) {break;}
            yMatches.push(this.getToken(originX, i))
        }

        console.log(xMatches, yMatches);

        if(xMatches.length >= 3) {this.purgeTokens(xMatches)}
        if(yMatches.length >= 3) {this.purgeTokens(yMatches)}
        if( (xMatches.length >= 3) || (yMatches.length >= 3)) {this.nukeBoard();}

    }

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }

    private purgeTokens(inputTokens: Token[]): void {
        inputTokens.forEach(element => {
            element.matched = true;
            console.log(element.matched)
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
            let unmatched = column.getAllTokens().filter(isNotMatched);
            let matched = column.getAllTokens().filter(isMatched);
            matched.forEach(token => {
                token.shuffleSkin();
            });
            let newColumn: Token [];
            newColumn = [];
            matched.forEach(token => {
                newColumn.push(token);
            });
            unmatched.forEach(token => {
                newColumn.push(token);
            });
            for(var i = 0; i <= 5; i++){
                const randomNumber = Math.round(Math.random() * (9 - 1) + 1);
            }
        });

        console.log("KABOOM");

    }

    // private checkMatch(): void {

    // }


}