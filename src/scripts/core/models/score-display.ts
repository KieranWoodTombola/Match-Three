import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { Token } from "./token";
import { eventEmitter } from "../../../event-emitter";
import { ScoreMaths } from "../services/score-maths";

export class ScoreDisplay extends Container {

    private score: number = 0;
    private scoreText: PixiText = new PixiText(`${this.score}`);
    private textContainer: Container = new Container();
    private trackedHeight = -1;

    constructor() {
        super()

        eventEmitter.on('onMatch', this.recordMatchedTokens, this)

        const title: PixiText = new PixiText("SCORE");
        this.scoreText.style = {
            fill: "white"
        };
        const scoreCard = new Graphics();
        scoreCard.beginFill(0xFFFFFF);
        scoreCard.drawRoundedRect(0, 0, title.width, title.height, 3);
        scoreCard.endFill();
        scoreCard.addChild(title);
        this.scoreText.position = {
            x: scoreCard.width * 0.5 - this.scoreText.width,
            y: scoreCard.height * 1.5
        };
        this.textContainer.addChild(scoreCard);
        this.textContainer.addChild(this.scoreText);
        this.addChild(this.textContainer);

    }

    private updateScore(targetScore: number) {
        gsap.to(this, {
            score: this.score + targetScore,
            duration: 3,
            onUpdate: this.showScore.bind(this),
        });
    }

    private showScore(): void {
        if (!this.scoreText) { return; }
        this.scoreText.text = Math.round(this.score);
    }

    private recordMatchedTokens(tokens: Token[]): void {
        const processedTokens: Token[][] = ScoreMaths.orderMatchedTokens(tokens);
        const comboDisplayTimeline = gsap.timeline({
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                this.removeChildren();
                this.addChild(this.scoreText);
                this.addChild(this.textContainer);
            }
        });
        processedTokens.forEach(array => {
            const tokensContainer = this.positionTokens(array);
            tokensContainer.alpha = 0;
            comboDisplayTimeline.to(tokensContainer, {
                y: tokensContainer.height * (processedTokens.indexOf(array) + 2),
                alpha: 1,
                duration: 2,
            }, processedTokens.indexOf(array));
            const score = ScoreMaths.getScore(array[0].skIndex);
            if (score) { this.updateScore(score); }
            this.addChild(tokensContainer);
        });
    }

    private positionTokens(tokens: Token[]): Container {
        const displayTokenContainer = new Container();
        tokens.forEach(token => {
            const newToken = new Token(token.availWidth, token.availHeight, token.skIndex);
            newToken.scale.x = 0.3;
            newToken.scale.y = 0.3;
            newToken.width = Math.floor(newToken.width);
            newToken.x = Math.floor(((token.width * 0.75) * tokens.indexOf(token)) + Math.floor(token.width * 0.4));
            newToken.y = (token.height * 0.6 * this.trackedHeight) + (token.height * 0.4);
            displayTokenContainer.addChild(newToken);
        });
        displayTokenContainer.position = {
            x: (this.textContainer.width * 0.5) - (displayTokenContainer.width * 0.5),
            y: this.textContainer.height
        };
        return displayTokenContainer;
    }
}