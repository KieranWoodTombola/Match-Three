import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';


export class Token extends Container {

    public matched: boolean;
    private _parentID: number;
    private parentSize: number;
    public _verticalIndex: number;
    private availWidth: number;
    private availHeight: number;
    private skin: Spine;
    public skIndex: number;

    public get parentID() {
        return this._parentID;
    }

    constructor (parentID: number, verticalIndex: number, size: number, availWidth: number, availHeight: number) {
        super();

        this.on('pointerdown', this.onClicked)

        this.matched = false;
        this.interactive = true;
        this._parentID = parentID;
        this.parentSize = size;
        this._verticalIndex = verticalIndex;
        this.availWidth = availWidth;
        this.availHeight = availHeight;
        this.skIndex = Math.round(Math.random() * (9 - 1) + 1);;
        this.skin = new Spine(Assets.get('symbols').spineData);
        this.skin.skeleton.setSkinByName(`${this.skIndex}`);
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

    public onTokenReveal(arg: number): void {
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

    public highLight(): void {
        let highLight = gsap.timeline({repeat: 2, yoyo: true});
        const cacheWidth = this.width;
        highLight.to(this, {
            width: 0
        })
        highLight.to(this, {
            width: cacheWidth
        })
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
        const TargetLocation = (this.availHeight / (this.parentSize/desiredArrayPosition));
        gsap.to(this, {
            y: TargetLocation,
            duration: 1
        })
    }

    public testMoveTo(): void {
        gsap.to(this, {
        y: this.height,
        duration: 1  
        })
    }

}