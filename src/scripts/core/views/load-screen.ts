import { Container, Text } from 'pixi.js';
import { Game } from '../../main';

export class LoadScreen extends Container {
    private _message: Text;

    constructor() {
        super();

        this._message = new Text('Loading...0%', { fill: 0xffffff });
        this._message.anchor.set(0.5);
        this._message.position = {
            x: Game.width * 0.5,
            y: Game.height * 0.5
        }
        this.addChild(this._message);
    }

    public update(percentage: number): void {
        this._message.text = `Loading...${percentage * 100}%`;
    }
}