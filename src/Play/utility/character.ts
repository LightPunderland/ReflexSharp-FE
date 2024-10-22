import { KeyboardKeys } from "./keyboardKeys";
import { MovementDirection } from "./characterMovement/movementDirection";
import { MovementMomentum } from "./characterMovement/movementMomentum";
import { MovementPhysics } from "./characterMovement/movementPhysics";
import * as PIXI from 'pixi.js';
import { Projectile } from "./projectiles/projectile";

export class Character {
    static reduceDiagonalSpeed = 0.707;
    static NinjaPNG= 'http://localhost:5050/api/sprite/by-name/ninja';
    sprite: PIXI.Sprite | undefined;
    movementDirection: MovementDirection;
    movementMomentum: MovementMomentum;
    collided: boolean;

    constructor() {
        //klase kurioje saugoma i kuria puse juda characteris
        this.movementDirection = new MovementDirection();

        //klase kurioje saugoma 4 krypciu inercijos jegos veikiancio characteri
        this.movementMomentum = new MovementMomentum();

        this.collided = false;
    }

    spawnCharacter(canvasWidth: number, canvasHeight: number) {
        
        if (!this.sprite || this.sprite.parent == null) {
            throw new Error("[Character] Sprite not added to the stage");
        }

        this.sprite.x = canvasWidth / 2 - this.sprite.width / 2;
        this.sprite.y = canvasHeight / 2 - this.sprite.height / 2;
    }

    update(tickerDeltaTime: number, projectileArray: Projectile[], deltaSpeed: number) {
        this.checkForCollision(projectileArray);
        this.setCharacterMovementDirection();
        this.updateCharacterMomentum(tickerDeltaTime);
        this.moveCharacter(deltaSpeed);
    }

    checkForCollision(projectileArray: Projectile[]){
        for(let i = 0;i<projectileArray.length;i++){
            let projectile = projectileArray[i].getSprite();

            if(this.sprite && this._pointCollision(this.sprite.x, this.sprite.y, projectile)){
                this.collided = true;
            }
            else if(this.sprite && this._pointCollision(this.sprite.x+this.sprite.width, this.sprite.y, projectile)){
                this.collided = true;
            }
            else if(this.sprite && this._pointCollision(this.sprite.x, this.sprite.y+this.sprite.height, projectile)){
                this.collided = true;
            }
            else if(this.sprite && this._pointCollision(this.sprite.x+this.sprite.width, this.sprite.y+this.sprite.height, projectile)){
                this.collided = true;
            }
            else{
                this.collided = false;
            }
        }
    }

    //Grazina true jeigu duotas characterio taskas collidina su projectile
    _pointCollision(x: number, y: number, projectile: PIXI.Sprite){
        if(projectile.x < x && x < projectile.x + projectile.width){
            if(projectile.y < y && y < projectile.y + projectile.height){
                return true;
            }
        }

        return false;
    }

    async loadSprite() {
        try {
            // Fetch the image data from the backend
            const response = await fetch(Character.NinjaPNG);
            if (!response.ok) {
                throw new Error("Failed to fetch sprite image");
            }
    
            // Get the image blob
            const blob = await response.blob();
    
            // Create a temporary URL for the image
            const imageUrl = URL.createObjectURL(blob);
    
            // Create a PIXI.Texture from the image URL
            const texture = PIXI.Texture.from(imageUrl);
    
            this.sprite = new PIXI.Sprite(texture);
            this.sprite.scale.set(1.15);
    
        } catch (error) {
            console.error("Failed to load sprite:", error);
        }
    }
    

    getSprite() {
        if (!this.sprite) {
            throw new Error("Character sprite not loaded");
        }
        return this.sprite;
    }

