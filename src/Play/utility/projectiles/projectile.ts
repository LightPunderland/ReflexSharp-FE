import * as PIXI from 'pixi.js';

export class Projectile {
    static _spawnOffset: number = 50;
    speed: number;
    player: { x: number; y: number };
    imagePath: string;
    sprite: PIXI.Sprite;
    speedIncrement: number;
    direction!: { x: number; y: number };

    constructor(player: { x: number; y: number }, speed: number, imagePath: string) {
        this.speed = speed;
        this.player = player;
        this.imagePath = imagePath;
        this.sprite = PIXI.Sprite.from(this.imagePath);
        
        this.speedIncrement = 0.1;

        if (!this.sprite) {
            throw new Error("ProjectileBase sprite not loaded");
        }        
    }

    getSprite(): PIXI.Sprite {
        if (!this.sprite) {
            throw new Error("ProjectileBase sprite not loaded");
        }
        return this.sprite;
    }

    calculateDirection(startX: number, startY: number, targetX: number, targetY: number): { x: number; y: number } {
        const dx = targetX - startX;
        const dy = targetY - startY;
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        return { x: dx / magnitude, y: dy / magnitude };
    }

    spawn(screenWidth: number, screenHeight: number): void {
        if (this.sprite.parent == null) {
            throw new Error("[ProjectileBase] Sprite not added to the stage");
        }

        const side = Math.floor(Math.random() * 4);

        switch (side) {
            case 0:
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = -Projectile._spawnOffset; 
                break;
            case 1:
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = screenHeight + Projectile._spawnOffset;
                break;
            case 2:
                this.sprite.x = -Projectile._spawnOffset; 
                this.sprite.y = Math.random() * screenHeight;
                break;
            case 3:
                this.sprite.x = screenWidth + Projectile._spawnOffset; 
                this.sprite.y = Math.random() * screenHeight;
                break;
        }

        this.direction = this.calculateDirection(this.sprite.x, this.sprite.y, this.player.x, this.player.y);
    }

    update(): void {
        this.speed += this.speedIncrement;

        this.sprite.x += this.direction.x * this.speed;
        this.sprite.y += this.direction.y * this.speed;

        if (this.sprite.x < -Projectile._spawnOffset ||
            this.sprite.x > window.innerWidth + Projectile._spawnOffset ||
            this.sprite.y < -Projectile._spawnOffset ||
            this.sprite.y > window.innerHeight + Projectile._spawnOffset) {
            
            if (this.sprite.parent) {
                this.sprite.parent.removeChild(this.sprite);
            }
        }
    }
}
