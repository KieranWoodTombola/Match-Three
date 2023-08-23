import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { Token } from "./token";
import { eventEmitter } from "../../../event-emitter";
import { ScoreMaths } from "../services/score-maths";

export interface IScoreDisplay {
    titleString: string;
    score: number;
}

export class ScoreDisplay extends Container {

    public score: number;
    public scoreText: PixiText;
    public textContainer: Container = new Container();

    constructor(args: IScoreDisplay) {
        super()

        const title: PixiText = new PixiText(args.titleString, {
            fill: "black",
            align: "center"
        });
        const scoreCard = new Graphics();
        scoreCard.beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, title.width, title.height, 3)
            .endFill()
            .addChild(title);
        this.textContainer.addChild(scoreCard);
        
        this.score = args.score ? args.score : 0;
        this.scoreText = new PixiText(`${this.score}`, {
            fill: "white",
            align: "center"
        });
        this.scoreText.position = {
            x: scoreCard.width * 0.5 - this.scoreText.width,
            y: scoreCard.height * 1.5
        };
        this.textContainer.addChild(this.scoreText);

        this.addChild(this.textContainer);
    }

    public updateScore(targetScore: number) {
        gsap.to(this, {
            score: this.score + targetScore,
            duration: 3,
            onUpdate: this.showScore.bind(this),
        });
    }

    private showScore(): void {
        if (!this.scoreText) { return; }
    
        const score = Math.floor(Math.round(this.score));
        if (this.score !== score) {
            console.log(score);
            this.scoreText.text = score;
        }
    }

}

export class GridScoreDisplay extends ScoreDisplay {

    private _trackedHeight = -1;

    constructor(args: IScoreDisplay) {
        super(args);

        eventEmitter.on('onMatch', this.recordMatchedTokens, this);
    }

    private recordMatchedTokens(tokens: Token[]): void {
        const comboDisplayTimeline = gsap.timeline({
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                this.removeChildren();
                this.addChild(this.scoreText);
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
}