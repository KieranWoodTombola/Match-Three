import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';

export interface IToken {
    availWidth: number;
    availHeight: number;
    parentID?: number;
    verticalIndex?: number;
    parentSize?: number;
    skIndex?: number;
}

export class Token extends Container {

    public matched: boolean = false;
    private _parentID: number = 0;
    private _parentSize: number = 0;
    public verticalIndex: number = 0;
    private _availWidth: number = 0;
    private _availHeight: number = 0;
    private _skin: Spine;
    public skIndex: number = -1;

    public get parentID() {
        return this._parentID;
    }

    public get availWidth() {
        return this._availWidth;
    }

    public get availHeight() {
        return this._availHeight;
    }

    public constructor(args: IToken) {
        super();

        this.on('pointerdown', this.onClicked);

        this.interactive = true;
        this._availWidth = args.availWidth;
        this._availHeight = args.availHeight;
        if (args.parentID) { this._parentID = args.parentID }
        if (args.verticalIndex) { this.verticalIndex = args.verticalIndex }
        if (args.parentSize) { this._parentSize = args.parentSize }
        this._skin = new Spine(Assets.get('symbols').spineData);
        if (args.skIndex) { this.setSkin(args.skIndex) }
        else { this.shuffleSkin() }

        this.width = Math.ceil(this._skin.width)
        this.scale.set(0.4);
        this.pivot.set(0.5);
        this.addChild(this._skin);
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
        const randomNumber = Math.round(Math.random() * (9 - 1) + 1);
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
        const TargetLocation = (this.availHeight / (this._parentSize / desiredArrayPosition));
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