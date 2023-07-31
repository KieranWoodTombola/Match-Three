import { Container } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";

export class Grid extends Container {

    private gridSize: number;
    public columns: Column[];
    private activeToken: number;


    constructor (gridSize: number, availWidth: number) {
        super ()

        eventEmitter.on('clickCheck', this.clickCheck)
        eventEmitter.on('tokenFirstClicked', this.swapPrepare);
        eventEmitter.on('tokenSecondClicked', this.swapCheck);

        this.gridSize = gridSize;
        this.columns = [];
        this.activeToken = 0;

        for(var i = 0; i < this.gridSize; i++) {
            const newColumn = new Column(i, this.gridSize, availWidth, availWidth);
            newColumn.x = (availWidth / (gridSize/i));
            this.columns.push(newColumn);
            this.addChild(newColumn);
        }
        
        this.position.set(this.columns[0].tokens[0].width/2, this.columns[0].tokens[0].height/2);

    }

    private clickCheck(tokenX: number, tokenY: number): void {
        console.log("tokenX: ", tokenX, "tokenY", tokenY);

        if(this.activeToken === 0) { this.activeToken = 1; eventEmitter.emit('tokenFirstClicked', tokenX, tokenY)}
        if(this.activeToken === 1) {this.activeToken = 2; eventEmitter.emit('tokenSecondClicked', tokenX, tokenY);}
    }

    private swapPrepare(): void {

    }

    private swapCheck(): void {
        //checkMatch

        //emit swap passed
        //emit swap failed
    }

    // private checkMatch(): void {

    // }


}