import { Projectile } from './projectile';
import { SpriteCache } from '../spriteCache';

export class Coin extends Projectile {

    private lifetime: number = 500;
    private elapsedTime: number = 0;
    private blinkStartTime: number = 300;
    private blinkInterval: number = 25; 

    public markedForDeletion: boolean = false;

    constructor(player: { x: number; y: number }) {
        super(player, SpriteCache.instance.coinTexture, SpriteCache.instance.bananaTexture);
        this.sprite.scale.set(0.69);
        this.addHitBoxesPoints();
    }

    spawn(): void {
        this.sprite.x = Math.random() * window.innerWidth;
        this.sprite.y = Math.random() * window.innerHeight;

        for(let i = 0; i < this.hitboxSpriteArray.length; i++){
            this.hitboxSpriteArray[i].x = this.sprite.x + this.hitboxPoints[i][0];
            this.hitboxSpriteArray[i].y = this.sprite.y + this.hitboxPoints[i][1];
        }
    }

    update(deltaTime: number): void {
        this.elapsedTime += deltaTime;

        // Handle blinking effect in the last second
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

    addHitBoxesPoints(){
        // Atkomentuoti jei nori nupiesti hitbox pointus
        // for(var i = 0;i<4;i++){
        //     const hitboxSprite = PIXI.Sprite.from('src/assets/redhitboxpoint.png')
        //     hitboxSprite.height = 4;
        //     hitboxSprite.width = 4;
    
        //     this.hitboxSpriteArray.push(hitboxSprite);
        // }

        this.hitboxPoints.push([4,4]);
        this.hitboxPoints.push([this.sprite.width-8,4]);
        this.hitboxPoints.push([4,this.sprite.height-6]);
        this.hitboxPoints.push([this.sprite.width-6,this.sprite.height-6]);
    }
}
