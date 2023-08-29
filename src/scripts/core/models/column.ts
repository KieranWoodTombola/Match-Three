import { Container } from "pixi.js";
import { Token } from "./token";
import { gsap } from "gsap";

export class Column extends Container {

    public tokens: Token[] = [];
    private _columnID: number;
    private _columnSize: number;

    constructor(columnID: number, columnSize: number) {
        super();

        this._columnID = columnID;
        this._columnSize = columnSize;

        for (let tokenIndex: number = 0; tokenIndex < this._columnSize; tokenIndex++) {
            const columnToken = new Token({
                parentID: this._columnID,
                parentSize: this._columnSize,
                verticalIndex: tokenIndex,
            });

            columnToken.interactive = true;
            columnToken.y = (columnToken.height * tokenIndex);
            this.tokens.push(columnToken);
            this.addChild(columnToken);
        }
    }

    public processMatches(): void {
        this.repositionOnScreen();
        this.rebuildTokens();
    }

    private repositionOnScreen(): void {
        const matchCombo: Token[] = [];
        const nonMatchCombo: Token[] = [];

        const sortTimeline = gsap.timeline({
            paused: true
        });

        for (let columnInspector: number = 0; columnInspector < this.tokens.length; columnInspector++) {
            const target = this.tokens[columnInspector];
            let matchCount = 0;
            this.tokens.forEach(token => {
                if (token.matched) { matchCount++; }
            });

            if (target.matched) {
                matchCombo.push(target);
                sortTimeline.add(() => target.hide(), 0);
                sortTimeline.add(() => target.moveTo((0 - matchCount) + matchCombo.indexOf(target)), 1);
            }
            else {
                nonMatchCombo.unshift(target);
                for (let combo = columnInspector + 1; combo <= this.tokens.length - 1; combo++) {
                    if (!this.tokens[combo].matched) {
                        break;
                    }
                    for (let i = 0; i < nonMatchCombo.length; i++) {
                        nonMatchCombo[i].moveTo(combo - i);
                    }
                }
            }
        }

        matchCombo.forEach(token => {
            sortTimeline.add(() => token.moveTo(matchCombo.indexOf(token)), 2);
            sortTimeline.add(() => token.reveal(), 2);
            sortTimeline.add(() => token.shuffleSkin(), 2);
        });

        sortTimeline.play();
    }

    private rebuildTokens(): void {
        const matchedTokens: Token[] = [];
        const unmatchedTokens: Token[] = [];

        for (let i = 0; i < this.tokens.length; i++) {
            const target = this.tokens[i]

            if (target.matched) {
                matchedTokens.push(target);
            }
            else {
                unmatchedTokens.push(target);
            }
        }

        const newTokens = [...matchedTokens, ...unmatchedTokens];

        for (let i = 0; i < this._columnSize; i++) {
            newTokens[i].matched = false;
            newTokens[i].verticalIndex = i;
        }
        
        this.tokens = newTokens;
    }

    public deactivateAllTokens(): void {
        this.tokens.forEach(token => { token.interactive = false });
    }

    public activateAllTokens(): void {
        this.tokens.forEach(token => { token.interactive = true });
    }

    public getToken(Y: number) {
        return this.tokens[Y];
    }

    public replaceAllTokens(newTokens: Token[]): void {
        if (newTokens.length !== this.tokens.length) {
            return;
        }
    }
}