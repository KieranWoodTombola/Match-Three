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
        //console.log("tokenX: ", tokenX, "tokenY", tokenY, "ActiveToken: ", this.activeToken);

        const location = [tokenX, tokenY];


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

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }

    private isMatch(originToken: Token, comparisonToken: Token): boolean {
        if(originToken.getSkIndex() === comparisonToken.getSkIndex()) {
            return true;
        }
        else {
            return false;
        }
    }

}