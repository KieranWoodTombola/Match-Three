
import { Container, IRenderer, autoDetectRenderer } from 'pixi.js'

interface EngineParams {
    containerId: string;
    canvasW: number;
    canvasH: number;
    fpsMax: number;
}

export class Engine {
    public container: HTMLElement;
    public renderer: IRenderer<HTMLCanvasElement>;
    public stage: Container;
    public fpsMax: number;

    constructor(params: EngineParams) {
        this.renderer = autoDetectRenderer({
            width: params.canvasW,
            height: params.canvasH,
            antialias: true
        });
        this.stage = new Container();


        this.fpsMax = params.fpsMax;

        this.container = params.containerId ? document.getElementById(params.containerId) || document.body : document.body;
        this.container.appendChild(this.renderer.view);
    }
}