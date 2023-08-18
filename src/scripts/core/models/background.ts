import { Assets, Container, Sprite } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from "gsap";

export class Background extends Container {
    
    private _viewWidth: number;
    private _viewHeight: number;
    private _farWave: Sprite = new Sprite(Assets.get('waterSprite'));;
    private _midWave: Sprite = new Sprite(Assets.get('waterSprite'));;
    private _closeWave: Sprite = new Sprite(Assets.get('waterSprite'));;

    constructor(viewWidth: number, viewHeight: number) {
        super();

        this.interactive = false;
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        this.initWave(this._farWave, this._viewWidth * 2, this._viewHeight);
        this._farWave.y = this._viewHeight - this._farWave.height * 0.7;
        this.initWave(this._midWave, this._viewWidth * 1.5, this._viewHeight);
        this._midWave.y = this._viewHeight - this._midWave.height * 0.7;
        this.initWave(this._closeWave, this._viewWidth * 2, this._viewHeight);
        this._closeWave.y = this._viewHeight - this._closeWave.height * 0.5;

        const background = new Sprite(Assets.get('background'));
        background.width = this._viewWidth;
        background.height = this._viewHeight;

        this.lowWave();

        this.addChild(
            background,
            this._farWave, 
            this._midWave, 
            this._closeWave
        );

    }

    public lowWave(): void {
        this.idleWaves(-0.2);
    }

    public midWave(): void {
        this.idleWaves(-0.15);
    }

    public highWave(): void {
        this.idleWaves(0);
    }

    private initWave(sprite: Sprite, width: number, height: number): void {
        sprite.width = width;
        sprite.height = height;
    }

    private idleWaves(waveHeight: number): void {
        const farTime = Math.floor(Math.random() * 10)+3;
        const midTime =  Math.floor(Math.random() * 5)+3;
        const closeTime =  Math.floor(Math.random() * 10)+3;

        const splash = gsap.timeline({
            ease: "power2",
            repeat: -1
        });

        splash.to(this._farWave, {
            y: 0 - this._farWave.height * waveHeight,
            duration: farTime,
            repeat: -1,
            yoyo: true
        }, 0);

        splash.to(this._midWave, {
            y: 0 - this._midWave.height * waveHeight,
            duration: midTime,
            repeat: -1,
            yoyo: true
        }, 0);

        splash.to(this._closeWave, {
            y: 0 - this._closeWave.height * (waveHeight * 1.5),
            duration: closeTime,
            repeat: -1,
            yoyo: true
        }, 0);
    }
}

