import { Assets } from 'pixi.js'
import { Scene, SceneManager } from './scene-manager';

import { LoadScreen } from '../core/views/load-screen';
import { GameScene } from './game-scene';
import { MenuObjectLoader } from './sceneObjects/menu-scene-object-loader';

import { eventEmitter } from '../../event-emitter';

import * as PIXI from 'pixi.js';
import PixiPlugin from 'gsap/PixiPlugin';
import { gsap } from "gsap";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class MenuScene extends Scene {
    private _viewWidth: number;
    private _viewHeight: number;
    private _toGameBound: () => void;


    private readonly _assetBundleName = 'example-scene';
    private readonly _assetBundle: PIXI.ResolverAssetsObject = {
        'background': 'assets/images/background.jpeg',
        'waterSprite': 'assets/images/waterStock.png',
        'symbols': 'assets/animations/symbols/symbol.json',
        'bigWins': 'assets/animations/bigWins/bigWinVikings.json',
        'introduction': 'assets/animations/introduction/introduction.json'
    }

    constructor(width: number, height: number) {
        super();

        this._toGameBound = this.toGame.bind(this);
        eventEmitter.on('toGame', this._toGameBound);

        this._viewWidth = width;
        this._viewHeight = height;

        Assets.addBundle(this._assetBundleName, this._assetBundle);
    }

    public load(onProgress: PIXI.ProgressCallback): Promise<void> {
        return Assets.loadBundle(this._assetBundleName, onProgress);
    }

    public onLoadComplete(): void {
        const menuSceneObjects = new MenuObjectLoader(this._viewWidth, this._viewHeight);
        this.addChild(menuSceneObjects);
    }

    private toGame(): void {
        this.getChildByName('menuSceneObjects')?.destroy()
        this.unload();
        eventEmitter.off('toGame');
        SceneManager.switchToScene(
            new GameScene(this._viewWidth, this._viewHeight), 
            new LoadScreen()
        );
    }

    public unload(): Promise<void> {
        return Assets.unloadBundle(this._assetBundleName);
    }
}