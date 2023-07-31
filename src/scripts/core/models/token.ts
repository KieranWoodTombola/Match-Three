import { Spine } from "pixi-spine";
import { Assets, Container } from "pixi.js";
import { eventEmitter } from "../../../event-emitter";
//import { gsap } from 'gsap';


export class Token extends Container {

    public matched: boolean;
    private parentID: number;
    private locationIndex;
    private skin: Spine;
    private skIndex: number;


    constructor (parentID: number, locationIndex: number, size: number, skIndex: number, availWidth: number) {
        super();

        this.on('pointerdown', this.onClicked)
        //eventEmitter.on('tokenFirstClicked', this.onClicked);
        //eventEmitter.on('tokenSecondClicked', this.onClicked);

        this.matched = false;
        this.interactive = true;
        this.parentID = parentID;
        this.locationIndex = locationIndex;
        this.skIndex = skIndex;
        this.skin = new Spine(Assets.get('symbols').spineData);
        this.skin.skeleton.setSkinByName(`${this.skIndex}`);
        this.width = Math.ceil(this.skin.width)
        this.scale.set(0.4);
        this.pivot.set(0.5);
        this.addChild(this.skin);
    }

    setToken(parentID: number, locationIndex: number, skIndex: number) {
        this.skIndex = skIndex;
        this.parentID = parentID;
        this.locationIndex = locationIndex;
        this.skin.skeleton.setSkinByName(`${this.skIndex}`);
    }

    //onClicked
    public onClicked(): void {
        eventEmitter.emit('clickCheck', this);
    }

    public onTokenReveal(arg: number): void {
    }

    public getParentID(): number {
        return this.parentID;
    }

    public getLocation(): number[] {
        const location = [this.parentID, this.locationIndex];
        return location;
    }

    public getSkIndex(): number {
        return this.skIndex;
    }

    public setSkIndex(newSkIndex: number): void {
        this.skIndex = newSkIndex;
    }

    public shuffleSkin(): void {
        const randomNumber = Math.round(Math.random() * (9 - 1) + 1);
        this.skIndex = randomNumber;
        this.skin.skeleton.setSkinByName(`${this.skIndex}`);
    }

    // private wobble(): void {
    //     if(this.skIndex === 1){
    //         gsap.to(this, {
    //            rotation: 2,
    //            repeat: -1,
    //             yoyo: true,
    //             duration: 1
    //         })
    //     }
    // }

    // private fade(): void {
    //     gsap.to(this, {
    //         alpha: 0.1,
    //         repeat: -1,
    //          yoyo: true,
    //          duration: 1
    //      })
    // }

}