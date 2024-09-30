import { KeyboardKeys } from "./keyboardKeys";
import { MovementDirection } from "./characterMovement/movementDirection";
import { MovementMomentum } from "./characterMovement/movementMomentum";
import { MovementPhysics } from "./characterMovement/movementPhysics";
import * as PIXI from 'pixi.js';
import NinjaPNG from "./assets/ninja.png"

export class Character {
    static reduceDiagonalSpeed = 0.707;
    static spriteImagePath = NinjaPNG;   // fix this rendering

    sprite: PIXI.Sprite | undefined;
    movementDirection: MovementDirection;
    movementMomentum: MovementMomentum;

    constructor() {
        this.movementDirection = new MovementDirection();
        this.movementMomentum = new MovementMomentum();
    }

    spawnCharacter(canvasWidth: number, canvasHeight: number) {
        console.log("canvasWidth: " + canvasWidth);
        console.log("canvasHeight: " + canvasHeight);
        if (!this.sprite || this.sprite.parent == null) {
            throw new Error("[Character] Sprite not added to the stage");
        }

        this.sprite.x = canvasWidth / 2 - this.sprite.width / 2;
        this.sprite.y = canvasHeight / 2 - this.sprite.height / 2;
    }

    update(tickerDeltaTime: number) {
        this.setCharacterMovementDirection();
        this.updateCharacterMomentum(tickerDeltaTime);
        this.moveCharacter();
    }

   async loadSprite() {
    try {
        const texture = await PIXI.Assets.load(Character.spriteImagePath);
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
    }

    moveCharacter() {
        if (!this.sprite) return;

        if (this.movementDirection.up) {
            this.sprite.y -= MovementPhysics.calculateSpeed(this.movementMomentum.upMomentum, 1);
        } else if (this.movementDirection.right) {
            this.sprite.x += MovementPhysics.calculateSpeed(this.movementMomentum.rightMomentum, 1);
        } else if (this.movementDirection.down) {
            this.sprite.y += MovementPhysics.calculateSpeed(this.movementMomentum.downMomentum, 1);
        } else if (this.movementDirection.left) {
            this.sprite.x -= MovementPhysics.calculateSpeed(this.movementMomentum.leftMomentum, 1);
        } else if (this.movementDirection.upright) {
            this.sprite.y -= MovementPhysics.calculateSpeed(this.movementMomentum.upMomentum, Character.reduceDiagonalSpeed);
            this.sprite.x += MovementPhysics.calculateSpeed(this.movementMomentum.rightMomentum, Character.reduceDiagonalSpeed);
        } else if (this.movementDirection.downright) {
            this.sprite.x += MovementPhysics.calculateSpeed(this.movementMomentum.rightMomentum, Character.reduceDiagonalSpeed);
            this.sprite.y += MovementPhysics.calculateSpeed(this.movementMomentum.downMomentum, Character.reduceDiagonalSpeed);
        } else if (this.movementDirection.downleft) {
            this.sprite.y += MovementPhysics.calculateSpeed(this.movementMomentum.downMomentum, Character.reduceDiagonalSpeed);
            this.sprite.x -= MovementPhysics.calculateSpeed(this.movementMomentum.leftMomentum, Character.reduceDiagonalSpeed);
        } else if (this.movementDirection.upleft) {
            this.sprite.x -= MovementPhysics.calculateSpeed(this.movementMomentum.leftMomentum, Character.reduceDiagonalSpeed);
            this.sprite.y -= MovementPhysics.calculateSpeed(this.movementMomentum.upMomentum, Character.reduceDiagonalSpeed);
        }
    }

    momentumDebugLog() {
        console.log("upMomentum" + this.movementMomentum.upMomentum);
        console.log("rightMomentum" + this.movementMomentum.rightMomentum);
        console.log("downMomentum" + this.movementMomentum.downMomentum);
        console.log("leftMomentum" + this.movementMomentum.leftMomentum);
    }
}
