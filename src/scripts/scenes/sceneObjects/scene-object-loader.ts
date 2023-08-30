import { Container } from "pixi.js";
import { Background } from "../../core/models/background";

export class SceneObjectLoader extends Container {

    protected _viewWidth: number;
    protected _viewHeight: number;
    protected _background: Background;

    constructor(viewWidth: number, viewHeight: number) {
        super()

        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        this._background = new Background(this._viewWidth, this._viewHeight);
        this.addChild(this._background);   
    }

}

