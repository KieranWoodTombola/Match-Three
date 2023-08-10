export class Curve {

    private firstX: number;
    private firstY: number;
    private secondX: number;
    private secondY: number;

    constructor(first: [number, number], second: [number, number]) {
        this.firstX = first[0];
        this.firstY = first[1];
        this.secondX = second[0];
        this.secondY = second[1];
    }

    public getFirst(): [number, number] {
        return [this.firstX, this.firstY]
    }

    public getSecond(): [number, number] {
        return [this.secondX, this.secondY]
    }

    public getHighNoon(): [number, number] {
        return [
            this.getMidpoint()[0],
            this.getMidpoint()[1] + this.getRadius()
        ];
    }

    public getMidpoint(): [number, number]{
        return [((this.firstX + this.secondX) * 0.5), ((this.firstY + this.secondY) * 0.5)]
    }

    public getDiameter(): number {
        return Math.round(Math.sqrt(
            Math.pow((this.secondX - this.firstX), 2) + 
            Math.pow((this.secondY - this.firstY), 2)
        ));
    }

    public getRadius(): number {
        return this.getDiameter() * 0.5;
    }

    public getCircumference(): number {
        return Math.PI * Math.pow(this.getRadius(), 2);
    }

    public getPointOnCircumference(degrees: number): [number, number] {
        const radians = degrees * (Math.PI / 180)
        return [
            (Math.cos(radians) * this.getRadius()) + this.getMidpoint()[0],
            (Math.sin(radians) * this.getRadius()) + this.getMidpoint()[1]
        ]
    }

    public rotate90(firstX: number, firstY: number): [number, number] {
        let newX = firstY - this.getMidpoint()[1];
        let newY = firstX - this.getMidpoint()[0];

        //ToDo reduce height of curve relative to base of curve
        // const length: number = Math.sqrt(newX * newX + newY * newY);
        // newX = (newX === 0) ? newX :newX / length;
        // newY = (newY === 0) ? newY : newY / length;

        newY * -1

        return [newX + this.getMidpoint()[0], newY + this.getMidpoint()[1]]
    }

}

