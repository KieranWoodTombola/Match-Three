import { EventEmitter } from 'eventemitter3';
import { Token } from './scripts/core/models/token';

interface Events {
    empty: () => void;

    //grid events
    clickCheck: (token: Token) => void;
    onSwapComplete: () => void
    onMatch: (tokens: Token[]) => void
  
    //column events

    //token events
    
    //countdown events
    countdown: () => void;
}

export const eventEmitter = new EventEmitter<Events>();
