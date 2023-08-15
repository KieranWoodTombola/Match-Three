import { Container, Text as PixiText } from "pixi.js";
import { gsap } from "gsap";
import { eventEmitter } from "../../../event-emitter";

export class Timer extends Container{

    private _secondsAllowed: number;
    private _currentTime: number;
    private _timeText: PixiText = new PixiText;
    private _timeLimit: number = 100;
    constructor(secondsAllowed: number) {
        super()
        this._secondsAllowed = secondsAllowed;
        this._currentTime = secondsAllowed;
        this.formatTime();
        this._timeText.style = {
            fill: "white"
        };
        this.addChild(this._timeText);
        this.countdown();
    }

    private formatTime(): void {
        let minutes = "0";
        let seconds = "0";
        if(this._currentTime > 60){
            minutes = Math.floor(this._currentTime/60).toString();
        }
        seconds = this._currentTime % 60 === 0 ? '00' : (this._currentTime % 60).toString()
        this._timeText.text =  minutes + ":" + seconds;
    }

    private countdown() {
        gsap.to(this, {
            duration: 1,
            _currentTime: this._currentTime -1,
            onComplete: () =>{
                this.formatTime()
                if(this._currentTime > 0) { this.countdown() }
                else {
                    eventEmitter.emit('countdown');
                }
            }
        })
    }

}
    