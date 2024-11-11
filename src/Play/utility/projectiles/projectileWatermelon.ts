import { SpriteCache } from '../spriteCache';
import { Projectile } from './projectile';
import * as PIXI from 'pixi.js';

export class Watermelon extends Projectile {
    static WatermelonPNG= 'http://localhost:5050/api/sprite/by-name/watermelon';

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, SpriteCache.instance.watermelonTexture, SpriteCache.instance.watermelonWarningTexture);   // doesn't render properly, fix this

        this.speedIncrement = 0.04;

        const width = this.sprite.width;
        const height = this.sprite.height - 10; // Remove 5 pixels from top and bottom
        const centerX = width / 2;
        const centerY = this.sprite.height / 2;

        // Define an oval hit area
        this.sprite.hitArea = new PIXI.Ellipse(centerX, centerY, width / 2, height / 2);

        // const debugGraphics = new PIXI.Graphics();
        // debugGraphics.lineStyle(2, 0xFF0000);
        // debugGraphics.drawEllipse(centerX, centerY, width / 2, height / 2);
        // this.sprite.addChild(debugGraphics);
    }
}
