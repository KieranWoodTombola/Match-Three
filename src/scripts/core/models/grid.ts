import { Container } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";

export class Grid extends Container {

    private gridSize: number;
    private columns: Column[] = [];
    private selectedTokens: [Token | undefined, Token | undefined] = [undefined, undefined];

    constructor (gridSize: number, availWidth: number) {
        super ()

        eventEmitter.on('clickCheck', this.clickCheck, this)

        this.gridSize = gridSize;

        for(var i = 0; i < this.gridSize; i++) {
            const newColumn = new Column(i, this.gridSize, availWidth, availWidth);
            newColumn.x = (availWidth / (gridSize/i));
            this.columns.push(newColumn);
            this.addChild(newColumn);
        }
        
        this.position.set(this.getToken(0,0).width * 0.5, this.getToken(0,0).height * 0.5);

    }

    private clickCheck(targetToken: Token): void {

        //on FirstClick
        if(!this.selectedTokens[0]) {
            this.selectedTokens[0] = targetToken;
            return;
        }

        //on SecondClick
        if(this.selectedTokens[0] && !this.selectedTokens[1]) {
            this.selectedTokens[1] = targetToken;
            const firstSkIndex = this.selectedTokens[0].skIndex;
            const secondSkIndex = this.selectedTokens[1].skIndex;
            this.selectedTokens[0].setToken(secondSkIndex);
            this.selectedTokens[1].setToken(firstSkIndex);
            this.selectedTokens = [undefined, undefined];
            this.resolveMatches();
            this.selectedTokens[0], this.selectedTokens[1] = undefined;
            return;
        }

    }

    /**
     * Use the matchLine function to find matches on columns and then rows
     */
    private resolveMatches(): void {
        //Y Matches
        this.columns.forEach(column => {
            this.matchLine(column.tokens);
        })



        //X Matches
        for(var i = 0; i < this.gridSize; i++) {
            const horizontalArray: Token [] = [];
            this.columns.forEach(column => {
                horizontalArray.push (column.tokens[i]);
            })
            this.matchLine(horizontalArray);
        }
    }

    /**
     * Identifies rows/columns of tokens where there are at least
     * 3 adjacent to eachother.
     * 
     * Identified tokens are marked with highLight()
     * and their matched status is set
     * 
     * @param Token[] - Array of Tokens to be searched for matches
     */
    private matchLine(tokens: Token[]) {
        let cacheSkIndex: number | undefined = undefined;
        let currentComboTokens: Token[] = [];
        const totalComboTokens: Token[] = [];

        function checkForCombo(): void {
            if(currentComboTokens.length >= 3 ){
                currentComboTokens.forEach(comboToken => {
                    totalComboTokens.push(comboToken);
                })
            }
        }

        tokens.forEach(token => {
            //new token
            if(!cacheSkIndex) {
                cacheSkIndex = token.skIndex;
                currentComboTokens.push(token);
                return;
            }

            //matching token
            if(token.skIndex === cacheSkIndex) {
                currentComboTokens.push(token);
                return;
            }

            //last token in the array
            if(token === tokens[this.gridSize-1]) {
                checkForCombo();
                return;
            }

            //cache defined but match failed
            if(token.skIndex !== cacheSkIndex){
                checkForCombo();
                currentComboTokens = [];
                cacheSkIndex = token.skIndex;
                currentComboTokens.push(token);
                return;
            }
        });

        totalComboTokens.forEach(matchedToken => {
            matchedToken.highLight();
            matchedToken.matched = true;
        })
        
    }

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }

}