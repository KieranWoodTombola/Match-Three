import { SceneObjectLoader } from "./scene-object-loader";

import { Text as PixiText } from "pixi.js";
import { Button } from "../../core/models/button";
import { eventEmitter } from "../../../event-emitter";
import { ScoreDisplay } from "../../core/models/score-display";

export class MenuObjectLoader extends SceneObjectLoader {

    constructor(viewWidth: number, viewHeight: number){
        super(viewWidth, viewHeight) 

        this._background.showShips();

        const title = new PixiText("Vikings: Match-3", {
            fill: "white",
            stroke: "black",
            fontFamily: "PR_Viking",
            strokeThickness: 2,
            fontSize: 50,
            align: 'center'
        });
        title.position = {
            x: (this._viewWidth * 0.5) - (title.width * 0.5),
            y: 0
        }
        this.addChild(title);

        const highScoreDisplay = new ScoreDisplay({
            titleString: "HIGHSCORE",
            score: localStorage.highScore,
            onScoreChangeComplete: () => { return; }
        });
        highScoreDisplay.position = {
            x: this._viewWidth * 0.5 - highScoreDisplay.width * 0.5,
            y: (title.y + title.height)
        }
        this.addChild(highScoreDisplay);

        const startButton = new Button("START \nGAME",
            this._viewWidth * 0.075,
            () => { eventEmitter.emit('toGame') });
        startButton.position = {
            x: this._viewWidth * 0.5 - startButton.width * 0.25,
            y: highScoreDisplay.y + highScoreDisplay.height + startButton.height * 0.5
        }
        startButton.scale.set(0.8);
        this.addChild(startButton);

    }

}