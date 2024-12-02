import { Projectile } from './projectile';
import { SpriteCache } from '../spriteCache';

export class Pumpkin extends Projectile {
    private phase: number = 0;               
    private phaseDuration: number = 100;      
    private phaseTimer: number = 0;         
    
    
    constructor(player: { x: number; y: number }) {

        super(player, SpriteCache.instance.pumpkinTextures[0], SpriteCache.instance.bananaTexture);
        this.sprite.anchor.set(0.5, 0.5);

        this.updateSprite();

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

    private updateSprite(): void {
        if (this.sprite) {
            this.sprite.texture = SpriteCache.instance.pumpkinTextures[this.phase];
        }
    }

    addHitBoxesPoints(){
        // Atkomentuoti jei nori nupiesti hitbox pointus
        // for(var i = 0;i<8;i++){
        //     const hitboxSprite = PIXI.Sprite.from('src/assets/redhitboxpoint.png')
        //     hitboxSprite.height = 4;
        //     hitboxSprite.width = 4;
    
        //     this.hitboxSpriteArray.push(hitboxSprite);
        // }

        this.hitboxPoints.push([-this.sprite.width+14,-this.sprite.height+10]);
        this.hitboxPoints.push([-this.sprite.width-2,0]);
        this.hitboxPoints.push([-this.sprite.width+10,this.sprite.height-16]);
        
        this.hitboxPoints.push([this.sprite.width-14,-this.sprite.height+14]);
        this.hitboxPoints.push([this.sprite.width,0]);
        this.hitboxPoints.push([this.sprite.width-10,this.sprite.height-10]);

        this.hitboxPoints.push([0,-this.sprite.height+14]);
        this.hitboxPoints.push([0,this.sprite.height-8]);
    }
    
    update(deltaTime: number): void {
        this.phaseTimer += deltaTime;
        
        if (this.phaseTimer >= this.phaseDuration) {
            this.phase++;
            this.phaseTimer = 0;

            if (this.phase < SpriteCache.instance.pumpkinTextures.length) {
                this.updateSprite();
            } else {
                if (this.sprite.parent) {
                    this.sprite.parent.removeChild(this.sprite);
                }
            }
        }
    }

    checkCollision(): boolean {
        return this.phase === SpriteCache.instance.pumpkinTextures.length - 1;
    }

    getPhase(): number {
        return this.phase;
    }

}
