import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';


export class Token extends Container {

    public matched: boolean = false;
    private _parentID: number = 0;
    private parentSize: number = 0;
    public verticalIndex: number = 0;
    private _availWidth: number = 0;
    private _availHeight: number = 0;
    private skin: Spine;
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

    public constructor (availWidth: number, availHeight: number, skIndex: number );
    public constructor (availWidth: number, availHeight: number, parentID: number, verticalIndex: number, parentSize: number);

    public constructor (...arr: any[]) {

        super();

        this.on('pointerdown', this.onClicked)

        if(arr[0]) this._availWidth = arr[0];
        if(arr[1]) this._availHeight = arr[1];
        this.skin = new Spine(Assets.get('symbols').spineData);

        if(arr.length === 3) {
            if(arr[2]) this.skIndex = arr[2];
            this.setSkin(this.skIndex);
        }

        if(arr.length === 5) {
            this.matched = false;
            this.interactive = true;
            if(arr[2]) this._parentID = arr[2];
            if(arr[3]) this.verticalIndex = arr[3];
            if(arr[4]) this.parentSize = arr[4];
            this.shuffleSkin();
        }

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
        const location = [this.parentID, this.verticalIndex];
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