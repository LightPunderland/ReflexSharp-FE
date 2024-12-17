import { KeyboardKeys } from "./keyboardKeys";
import { MovementDirection } from "./characterMovement/movementDirection";
import { MovementMomentum } from "./characterMovement/movementMomentum";
import { MovementPhysics } from "./characterMovement/movementPhysics";
import * as PIXI from 'pixi.js';
import { Projectile } from "./projectiles/projectile";
import { SpriteCache } from "./spriteCache";
import { Coin } from "./projectiles/projectileCoin";
import { Kunai } from "./projectiles/projectileKunai";

export class Character {
    static reduceDiagonalSpeed = 0.707;
    sprite: PIXI.Sprite | undefined;
    movementDirection: MovementDirection;
    movementMomentum: MovementMomentum;
    collided: boolean;
    collected: boolean;
    hasKunai: boolean = false;

    charHitboxOffset = 10;

    constructor() {
        //klase kurioje saugoma i kuria puse juda characteris
        this.movementDirection = new MovementDirection();

        //klase kurioje saugoma 4 krypciu inercijos jegos veikiancio characteri
        this.movementMomentum = new MovementMomentum();

        this.sprite = new PIXI.Sprite(SpriteCache.instance.ninjaTexture);

        this.sprite.scale.set(1.15);
        this.collided = false;
        this.collected = false;
    }

    spawnCharacter(canvasWidth: number, canvasHeight: number) {
        if (!this.sprite || this.sprite.parent == null) {
            throw new Error("[Character] Sprite not added to the stage");
        }

        this.sprite.x = canvasWidth / 2 - this.sprite.width / 2;
        this.sprite.y = canvasHeight / 2 - this.sprite.height;
    }

    update(projectileArray: Projectile[], coinArray: Coin[], kunaiArray: Kunai[], deltaTime: number) {
        this.checkForCollision(projectileArray);
        this.checkForCoins(coinArray);
        this.checkForKunai(kunaiArray);
        this.setCharacterMovementDirection();
        this.updateCharacterMomentum(deltaTime);
        this.moveCharacter(deltaTime);
        this.checkForOutOfBounds();
    }

    checkForOutOfBounds() {
        if (!this.sprite) return;

        if (this.sprite.x < 0 - this.sprite.width/2) {
            this.sprite.x = 0 - this.sprite.width/2;
        } else if (this.sprite.x > window.innerWidth - this.sprite.width/2) {
            this.sprite.x = window.innerWidth - this.sprite.width/2;
        }

        if (this.sprite.y < 0 - this.sprite.height/2) {
            this.sprite.y = 0 - this.sprite.height/2;
        } else if (this.sprite.y > window.innerHeight - (this.sprite.height*2)) {
            this.sprite.y = window.innerHeight - (this.sprite.height*2);
        }
    }

    checkForCollision(projectileArray: Projectile[]) {
        if (!this.sprite) return;

        for (let i = 0; i < projectileArray.length; i++) {
            let projectile = projectileArray[i];
            
            for(var projectileHitboxPoint of projectile.hitboxPoints){
                var hitboxX = projectile.sprite.x+projectileHitboxPoint[0]
                var hitboxY = projectile.sprite.y+projectileHitboxPoint[1]
                
                if(hitboxX>this.sprite.x+this.charHitboxOffset && hitboxX<this.sprite.x+this.sprite.width-this.charHitboxOffset){
                    if(hitboxY>this.sprite.y+this.charHitboxOffset && hitboxY<this.sprite.y+this.sprite.height-this.charHitboxOffset){
                        this.collided = true;
                    }
                }
            }
        }
    }
    
    checkForCoins(coinArray: Coin[]) {
        if (!this.sprite) return;

        for (let i = 0; i < coinArray.length; i++) {
            let coin = coinArray[i];

            if(this.sprite && coin.markedForDeletion) {
                this.sprite.parent.removeChild(coin.sprite);
                coinArray.splice(i, 1);
            }

            for(var projectileHitboxPoint of coin.hitboxPoints){
                var hitboxX = coin.sprite.x+projectileHitboxPoint[0];
                var hitboxY = coin.sprite.y+projectileHitboxPoint[1];
                
                if(hitboxX>this.sprite.x+this.charHitboxOffset && hitboxX<this.sprite.x+this.sprite.width-this.charHitboxOffset){
                    if(hitboxY>this.sprite.y+this.charHitboxOffset && hitboxY<this.sprite.y+this.sprite.height-this.charHitboxOffset){
                        this.collected = true;
                        this.sprite.parent.removeChild(coin.sprite);
                        coinArray.splice(i, 1);
                        break; // Exit loop on first collision
                    }
                }
            }
        }
    }

    checkForKunai(kunaiArray: Kunai[]) {
        if (!this.sprite) return;

        for (let i = 0; i < kunaiArray.length; i++) {
            if(!kunaiArray[i].toThrow){
            let kunai = kunaiArray[i];
            if(this.sprite && kunai.markedForDeletion) {
                this.sprite.parent.removeChild(kunai.sprite);
                kunaiArray.splice(i, 1);
            }

            for(var projectileHitboxPoint of kunai.hitboxPoints){
                var hitboxX = kunai.sprite.x+projectileHitboxPoint[0];
                var hitboxY = kunai.sprite.y+projectileHitboxPoint[1];
                
                if(hitboxX>this.sprite.x+this.charHitboxOffset && hitboxX<this.sprite.x+this.sprite.width-this.charHitboxOffset){
                    if(hitboxY>this.sprite.y+this.charHitboxOffset && hitboxY<this.sprite.y+this.sprite.height-this.charHitboxOffset){
                        this.hasKunai = true;
                        this.sprite.parent.removeChild(kunai.sprite);
                        kunaiArray.splice(i, 1);
                        break; // Exit loop on first collision
                    }
                }
            }
        }
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

    moveCharacter(deltaTime: number) {
        if (!this.sprite) return;

        const calculatedSpeed = (deltaTime) * MovementPhysics.calculateSpeed();

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

