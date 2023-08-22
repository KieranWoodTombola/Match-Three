import { Text as PixiText, Container, Graphics} from "pixi.js";
import { gsap } from "gsap";

export class Button extends Container {
    private _buttonText: PixiText;
    private _coin: Graphics;
    private _buttonCallback: Function | undefined;

    constructor (buttonText: string, buttonRadius: number, buttonCallback: Function) {
        super();

        this.interactive = true;
        this.cursor = "pointer";

        this.on('pointerdown',this.onPointerDown, this)
        .on('pointerover', this.onPointerOver, this)
        .on('pointerup', this.onPointerUp, this)
        .on('pointerout', this.onPointerOut, this);
        
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

    private onPointerOver(): void {
        console.log("over");
        gsap.to(this._coin, {
            duration: 0.3,
            pixi: {
                tint: "orange",
                scale: 1.1,
            }
        });
    }
    
    private onPointerOut(): void {
        gsap.to(this._coin, {
            duration: 0.3,
            pixi: {
                tint: "white",
                scale: 1.0,
            }
        });
    }

    private onPointerDown(): void {
        gsap.to(this._coin, {
            duration: 0.3,
            pixi: {
                tint: "red",
                scale: 1.1
            },
            onComplete: () => { 
                this._buttonCallback!();
            }
        });
    }

    private onPointerUp(): void {
        gsap.to(this._coin, {
            duration: 0.3,
            pixi: {
                tint: "white",
                scale: 1
            }
        });
    }
}