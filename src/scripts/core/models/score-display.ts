import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { Token } from "./token";
import { eventEmitter } from "../../../event-emitter";
import { ScoreMaths } from "../services/score-maths";

export interface IScoreDisplayOptions {
    titleString: string;
    score: number;
    onScoreChangeComplete: () => void;
}

export class ScoreDisplay extends Container {

    public score: number;
    public scoreAsText: PixiText;
    public textContainer: Container = new Container();
    public onScoreChangeComplete: () => void;

    constructor(options: IScoreDisplayOptions) {
        super()

        this.onScoreChangeComplete = options.onScoreChangeComplete;

        const title: PixiText = new PixiText(options.titleString, {
            fill: "black",
            align: "center"
        });
        const titleTextBackground = new Graphics();
        titleTextBackground.beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, title.width, title.height, 3)
            .endFill()
            .addChild(title);
        this.textContainer.addChild(titleTextBackground);
        
        this.score = options.score ? options.score : 0;
        this.scoreAsText = new PixiText(`${this.score}`, {
            fill: "white",
            align: "center",
            stroke: "black",
            strokeThickness: 1
        });
        this.scoreAsText.position = {
            x: titleTextBackground.width * 0.5 - this.scoreAsText.width * 0.5,
            y: titleTextBackground.height * 1.5
        };
        this.textContainer.addChild(this.scoreAsText);

        this.addChild(this.textContainer);
    }

    public updateScore(targetScore: number) {

        gsap.to(this, {
            score: targetScore,
            duration: 3,
            onUpdate: this.showScore.bind(this),

            onComplete: () => {
                if(this.onScoreChangeComplete) {
                    this.onScoreChangeComplete();
                }
                gsap.to(this.scoreAsText, {
                    x: this.textContainer.width * 0.5 - this.scoreAsText.width * 0.5
                });
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
    public comboTweenStack: string[] = [];
    private _recordMatchedTokensBound: (tokens: Token[]) => void;

    constructor(options: IScoreDisplayOptions) {
        super(options);

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

            let newScore = 0;
            array.forEach(token => {
                const points = ScoreMaths.getScore(token.skIndex);
                if (points) { 
                    newScore += points;
                }
            });
            if (newScore) {
                super.updateScore(this.score + newScore);

            }
            this.addChild(tokensContainer);
        });
    }

    private positionTokens(tokens: Token[]): Container {
        const displayTokenContainer = new Container();

        tokens.forEach(token => {
            const copyToken = new Token({
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