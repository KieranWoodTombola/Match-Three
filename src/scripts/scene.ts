//import { Spine } from 'pixi-spine';
import { Assets, Container } from 'pixi.js'
import { Grid } from './core/models/grid';

export class Scene extends Container {
    private viewWidth: number;
    private viewHeight: number;
    //private spine!: Spine;
    private assets: any[] = [];
    private gridWidth: number;

    constructor(width: number, height: number) {
        super();
        this.viewWidth = width;
        this.viewHeight = height;

        this.gridWidth = 0;
        if (this.viewWidth <= this.height) { 
            this.gridWidth = this.viewWidth; 
        }
        else { 
            this.gridWidth = this.viewHeight; 
        }

    }

    public async load(): Promise<void> {
        const assetList = [
            { key: 'logo', url: 'assets/images/logo.png' },
            { key: 'symbols', url: 'assets/animations/symbols/symbol.json' }
        ]

        for (const asset of assetList) {
            Assets.add(asset.key, asset.url);
            const loadedAsset = await Assets.load(asset.key);
            this.assets.push(loadedAsset);
        }

    }

    public initialise(): void {
        // this.spine = new Spine(Assets.get('symbols').spineData);
        // this.spine.skeleton.setSkinByName('1');
        // this.spine.x = this.viewWidth * 0.5;
        // this.spine.y = this.viewHeight * 0.5;
        // this.addChild(this.spine);

        // discern portrait/landscape

        const grid = new Grid(6, this.gridWidth);
        this.addChild(grid);
    }

    public update(delta: number): void {
    }
}