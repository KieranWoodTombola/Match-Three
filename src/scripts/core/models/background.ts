import { Assets, Container, Sprite } from "pixi.js";
import { Spine } from "pixi-spine";
import { Ship } from "./ship";

import { gsap } from "gsap";
import { eventEmitter } from "../../../event-emitter";

export class Background extends Container {

    private _viewWidth: number;
    private _viewHeight: number;

    private _ships: Ship[] | undefined;

    private _stormCloudsContainer: Container = new Container();
    private _thunderFlash: Spine;
    private _lightning: Spine;

    private _closeWaveContainer: Container = new Container();
    private _midWaveContainer: Container = new Container();
    private _farWaveContainer: Container = new Container();

    constructor(viewWidth: number, viewHeight: number) {
        super();

        eventEmitter.on('onMatch', this.playThunder, this);

        this.interactive = false;
        this._viewWidth = viewWidth;
        this._viewHeight = viewHeight;

        const playerShip = new Ship(viewWidth * 0.5, viewHeight, 0.5);
        const closeShip = new Ship(viewWidth * 0.1, viewHeight, 0.4);
        const midShip = new Ship(viewWidth * 0.3, viewHeight, 0.3);
        const farShip01 = new Ship(viewWidth * 0.8, viewHeight * 0.965, 0.2);
        const farShip02 = new Ship(viewWidth * 0.65, viewHeight * 0.945, 0.2);
        this._ships = [closeShip, midShip, playerShip, farShip01, farShip02];

        const stormCloudsBack = new Spine(Assets.get("introduction").spineData);
        stormCloudsBack.skeleton.setSkinByName("skyCloudsBack");
        this._thunderFlash = new Spine(Assets.get("introduction").spineData);
        this._thunderFlash.skeleton.setSkinByName("thunderFlash");
        this._lightning = new Spine(Assets.get("introduction").spineData);
        this._lightning.skeleton.setSkinByName("lightning");
        const stormCloudsFront = new Spine(Assets.get("introduction").spineData);
        stormCloudsFront.skeleton.setSkinByName("skyCloudsFront");

        this._stormCloudsContainer.addChild(
            stormCloudsBack,
            this._thunderFlash,
            this._lightning,
            stormCloudsFront
        );
        this._stormCloudsContainer.scale.set(0.5);
        this._stormCloudsContainer.position = {
            x: this._viewWidth * 0.5,
            y: this._viewHeight * 0.5
        }


        const ground = new Spine(Assets.get("introduction").spineData);
        ground.skeleton.setSkinByName("nature");
        ground.position = {
            x: this._viewWidth * 0.5,
            y: this._viewHeight * 0.5
        }


        const farWave = this.initWave(this._viewWidth * 2, this._viewHeight, this._viewHeight * 0.4);
        const midWave = this.initWave(this._viewWidth * 1.5, this._viewHeight, this._viewHeight * 0.45);
        const closeWave = this.initWave(this._viewWidth * 2, this._viewHeight, this._viewHeight * 0.5);
        

        this._closeWaveContainer.addChild(closeShip, closeWave);
        this._midWaveContainer.addChild(midShip, midWave);
        this._farWaveContainer.addChild(farShip01, farShip02, farWave);


        this.setWaveTweens();
        this.addChild(
            this._stormCloudsContainer,
            this._farWaveContainer,
            this._midWaveContainer,
            this._closeWaveContainer,
            ground
        );

    }

    public playThunder(): void {
        this._thunderFlash.alpha = 1;
        this._lightning.alpha = 1;
        this._thunderFlash.state.setAnimation(0, "introduction", false);
        this._lightning.state.setAnimation(0, "introduction", false);
    }

    public loopThunder(): void {
        this._thunderFlash.alpha = 1;
        this._lightning.alpha = 1;
        this._thunderFlash.state.setAnimation(0, "introduction", true);
        this._lightning.state.setAnimation(0, "introduction", true);
    }

    public stopThunder(): void {
        this._thunderFlash.alpha = 0.001;
        this._lightning.alpha = 0.001;
        this._thunderFlash.state.setEmptyAnimation(0, 0);
        this._lightning.state.setEmptyAnimation(0, 0);
    }

    private initWave(width: number, height: number, startingY: number): Sprite {
        const sprite = new Sprite(Assets.get('waterSprite'));
        sprite.width = width;
        sprite.height = height;
        sprite.y = startingY;

        return sprite;
    }

    public showShips(): void {
        this._ships?.forEach(ship => {
            ship.alpha = 1;
        })
    }

    public enterShips(): void {
        this._ships?.forEach(ship => {
            ship.alpha = 1;
            gsap.from (ship, {
                duration: 60,
                x: 0 - ship.width
            });
        });
    }

    private setWaveTweens(): void {
        const farTime = Math.floor(Math.random()) + 3;
        const midTime = Math.floor(Math.random()) + 2;
        const closeTime = Math.floor(Math.random()) + 3;

        const splash = gsap.timeline({
            repeat: -1,
            yoyo: true
        })
        .to(this._farWaveContainer, {
            y: this._viewHeight * 0.45 - (this._viewHeight * 0.5),
            duration: farTime,
        }, 0)
        .to(this._midWaveContainer, {
            y: this._viewHeight * 0.45 - (this._viewHeight * 0.5),
            duration: midTime,
        }, 0)
        .to(this._closeWaveContainer, {
            y: this._viewHeight * 0.3 - (this._viewHeight * 0.35),
            duration: closeTime,
        }, 0);
    }
}

