import { Container } from "pixi.js";
import { Column } from "./column";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";

export class Grid extends Container {

    private gridSize: number;
    private columns: Column[];
    private activeToken: number;
    private firstTokenLocation: number[];

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
        const firstTokenLocation = [-1, -1];
        this.firstTokenLocation = firstTokenLocation;

        for(var i = 0; i < this.gridSize; i++) {
            const newColumn = new Column(i, this.gridSize, availWidth, availWidth);
            newColumn.x = (availWidth / (gridSize/i));
            this.columns.push(newColumn);
            this.addChild(newColumn);
        }
        
        this.position.set(this.getToken(0,0).width * 0.5, this.getToken(0,0).height * 0.5);

    }

    private clickCheck(targetToken: Token): void {
        //on first click, despite being defined in the constructor, activeToken appears undefined
        if(this.activeToken === undefined) {
            
            this.activeToken = 0;
        }

        //on FirstClick
        if((this.activeToken === 0) && (this.firstTokenLocation[0] === -1) && (this.firstTokenLocation[0] === -1)) {
            targetToken.highLight();
            this.activeToken = 1;
            this.firstTokenLocation = targetToken.getLocation();
            return;
        }

        //on SecondClick
        if(this.activeToken === 1) {
            targetToken.highLight();
            this.activeToken = 2;

            //Identify first Token
            const firstX = this.firstTokenLocation[0];
            const firstY = this.firstTokenLocation[1];
            const firstTokenCopy = this.getToken(firstX, firstY);
            const firstSkIndex = firstTokenCopy.getSkIndex();

            //Identify second Token
            const secondX = targetToken.getLocation()[0];
            const secondY = targetToken.getLocation()[1];
            const secondSkIndex = this.getToken(secondX, secondY).getSkIndex();

            // //Swap Tokens
            const tempFirstToken = this.getToken(firstX, firstY);
            const tempSecondToken = this.getToken(secondX, secondY);
            

            //Swapping isn't working as expected
            let targetFirst = this.getToken(firstX, firstY); //get the Token at the stored coordinates of the Token clicked first
            targetFirst.setToken(secondSkIndex); //set the skin of the first token
            let targetSecond = this.getToken(secondX, secondY);
            targetSecond.setToken(firstSkIndex);

            this.matchCheck(this.getToken(firstX, firstY));
            this.matchCheck(this.getToken(secondX, secondY));

            this.nukeBoard();

            this.firstTokenLocation = [-1, -1];
            this.activeToken = 0;
            return;
        }

    }

    /**
     * 
     * Using target token, search horizontally and vertically for adjacent matching tokens
     * Add those tokens to arrays and mark the tokens for later removal
     */

    private matchCheck(inputToken: Token): void {

        const origin = inputToken;
        const originX = origin.getLocation()[0];
        const originY = origin.getLocation()[1];
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
            this.markMatchedTokens(xMatches);
        }
        if(yMatches.length >= 3) {
            this.markMatchedTokens(yMatches);
        }
        if((xMatches.length < 3) && (yMatches.length < 3)) {
        }

    }

    private getToken(X: number, Y: number): Token {
        return this.columns[X].getToken(Y);
    }

    private markMatchedTokens(inputTokens: Token[]): void {
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

    /**
     * 
     * search the board for tokens found to be in a matching position
     * reassemble the column
     * Unmatches tokens shoud be at the bottom of the column
     * Matching tokens should be at the top of the column with randomised skins.
     * 
     */
    private nukeBoard(): void {
        function isMatched(token: Token) {
            return (token.matched);
        }

        function isNotMatched(token: Token) {
            return (!token.matched);
        }

        this.columns.forEach(targetColumn => {
            
            const newTokenArray = targetColumn.getAllTokens();

            const matched = targetColumn.getAllTokens().filter(isMatched);
            matched.forEach(token => {
                token.shuffleSkin();
                token.highLight();
                newTokenArray.push(token);
            });

            const unmatched = targetColumn.getAllTokens().filter(isNotMatched);
            unmatched.forEach(token => {
                newTokenArray.push(token);
            });

            newTokenArray.forEach(token => {
                token.matched = false;
            })

            targetColumn.replaceAllTokens(newTokenArray);
        });

    }

}