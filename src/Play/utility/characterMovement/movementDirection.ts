export class MovementDirection {
    private _up: boolean = false; 
    private _right: boolean = false;
    private _down: boolean = false;
    private _left: boolean = false;
    private _upright: boolean = false;
    private _upleft: boolean = false;
    private _downleft: boolean = false;
    private _downright: boolean = false;

    _resetDirection(): void {
        this._up = false;
        this._right = false;
        this._down = false;
        this._left = false;
        this._upright = false;
        this._upleft = false;
        this._downleft = false;
        this._downright = false;
    }

    constructor() {}

    get up(): boolean {
        return this._up;
    }

    set up(bool: boolean) {
        this._resetDirection();
        this._up = bool;
    }

    get down(): boolean {
        return this._down;
    }

    set down(bool: boolean) {
        this._resetDirection();
        this._down = bool;
    }

    get right(): boolean {
        return this._right;
    }

    set right(bool: boolean) {
        this._resetDirection();
        this._right = bool;
    }

    get left(): boolean {
        return this._left;
    }

    set left(bool: boolean) {
        this._resetDirection();
        this._left = bool;
    }

    get upleft(): boolean {
        return this._upleft;
    }

    set upleft(bool: boolean) {
        this._resetDirection();
        this._upleft = bool;
    }

    get upright(): boolean {
        return this._upright;
    }

    set upright(bool: boolean) {
        this._resetDirection();
        this._upright = bool;
    }

    get downleft(): boolean {
        return this._downleft;
    }

    set downleft(bool: boolean) {
        this._resetDirection();
        this._downleft = bool;
    }

    get downright(): boolean {
        return this._downright;
    }

    set downright(bool: boolean) {
        this._resetDirection();
        this._downright = bool;
    }
}
