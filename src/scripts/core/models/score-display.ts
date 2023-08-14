import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { Token } from "./token";
import { eventEmitter } from "../../../event-emitter";
import { ScoreMaths } from "../services/score-maths";

export class ScoreDisplay extends Container {

    private score: number = 0;
    private scoreText: PixiText = new PixiText(`${this.score}`);
    private textContainer: Container = new Container();
    private tokensContainer: Container = new Container();
    private trackedSkin = -1;
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
        this.updateScore(50);

        this.addChild(this.tokensContainer);

        const marker = new Graphics();
        marker.beginFill("red");
        marker.drawCircle(this.textContainer.width/2, this.textContainer.height/2, 3);
        marker.endFill();
        this.textContainer.addChild(marker);
    }

    private updateScore(targetScore: number) {
        gsap.to(this, {
            score: targetScore,
            duration: 3,
            onUpdate: this.showScore.bind(this),
        })
    }

    private showScore(): void {
        if(!this.scoreText) { console.log("crash"); return; }
        this.scoreText.text = Math.round(this.score);
    }

    private recordMatchedTokens(tokens: Token[]): void {
        const processedTokens: Token[][] = ScoreMaths.orderMatchedTokens(tokens);
        console.log(processedTokens);
        processedTokens.forEach(array => {
            const tokensContainer = this.positionTokens(array)
            tokensContainer.y = tokensContainer.height * processedTokens.indexOf(array);
            this.addChild(tokensContainer)
        })
    }

    private positionTokens(tokens: Token[]): Container {

        const displayTokenContainer = new Container();
        this.trackedHeight ++;
        tokens.forEach(token => {
            const newToken = new Token (token.availWidth, token.availHeight, token.skIndex);
            newToken.scale.x = 0.3;
            newToken.scale.y = 0.3;
            newToken.width = Math.floor(newToken.width);
            newToken.x = Math.floor(((token.width* 0.75) * tokens.indexOf(token)) + Math.floor(token.width * 0.4));
            newToken.y = (token.height/2 * this.trackedHeight) + (token.height * 0.4);
            displayTokenContainer.addChild(newToken);
        })
        displayTokenContainer.position = {
            x: (this.textContainer.width * 0.5) - (displayTokenContainer.width * 0.5), 
            y: this.textContainer.height
        };

        return displayTokenContainer;
        // const square = new Graphics();
        // square.beginFill("white");
        // square.drawRect(0, 0, displayTokenContainer.width, displayTokenContainer.height);
        // square.endFill();
        // displayTokenContainer.addChild(square);
    }

}