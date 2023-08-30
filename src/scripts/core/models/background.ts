import { Assets, Container, Sprite } from "pixi.js";
import { gsap } from "gsap";

export class Background extends Container {

    private _viewWidth: number;
    private _viewHeight: number;
    private _farWave: Sprite = new Sprite(Assets.get('waterSprite'));
    private _midWaveContainer: Container = new Container();
    private _midWave: Sprite = new Sprite(Assets.get('waterSprite'));
    private _closeWave: Sprite = new Sprite(Assets.get('waterSprite'));
    private _playerShip: Sprite;
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


        this._npcShipClose = this.addShip(0.4, 9);
        this._npcShipClose.x = this._viewWidth * 0.3;
        this._playerShip = this.addShip(0.6, 5);
        this._npcShipFar = this.addShip(0.3, 3);
        

        this._midWaveContainer.addChild(
            this._npcShipFar,
            this._playerShip,
            this._npcShipClose,
            this._midWave
        );

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

    private addShip(scale: number, duration: number): Sprite {
        const ship = new Sprite(Assets.get('ship'));

        ship.scale.set(scale);
        ship.position = {
            x: this._viewWidth * 0.8 ,
            y: this._viewHeight - ship.height * 0.2
        }
        ship.pivot = {
            x: ship.width * 0.75, 
            y: ship.height 
        }
        ship.angle = -20;
        ship.alpha = 0;
        gsap.to(ship, {
            duration: duration,
            repeat: -1,
            yoyo: true,

            y: ship.y + ship.height * 0.1,
            angle: 20,
        });

        return ship
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

