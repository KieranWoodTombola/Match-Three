import { EventEmitter } from 'eventemitter3';

interface Events {
    empty: () => void

    //grid events
    clickCheck: (tokenX: number, tokenY: number) => void
    //column events

    //token events
    tokenFirstClicked: (tokenX: number, tokenY: number) => void
    tokenSecondClicked: (tokenX: number, tokenY: number) => void
    tokenPositionChange: () => void
    //tokenRevealed: (arg1: number) => void
}

export const eventEmitter = new EventEmitter<Events>();
