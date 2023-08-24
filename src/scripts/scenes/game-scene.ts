import { Assets, Text as PixiText} from 'pixi.js'
import { Scene, SceneManager } from '../core/scene-manager';
import { Grid } from '../core/models/grid';
import { ScoreDisplay, GridScoreDisplay } from '../core/models/score-display';
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
    private _gridPossibleWidth: number | undefined = undefined;

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

        const grid = new Grid(6, this._gridPossibleWidth!);
        this.addChild(grid);

        const gridScoreDisplay = new GridScoreDisplay({
            titleString: "SCORE",
            score: 0
        });
        const remainingWidth = this._viewWidth - grid.width;
        gridScoreDisplay.position = {
            x: (this._gridPossibleWidth! + remainingWidth * 0.5) - gridScoreDisplay.width * 0.5,
            y: this._viewHeight * 0.3
        }
        this.addChild(gridScoreDisplay);

        const highScore = localStorage.highScore;
        const highScoreDisplay = new ScoreDisplay({
            titleString: "HIGHSCORE",
            score: highScore,
            onScoreChange: () => {localStorage.highScore = gridScoreDisplay.score;}
        });
        highScoreDisplay.alpha = 0;
        highScoreDisplay.position = {
            x: this._viewWidth * 0.5 - gridScoreDisplay.width,
            y: this._viewHeight * 0.5 - gridScoreDisplay.height * 0.5
        };
        this.addChild(highScoreDisplay);

        const menuButton = new Button("Back to Menu",
            (grid.getToken(1, 1).width),
            () => {
                this.unload();
                SceneManager.switchToScene(new MenuScene(this._viewWidth, this._viewHeight), new LoadScreen());
            });
            menuButton.position = {
            x: (gridScoreDisplay.x + gridScoreDisplay.width * 0.5) - menuButton.width * 0.4,
            y: menuButton.height * 0.7
        }
        this.addChild(menuButton);

        const timer = new Timer(10, {
            45: () => { background.setWaveHeightMedium(); },
            10: () => { background.setWaveHeightHigh(); }
        }, 
        //Things to happen when the timer runs out
        () => {
            background.setWaveHeightLow();

            const endgameTimeline = gsap.timeline({
                duration: 5,
                //onComplete being carried out before token tweens are complete
                onComplete: (() => {
                    if(gridScoreDisplay.score > highScoreDisplay.score) {
                        highScoreDisplay.updateScore(gridScoreDisplay.score)
                    };
                })
            });
            endgameTimeline.to(grid, {
                x: 0 - grid.width
            }, 0);
            endgameTimeline.to(timer, {
                alpha: 0
            }, 1)
            endgameTimeline.to(menuButton, {
                x: this._viewWidth * 0.5 - menuButton.width * 0.5
            }, 1);
            endgameTimeline.to(gridScoreDisplay, {
                x: this._viewWidth * 0.5 - gridScoreDisplay.width,
                y: this._viewHeight * 0.5 - gridScoreDisplay.height * 0.5
            }, 1);

            endgameTimeline.to(highScoreDisplay, {
                x: this._viewWidth * 0.5 + highScoreDisplay.width * 0.5,
                y: this._viewHeight * 0.5 - highScoreDisplay.height * 0.5,
                alpha: 1
            }, 2);
            
        });

        timer.position = {
            x: gridScoreDisplay.x + gridScoreDisplay.width * 0.5 - timer.width * 0.5,
            y: gridScoreDisplay.y - timer.height
        }
        this.addChild(timer);
    }

    public unload(): Promise<void> {
        console.log(this.children);
        this.children.forEach(child => {
            gsap.killTweensOf(child);
            child.destroy();
        });
        return Assets.unloadBundle(this._assetBundleName);
    }

    public update(delta: number): void {
    }
}