import { KeyboardKeys } from "./keyboardKeys.js";

import { MovementDirection } from "./characterMovement/movementDirection.js";

import { MovementMomentum } from "./characterMovement/movementMomentum.js";

import { MovementPhysics } from "./characterMovement/movementPhysics.js";

export class Character{

    //konstanta reikalinga sumazinti characterio greiti judant istrizai
    static reduceDiagonalSpeed = 0.707;

    static spriteImagePath = './assets/ninja.png';

    constructor(){
        // if (!this.projectile) {
        //     throw new Error("Projectile must have a sprite defined.");
        // }

        //klase kurioje saugoma i kuria puse juda characteris
        this.movementDirection = new MovementDirection();

        //klase kurioje saugoma 4 krypciu inercijos jegos veikiancio characteri
        this.movementMomentum = new MovementMomentum();

        this.collided = false;
    }

    spawnCharacter(canvasWidth, canvasHeight){
        if(this.sprite.parent == null){
            throw new Error("[Character] Sprite not added to the stage");
        }
        
        this.sprite.x = canvasWidth/2 - this.sprite.width/2;
        this.sprite.y = canvasHeight/2 - this.sprite.height/2;
    }

    update(tickerDeltaTime, projectileArray){
        this.checkForCollision(projectileArray);
        this.setCharacterMovementDirection();
        this.updateCharacterMomentum(tickerDeltaTime);
        this.moveCharacter();
    }

    checkForCollision(projectileArray){
        for(let i = 0;i<projectileArray.length;i++){
            let projectile = projectileArray[i].getSprite();

            if(this._pointCollision(this.sprite.x, this.sprite.y, projectile)){
                this.collided = true;
            }
            else if(this._pointCollision(this.sprite.x+this.sprite.width, this.sprite.y, projectile)){
                this.collided = true;
            }
            else if(this._pointCollision(this.sprite.x, this.sprite.y+this.sprite.height, projectile)){
                this.collided = true;
            }
            else if(this._pointCollision(this.sprite.x+this.sprite.width, this.sprite.y+this.sprite.height, projectile)){
                this.collided = true;
            }
            else{
                this.collided = false;
            }
        }
    }

    //Grazina true jeigu duotas characterio taskas collidina su projectile
    _pointCollision(x, y, projectile){
        if(projectile.x < x && x < projectile.x + projectile.width){
            if(projectile.y < y && y < projectile.y + projectile.height){
                return true;
            }
        }

        return false;
    }

    async loadSprite(){
        await PIXI.Assets.load(Character.spriteImagePath);
        this.sprite = PIXI.Sprite.from(Character.spriteImagePath);
        this.sprite.scale.set(1.15);
    }

    getSprite(){
        if (!this.sprite) {
            throw new Error("Character sprite not loaded");
        }

        return this.sprite;
    }

    //funkcija turi buti kvieciama every tick, kad pagal judejimo krypti apskaiciuotu inercija
    updateCharacterMomentum(tickerDeltaTime){

        if(this.movementDirection.upleft){
            this.movementMomentum.gainLeftMomentum(tickerDeltaTime);
            this.movementMomentum.gainUpMomentum(tickerDeltaTime);
        }
        else if(this.movementDirection.upright){
            this.movementMomentum.gainUpMomentum(tickerDeltaTime);
            this.movementMomentum.gainRightMomentum(tickerDeltaTime);
        }
        else if(this.movementDirection.downright){
            this.movementMomentum.gainRightMomentum(tickerDeltaTime);
            this.movementMomentum.gainDownMomentum(tickerDeltaTime);
        }
        else if(this.movementDirection.downleft){
            this.movementMomentum.gainDownMomentum(tickerDeltaTime);
            this.movementMomentum.gainLeftMomentum(tickerDeltaTime);
        }
        else if(this.movementDirection.left){
            this.movementMomentum.gainLeftMomentum(tickerDeltaTime);
    
            this.movementMomentum.resetDownMomentum();
            this.movementMomentum.resetUpMomentum();
        }
        else if(this.movementDirection.right){
            this.movementMomentum.gainRightMomentum(tickerDeltaTime);
    
            this.movementMomentum.resetDownMomentum();
            this.movementMomentum.resetUpMomentum();
        }
        else if(this.movementDirection.up){
            this.movementMomentum.gainUpMomentum(tickerDeltaTime);
    
            this.movementMomentum.resetRightMomentum();
            this.movementMomentum.resetLeftMomentum();
        }
        else if(this.movementDirection.down){
            this.movementMomentum.gainDownMomentum(tickerDeltaTime);
    
            this.movementMomentum.resetRightMomentum();
            this.movementMomentum.resetLeftMomentum();
        }
    
        if(!KeyboardKeys.anyKeyPressed()){
            this.movementMomentum.loseMomentum();
        }
    }

