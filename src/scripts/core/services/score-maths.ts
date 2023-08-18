import { Token } from "../models/token";

export class ScoreMaths {

    static scoreMap: Map <number, number> = new Map <number, number>([
        [1, 5],
        [2, 10],
        [3, 25],
        [4, 50],
        [5, 100],
        [6, 200],
        [7, 250],
        [8, 500],
        [9, 1000]
    ]);

    static getScore(skin: number): number | undefined {
        if(this.scoreMap.has(skin)) {return this.scoreMap.get(skin)}
        else return undefined;
    }

    static orderMatchedTokens(tokens: Token[]): Token [][] {
        const orderedTokens: Token[][] = []
        let tokenCache: Token[] = [];
        let skIndexCache: number = -1;

        //break array into 2d array with token skins
        tokens.forEach(token => {
            if(tokens.indexOf(token) === 0) {
                skIndexCache = token.skIndex;
                tokenCache.push(token);
                return;
            }
            if(tokens.indexOf(token) === tokens.length - 1){
                tokenCache.push(token);
                orderedTokens.push(tokenCache);
                return;
            }
            if(token.skIndex !== tokenCache[0].skIndex) {
                orderedTokens.push(tokenCache);
                tokenCache = [];
                tokenCache.push(token);
                return;
            }
            else {
                tokenCache.push(token);
                return;
            }
        })
        //if an array is multiple of 3, break into smaller arrays
        orderedTokens.forEach(tokenArray => {
            if(tokenArray.length % 3 !== 0 || tokenArray.length === 3){
                return;
            }
            let newArray: Token[] = []
            for(let i = 0; i < tokenArray.length; i++) {
                if(i % 3 === 0){
                    newArray.push(tokenArray[i])
                    orderedTokens.splice(orderedTokens.indexOf(tokenArray), 0, newArray);
                    newArray = [];
                }
                else {
                    newArray.push(tokenArray[i]);
                }
            }
            orderedTokens.splice(orderedTokens.indexOf(tokenArray), 1);
        }) 

        return orderedTokens;
    }

}