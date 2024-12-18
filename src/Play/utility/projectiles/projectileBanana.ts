import { SpriteCache } from '../spriteCache';
import { Projectile } from './projectile';
export class Banana extends Projectile {
    public archDelay: number;  
    public archStrength: number; 
    public archDirection: { x: number; y: number }; 

    constructor(player: { x: number; y: number }) {

        super(player, SpriteCache.instance.bananaTexture, SpriteCache.instance.bananaWarningTexture);

        this.speedIncrement = 0.03;
        this.archDelay = 1;         
        this.archStrength = 0.003;  
       
        if (this.sprite) {
            this.archDirection = {
                x: this.sprite.x < window.innerWidth / 2 ? 1 : -1, // Left or right
                y: this.sprite.y < window.innerHeight / 2 ? 1 : -1 // Top or bottom
            };
        } else {
            this.archDirection = { x: 0, y: 0 }; // Default values if sprite is null
        }
        
        this.addHitBoxesPoints()
    }



    update(deltaTime: number): void {

        this.warnTime++;

        if(this.warnTime > 100) {

            if(!this.direction) this.direction = this.calculateDirection(this.sprite.x, this.sprite.y, this.player.x, this.player.y);

            this.speed += this.speedIncrement * deltaTime;
            this.time += 0.05 * deltaTime;


            // Pries delay judam tiesiai, po delay arka
            if (this.time > this.archDelay) {
                this.direction.x += this.archDirection.x * this.archStrength * deltaTime;
                this.direction.y += this.archDirection.y * this.archStrength * deltaTime;
            }

            // normalizuojam direction'a
            const magnitude = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;

            if (this.sprite) {
                this.sprite.x += this.direction.x * this.speed * deltaTime;
                this.sprite.y += this.direction.y * this.speed * deltaTime;

                for(let i = 0; i < this.hitboxSpriteArray.length; i++){
                    this.hitboxSpriteArray[i].x = this.sprite.x + this.hitboxPoints[i][0]
                    this.hitboxSpriteArray[i].y = this.sprite.y + this.hitboxPoints[i][1]
                }
            }

            // Panaikinam jei iseina is ekrano
            if (this.sprite && (this.sprite.x < -Projectile._spawnOffset ||
                this.sprite.x > window.innerWidth + Projectile._spawnOffset ||
                this.sprite.y < -Projectile._spawnOffset ||
                this.sprite.y > window.innerHeight + Projectile._spawnOffset)) {
                
                if (this.sprite.parent) {
                    this.sprite.parent.removeChild(this.sprite);
                }
            }
            if(this.warningSprite.parent) {

                this.warningSprite.parent.removeChild(this.warningSprite);
            }
        }
        else{
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

    addHitBoxesPoints(){
        //Atkomentuoti jei nori nupiesti hitbox pointus
        // for(var i = 0;i<5;i++){
        //     const hitboxSprite = PIXI.Sprite.from('src/assets/redhitboxpoint.png')
        //     hitboxSprite.height = 4;
        //     hitboxSprite.width = 4;
    
        //     this.hitboxSpriteArray.push(hitboxSprite);
        // }

        this.hitboxPoints.push([this.sprite.width-18,10]);
        this.hitboxPoints.push([this.sprite.width-8,12]);
        this.hitboxPoints.push([2,this.sprite.height-12]);
        this.hitboxPoints.push([this.sprite.width-16,this.sprite.height-16]);
        this.hitboxPoints.push([36,34]);
    }
}
