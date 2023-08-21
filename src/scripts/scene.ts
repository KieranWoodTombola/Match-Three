import { Assets, Container } from 'pixi.js'
import { Grid } from './core/models/grid';
import { ScoreDisplay } from './core/models/score-display';
import { Background } from './core/models/background';
import { Timer } from './core/models/timer';
import { Button } from './core/models/button';
import '@pixi/graphics-extras';

export class Scene extends Container {
    private _viewWidth: number;
    private _viewHeight: number;
    private _assets: any[] = [];
    private _gridPossibleWidth: number;

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
    }

    public async load(): Promise<void> {
        const assetList = [
            { key: 'transparent', url: 'assets/images/transparent.png'},
            { key: 'logo', url: 'assets/images/logo.png' },
            { key: 'background', url: 'assets/images/background.jpeg'},
            { key: 'waterSprite', url: 'assets/images/waterStock.png'},
            { key: 'symbols', url: 'assets/animations/symbols/symbol.json' }
        ];

        for (const asset of assetList) {
            Assets.add(asset.key, asset.url);
            const loadedAsset = await Assets.load(asset.key);
            this._assets.push(loadedAsset);
        }
    }

    public initialise(): void {

        const background = new Background(this._viewWidth, this._viewHeight);
        background.position = {x: 0, y: 0}
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
            45: () => {background.midWave();},
            10: () => {background.highWave();}
        }, () => {
            background.lowWave()
        });
        timer.x = scoreDisplay.x + scoreDisplay.width * 0.5 - timer.width * 0.5;
        timer.y = scoreDisplay.y - timer.height;
        this.addChild(timer);
        const startButton = new Button("test", (grid.getToken(1, 1).width), () => {background.animateShip()});
        startButton.x = scoreDisplay.x;
        startButton.y = scoreDisplay.y + startButton.height * 1.5;
        this.addChild(startButton);
    }

    public update(delta: number): void {
    }
}