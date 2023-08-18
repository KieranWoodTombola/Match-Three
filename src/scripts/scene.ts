import { Assets, Container } from 'pixi.js'
import { Grid } from './core/models/grid';
import { ScoreDisplay } from './core/models/score-display';
import { Timer } from './core/models/timer';

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
            { key: 'logo', url: 'assets/images/logo.png' },
            { key: 'symbols', url: 'assets/animations/symbols/symbol.json' }
        ];

        for (const asset of assetList) {
            Assets.add(asset.key, asset.url);
            const loadedAsset = await Assets.load(asset.key);
            this._assets.push(loadedAsset);
        }
    }

    public initialise(): void {
        const grid = new Grid(6, this._gridPossibleWidth);
        this.addChild(grid);

        const scoreDisplay = new ScoreDisplay();
        const remainingWidth = this._viewWidth - grid.width;
        scoreDisplay.position = {
            x: this._gridPossibleWidth + remainingWidth * 0.5,
            y: this._viewHeight * 0.3
        }
        this.addChild(scoreDisplay);

        const timer = new Timer(90);
        timer.x = this.width;
        this.addChild(timer);
    }

    public update(delta: number): void {
    }
}