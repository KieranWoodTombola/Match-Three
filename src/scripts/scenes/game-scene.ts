import { Assets } from 'pixi.js'
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

        let timerComplete: Boolean = false;
        let gridTweens = false;

        function checkGameEnd(_viewWidth: number, _viewHeight: number): void {
            if (gridTweens || !timerComplete) {
                return;
            }

            menuButton.interactive = false;
            menuButton.resetButtonToStartingState();
            if(gridScoreDisplay.score > highScore.score) {
                localStorage.highScore = gridScoreDisplay.score;
            }
            background.setWaveHeight(0.2, 0.2, 0.2, 2);


            const clearBoard = gsap.timeline({
                delay: 3,
                duration: 3,

                onComplete: () => {
                    enterHighScore.play();
                }
            })
            .to(grid, {
                x: 0 - grid.width
            }, 1)
            .to (background.ship, {
                duration: 5,

                x: _viewWidth * 0.5 + background.ship.width * 0.5
            })
            .to(timer, {
                alpha: 0
            }, 2)
            .to(menuButton, {
                x: _viewWidth * 0.5 - menuButton.width * 0.5
            }, 2)
            .to(gridScoreDisplay, {
                x: _viewWidth * 0.5 - gridScoreDisplay.width * 0.5,
                y: _viewHeight * 0.5 - gridScoreDisplay.height * 0.5
            }, 2)
            .to(highScoreDisplay, {
                x: _viewWidth * 0.5 - gridScoreDisplay.width,
                y: _viewHeight * 0.5 - gridScoreDisplay.height * 0.5,
            }, 2);


            const enterHighScore = gsap.timeline({
                paused: true,
                //delay: 2,
                onComplete: () => {
                    changeHighScore.play();
                }
            })
            .to(gridScoreDisplay, {
                x: _viewWidth * 0.5 - gridScoreDisplay.width * 1.1,
                y: _viewHeight * 0.5 - gridScoreDisplay.height * 0.5,
            }, 2)
            .to(highScoreDisplay, {
                x: _viewWidth * 0.5 ,
                alpha: 1
            }, 2);


            const changeHighScore = gsap.timeline({
                // delay: 3,
                paused: true,
                duration: 3,
                onStart: () => {
                    highScoreDisplay.updateScore(gridScoreDisplay.score);
                    background.animateShip();
                },
                onComplete: () => {
                    menuButton.interactive = true;
                }
            })
            .to(gridScoreDisplay, {
                x: _viewWidth * 0.5 - gridScoreDisplay.width * 1.9,
                alpha: 0
            }, 1)
            .to(highScoreDisplay, {
                x: _viewWidth * 0.5 - highScoreDisplay.width * 0.5,
            }, 1)
            .to(highScoreDisplay, {
            }, 1);
        }

        const background = new Background(this._viewWidth, this._viewHeight);
        background.enterShip();
        this.addChild(background);


        const grid = new Grid(6, this._gridPossibleWidth!);
        this.addChild(grid);


        const gridScoreDisplay = new GridScoreDisplay({
            titleString: "SCORE",
            score: 0,
            onScoreChangeComplete: () => {return;}
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
            onScoreChangeComplete: () => {
                localStorage.highScore = gridScoreDisplay.score;
            }
        });
        highScoreDisplay.alpha = 0;
        highScoreDisplay.position = gridScoreDisplay.position;
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


        const timer = new Timer(90, {
             60: () => { background.setWaveHeight(0.3, 0.3, 0.3, 1); },
             30: () => { background.setWaveHeight(0.4, 0.4, 0.4, 0); }
        }, 
        () => {
            timerComplete = true;
            grid.deactivate();
            checkGameEnd(this._viewWidth, this._viewHeight);
        });

        timer.position = {
            x: gridScoreDisplay.x + gridScoreDisplay.width * 0.5 - timer.width * 0.5,
            y: gridScoreDisplay.y - timer.height
        }
        this.addChild(timer);

    }

    public unload(): Promise<void> {
        this.children.forEach(child => {
            gsap.killTweensOf(child);
            child.destroy();
        });
        return Assets.unloadBundle(this._assetBundleName);
    }
}