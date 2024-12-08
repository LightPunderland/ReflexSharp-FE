import { Projectile } from './projectile';
import { SpriteCache } from '../spriteCache';
import * as PIXI from 'pixi.js';

export class Kunai extends Projectile {

    private lifetime: number = 500;
    private elapsedTime: number = 0;
    private blinkStartTime: number = 300;
    private blinkInterval: number = 25;
    private charHitboxOffset: number = 10

    public toThrow: boolean;
    public markedForDeletion: boolean = false;

    constructor(player: { x: number; y: number }, toThrow: boolean) {
        super(player, SpriteCache.instance.kunaiTexture, PIXI.Texture.EMPTY);
        this.speed = 30;
        this.toThrow = toThrow;
        this.addHitBoxesPoints();
        this.spawn();
    }

    spawn(): void {
        if(!this.toThrow){
            this.sprite.x = Math.random() * window.innerWidth;
            this.sprite.y = Math.random() * window.innerHeight;
        }
        else{
            this.sprite.x = this.player.x;
            this.sprite.y = this.player.y;
            this.markedForDeletion = false;
        }
    }

    throw(targetX: number, targetY: number, startX: number, startY: number): void {
        this.sprite.visible = true;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        this.direction = new PIXI.Point(dx / magnitude, dy / magnitude);
        const angle = Math.atan2(dy, dx);
        this.sprite.rotation = angle;
    }

    checkForCollision(projectiles: Projectile[]){
        if(!this.toThrow){
            return;
        }
        
        for(var i=0;i<projectiles.length;i++){
            for(var projectileHitboxPoint of projectiles[i].hitboxPoints){
                var hitboxX = projectiles[i].sprite.x+projectileHitboxPoint[0]
                var hitboxY = projectiles[i].sprite.y+projectileHitboxPoint[1]
                
                if(hitboxX>this.sprite.x+this.charHitboxOffset && hitboxX<this.sprite.x+this.sprite.width-this.charHitboxOffset){
                    if(hitboxY>this.sprite.y+this.charHitboxOffset && hitboxY<this.sprite.y+this.sprite.height-this.charHitboxOffset){
                        console.log("FRUIT IS KILLED!");
                        if (projectiles[i].sprite.parent) {
                            projectiles[i].sprite.parent.removeChild(projectiles[i].sprite);
                        }
                    }
                }
            }
        }
    }

    update(deltaTime: number): void {
        if(!this.toThrow){
            this.elapsedTime += deltaTime;

            if (this.elapsedTime >= this.blinkStartTime) {
                const timeSinceBlinkStart = this.elapsedTime - this.blinkStartTime;

                if (Math.floor(timeSinceBlinkStart / this.blinkInterval) % 2 === 0) {
                    this.sprite.visible = true;
                } else {
                    this.sprite.visible = false;
                }

                // Check if lifetime has expired
                if (this.elapsedTime >= this.lifetime) {
                    if (this.sprite.parent) {
                        this.markedForDeletion = true;
                    }
                }
            }
        }

        if (this.direction) {
            this.sprite.x += this.direction.x * this.speed * deltaTime;
            this.sprite.y += this.direction.y * this.speed * deltaTime;

            // Check if knife goes off-screen
            if (
                this.sprite.x < 0 || this.sprite.x > window.innerWidth ||
                this.sprite.y < 0 || this.sprite.y > window.innerHeight
            ) {
                this.markedForDeletion = true;
            }
        }
        
    }

    addHitBoxesPoints(){
        // Atkomentuoti jei nori nupiesti hitbox pointus
        for(var i = 0;i<4;i++){
            const hitboxSprite = PIXI.Sprite.from('src/assets/redhitboxpoint.png')
            hitboxSprite.height = 4;
            hitboxSprite.width = 4;
    
            this.hitboxSpriteArray.push(hitboxSprite);
        }

        this.hitboxPoints.push([this.sprite.width-18,10]);
        this.hitboxPoints.push([this.sprite.width-8,12]);
        this.hitboxPoints.push([2,this.sprite.height-12]);
        this.hitboxPoints.push([this.sprite.width-16,this.sprite.height-16]);
    }
}