import { KeyboardKeys } from "./keyboardKeys";
import { MovementDirection } from "./characterMovement/movementDirection";
import { MovementMomentum } from "./characterMovement/movementMomentum";
import { MovementPhysics } from "./characterMovement/movementPhysics";
import * as PIXI from 'pixi.js';
import { Projectile } from "./projectiles/projectile";
import { SpriteCache } from "./spriteCache";
import * as SAT from 'sat';

export class Character {
    static reduceDiagonalSpeed = 0.707;
    sprite: PIXI.Sprite | undefined;
    movementDirection: MovementDirection;
    movementMomentum: MovementMomentum;
    collided: boolean;

    constructor() {
        //klase kurioje saugoma i kuria puse juda characteris
        this.movementDirection = new MovementDirection();

        //klase kurioje saugoma 4 krypciu inercijos jegos veikiancio characteri
        this.movementMomentum = new MovementMomentum();

        this.sprite = new PIXI.Sprite(SpriteCache.instance.ninjaTexture);

        this.sprite.scale.set(1.15);
        this.collided = false;

        this.setHitArea();
    }

    spawnCharacter(canvasWidth: number, canvasHeight: number) {
        if (!this.sprite || this.sprite.parent == null) {
            throw new Error("[Character] Sprite not added to the stage");
        }

        this.sprite.x = canvasWidth / 2 - this.sprite.width / 2;
        this.sprite.y = canvasHeight / 2 - this.sprite.height;
    }

    update(projectileArray: Projectile[], deltaTime: number) {
        this.checkForCollision(projectileArray);
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

    setHitArea() {
        if (!this.sprite) return;
        
        const width = this.sprite.width;
        const height = this.sprite.height; 
        const centerX = (width * 1.15) / 2;
        const centerY = height / 2;
    
        this.sprite.hitArea = new PIXI.Ellipse(centerX, centerY, width / 3, height / 3);
    }

    checkForCollision(projectileArray: Projectile[]) {
        for (let i = 0; i < projectileArray.length; i++) {
            let projectile = projectileArray[i];
            
            // Ensure the character and projectile have valid hitArea before checking
            if (this.sprite && this.sprite.hitArea && projectile.sprite && projectile.sprite.hitArea) {
                if (this._hitAreaCollision(this.sprite, projectile)) {
                    this.collided = true;
                    break; // Exit loop on first collision
                }
            } else {
                // Log if either the character or the projectile does not have a hitArea
                console.log('Missing hitArea for character or projectile!');
            }
        }
    }
    
    
    _hitAreaCollision(character: PIXI.Sprite, projectile: Projectile): boolean {
        if (character.hitArea && projectile.sprite && projectile.sprite.hitArea) {
            const characterHitArea = character.hitArea;
            const projectileHitArea = projectile.sprite.hitArea;
    
            let characterShape: SAT.Circle | undefined, projectileShape: SAT.Circle | SAT.Polygon;
    
            // Convert the hitAreas to SAT shapes
            if (characterHitArea instanceof PIXI.Ellipse) {
                characterShape = new SAT.Circle(new SAT.Vector(character.x, character.y), characterHitArea.width);
            }
    
            if (projectileHitArea instanceof PIXI.Ellipse) {
                projectileShape = new SAT.Circle(new SAT.Vector(projectile.sprite.x, projectile.sprite.y), projectileHitArea.width / 2);
            } else if (projectileHitArea instanceof PIXI.Polygon) {
                projectileShape = new SAT.Polygon(
                    new SAT.Vector(projectile.sprite.x, projectile.sprite.y), 
                    projectileHitArea.points.map((_, i) => i % 2 === 0 ? new SAT.Vector(projectileHitArea.points[i], projectileHitArea.points[i + 1]) : null).filter(p => p !== null) as SAT.Vector[]);
            } else {
                console.error('Unexpected projectile hitArea type:', projectileHitArea);
                return false;
            }
    
            // Check for intersection using SAT.js
            const response = new SAT.Response();
            let collided = false;
            if (characterShape instanceof SAT.Circle && projectileShape instanceof SAT.Circle) {
                collided = SAT.testCircleCircle(characterShape, projectileShape, response);
            } else if (characterShape instanceof SAT.Circle && projectileShape instanceof SAT.Polygon) {
                collided = SAT.testCirclePolygon(characterShape, projectileShape, response);
            }
            
            // Log if collision occurs
            if (collided) {
                console.log('Collision detected between character and projectile');
                return true;
            }
        }
        return false;
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

