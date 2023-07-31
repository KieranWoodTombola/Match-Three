import { Assets, Container } from 'pixi.js'

export class Scene extends Container {
    private assets: any[] = [];

    constructor(width: number, height: number) {
        super();

    }

    public async load(): Promise <void> {
        const assetList = [
            { key:'logo', url: 'assets/images/logo.png'},
            { key:'symbols', url: 'assets/animations/symbols/symbol.json'}
        ]

        for (const asset of assetList) {
            Assets.add(asset.key, asset.url);
            const loadedAsset = await Assets.load(asset.key);
            this.assets.push(loadedAsset);
        }

    }

    public initialise(): void {
      
    }

    public update(delta: number): void {
    }
}