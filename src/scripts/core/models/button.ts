import { Text as PixiText, Container, Graphics} from "pixi.js";
// import '@pixi/graphics-extras';
import { gsap } from "gsap";

export class Button extends Container {
    private _buttonText: PixiText;
    private _coin: Graphics;
    private _buttonCallback: Function | undefined;

    constructor (buttonText: string, buttonRadius: number, buttonCallback: Function) {
        super();

        this.interactive = true;
        this.cursor = "pointer";

        this
        .on('pointerdown',this.onPointerDown, this)
        .on('pointerover', this.onPointerOver, this)
        .on('pointerup', this.onPointerUp, this)
        .on('pointerout', this.onPointerOut, this)

        this._buttonCallback = buttonCallback;
        this._coin = new Graphics()
            .beginFill('white')
            .lineStyle({
                width: 1, 
                color: 'black',
                alpha: 1
            })
            .drawTorus!(0, 0, buttonRadius * 0.2, buttonRadius * 0.5)
            .endFill()
        this._coin.interactive = true;
        this.addChild(this._coin);
        this._buttonText = new PixiText(buttonText)
        this._buttonText.style = {
            fill: "white",
            stroke: "black",
            strokeThickness: 1,
        };
        this._buttonText.position = {
            x: this._coin.width * 0.6 ,
            y: 0 - this._buttonText.height * 0.5
        }
        this.addChild(this._buttonText);
    }

    private onPointerOver() {
        console.log("over");
        gsap.to(this._coin, {
            tint: "orange",
            duration: 0.3
        });
        gsap.to(this._coin.scale, {
            x: 1.1,
            y: 1.1,
            duration: 0.2
        });
    }
    
    private onPointerOut() {
        gsap.to(this._coin, {
            tint: "white",
            duration: 0.3
        });
        gsap.to(this._coin.scale, {
            x: 1.0,
            y: 1.0,
            duration: 0.2
        });
    }

    private onPointerDown() {
        const pointerDownTL = gsap.timeline({
            onComplete: () => { 
                this._buttonCallback!();
            }
        });
        pointerDownTL.to(this._coin, {
            tint: "red",
            duration: 0.3,
        }, 0);
        pointerDownTL.to(this._coin.scale, {
            x: 1.1,
            y: 1.1,
            duration: 0.2
        }, 0);
    }

    private onPointerUp() {
        gsap.to(this._coin, {
            tint: "white",
            duration: 0.3
        });
        gsap.to(this._coin.scale, {
            x: 1.0,
            y: 1.0,
            duration: 0.2
        });
    }

}