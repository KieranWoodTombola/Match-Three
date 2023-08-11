import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';


export class Token extends Container {

    public matched: boolean;
    private _parentID: number;
    private parentSize: number;
    public _verticalIndex: number;
    private availHeight: number;
    private skin: Spine;
    public skIndex: number = -1;

    public get parentID() {
        return this._parentID;
    }

    constructor(parentID: number, verticalIndex: number, size: number, availWidth: number, availHeight: number) {
        super();

        this.on('pointerdown', this.onClicked)

        this.matched = false;
        this.interactive = true;
        this._parentID = parentID;
        this.parentSize = size;
        this._verticalIndex = verticalIndex;
        this.availHeight = availHeight;
        this.skin = new Spine(Assets.get('symbols').spineData);
        this.shuffleSkin();
        this.width = Math.ceil(this.skin.width)
        this.scale.set(0.4);
        this.pivot.set(0.5);
        this.addChild(this.skin);
    }

    public onClicked(): void {
        eventEmitter.emit('clickCheck', this);
    }

    public setSkin(skIndex: number) {
        this.skIndex = skIndex;
        this.skin.skeleton.setSkinByName(`${skIndex}`);
    }

    public getLocation(): number[] {
        const location = [this.parentID, this._verticalIndex];
        return location;
    }

    public shuffleSkin(): void {
        const randomNumber = Math.round(Math.random() * (9 - 1) + 1);
        this.skIndex = randomNumber;
        this.skin.skeleton.setSkinByName(`${this.skIndex}`);
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
        const TargetLocation = (this.availHeight / (this.parentSize / desiredArrayPosition));
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
}