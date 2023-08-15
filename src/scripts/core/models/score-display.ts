import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { Token, IToken } from "./token";
import { eventEmitter } from "../../../event-emitter";
import { ScoreMaths } from "../services/score-maths";

export class ScoreDisplay extends Container {

    private _score: number = 0;
    private _scoreText: PixiText = new PixiText(`${this._score}`);
    private _textContainer: Container = new Container();
    private _trackedHeight = -1;

    constructor() {
        super()

        eventEmitter.on('onMatch', this.recordMatchedTokens, this)

        const title: PixiText = new PixiText("SCORE");
        this._scoreText.style = {
            fill: "white"
        };
        const scoreCard = new Graphics();
        scoreCard.beginFill(0xFFFFFF);
        scoreCard.drawRoundedRect(0, 0, title.width, title.height, 3);
        scoreCard.endFill();
        scoreCard.addChild(title);
        this._scoreText.position = {
            x: scoreCard.width * 0.5 - this._scoreText.width,
            y: scoreCard.height * 1.5
        };
        this._textContainer.addChild(scoreCard);
        this._textContainer.addChild(this._scoreText);
        this.addChild(this._textContainer);

    }

    private updateScore(targetScore: number) {
        gsap.to(this, {
            _score: this._score + targetScore,
            duration: 3,
            onUpdate: this.showScore.bind(this),
        });
    }

    private showScore(): void {
        if (!this._scoreText) { return; }
        this._scoreText.text = Math.round(this._score);
    }

    private recordMatchedTokens(tokens: Token[]): void {
        const processedTokens: Token[][] = ScoreMaths.orderMatchedTokens(tokens);
        const comboDisplayTimeline = gsap.timeline({
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                this.removeChildren();
                this.addChild(this._scoreText);
                this.addChild(this._textContainer);
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
            let score = 0
            array.forEach(token => {
                const bonus = ScoreMaths.getScore(token.skIndex);
                if (bonus) { score += bonus }
            });
            if (score) { this.updateScore(score); }
            this.addChild(tokensContainer);
        });
    }

    private positionTokens(tokens: Token[]): Container {
        const displayTokenContainer = new Container();
        tokens.forEach(token => {
            const copyIToken: IToken = {
                availWidth: token.availWidth,
                availHeight: token.availHeight,
                skIndex: token.skIndex
            }
            const copyToken = new Token(copyIToken);
            copyToken.scale.x = 0.3;
            copyToken.scale.y = 0.3;
            copyToken.width = Math.floor(copyToken.width);
            copyToken.x = Math.floor(((token.width * 0.75) * tokens.indexOf(token)) + Math.floor(token.width * 0.4));
            copyToken.y = (token.height * 0.6 * this._trackedHeight) + (token.height * 0.4);
            copyToken.animate(true);
            displayTokenContainer.addChild(copyToken);
        });
        displayTokenContainer.position = {
            x: (this._textContainer.width * 0.5) - (displayTokenContainer.width * 0.5),
            y: this._textContainer.height
        };
        return displayTokenContainer;
    }
}