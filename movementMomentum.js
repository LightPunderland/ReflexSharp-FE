export class MovementMomentum{

    //laikas per kuri characteris pasiekia savo max inercija
    static momentumMaxTime = 20;

    static initialMomentumTime = 8;

    static momentumLoseRate = 0.8;

    constructor(){
        //visos sitos values turi buti range [0:1], tai 1 bus kai max inercija pasieke
        this.upMomentum = 0;
        this.rightMomentum = 0;
        this.leftMomentum = 0;
        this.downMomentum = 0;

        //sitos values yra nuo [0;momentumMaxTime]
        this._upMomentumTime = MovementMomentum.initialMomentumTime;
        this._rightMomentumTime = MovementMomentum.initialMomentumTime;
        this._leftMomentumTime = MovementMomentum.initialMomentumTime;
        this._downMomentumTime = MovementMomentum.initialMomentumTime;
    }

    loseMomentum(){
        
    }

    _resetUpMomentum(){
        this._upMomentumTime = MovementMomentum.initialMomentumTime;
        this.upMomentum = 0;
    }

    _resetDownMomentum(){
        this._downMomentumTime = MovementMomentum.initialMomentumTime;
        this.downMomentum = 0;
    }

    _resetRightMomentum(){
        this._rightMomentumTime = MovementMomentum.initialMomentumTime;
        this.rightMomentum = 0;
    }

    _resetLeftMomentum(){
        this._leftMomentumTime = MovementMomentum.initialMomentumTime;
        this.leftMomentum = 0;
    }

    gainUpMomentum(momentumTime){
        if(this._upMomentumTime + momentumTime <= MovementMomentum.momentumMaxTime){
            this._upMomentumTime += momentumTime;
        }
        else{
            this._upMomentumTime = MovementMomentum.momentumMaxTime;
        }
        
        this.upMomentum = Math.sqrt(this._upMomentumTime / MovementMomentum.momentumMaxTime);

        //jeigu igauna inercijos i virsu, praranda visa inercija i apacia
        this._resetDownMomentum();
    }

    gainDownMomentum(momentumTime){
        if(this._downMomentumTime + momentumTime <= MovementMomentum.momentumMaxTime){
            this._downMomentumTime += momentumTime;
        }
        else{
            this._downMomentumTime = MovementMomentum.momentumMaxTime;
        }
        this.downMomentum = Math.sqrt(this._downMomentumTime / MovementMomentum.momentumMaxTime);

        //jeigu igauna inercijos i virsu, praranda visa inercija i virsu
        this._resetUpMomentum();
    }

    gainRightMomentum(momentumTime){
        if(this._rightMomentumTime + momentumTime <= MovementMomentum.momentumMaxTime){
            this._rightMomentumTime += momentumTime;
        }
        else{
            this._rightMomentumTime = MovementMomentum.momentumMaxTime;
        }
        this.rightMomentum = Math.sqrt(this._rightMomentumTime / MovementMomentum.momentumMaxTime);

        //jeigu igauna inercijos i virsu, praranda visa inercija i kaire
        this._resetLeftMomentum();
    }

    gainLeftMomentum(momentumTime){
        if(this._leftMomentumTime + momentumTime <= MovementMomentum.momentumMaxTime){
            this._leftMomentumTime += momentumTime;
        }
        else{
            this._leftMomentumTime = MovementMomentum.momentumMaxTime;
        }
        this.leftMomentum = Math.sqrt(this._leftMomentumTime / MovementMomentum.momentumMaxTime);

        //jeigu igauna inercijos i virsu, praranda visa inercija i desine
        this._resetRightMomentum();
    }
}