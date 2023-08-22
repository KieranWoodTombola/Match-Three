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

    constructor(viewWidth: number, viewHeight: number) {
        super();

        this.interactive = false;
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        eventEmitter.on('onMatch', this.animateShip, this);

        this.initWave(this._farWave, this._viewWidth * 2, this._viewHeight);
        this._farWave.y = this._viewHeight - this._farWave.height * 0.7;
        this.initWave(this._midWave, this._viewWidth * 1.5, this._viewHeight);
        this._midWave.y = this._viewHeight - this._midWave.height * 0.7;
        this.initWave(this._closeWave, this._viewWidth * 2, this._viewHeight);
        this._closeWave.y = this._viewHeight - this._closeWave.height * 0.5;
        this._ship = new Token({
            availHeight: this._viewWidth,
            availWidth: this._viewHeight,
            skIndex: 1
        });
        this._ship.scale.set(1);
        this._ship.position = {
            x: this._viewWidth * 0.75,
            y: this._viewHeight - this._ship.height * 0.5
        }
        this._midWaveContainer.addChild(this._midWave, this._ship);
        const background = new Sprite(Assets.get('background'));
        background.width = this._viewWidth;
        background.height = this._viewHeight;
        this.setWaveHeightLow();
        this.addChild(
            background,
            this._farWave,
            this._midWaveContainer,
            this._closeWave
        );
    }

    private animateShip(): void {
        this._ship.animate(false);
    }

    public setWaveHeightLow(): void {
        this.backgroundSpriteTweenManager(-0.2);
    }

    public setWaveHeightMedium(): void {
        this.backgroundSpriteTweenManager(-0.15);
    }

    public setWaveHeightHigh(): void {
        this.backgroundSpriteTweenManager(0);
    }

    private initWave(sprite: Sprite, width: number, height: number): void {
        sprite.width = width;
        sprite.height = height;
    }

    private backgroundSpriteTweenManager(waveHeightMultiplier: number): void {
        const farTime = Math.floor(Math.random() * 5) + 3;
        const midTime = Math.floor(Math.random() * 5) + 3;
        const closeTime = Math.floor(Math.random() * 5) + 3;

        const splash = gsap.timeline();

        splash.to(this._farWave, {
            y: 0 - this._farWave.height * waveHeightMultiplier,
            duration: farTime,
            repeat: -1,
            yoyo: true
        }, 0);

        splash.to(this._midWaveContainer, {
            y: 0 - this._ship.height * waveHeightMultiplier,
            duration: midTime,
            repeat: -1,
            yoyo: true
        }, 0);

        splash.fromTo(this._ship, {
            angle: -20,
            x: this._ship.x - (this._ship.width * 0.25)
        }, {
            angle: 20,
            x: this._ship.x + (this._ship.width * 0.25),
            duration: 5,
            repeat: -1,
            yoyo: true
        }, 0);

        splash.to(this._closeWave, {
            y: 0 - this._closeWave.height * waveHeightMultiplier,
            duration: closeTime,
            repeat: -1,
            yoyo: true
        }, 0);
    }
}

