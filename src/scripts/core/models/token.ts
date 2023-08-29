import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';

export interface IToken {
    parentID?: number;
    parentSize?: number;
    verticalIndex?: number;
    skIndex?: number;
}

export class Token extends Container {

    public matched: boolean = false;
    private _parentID: number = 0;
    private _parentHeight: number = 0;;
    private _parentSize: number = 0;
    public verticalIndex: number = 0;
    private _skin: Spine;
    public skIndex: number = -1;

    public get parentID() {
        return this._parentID;
    }


    public constructor(options: IToken) {
        super();

        this.on('pointerdown', this.onClicked);

        this.interactive = false;
        if (options.parentID) { this._parentID = options.parentID }
        if (options.verticalIndex) { this.verticalIndex = options.verticalIndex }
        this._skin = new Spine(Assets.get('symbols').spineData);
        if (options.skIndex) { this.setSkin(options.skIndex) }
        else { this.shuffleSkin() }

        this.width = Math.ceil(this._skin.width)
        this.scale.set(0.2);
        this.pivot.set(0.5);

        this.addChild(this._skin);

        if (options.parentSize) { 
            this._parentSize = options.parentSize;
            this._parentHeight = this._parentSize * this.height;
        }
    }

    public onClicked(): void {
        eventEmitter.emit('clickCheck', this);
    }

    public setSkin(skIndex: number) {
        this.skIndex = skIndex;
        this._skin.skeleton.setSkinByName(`${skIndex}`);
    }

    public getLocation(): number[] {
        const location = [this.parentID, this.verticalIndex];
        return location;
    }

    public shuffleSkin(): void {
        const randomNumber = Math.round(Math.random() * (12 - 1) + 1);
        this.skIndex = randomNumber;
        this._skin.skeleton.setSkinByName(`${this.skIndex}`);
    }

    public hide(): void {
        gsap.to(this, {
            alpha: 0.001,
            duration: 0.3
        });
    }

    public reveal(): void {
        gsap.to(this, {
            alpha: 1,
            duration: 0.3
        });
    }

    public moveTo(desiredArrayPosition: number): void {
        const TargetLocation = (this._parentHeight /  this._parentSize) * desiredArrayPosition;
        gsap.to(this, {
            y: TargetLocation,
            duration: 1
        });
    }

    public testMoveTo(): void {
        gsap.to(this, {
            y: this.height,
            duration: 1
        });
    }

    public animate(bool: boolean): void {
        this._skin.state.setAnimation(0, "animation", bool);
    }

    public freeze(): void {
        this._skin.state.setEmptyAnimation(0, 0);
    }
}