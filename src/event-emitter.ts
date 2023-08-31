import { EventEmitter } from 'eventemitter3';
import { Token } from './scripts/core/models/token';

interface Events {
    //grid events
    clickCheck: (token: Token) => void;
    onMatch: (tokens: Token[]) => void;
  
    //column events

    //token events
    
}

export const eventEmitter = new EventEmitter<Events>();
