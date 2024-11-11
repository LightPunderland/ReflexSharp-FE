import { SpriteCache } from '../spriteCache';
import { Projectile } from './projectile';

export class Watermelon extends Projectile {
    static WatermelonPNG= 'http://localhost:5050/api/sprite/by-name/watermelon';

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, SpriteCache.instance.watermelonTexture);   // doesn't render properly, fix this

        this.speedIncrement = 0.04;
    }
}
