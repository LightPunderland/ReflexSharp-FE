import { Projectile } from './projectile';
import { SpriteCache } from '../spriteCache';

export class Pumpkin extends Projectile {
    private phase: number = 0;               
    private phaseDuration: number = 150;      
    private phaseTimer: number = 0;         
    
    constructor(player: { x: number; y: number }) {
        super(player, SpriteCache.instance.pumpkinTextures[0]);
        this.updateSprite();
    }

    spawn(): void {
        this.sprite.x = Math.random() * window.innerWidth;
        this.sprite.y = Math.random() * window.innerHeight;
    }

    private updateSprite(): void {
        if (this.sprite) {
            this.sprite.texture = SpriteCache.instance.pumpkinTextures[this.phase];
        }
    }

    update(deltaTime: number): void {
        this.phaseTimer += 1 * deltaTime;
        
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
