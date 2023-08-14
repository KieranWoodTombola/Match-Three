import { EventEmitter } from 'eventemitter3';
import { Token } from './scripts/core/models/token';

interface Events {
    empty: () => void;

    //grid events
    clickCheck: (token: Token) => void;
    onSwapComplete: () => void;

    //column events

    //token events
    tokenFirstClicked: (tokenX: number, tokenY: number) => void;
    tokenSecondClicked: (tokenX: number, tokenY: number) => void;
    tokenPositionChange: () => void;
    //tokenRevealed: (arg1: number) => void;
}

export const eventEmitter = new EventEmitter<Events>();
