import { Sprite } from "pixi.js";
import { Texture } from "pixi.js";
import { Resource } from "pixi.js";
import { Assets } from "pixi.js";

import { gsap } from "gsap";

export class Ship extends Sprite {

    constructor(x: number, y: number, scale: number) {
        super(Assets.get('ship'))

        this.alpha = 0.001;

        this.pivot = {
            x: this.width * 0.6, 
            y: this.height 
        }

        this.scale.set(scale);

        this.position = {
            x: x,
            y: y
        }

        gsap.fromTo(this, {
            angle: -20
        }, {
            duration: Math.round(Math.random() * (6 - 1) + 5),
            repeat: -1,
            yoyo: true,
            angle: 20,
        });
    }
}