import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';


export class Token extends Container {

    public matched: boolean;
    public parentID: number;
    public horizontalIndex;
    private skin: Spine;
    public skIndex: number;


    constructor (parentID: number, horizontalIndex: number, size: number, skIndex: number, availWidth: number) {
        super();

        this.on('pointerdown', this.onClicked)

        this.matched = false;
        this.interactive = true;
        this.parentID = parentID;
        this.horizontalIndex = horizontalIndex;
        this.skIndex = skIndex;
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

    public setToken(skIndex: number) {
        this.skIndex = skIndex;
        this.skin.skeleton.setSkinByName(`${skIndex}`);
    }

    public onTokenReveal(arg: number): void {
    }

    public getLocation(): number[] {
        const location = [this.parentID, this.horizontalIndex];
        return location;
    }

    public shuffleSkin(): void {
        const randomNumber = Math.round(Math.random() * (9 - 1) + 1);
        this.skIndex = randomNumber;
        this.skin.skeleton.setSkinByName(`${this.skIndex}`);
    }

    public highLight(): void {
        gsap.to(this, {
            alpha: 0.5,
            repeat: 3,
            yoyo: true,
            duration: 0.3
        });
    }

    public hide(): void {
        gsap.to(this, {
            alpha: 0,
            duration: 0.3
        });
    }

    public hide(): void {
        gsap.to(this, {
            alpha: 0,
            duration: 0.3
        });
    }

}