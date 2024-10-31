import * as PIXI from 'pixi.js';
import { Projectile } from './projectile';

export class Pumpkin extends Projectile {
    private phase: number = 0;               
    private phaseDuration: number = 150;      
    private phaseTimer: number = 0;         
    private pumpkinSprites: string[] = [   
        'http://localhost:5050/api/sprite/by-name/pumpkin0',
        'http://localhost:5050/api/sprite/by-name/pumpkin1',
        'http://localhost:5050/api/sprite/by-name/pumpkin2',
        'http://localhost:5050/api/sprite/by-name/pumpkin3',
        'http://localhost:5050/api/sprite/by-name/pumpkin4'
    ];

    // laikinas fixas cachinimo images, veliau reikes normalu buda padaryt visiem projectiles
    private pumpkinSpriteCache: PIXI.Texture<PIXI.Resource>[] = [
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin0'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin1'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin2'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin3'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin4'),
    ]
    
    constructor(player: { x: number; y: number }, speed: number) {
        
        super(player, speed, 'http://localhost:5050/api/sprite/by-name/pumpkin0');
        this.updateSprite();


    }

    spawn(): void {
        this.sprite.x = Math.random() * window.innerWidth;
        this.sprite.y = Math.random() * window.innerHeight;
    }

    private updateSprite(): void {
        if (this.sprite) {
            this.sprite.texture = this.pumpkinSpriteCache[this.phase];
        }
    }

    update(): void {
        this.phaseTimer++;
        
        if (this.phaseTimer >= this.phaseDuration) {
            this.phase++;
            this.phaseTimer = 0;
            if (this.phase < this.pumpkinSprites.length) {
                this.updateSprite();
            } else {
                if (this.sprite.parent) {
                    this.sprite.parent.removeChild(this.sprite);
                }
            }
        }
    }

    checkCollision(): boolean {
        return this.phase === this.pumpkinSprites.length - 1;
    }

    getPhase(): number {
        return this.phase;
    }

}
