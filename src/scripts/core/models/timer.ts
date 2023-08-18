import { Container, Text as PixiText } from "pixi.js";
import { gsap } from "gsap";
import { eventEmitter } from "../../../event-emitter";

export class Timer extends Container {

    private _totalTime: number;
    private _currentTime: number;
    private _timeText: PixiText = new PixiText;
    private _timeCallbacks: Record <number, (() => void) | undefined> | undefined;

    public get totalTime() {
        return this._totalTime;
    }

    constructor(totalTime: number, timeCallbacks?: Record<number, (() => void) | undefined>) {
        super()
        this._totalTime = totalTime;
        this._currentTime = totalTime;
        this.formatTime();
        this._timeText.style = {
            fill: "white"
        };
        this.addChild(this._timeText);

        this._timeCallbacks = timeCallbacks;

        this.countdown();
    }

    private formatTime(): void {
        const minutes: string = this._currentTime >= 60 ? Math.floor(this._currentTime / 60).toString() : '0';
        const seconds: string = (this._currentTime % 60).toString().padStart(2, "0");
        this._timeText.text = minutes + ":" + seconds;
    }

    private countdown() {
        gsap.to(this, {
            duration: 1,
            _currentTime: this._currentTime - 1,

            onComplete: () => {
                this.test(),
                this.formatTime()
                if (this._currentTime > 0) { this.countdown() }
                else {
                    eventEmitter.emit('onTotalTimerComplete');
                }
            }
        })
    }

    private test(): void {
        const time = this._currentTime;
        if (this._timeCallbacks) {
            const _timeCallbacks = this._timeCallbacks[time];
            if (_timeCallbacks) { 
                _timeCallbacks();
            }
        }
    }

}