    updateCharacterMomentum(tickerDeltaTime: number) {
        if (this.movementDirection.upleft) {
            this.movementMomentum.gainLeftMomentum(tickerDeltaTime);
            this.movementMomentum.gainUpMomentum(tickerDeltaTime);
        } else if (this.movementDirection.upright) {
            this.movementMomentum.gainUpMomentum(tickerDeltaTime);
            this.movementMomentum.gainRightMomentum(tickerDeltaTime);
        } else if (this.movementDirection.downright) {
            this.movementMomentum.gainRightMomentum(tickerDeltaTime);
            this.movementMomentum.gainDownMomentum(tickerDeltaTime);
        } else if (this.movementDirection.downleft) {
            this.movementMomentum.gainDownMomentum(tickerDeltaTime);
            this.movementMomentum.gainLeftMomentum(tickerDeltaTime);
        } else if (this.movementDirection.left) {
            this.movementMomentum.gainLeftMomentum(tickerDeltaTime);
            this.movementMomentum.resetDownMomentum();
            this.movementMomentum.resetUpMomentum();
        } else if (this.movementDirection.right) {
            this.movementMomentum.gainRightMomentum(tickerDeltaTime);
            this.movementMomentum.resetDownMomentum();
            this.movementMomentum.resetUpMomentum();
        } else if (this.movementDirection.up) {
            this.movementMomentum.gainUpMomentum(tickerDeltaTime);
            this.movementMomentum.resetRightMomentum();
            this.movementMomentum.resetLeftMomentum();
        } else if (this.movementDirection.down) {
            this.movementMomentum.gainDownMomentum(tickerDeltaTime);
            this.movementMomentum.resetRightMomentum();
            this.movementMomentum.resetLeftMomentum();
        }

        if (!KeyboardKeys.anyKeyPressed()) {
            this.movementDirection._resetDirection();
            this.movementMomentum.loseMomentum();
        }
    }

    setCharacterMovementDirection() {
        if (KeyboardKeys.numberOfKeysPressed() === 2) {
            if (KeyboardKeys.keyboardState["KeyA"] && KeyboardKeys.keyboardState["KeyW"]) {
                this.movementDirection.upleft = true;
            } else if (KeyboardKeys.keyboardState["KeyW"] && KeyboardKeys.keyboardState["KeyD"]) {
                this.movementDirection.upright = true;
            } else if (KeyboardKeys.keyboardState["KeyD"] && KeyboardKeys.keyboardState["KeyS"]) {
                this.movementDirection.downright = true;
            } else if (KeyboardKeys.keyboardState["KeyS"] && KeyboardKeys.keyboardState["KeyA"]) {
                this.movementDirection.downleft = true;
            }
            return;
        }

        if (KeyboardKeys.keyboardState["KeyA"]) {
            this.movementDirection.left = true;
        }
        if (KeyboardKeys.keyboardState["KeyD"]) {
            this.movementDirection.right = true;
        }
        if (KeyboardKeys.keyboardState["KeyW"]) {
            this.movementDirection.up = true;
        }
        if (KeyboardKeys.keyboardState["KeyS"]) {
            this.movementDirection.down = true;
        }

        if (!KeyboardKeys.anyKeyPressed()) {
            this.movementMomentum.loseMomentum();
        }
    }

    moveCharacter(deltaSpeed: number) {
        if (!this.sprite) return;

        const calculatedSpeed = deltaSpeed * MovementPhysics.calculateSpeed(1, 1);

        if (this.movementDirection.up) {
            this.sprite.y -= calculatedSpeed * this.movementMomentum.upMomentum;
        } else if (this.movementDirection.right) {
            this.sprite.x += calculatedSpeed * this.movementMomentum.rightMomentum;
        } else if (this.movementDirection.down) {
            this.sprite.y += calculatedSpeed * this.movementMomentum.downMomentum;
        } else if (this.movementDirection.left) {
            this.sprite.x -= calculatedSpeed * this.movementMomentum.leftMomentum;
        } else if (this.movementDirection.upright) {
            this.sprite.y -= calculatedSpeed * this.movementMomentum.upMomentum * Character.reduceDiagonalSpeed;
            this.sprite.x += calculatedSpeed * this.movementMomentum.rightMomentum * Character.reduceDiagonalSpeed;
        } else if (this.movementDirection.downright) {
            this.sprite.x += calculatedSpeed * this.movementMomentum.rightMomentum * Character.reduceDiagonalSpeed;
            this.sprite.y += calculatedSpeed * this.movementMomentum.downMomentum * Character.reduceDiagonalSpeed;
        } else if (this.movementDirection.downleft) {
            this.sprite.y += calculatedSpeed * this.movementMomentum.downMomentum * Character.reduceDiagonalSpeed;
            this.sprite.x -= calculatedSpeed * this.movementMomentum.leftMomentum * Character.reduceDiagonalSpeed;
        } else if (this.movementDirection.upleft) {
            this.sprite.x -= calculatedSpeed * this.movementMomentum.leftMomentum * Character.reduceDiagonalSpeed;
            this.sprite.y -= calculatedSpeed * this.movementMomentum.upMomentum * Character.reduceDiagonalSpeed;
        }
    }

    momentumDebugLog() {
        console.log("upMomentum" + this.movementMomentum.upMomentum);
        console.log("rightMomentum" + this.movementMomentum.rightMomentum);
        console.log("downMomentum" + this.movementMomentum.downMomentum);
        console.log("leftMomentum" + this.movementMomentum.leftMomentum);
    }
}

