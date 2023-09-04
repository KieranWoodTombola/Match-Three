import { Engine } from './core/engine';
import { MenuScene } from './scenes/menu-scene';

export const Game = new Engine({
    containerId: 'game',
    canvasW: 800,
    canvasH: 450
});

Game.initialise(new MenuScene(Game.width, Game.height));
