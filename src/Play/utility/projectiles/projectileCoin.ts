import { Projectile } from './projectile';
import { SpriteCache } from '../spriteCache';
import * as PIXI from 'pixi.js';

export class Coin extends Projectile {

    private lifetime: number = 500;
    private elapsedTime: number = 0;
    private blinkStartTime: number = 300;
    private blinkInterval: number = 25; 

    public markedForDeletion: boolean = false;

    constructor(player: { x: number; y: number }) {
        super(player, SpriteCache.instance.coinTexture, SpriteCache.instance.bananaTexture);
        this.setHitArea();
        this.sprite.scale.set(0.69);
    }

    spawn(): void {
        this.sprite.x = Math.random() * window.innerWidth;
        this.sprite.y = Math.random() * window.innerHeight;
    }

    private setHitArea(): void {
        if (this.sprite && this.sprite.texture) {
            const width = this.sprite.width;
            const height = this.sprite.height;
            const polygon = new PIXI.Polygon(
                new PIXI.Point(-width / 2, -height / 2),
                new PIXI.Point(width / 2, -height / 2),
                new PIXI.Point(width / 2, height / 2),
                new PIXI.Point(-width / 2, height / 2)
            );
            this.sprite.hitArea = polygon;
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
}
