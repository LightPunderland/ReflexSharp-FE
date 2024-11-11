import { SpriteCache } from '../spriteCache';
import { Projectile } from './projectile';

export class Watermelon extends Projectile {
    constructor(player: { x: number; y: number }) {
        super(player, SpriteCache.instance.watermelonTexture);   // doesn't render properly, fix this

        this.speedIncrement = 0.08;
    }
}
