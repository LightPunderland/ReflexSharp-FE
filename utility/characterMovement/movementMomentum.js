export class MovementMomentum{

    //laikas per kuri characteris pasiekia savo max inercija
    static momentumMaxTime = 20;

    static initialMomentumTime = 8;

    static momentumLoseRate = 4;

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
        this.loseDownMomentum();
        this.loseUpMomentum();
        this.loseLeftMomentum();
        this.loseRightMomentum();
    }

    resetUpMomentum(){
        this._upMomentumTime = MovementMomentum.initialMomentumTime;
        this.upMomentum = 0;
    }

    resetDownMomentum(){
        this._downMomentumTime = MovementMomentum.initialMomentumTime;
        this.downMomentum = 0;
    }

    resetRightMomentum(){
        this._rightMomentumTime = MovementMomentum.initialMomentumTime;
        this.rightMomentum = 0;
    }

    resetLeftMomentum(){
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
        this.resetDownMomentum();
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
        this.resetUpMomentum();
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
        this.resetLeftMomentum();
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
        this.resetRightMomentum();
    }

    loseLeftMomentum(){
        if(this._leftMomentumTime - MovementMomentum.momentumLoseRate > MovementMomentum.initialMomentumTime){
            this._leftMomentumTime -= MovementMomentum.momentumLoseRate;
            this.leftMomentum = Math.sqrt(this._leftMomentumTime / MovementMomentum.momentumMaxTime);
        }
        else{
            this._leftMomentumTime = MovementMomentum.initialMomentumTime;
            this.leftMomentum = 0;
        }
    }

    loseRightMomentum(){
        if(this._rightMomentumTime - MovementMomentum.momentumLoseRate > MovementMomentum.initialMomentumTime){
            this._rightMomentumTime -= MovementMomentum.momentumLoseRate;
            this.rightMomentum = Math.sqrt(this._rightMomentumTime / MovementMomentum.momentumMaxTime);
        }
        else{
            this._rightMomentumTime = MovementMomentum.initialMomentumTime;
            this.rightMomentum = 0;
        }
    }

    loseUpMomentum(){
        if(this._upMomentumTime - MovementMomentum.momentumLoseRate > MovementMomentum.initialMomentumTime){
            this._upMomentumTime -= MovementMomentum.momentumLoseRate;
            this.upMomentum = Math.sqrt(this._upMomentumTime / MovementMomentum.momentumMaxTime);
        }
        else{
            this.upMomentumTime = MovementMomentum.initialMomentumTime;
            this.upMomentum = 0;
        }
    }

    loseDownMomentum(){
        if(this._downMomentumTime - MovementMomentum.momentumLoseRate > MovementMomentum.initialMomentumTime){
            this._downMomentumTime -= MovementMomentum.momentumLoseRate;
            this.downMomentum = Math.sqrt(this._downMomentumTime / MovementMomentum.momentumMaxTime);
        }
        else{
            this._downMomentumTime = MovementMomentum.initialMomentumTime;
            this.downMomentum = 0;
        }
    }
}