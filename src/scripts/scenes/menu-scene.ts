import { Assets, Text as PixiText, } from 'pixi.js'
import { Scene, SceneManager } from '../core/scene-manager';
import { Background } from '../core/models/background';
import { Button } from '../core/models/button';
import '@pixi/graphics-extras';
import * as PIXI from 'pixi.js';
import PixiPlugin from 'gsap/PixiPlugin';
import { gsap } from "gsap";
import { LoadScreen } from '../core/views/load-screen';
import { GameScene } from './game-scene';
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class MenuScene extends Scene {
    private _viewWidth: number;
    private _viewHeight: number;

    private readonly _assetBundleName = 'example-scene';
    private readonly _assetBundle: PIXI.ResolverAssetsObject = {
        'background': 'assets/images/background.jpeg',
        'waterSprite': 'assets/images/waterStock.png',
        'symbols': 'assets/animations/symbols/symbol.json'
    }

    constructor(width: number, height: number) {
        super();

        this._viewWidth = width;
        this._viewHeight = height;

        Assets.addBundle(this._assetBundleName, this._assetBundle);
    }

    public load(onProgress: PIXI.ProgressCallback): Promise<void> {
        return Assets.loadBundle(this._assetBundleName, onProgress);
    }

    public onLoadComplete(): void {

        const background = new Background(this._viewWidth, this._viewHeight);
        this.addChild(background);

        const title = new PixiText("Vikings: Match-3", {
            fill: "white",
            stroke: "black",
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
            () => {
                this.unload();
                SceneManager.switchToScene(new GameScene(this._viewWidth, this._viewHeight), new LoadScreen());
            });
        startButton.position = {
            x: this._viewWidth * 0.5 - startButton.width * 0.5,
            y: title.height + startButton.height
        }
        this.addChild(startButton);
    }

    public unload(): Promise<void> {
        this.children.forEach(child => {
            gsap.killTweensOf(child);
            child.destroy;
        });
        
        return Assets.unloadBundle(this._assetBundleName);
    }
}