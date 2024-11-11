import * as PIXI from 'pixi.js';

export class Projectile {
    static _spawnOffset: number = 100;
    speed: number;
    player: { x: number; y: number };
    sprite: PIXI.Sprite;
    warningSprite: PIXI.Sprite;
    speedIncrement: number;
    direction!: { x: number; y: number };
    time: number; //Kiek laiko praejo nuo sviedinio sukurimo
    side: number;
    warnTime: number;

    constructor(player: { x: number; y: number }, spriteTexture: PIXI.Texture, warningTexture: PIXI.Texture) {
        this.speed = 12;
        this.player = player;
        this.sprite = PIXI.Sprite.from(spriteTexture);
        this.warningSprite = PIXI.Sprite.from(warningTexture);
        this.time = 0;
        this.side = Math.floor(Math.random() * 4);
        this.warnTime = 0;

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

    getWarningSprite(): PIXI.Sprite {
        if (!this.warningSprite) {
            throw new Error("ProjectileBase warning sprite not loaded");
        }
        return this.warningSprite;
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

        switch (this.side) {
            case 0:
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = -Projectile._spawnOffset;
                this.warningSprite.rotation = Math.PI;
                break;
            case 1: 
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = screenHeight + Projectile._spawnOffset;
                break;
            case 2:
                this.sprite.x = -Projectile._spawnOffset; 
                this.sprite.y = Math.random() * screenHeight;
                this.warningSprite.rotation = Math.PI/2;
                break;
            case 3:
                this.sprite.x = screenWidth + Projectile._spawnOffset; 
                this.sprite.y = Math.random() * screenHeight;
                this.warningSprite.rotation = -Math.PI/2;
                break;
        }

        
    }

    getCollisionBox(): { x: number, y: number, width: number, height: number } {
        return {
            x: this.sprite.x - this.sprite.width / 2,
            y: this.sprite.y - this.sprite.height / 2,
            width: this.sprite.width,
            height: this.sprite.height,
        };
    }
    
    getIsWarningActive(): boolean {
        return this.warnTime < 100;
    }

    update(deltaTime: number): void {
        
        this.warnTime++;
        if(this.warnTime > 100) {
        if(!this.direction) this.direction = this.calculateDirection(this.sprite.x, this.sprite.y, this.player.x, this.player.y);

        this.speed += this.speedIncrement * deltaTime;

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
        if(this.warningSprite.parent) {

            this.warningSprite.parent.removeChild(this.warningSprite);
        }
    }else {
        switch (this.side) {
            case 0:
                this.warningSprite.x = this.sprite.x;
                this.warningSprite.y = this.sprite.y + Projectile._spawnOffset*2;
                break;
            case 1: 
                this.warningSprite.x = this.sprite.x;
                this.warningSprite.y = this.sprite.y - Projectile._spawnOffset*3;
                break;
            case 2:
                this.warningSprite.x = this.sprite.x + Projectile._spawnOffset*2;
                this.warningSprite.y = this.sprite.y;
                break;
            case 3:
                this.warningSprite.x = this.sprite.x - Projectile._spawnOffset*2;
                this.warningSprite.y = this.sprite.y;
                break;
        }
        
        this.warningSprite.width = this.sprite.width;
        this.warningSprite.height = this.sprite.height;
    }
    
}
}