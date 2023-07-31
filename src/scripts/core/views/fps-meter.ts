export class FpsMeter {
    private nbFrames: number;
    private elapsedTime: number;
    private previousTime: number;

    constructor(public render: () => void, private refreshDelay = 500) {
        this.nbFrames = 0;
        this.elapsedTime = 0;
        this.previousTime = performance.now();
    }

    public updateTime(): void {
        this.elapsedTime = performance.now() - this.previousTime;
    }

    public tick(): void {
        this.nbFrames++;
        if (this.elapsedTime > this.refreshDelay) {
            this.render();
            this.reset();
        }
    }

    public reset(): void {
        this.nbFrames = 0;
        this.elapsedTime = 0;
        this.previousTime = performance.now();
    }

    public getFrameRate(): number {
        return 1000.0 * this.nbFrames / this.elapsedTime;
    }
}
