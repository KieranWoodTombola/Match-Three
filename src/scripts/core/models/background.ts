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
    private _playerShip: Sprite = new Sprite(Assets.get('ship'));
    private _npcShipClose: Sprite = new Sprite(Assets.get('ship'));
    private _npcShipFar: Sprite = new Sprite(Assets.get('ship'));
    private _splash: gsap.core.Timeline = gsap.timeline();
    private _waveStartingPosition: number;

    public get playerShip() {
        return this._playerShip;
    }

    constructor(viewWidth: number, viewHeight: number) {
        super();

        this.interactive = false;
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        this._waveStartingPosition = this._viewHeight * 0.5;

        this.initWave(this._farWave, this._viewWidth * 2, this._viewHeight);
        this._farWave.y = this._waveStartingPosition;
        this.initWave(this._midWave, this._viewWidth * 1.5, this._viewHeight);
        this._midWave.y = this._waveStartingPosition;
        this.initWave(this._closeWave, this._viewWidth * 2, this._viewHeight);
        this._closeWave.y = this._waveStartingPosition;


        this._npcShipClose.scale.set(0.4);
        this._npcShipClose.position = {
            x: this._viewWidth * 0.2 ,
            y: this._viewHeight - this._npcShipClose.height * 0.2
        }
        this._npcShipClose.pivot = {
            x: this._npcShipClose.width * 0.75, 
            y: this._npcShipClose.height 
        }
        this._npcShipClose.angle = -20;
        this._npcShipClose.alpha = 0;
        gsap.to(this._npcShipClose, {
            duration: Math.floor(Math.random() * 3) + 5,
            repeat: -1,
            yoyo: true,

            y: this._npcShipClose.y + this._npcShipClose.height * 0.1,
            angle: 20,
        });


        this._playerShip.scale.set(0.6);
        this._playerShip.position = {
            x: this._viewWidth * 0.8 ,
            y: this._viewHeight - this._playerShip.height * 0.2
        }
        this._playerShip.pivot = {
            x: this._playerShip.width * 0.75, 
            y: this._playerShip.height 
        }
        this._playerShip.angle = -20;
        this._playerShip.alpha = 0;
        gsap.to(this._playerShip, {
            duration: 5,
            repeat: -1,
            yoyo: true,

            y: this._playerShip.y + this._playerShip.height * 0.1,
            angle: 20,
        });


        this._npcShipFar.scale.set(0.3);
        this._npcShipFar.position = {
            x: this._viewWidth * 0.8 ,
            y: this._viewHeight - this._npcShipFar.height * 0.2
        }
        this._npcShipFar.pivot = {
            x: this._playerShip.width * 0.75, 
            y: this._playerShip.height 
        }
        this._npcShipFar.angle = -20;
        this._npcShipFar.alpha = 0;
        gsap.to(this._npcShipFar, {
            duration: Math.floor(Math.random() * 3) + 8,
            repeat: -1,
            yoyo: true,

            y: this._npcShipFar.y + this._npcShipFar.height * 0.1,
            angle: 20,
        });

        

        this._midWaveContainer.addChild(
            this._npcShipFar,
            this._playerShip,
            this._npcShipClose,
            this._midWave);

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

    public enterPlayerShip(): void {
        this._playerShip.alpha = 1;
        gsap.from(this._playerShip, {
            x: this._viewWidth + this._playerShip.width,
            duration: 3
        })
    }

    public enterNPCShips(): void {
        this._npcShipClose.alpha = 1;
        gsap.from(this._npcShipClose, {
            x: 0 - this._npcShipClose.width,
            duration: 7
        })

        this._npcShipFar.alpha = 1;
        gsap.from(this._npcShipFar, {
            x: 0 - this._npcShipFar.width,
            duration: 20
        })
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

