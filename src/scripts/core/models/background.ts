import { Assets, Container, Sprite } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { Token } from "./token";
import { gsap } from "gsap";

export class Background extends Container {

    private _viewWidth: number;
    private _viewHeight: number;
    private _farWave: Sprite = new Sprite(Assets.get('waterSprite'));
    private _midWaveContainer: Container = new Container();
    private _midWave: Sprite = new Sprite(Assets.get('waterSprite'));
    private _closeWave: Sprite = new Sprite(Assets.get('waterSprite'));
    private _ship: Token;
    private _splash: gsap.core.Timeline = gsap.timeline();
    private _waveStartingPosition: number;

    public get ship() {
        return this._ship;
    }

    constructor(viewWidth: number, viewHeight: number) {
        super();

        this.interactive = false;
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        eventEmitter.on('onMatch', this.animateShip, this);

        this._waveStartingPosition = this._viewHeight * 0.5;

        this.initWave(this._farWave, this._viewWidth * 2, this._viewHeight);
        this._farWave.y = this._waveStartingPosition;
        this.initWave(this._midWave, this._viewWidth * 1.5, this._viewHeight);
        this._midWave.y = this._waveStartingPosition;
        this.initWave(this._closeWave, this._viewWidth * 2, this._viewHeight);
        this._closeWave.y = this._waveStartingPosition;

        this._ship = new Token({
            skIndex: 1
        });
        this._ship.scale.set(1);
        this._ship.position = {
            x: this._viewWidth * 0.95 ,
            y: this._viewHeight
        }
        this._ship.pivot = {
            x: this._ship.width * 0.5, 
            y: this._ship.height * 0.25
        }
        this._ship.angle = -20;
        this._ship.alpha = 0;
        gsap.to(this._ship, {
            duration: 5,
            repeat: -1,
            yoyo: true,

            y: this._ship.y + this._ship.height * 0.1,
            angle: 20,
        });

        this._midWaveContainer.addChild(this._ship, this._midWave);

        const background = new Sprite(Assets.get('background'));
        background.width = this._viewWidth;
        background.height = this._viewHeight;
        
        this.addWavesToTimeline(0.2, 0.2, 0.2, 2);
        this.addChild(
            background,
            this._farWave,
            this._midWaveContainer,
            this._closeWave
        );
    }

    public animateShip(): void {
        this._ship.animate(false);
    }

    public enterShip(): void {
        this._ship.alpha = 1;
        // gsap.from(this._ship, {
        //     x: this._viewWidth + this._ship.width,
        //     duration: 3
        // })
    }

    private initWave(sprite: Sprite, width: number, height: number): void {
        sprite.width = width;
        sprite.height = height;
    }

    private addWavesToTimeline(farWaveHeightMod: number, midWaveHeightMod: number, closeWaveHeightMod: number, duration: number): void {
        const farTime = Math.floor(Math.random() * duration) + 3;
        const midTime = Math.floor(Math.random() * duration) + 2;
        const closeTime = Math.floor(Math.random() * duration) + 1;

        this._splash = gsap.timeline({
            repeat: -1,
            yoyo: true
        });

        this._splash.to(this._farWave, {
            y: this._waveStartingPosition - (this._closeWave.height * farWaveHeightMod),
            duration: farTime,
        }, 0)
        .to(this._midWaveContainer, {
            y: this._midWaveContainer.y - (this._midWave.height * midWaveHeightMod),
            duration: midTime,
        }, 0)
        .to(this._closeWave, {
            y: this._waveStartingPosition - (this._closeWave.height * closeWaveHeightMod),
            duration: closeTime,
        }, 0);

    }

}

