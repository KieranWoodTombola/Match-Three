import { Container, Text as PixiText, Assets } from "pixi.js";
import { Spine } from "pixi-spine";
import { gsap } from "gsap";
import { eventEmitter } from "../../../event-emitter";

export class Timer extends Container {

    private _timerBackground: Spine;
    private _totalTime: number;
    private _currentTime: number;
    private _titleText: PixiText = new PixiText;
    private _timeText: PixiText = new PixiText;
    private _timeCallbacks: Record<number, (() => void) | undefined> | undefined;


    public get totalTime() {
        return this._totalTime;
    }

    constructor(totalTime: number, timeCallbacks?: Record<number, (() => void) | undefined>) {
        super()

        this._timerBackground = new Spine(Assets.get('bigWins').spineData);
        this._timerBackground.skeleton.setSkinByName('default');
        this._timerBackground.state.setAnimation(0, 'static', true);
        this._timerBackground.scale.set(0.35);
        this._timerBackground.position = {
            x: this._timerBackground.width * 0.5,
            y: this._timerBackground.height * 0.5
        }
        this.addChild(this._timerBackground)
        
        this._totalTime = totalTime;
        this._currentTime = totalTime;
        this.formatTime();

        this._timeText.style = {
            fill: "white",
            fontFamily: "PR_Viking",
            align: "center",
            stroke: "black",
            strokeThickness: 2         
        };
        this._timeText.position = {
            x: this._timerBackground.width * 0.5 - this._timeText.width * 0.5,
            y: this._timerBackground.height * 0.5 + this._timeText.height * 0.25
        }
        this.addChild(this._timeText);


        this._titleText.text = "Time";
        this._titleText.style = {
            fill: "white",
            fontFamily: "PR_Viking",
            align: "center",
            stroke: "black",
            strokeThickness: 2         
        };
        this._titleText.position = {
            x: this._timerBackground.width * 0.5 - this._titleText.width * 0.5,
            y: this._timerBackground.height * 0.5 - this._titleText.height * 0.9
        }
        this.addChild(this._titleText);


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
                this.callBacks();
                this.formatTime();
                if (this._currentTime > 0) {
                    this.countdown();
                }
                else {
                    eventEmitter.emit('onTimeComplete')
                }
            }
        })
    }

    private callBacks(): void {
        const time = this._currentTime;
        if (this._timeCallbacks) {
            const _timeCallbacks = this._timeCallbacks[time];
            if (_timeCallbacks) {
                _timeCallbacks();
            }
        }
    }

}
