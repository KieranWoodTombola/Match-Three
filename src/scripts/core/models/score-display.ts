import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { Token } from "./token";
import { eventEmitter } from "../../../event-emitter";
import { ScoreMaths } from "../services/score-maths";

export interface IScoreDisplay {
    titleString: string;
    score: number;
    onScoreChange?: () => void;
}

export class ScoreDisplay extends Container {

    public score: number;
    public scoreAsText: PixiText;
    public textContainer: Container = new Container();
    public OnScoreChange?: () => void;

    constructor(args: IScoreDisplay) {
        super()

        const title: PixiText = new PixiText(args.titleString, {
            fill: "black",
            align: "center"
        });
        const titleTextBackground = new Graphics();
        titleTextBackground.beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, title.width, title.height, 3)
            .endFill()
            .addChild(title);
        this.textContainer.addChild(titleTextBackground);
        
        this.score = args.score ? args.score : 0;
        this.scoreAsText = new PixiText(`${this.score}`, {
            fill: "white",
            align: "center"
        });
        this.scoreAsText.position = {
            x: titleTextBackground.width * 0.5 - this.scoreAsText.width,
            y: titleTextBackground.height * 1.5
        };
        this.textContainer.addChild(this.scoreAsText);

        this.addChild(this.textContainer);
    }

    public updateScore(targetScore: number) {
        gsap.to(this, {
            score: this.score + targetScore,
            duration: 3,
            onUpdate: this.showScore.bind(this),
            onComplete: () => {
                if(this.OnScoreChange) {
                    this.OnScoreChange();
                }
            }
        });
    }

    private showScore(): void {
        if (!this.scoreAsText) { 
            return; 
        }
    
        const score = Math.floor(Math.round(this.score));
        if (this.score !== score) {
            this.scoreAsText.text = score.toString();
        }
    }

}

export class GridScoreDisplay extends ScoreDisplay {

    private _trackedHeight = -1;
    private _recordMatchedTokensBound: (tokens: Token[]) => void;

    constructor(args: IScoreDisplay) {
        super(args);

        this._recordMatchedTokensBound = this.recordMatchedTokens.bind(this);
        eventEmitter.on('onMatch', this._recordMatchedTokensBound);
    }

    private recordMatchedTokens(tokens: Token[]): void {
        const comboDisplayTimeline = gsap.timeline({
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                this.removeChildren();
                this.addChild(this.scoreAsText);
                this.addChild(this.textContainer);
            }
        });

        const processedTokens: Token[][] = ScoreMaths.orderMatchedTokens(tokens);
        processedTokens.forEach(array => {
            const tokensContainer = this.positionTokens(array);

            tokensContainer.alpha = 0;

            comboDisplayTimeline.to(tokensContainer, {
                y: tokensContainer.height * (processedTokens.indexOf(array) + 2),
                alpha: 1,
                duration: 2,
            }, processedTokens.indexOf(array));

            let score = 0;
            array.forEach(token => {
                const bonus = ScoreMaths.getScore(token.skIndex);
                if (bonus) { score += bonus }
            });
            if (score) { super.updateScore(score); }
            
            this.addChild(tokensContainer);
        });
    }

    private positionTokens(tokens: Token[]): Container {
        const displayTokenContainer = new Container();

        tokens.forEach(token => {
            const copyToken = new Token({
                availWidth: token.availWidth,
                availHeight: token.availHeight,
                skIndex: token.skIndex
            });
            copyToken.scale.set(0.3);
            copyToken.width = Math.floor(copyToken.width);
            copyToken.position = {
                x: Math.floor(((token.width * 0.75) * tokens.indexOf(token)) + Math.floor(token.width * 0.4)),
                y: (token.height * 0.6 * this._trackedHeight) + (token.height * 0.4)
            }
            copyToken.animate(true);
            displayTokenContainer.addChild(copyToken);
        });

        displayTokenContainer.position = {
            x: (this.textContainer.width * 0.5) - (displayTokenContainer.width * 0.5),
            y: this.textContainer.height
        };

        return displayTokenContainer;
    }

    public destroy(): void {
        super.destroy();
        eventEmitter.off('onMatch', this._recordMatchedTokensBound);
        return;
    }
}