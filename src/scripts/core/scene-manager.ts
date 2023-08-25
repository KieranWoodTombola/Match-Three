import { Container, ProgressCallback } from 'pixi.js';
import { Game } from '../main';
import { LoadScreen } from './views/load-screen';

export abstract class Scene extends Container {
    public abstract load(onProgress: ProgressCallback): Promise<void>;
    public abstract unload(): Promise<void>;
    public abstract onLoadComplete(): void;
}

export class SceneManager {
    private static _currentScene: Scene | undefined;

    public static async switchToScene(newScene: Scene, loadScreen: LoadScreen): Promise<void> {
        if(this._currentScene) {
            Game.stage.removeChild(this._currentScene);
        }
        Game.stage.addChild(loadScreen);

        const previousScene = this._currentScene;
        this._currentScene = newScene;
        await previousScene?.unload();
        await newScene.load(loadScreen.update.bind(loadScreen));

        Game.stage.removeChild(loadScreen);
        Game.stage.addChild(newScene);

        this._currentScene?.onLoadComplete();
    }
}