    //pagal klaviaturos inputa nustato characterio judejimo direction
    setCharacterMovementDirection(){
        if(KeyboardKeys.numberOfKeysPressed() == 2){
            if(KeyboardKeys.keyboardState["KeyA"] && KeyboardKeys.keyboardState["KeyW"]){
                this.movementDirection.upleft = true;
            }
            else if(KeyboardKeys.keyboardState["KeyW"] && KeyboardKeys.keyboardState["KeyD"]){
                this.movementDirection.upright = true;
            }
            else if(KeyboardKeys.keyboardState["KeyD"] && KeyboardKeys.keyboardState["KeyS"]){
                this.movementDirection.downright = true;
            }
            else if(KeyboardKeys.keyboardState["KeyS"] && KeyboardKeys.keyboardState["KeyA"]){
                this.movementDirection.downleft = true;
            }
    
            return;
        }
    
        if(KeyboardKeys.keyboardState["KeyA"]){
            this.movementDirection.left = true;
        }
        if(KeyboardKeys.keyboardState["KeyD"]){
            this.movementDirection.right = true;
        }
        if(KeyboardKeys.keyboardState["KeyW"]){
            this.movementDirection.up = true;
        }
        if(KeyboardKeys.keyboardState["KeyS"]){
            this.movementDirection.down = true;
        }
    }

    //funkcija kvieciama every tick, judina characteri pagal ji veikiancias inercijos jegas
    moveCharacter(){
        if(this.movementDirection.up){
            this.sprite.y -= MovementPhysics.calculateSpeed(this.movementMomentum.upMomentum, 1);
        }
        else if(this.movementDirection.right){
            this.sprite.x += MovementPhysics.calculateSpeed(this.movementMomentum.rightMomentum, 1);
        }
        else if(this.movementDirection.down){
            this.sprite.y += MovementPhysics.calculateSpeed(this.movementMomentum.downMomentum, 1);
        }
        else if(this.movementDirection.left){
            this.sprite.x -= MovementPhysics.calculateSpeed(this.movementMomentum.leftMomentum, 1);
        }
        else if(this.movementDirection.upright){
            this.sprite.y -= MovementPhysics.calculateSpeed(this.movementMomentum.upMomentum, Character.reduceDiagonalSpeed);
            this.sprite.x += MovementPhysics.calculateSpeed(this.movementMomentum.rightMomentum, Character.reduceDiagonalSpeed);
        }
        else if(this.movementDirection.downright){
            this.sprite.x += MovementPhysics.calculateSpeed(this.movementMomentum.rightMomentum, Character.reduceDiagonalSpeed);
            this.sprite.y += MovementPhysics.calculateSpeed(this.movementMomentum.downMomentum, Character.reduceDiagonalSpeed);
        }
        else if(this.movementDirection.downleft){
            this.sprite.y += MovementPhysics.calculateSpeed(this.movementMomentum.downMomentum, Character.reduceDiagonalSpeed);
            this.sprite.x -= MovementPhysics.calculateSpeed(this.movementMomentum.leftMomentum, Character.reduceDiagonalSpeed);
        }
        else if(this.movementDirection.upleft){
            this.sprite.x -= MovementPhysics.calculateSpeed(this.movementMomentum.leftMomentum, Character.reduceDiagonalSpeed);
            this.sprite.y -= MovementPhysics.calculateSpeed(this.movementMomentum.upMomentum, Character.reduceDiagonalSpeed);
        }
    }

    momentumDebugLog(){
        console.log("upMomentum" + this.movementMomentum.upMomentum);
        console.log("rightMomentum" + this.movementMomentum.rightMomentum);
        console.log("downMomentum" + this.movementMomentum.downMomentum);
        console.log("leftMomentum" + this.movementMomentum.leftMomentum);
    }
}