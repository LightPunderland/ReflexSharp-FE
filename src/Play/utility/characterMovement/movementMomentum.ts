export class MovementMomentum {

    static momentumMaxTime: number = 20;
    static initialMomentumTime: number = 8;
    static momentumLoseRate: number = 4;

    upMomentum: number;
    rightMomentum: number;
    leftMomentum: number;
    downMomentum: number;

    private _upMomentumTime: number;
    private _rightMomentumTime: number;
    private _leftMomentumTime: number;
    private _downMomentumTime: number;

    constructor() {
        this.upMomentum = 0;
        this.rightMomentum = 0;
        this.leftMomentum = 0;
        this.downMomentum = 0;

        this._upMomentumTime = MovementMomentum.initialMomentumTime;
        this._rightMomentumTime = MovementMomentum.initialMomentumTime;
        this._leftMomentumTime = MovementMomentum.initialMomentumTime;
        this._downMomentumTime = MovementMomentum.initialMomentumTime;
    }

    loseMomentum(): void {
        this.loseDownMomentum();
        this.loseUpMomentum();
        this.loseLeftMomentum();
        this.loseRightMomentum();
    }

    resetUpMomentum(): void {
        this._upMomentumTime = MovementMomentum.initialMomentumTime;
        this.upMomentum = 0;
    }

    resetDownMomentum(): void {

        this._downMomentumTime = MovementMomentum.initialMomentumTime;
        this.downMomentum = 0;
    }

    resetRightMomentum(): void {
        this._rightMomentumTime = MovementMomentum.initialMomentumTime;
        this.rightMomentum = 0;
    }

    resetLeftMomentum(): void {
        this._leftMomentumTime = MovementMomentum.initialMomentumTime;
        this.leftMomentum = 0;
    }

    gainUpMomentum(momentumTime: number): void {
        this._upMomentumTime = Math.min(this._upMomentumTime + momentumTime, MovementMomentum.momentumMaxTime);
        this.upMomentum = Math.sqrt(this._upMomentumTime / MovementMomentum.momentumMaxTime);
        this.resetDownMomentum();
    }

    gainDownMomentum(momentumTime: number): void {

        this._downMomentumTime = Math.min(this._downMomentumTime + momentumTime, MovementMomentum.momentumMaxTime);
        this.downMomentum = Math.sqrt(this._downMomentumTime / MovementMomentum.momentumMaxTime);
        this.resetUpMomentum();
    }

    gainRightMomentum(momentumTime: number): void {
        this._rightMomentumTime = Math.min(this._rightMomentumTime + momentumTime, MovementMomentum.momentumMaxTime);
        this.rightMomentum = Math.sqrt(this._rightMomentumTime / MovementMomentum.momentumMaxTime);
        this.resetLeftMomentum();
    }

    gainLeftMomentum(momentumTime: number): void {
        this._leftMomentumTime = Math.min(this._leftMomentumTime + momentumTime, MovementMomentum.momentumMaxTime);
        this.leftMomentum = Math.sqrt(this._leftMomentumTime / MovementMomentum.momentumMaxTime);
        this.resetRightMomentum();
    }

    loseLeftMomentum(): void {
        this._leftMomentumTime = Math.max(this._leftMomentumTime - MovementMomentum.momentumLoseRate, MovementMomentum.initialMomentumTime);
        this.leftMomentum = Math.sqrt(this._leftMomentumTime / MovementMomentum.momentumMaxTime);
    }

    loseRightMomentum(): void {
        this._rightMomentumTime = Math.max(this._rightMomentumTime - MovementMomentum.momentumLoseRate, MovementMomentum.initialMomentumTime);
        this.rightMomentum = Math.sqrt(this._rightMomentumTime / MovementMomentum.momentumMaxTime);
    }

    loseUpMomentum(): void {
        this._upMomentumTime = Math.max(this._upMomentumTime - MovementMomentum.momentumLoseRate, MovementMomentum.initialMomentumTime);
        this.upMomentum = Math.sqrt(this._upMomentumTime / MovementMomentum.momentumMaxTime);
    }

    loseDownMomentum(): void {
        this._downMomentumTime = Math.max(this._downMomentumTime - MovementMomentum.momentumLoseRate, MovementMomentum.initialMomentumTime);
        this.downMomentum = Math.sqrt(this._downMomentumTime / MovementMomentum.momentumMaxTime);
    }
}
