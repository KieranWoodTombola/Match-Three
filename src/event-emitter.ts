import { EventEmitter } from 'eventemitter3';
import { Token } from './scripts/core/models/token';

interface Events {
    //navigation events
    toMenu: () => void;
    toGame: () => void;

    //timer
    onTimeComplete: () => void;

    //grid events
    clickCheck: (token: Token) => void;
    onMatch: (tokens: Token[]) => void;
}

export const eventEmitter = new EventEmitter<Events>();
