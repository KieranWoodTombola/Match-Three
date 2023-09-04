import { Container, IRenderer, Ticker, autoDetectRenderer } from 'pixi.js';
import { Scene, SceneManager } from '../scenes/scene-manager';
import { LoadScreen } from './views/load-screen';

interface EngineParams {
    containerId: string;
    canvasW: number;
    canvasH: number;
}

export class Engine {
    public renderer: IRenderer<HTMLCanvasElement>;
    public stage: Container;

    public get width(): number {
        return this.renderer.width / this.renderer.resolution;
    }
    
    public get height(): number {
        return this.renderer.height / this.renderer.resolution;
    }

    private _htmlContainer: HTMLElement;
    private _fpsMeterItem: HTMLDivElement;
    private _canvasWidth: number;
    private _canvasHeight: number;
    private _ticker: Ticker;

    constructor(options: EngineParams) {
        this._canvasWidth = options.canvasW;
        this._canvasHeight = options.canvasH;

        this.renderer = autoDetectRenderer({
            resolution: window.devicePixelRatio || 1,
            width: options.canvasW,
            height: options.canvasH,
            antialias: true
        });

        this.stage = new Container();

        this._htmlContainer = options.containerId ? document.getElementById(options.containerId) || document.body : document.body;
        this._htmlContainer.appendChild(this.renderer.view);

        this._fpsMeterItem = document.createElement('div');
        this._fpsMeterItem.classList.add('fps');
        this._htmlContainer.appendChild(this._fpsMeterItem);

        this._ticker = new Ticker();
        this.resize();
        this._ticker.add(this.update, this);

        window.onresize = this.resize.bind(this);
    }

    public initialise(initialScene: Scene, loadScreen?: LoadScreen) {
        SceneManager.switchToScene(initialScene, loadScreen ?? new LoadScreen());
        this._ticker.start();
    }

    public update(delta: number) {
        this.renderer.render(this.stage);
        this._fpsMeterItem.innerHTML = 'FPS: ' + this._ticker.FPS.toFixed(0);
    }

    private resize(): void {
        // current screen size
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // uniform scale for our game
        const scale = Math.min(screenWidth / this._canvasWidth, screenHeight / this._canvasHeight);

        // the "uniformly englarged" size for our game
        const enlargedWidth = Math.floor(scale * this._canvasWidth);
        const enlargedHeight = Math.floor(scale * this._canvasHeight);

        // now we use css trickery to set the sizes and margins
        this.renderer.view.style.width = `${enlargedWidth}px`;
        this.renderer.view.style.height = `${enlargedHeight}px`;
    }
}