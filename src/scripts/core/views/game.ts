

import { FpsMeter } from './fps-meter';
import { Engine } from './engine';
import { Scene } from '../../scene';

export class Game {
    public static engine: Engine;

    private fpsMeter!: FpsMeter;
    private scene!: Scene;
    private start!: number;
    private frameDuration: number;
    private latency = 0;

    constructor() {
        Game.engine = new Engine({
            containerId: 'game',
            canvasW: 800,
            canvasH: 450,
            fpsMax: 60
        });

        this.frameDuration = 1000 / Game.engine.fpsMax;

        window.onload = this.initialise.bind(this);
    }

    public initialise() {
        /* FPS */
        const fpsMeterItem = document.createElement('div');
        fpsMeterItem.classList.add('fps');
        Game.engine.container.appendChild(fpsMeterItem);
    
        this.fpsMeter = new FpsMeter(() => {
            fpsMeterItem.innerHTML = 'FPS: ' + this.fpsMeter.getFrameRate().toFixed(2).toString();
        });

        /* Scene */
        this.scene = new Scene(Game.engine.renderer.width, Game.engine.renderer.height);
        this.scene.load().then(this.onAssetsLoaded.bind(this));
    }

    public onAssetsLoaded(): void {
        this.scene.initialise();

        Game.engine.stage.addChild(this.scene);

        this.start = Date.now();
        this.update();
    }

    public update() {
        requestAnimationFrame(this.update.bind(this));
        
        // Calcuate the time that has elapsed since the last frame
        var current = Date.now(), elapsed = current - this.start;
        this.start = current;
        // Add the elapsed time to the latency counter
        this.latency += elapsed;
    
        // Update the frame if the latency counter is greater than or
        // equal to the frame duration
        while (this.latency >= this.frameDuration){  
            //Update any logic???
            this.fpsMeter.updateTime();
            
            // Reduce the latency counter by the frame duration
            this.latency -= this.frameDuration;
        }

        // Calculate the delta and use it to update
        var delta = this.latency / this.frameDuration;
        this.scene.update(delta);
        Game.engine.renderer.render(Game.engine.stage);
        this.fpsMeter.tick();
    }
}
