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
        return [this.firstX, this.firstY];
    }

    public getSecond(): [number, number] {
        return [this.secondX, this.secondY];
    }

    public getCurvePoints(): [number, number, number, number] {

        let firstX: number = (this.getMidpoint()[0] + this.firstX) * 0.5;
        let firstY: number = (this.getMidpoint()[1] + this.secondY) * 0.5;
        let secondX: number = (this.getMidpoint()[0] + this.secondX) * 0.5;
        let secondY: number = (this.getMidpoint()[1] + this.firstY) * 0.5;

        if(this.firstX === this.secondX){
            const curveRadius = (this.getMidpoint()[1] + secondY) * 0.25
            firstX = this.getMidpoint()[0] + curveRadius;
            secondX = this.getMidpoint()[0] - curveRadius;

            firstY = this.getMidpoint()[1];
            secondY = this.getMidpoint()[1];

            return [firstX, firstY, secondX, secondY];
        }

        if(this.firstY === this.secondY){
            const curveRadius = (this.getMidpoint()[0] + secondX) * 0.25
            firstY = this.getMidpoint()[1] + curveRadius;
            secondY = this.getMidpoint()[1] - curveRadius;

            firstX = this.getMidpoint()[0];
            secondY = this.getMidpoint()[0];

            return [firstX, firstY, secondX, secondY];
        }


        return [firstX, firstY, secondX, secondY];
    }

    public getMidpoint(): [number, number]{
        return [((this.firstX + this.secondX) * 0.5), ((this.firstY + this.secondY) * 0.5)];
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

    //using known degree, get grid position of a point
    public getPointOnCircumference(degrees: number): [number, number] {
        const radians = degrees * (Math.PI / 180)
        return [
            (Math.cos(radians) * this.getRadius()) + this.getMidpoint()[0],
            (Math.sin(radians) * this.getRadius()) + this.getMidpoint()[1]
        ];
    }

}

