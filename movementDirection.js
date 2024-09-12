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

    set up(_){
        this._resetDirection();
        this._up = true;
    }

    get down(){
        return this._down;
    }

    set down(_){
        this._resetDirection();
        this._down = true;
    }

    get right(){
        return this._right;
    }

    set right(_){
        this._resetDirection();
        this._right = true;
    }

    get left(){
        return this._left;
    }

    set left(_){
        this._resetDirection();
        this._left = true;
    }

    get upleft(){
        return this._upleft;
    }

    set upleft(_){
        this._resetDirection();
        this._upleft = true;
    }

    get upright(){
        return this._upright;
    }

    set upright(_){
        this._resetDirection();
        this._upright = true;
    }

    get downleft(){
        return this._downleft;
    }

    set downleft(_){
        this._resetDirection();
        this._downleft = true;
    }

    get downright(){
        return this._downright;
    }

    set downright(_){
        this._resetDirection();
        this._downright = true;
    }
}