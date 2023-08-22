import { Assets, } from 'pixi.js'
import { Scene, SceneManager } from '../core/scene-manager';
import { Grid } from '../core/models/grid';
import { ScoreDisplay } from '../core/models/score-display';
import { Background } from '../core/models/background';
import { Timer } from '../core/models/timer';
import { Button } from '../core/models/button';
import '@pixi/graphics-extras';
import * as PIXI from 'pixi.js';
import PixiPlugin from 'gsap/PixiPlugin';
import { gsap } from "gsap";
import { MenuScene } from './menu-scene';
import { LoadScreen } from '../core/views/load-screen';
import { Game } from '../main';
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class GameScene extends Scene {
    private _viewWidth: number;
    private _viewHeight: number;
    private _gridPossibleWidth: number;

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
        this._gridPossibleWidth = 0;
        if (this._viewWidth <= this.height) {
            this._gridPossibleWidth = this._viewWidth;
        }
        else {
            this._gridPossibleWidth = this._viewHeight;
        }
        Assets.addBundle(this._assetBundleName, this._assetBundle);
    }

    public load(onProgress: PIXI.ProgressCallback): Promise<void> {
        return Assets.loadBundle(this._assetBundleName, onProgress);
    }

    public onLoadComplete(): void {
        this.removeChildren();
        const background = new Background(this._viewWidth, this._viewHeight);
        background.enterShip();
        this.addChild(background);
        const grid = new Grid(6, this._gridPossibleWidth);
        this.addChild(grid);
        const scoreDisplay = new ScoreDisplay();
        const remainingWidth = this._viewWidth - grid.width;
        scoreDisplay.position = {
            x: (this._gridPossibleWidth + remainingWidth * 0.5) - scoreDisplay.width * 0.5,
            y: this._viewHeight * 0.3
        }
        this.addChild(scoreDisplay);
        const timer = new Timer(90, {
            45: () => { background.setWaveHeightMedium(); },
            10: () => { background.setWaveHeightHigh(); }
        }, () => {
            background.setWaveHeightLow()
        });
        timer.x = scoreDisplay.x + scoreDisplay.width * 0.5 - timer.width * 0.5;
        timer.y = scoreDisplay.y - timer.height;
        this.addChild(timer);
        const startButton = new Button("Back to Menu",
            (grid.getToken(1, 1).width),
            () => {
                SceneManager.switchToScene(new MenuScene(this._viewWidth, this._viewHeight), new LoadScreen());
                this.unload();
            });
        startButton.position = {
            x: (scoreDisplay.x + scoreDisplay.width * 0.5) - startButton.width * 0.4,
            y: startButton.height * 0.7
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

    public update(delta: number): void {
    }
}