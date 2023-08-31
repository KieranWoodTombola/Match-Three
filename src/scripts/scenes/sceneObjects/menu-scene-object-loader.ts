import { SceneObjectLoader } from "./scene-object-loader";

import { Text as PixiText } from "pixi.js";
import { Button } from "../../core/models/button";
import { eventEmitter } from "../../../event-emitter";

export class MenuObjectLoader extends SceneObjectLoader {

    constructor(viewWidth: number, viewHeight: number){
        super(viewWidth, viewHeight)

        this._background.loopThunder();

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

        const startButton = new Button("Start Game",
            this._viewWidth * 0.1,
            () => { eventEmitter.emit('toGame') });
        startButton.position = {
            x: this._viewWidth * 0.5 - startButton.width * 0.5,
            y: title.height + startButton.height
        }
        this.addChild(startButton);

    }

    public destroy(): void {
        super.destroy();

    }

}