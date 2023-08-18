import { Container, Text as PixiText } from "pixi.js";
import { gsap } from "gsap";
import { eventEmitter } from "../../../event-emitter";

export class Timer extends Container {

    private _totalTime: number;
    private _currentTime: number;
    private _timeText: PixiText = new PixiText;

    public get totalTime() {
        return this._totalTime;
    }

    constructor(totalTime: number) {
        super()
        this._totalTime = totalTime;
        this._currentTime = totalTime;
        this.formatTime();
        this._timeText.style = {
            fill: "white"
        };
        this.addChild(this._timeText);
        this.countdown();
    }

    private formatTime(): void {
        const minutes: String = this._currentTime >= 60 ? Math.floor(this._currentTime / 60).toString() : '0';
        const seconds: String = (this._currentTime % 60).toString().padStart(2, "0");
        this._timeText.text = minutes + ":" + seconds;
    }

    private countdown() {
        gsap.to(this, {
            duration: 1,
            _currentTime: this._currentTime - 1,
            onComplete: () => {
                this.formatTime()
                if (this._currentTime > 0) { this.countdown() }
                else {
                    eventEmitter.emit('onTotalTimerComplete');
                }
            }
        })
    }

}
