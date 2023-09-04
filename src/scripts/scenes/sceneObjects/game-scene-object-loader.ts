import { SceneObjectLoader } from "./scene-object-loader";

import { eventEmitter } from "../../../event-emitter";
import { gsap } from "gsap";

import { Grid } from "../../core/models/grid";
import { GridScoreDisplay, ScoreDisplay } from "../../core/models/score-display";
import { Button } from "../../core/models/button";
import { Timer } from "../../core/models/timer";

export class GameSceneObjectLoader extends SceneObjectLoader{

    private _highScore: number;

    private _grid: Grid;
    private _highScoreDisplay: ScoreDisplay;
    private _gridScoreDisplay: GridScoreDisplay;
    private _menuButton: Button;
    private _timer: Timer;
    private _checkGameEndBind: () => void;


    constructor(viewWidth: number, viewHeight: number) {
        super(viewWidth, viewHeight);

        this._background.stopThunder();
        
        this._checkGameEndBind = this.checkGameEnd.bind(this);
        eventEmitter.on('onTimeComplete', this._checkGameEndBind)

        this._grid = new Grid(11);
        this.addChild(this._grid);
        

        this._gridScoreDisplay = new GridScoreDisplay({
            titleString: "SCORE",
            score: 0,
            onScoreChangeComplete: () => {return;}
        });
        this._gridScoreDisplay.position = {
            x: (this._grid.width + ((this._viewWidth - this._grid.width) * 0.5)) - (this._gridScoreDisplay.width * 0.5),
            y: this._grid.y + (this._grid.height) - this._gridScoreDisplay.height * 1.1,
        }


        this._highScore = localStorage.highScore;
        this._highScoreDisplay = new ScoreDisplay({
            titleString: "HIGHSCORE",
            score: this._highScore,
            onScoreChangeComplete: () => {
                if( this._highScore < this._gridScoreDisplay.score ) {
                    localStorage.highScore = this._gridScoreDisplay.score;
                }
            }
        });
        this._highScoreDisplay.alpha = 0;
        this._highScoreDisplay.position = this._gridScoreDisplay.position;

        this.addChild(
            this._highScoreDisplay,
            this._gridScoreDisplay
        );


        this._menuButton = new Button("Back to Menu",
            (this._grid.getToken(1, 1).width),
            () => { eventEmitter.emit('toMenu') }),
            this._menuButton.position = {
            x: this._grid.width * 0.5 - this._menuButton.width * 0.35,
            y: this._grid.height + this._menuButton.height
        }
        this.addChild(this._menuButton);


        this._timer = new Timer(3, 
        {
            /**This is where you can add in callbacks for things happening
             * as the timer runs down
             */
        });
        this._timer.position = {
            x: this._gridScoreDisplay.x + this._gridScoreDisplay.width * 0.5 - this._timer.width * 0.5,
            y: this._grid.y + this._timer.height * 0.05
        }
        this.addChild(this._timer);

    }


    private checkGameEnd(): void {

        if(this._highScore < this._gridScoreDisplay.score) {
            localStorage.highScore = this._gridScoreDisplay.score
        }

        /**
         * remove the grid from the board
         * and transition the score to the center of the 
         * screen
         */
        const clearBoard = gsap.timeline({
            delay: 3,
            duration: 3,

            onComplete: () => {
                enterHighScore.play();
            }
        })
        .to(this._grid, {
            x: 0 - this._grid.width
        }, 1)
        .to(this._timer, {
            alpha: 0
        }, 2)
        .to(this._menuButton, {
            x: this._viewWidth * 0.5 - this._menuButton.width * 0.5
        }, 2)
        .to(this._gridScoreDisplay, {
            x: this._viewWidth * 0.5 - this._gridScoreDisplay.width * 0.5,
            y: this._viewHeight * 0.5 - this._gridScoreDisplay.height * 0.5
        }, 2)
        .to(this._highScoreDisplay, {
            x: this._viewWidth * 0.5 - this._gridScoreDisplay.width,
            y: this._viewHeight * 0.5 - this._gridScoreDisplay.height * 0.5,
        }, 2);


        /**
         * Transition the highScoreDisplay onto the stage
         */
        const enterHighScore = gsap.timeline({
            paused: true,

            onStart: () => {
                this._background.enterShips();
            },

            onComplete: () => {
                changeHighScore.play();
            }
        })
        .to(this._gridScoreDisplay, {
            x: this._viewWidth * 0.5 - this._gridScoreDisplay.width * 1.1,
            y: this._viewHeight * 0.5 - this._gridScoreDisplay.height * 0.5,
        }, 2)
        .to(this._highScoreDisplay, {
            x: this._viewWidth * 0.5 ,
            alpha: 1
        }, 2);



        /**
         * Update the highScore on the stage's highScoreDisplay if
         * necessary
         */
        const changeHighScore = gsap.timeline({
            paused: true,
            duration: 3,
            onStart: () => {
                this._highScoreDisplay.updateScore(this._gridScoreDisplay.score);
            },
            onComplete: () => {
                this._menuButton.interactive = true;
            }
        })
        .to(this._gridScoreDisplay, {
            x: this._viewWidth * 0.5 - this._gridScoreDisplay.width * 1.9,
            alpha: 0
        }, 1)
        .to(this._highScoreDisplay, {
            x: this._viewWidth * 0.5 - this._highScoreDisplay.width * 0.5,
        }, 1)
    }

    public destroy(): void {
        super.destroy();
        this.children.forEach(child => {
            gsap.killTweensOf(child);
            child.destroy();
        });
        eventEmitter.off('onMatch')
        eventEmitter.off('onTimeComplete');
        eventEmitter.off('clickCheck');
    }
}