import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
import { gsap } from 'gsap';


export class Token extends Container {

    public matched: boolean;
    public parentID: number;
    public horizontalIndex;
    private skin: Spine;
    public skIndex: number = -1;

    public get parentID() {
        return this._parentID;
    }

    constructor (parentID: number, horizontalIndex: number, size: number, skIndex: number, availWidth: number) {
        super();

        this.on('pointerdown', this.onClicked)

        this.matched = false;
        this.interactive = true;
        this.parentID = parentID;
        this.horizontalIndex = horizontalIndex;
        this.skIndex = skIndex;
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
        const location = [this.parentID, this.horizontalIndex];
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

}