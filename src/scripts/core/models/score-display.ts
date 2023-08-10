import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";

export class ScoreDisplay extends Container {

    private score: number = 0;
    private scoreText: PixiText = new PixiText(`${this.score}`);

    constructor() {
        super() 

        const title: PixiText = new PixiText("SCORE");
        this.scoreText.style = {
            fill: "white"
        };
        const scoreCard = new Graphics();
        scoreCard.beginFill(0xFFFFFF);
        scoreCard.drawRoundedRect(0, 0, title.width, title.height, 5);
        scoreCard.endFill();
        scoreCard.addChild(title);
        this.scoreText.position = {
            x: scoreCard.width * 0.5 - this.scoreText.width,
            y: scoreCard.height * 1.5
        }
        this.addChild(scoreCard);
        this.addChild(this.scoreText);
        console.log(this.score)
        this.updateScore(50);
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
}