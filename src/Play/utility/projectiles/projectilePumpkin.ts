import { Projectile } from './projectile';
import { SpriteCache } from '../spriteCache';
import * as PIXI from 'pixi.js';

export class Pumpkin extends Projectile {
    private phase: number = 0;               
    private phaseDuration: number = 100;      
    private phaseTimer: number = 0;         
    
    
    constructor(player: { x: number; y: number }) {

        super(player, SpriteCache.instance.pumpkinTextures[0], SpriteCache.instance.bananaTexture);
        this.sprite.anchor.set(0.5, 0.5);

        this.updateSprite();
        this.setHitArea();
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

    private setHitArea(): void {
        if (this.sprite && this.sprite.texture) {
            const textureWidth = this.sprite.texture.width;
            const textureHeight = this.sprite.texture.height;
    
            // Calculate the actual width and height based on the sprite's scale
            const width = this.sprite.width;
            const height = this.sprite.height;
    
    
            // Create a polygon for the hitbox with corners adjusted for anchor and scale
            const polygon = new PIXI.Polygon(
                new PIXI.Point(-width / 2 - textureWidth, -height / 2 - textureHeight), // Top-left corner
                new PIXI.Point(width / 2 , -height / 2 - textureHeight),  // Top-right corner
                new PIXI.Point(width / 2 , height / 2 ),   // Bottom-right corner
                new PIXI.Point(-width / 2 - textureWidth, height / 2 )   // Bottom-left corner
            );
    
            // Set the polygon as the hitArea for collision detection
            this.sprite.hitArea = polygon;
    
            // Optional: visualize the hitArea for debugging
            // this.drawDebugHitbox(polygon);
        }
    }
    
    // Optional method to draw the hitbox for visualization
    private drawDebugHitbox(polygon: PIXI.Polygon): void {
        const debugGraphics = new PIXI.Graphics();
        debugGraphics.lineStyle(2, 0xff0000); // Red outline for visibility
        debugGraphics.drawPolygon(polygon.points);
        debugGraphics.endFill();
    
        // Attach the debug graphics to the same parent as the sprite for accurate positioning
        if (this.sprite.parent) {
            this.sprite.parent.addChild(debugGraphics);
            debugGraphics.x = this.sprite.x;
            debugGraphics.y = this.sprite.y;
            debugGraphics.rotation = this.sprite.rotation;
        }
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
