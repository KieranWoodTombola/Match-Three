import { gsap } from "gsap";
import { Container, Graphics, Text as PixiText, Assets } from "pixi.js";
import { Spine } from "pixi-spine";
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
    protected _scoreAsText: PixiText;
    protected _titleText: PixiText;
    protected _scoreBackground: Spine = new Spine(Assets.get('bigWins').spineData);
    protected onScoreChangeComplete: () => void;

    constructor(options: IScoreDisplayOptions) {
        super()

        this.onScoreChangeComplete = options.onScoreChangeComplete;
        this._scoreBackground.skeleton.setSkinByName('default');
        this._scoreBackground.state.setAnimation(0, 'static', true);
        this._scoreBackground.scale.set(0.35);
        this._scoreBackground.position = {
            x: this._scoreBackground.width * 0.5,
            y: this._scoreBackground.height * 0.5
        }
        this.addChild(this._scoreBackground)

        this._titleText = new PixiText(options.titleString, {
            fill: "white",
            fontFamily: "PR_Viking",
            align: "center"
        });
        this._titleText.position = {
            x: this._scoreBackground.x - this._titleText.width * 0.5,
            y: this._scoreBackground.y - this._titleText.height
        };
        this.addChild(this._titleText)
        
        this.score = options.score ? options.score : 0;
        this._scoreAsText = new PixiText(`${this.score}`, {
            fill: "white",
            fontFamily: "PR_Viking",
            align: "center",
            stroke: "black",
            strokeThickness: 2
        });
        this._scoreAsText.position = {
            x: this._scoreBackground.x - this._scoreAsText.width * 0.5,
            y: this._scoreBackground.y + this._scoreAsText.height * 0.25,
        };
        this.addChild(this._scoreAsText);

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
                gsap.to(this._scoreAsText, {
                    x: this._scoreBackground.x - this._scoreAsText.width * 0.5,
                    onComplete: () => {
                        this._scoreBackground.alpha = 1;
                    }
                });

            }
        });
    }

    private showScore(): void {
        if (!this._scoreAsText) { 
            return; 
        }
    
        const score = Math.floor(Math.round(this.score));
        if (this.score !== score) {
            this._scoreAsText.text = score.toString();
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
                this.addChild(this._scoreBackground,
                this._titleText,
                this._scoreAsText);
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
            copyToken.scale.set(0.2);
            copyToken.width = Math.floor(copyToken.width);
            copyToken.position = {
                x: Math.floor(((token.width * 0.75) * tokens.indexOf(token)) + Math.floor(token.width * 0.4)),
                y: this._scoreAsText.y + ((token.height * 0.6 * this._trackedHeight))
            }
            copyToken.animate(true);
            displayTokenContainer.addChild(copyToken);
        });

        displayTokenContainer.position = {
            x: (this._scoreBackground.width * 0.5) - (displayTokenContainer.width * 0.5),
            y: this._scoreBackground.height
        };

        return displayTokenContainer;
    }

    public destroy(): void {
        super.destroy();
        eventEmitter.off('onMatch', this._recordMatchedTokensBound);
        return;
    }
}