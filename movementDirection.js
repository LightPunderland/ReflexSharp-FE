export class MovementDirection{
    //privati funkcija neturi buti naudojama isoreje
    _resetDirection(){
        this._up = false;
        this._right = false;
        this._down = false;
        this._left = false;
        this._upright = false;
        this._upleft = false;
        this._downleft = false;
        this._downright = false;
    }

    constructor(){
        this._resetDirection();
    }

    get up(){
        return this._up;
    }

    set up(bool){
        this._resetDirection();
        this._up = bool;
    }

    get down(){
        return this._down;
    }

    set down(bool){
        this._resetDirection();
        this._down = bool;
    }

    get right(){
        return this._right;
    }

    set right(bool){
        this._resetDirection();
        this._right = bool;
    }

    get left(){
        return this._left;
    }

    set left(bool){
        this._resetDirection();
        this._left = bool;
    }

    get upleft(){
        return this._upleft;
    }

    set upleft(bool){
        this._resetDirection();
        this._upleft = bool;
    }

    get upright(){
        return this._upright;
    }

    set upright(bool){
        this._resetDirection();
        this._upright = bool;
    }

    get downleft(){
        return this._downleft;
    }

    set downleft(bool){
        this._resetDirection();
        this._downleft = bool;
    }

    get downright(){
        return this._downright;
    }

    set downright(bool){
        this._resetDirection();
        this._downright = bool;
    }
}