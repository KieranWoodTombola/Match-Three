import { Assets } from 'pixi.js'
import { Scene, SceneManager } from './scene-manager';

import { MenuScene } from './menu-scene';
import { LoadScreen } from '../core/views/load-screen';
import { GameSceneObjectLoader } from './sceneObjects/game-scene-object-loader';

import { eventEmitter } from '../../event-emitter';

import * as PIXI from 'pixi.js';
import PixiPlugin from 'gsap/PixiPlugin';
import { gsap } from "gsap";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class GameScene extends Scene {
    private _viewWidth: number;
    private _viewHeight: number;
    private _toMenuBound: () => void;


    private readonly _assetBundleName = 'example-scene';
    private readonly _assetBundle: PIXI.ResolverAssetsObject = {
        'ship': 'assets/images/wild-static.png',
        'water': 'assets/images/waves.png',
        'symbols': 'assets/animations/symbols/symbol.json',
        'gridBackground': 'assets/images/PTBackground.png',
        'bigWins': 'assets/animations/bigWins/bigWinVikings.png',
        'introduction': 'assets/animations/introduction/introduction.json'
    }

    constructor(width: number, height: number) {
        super();

        this._toMenuBound = this.toMenu.bind(this);
        eventEmitter.on('toMenu', this._toMenuBound);

        this._viewWidth = width;
        this._viewHeight = height;

        Assets.addBundle(this._assetBundleName, this._assetBundle);
    }

    public load(onProgress: PIXI.ProgressCallback): Promise<void> {
        return Assets.loadBundle(this._assetBundleName, onProgress);
    }

    public onLoadComplete(): void {

        const gameObjectsManager = new GameSceneObjectLoader(this._viewWidth, this._viewHeight);
        this.addChild(gameObjectsManager);
    }

    public toMenu() {
        this.children.forEach(child => {
            child.destroy();
        });
        this.unload();
        eventEmitter.off('toMenu');
        SceneManager.switchToScene(
            new MenuScene(this._viewWidth, this._viewHeight), 
            new LoadScreen()
        );
        return;
    }

    public unload(): Promise<void> {
        return Assets.unloadBundle(this._assetBundleName);
    }


}