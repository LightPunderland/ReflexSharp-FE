import { SpriteCache } from '../spriteCache';
import { Projectile } from './projectile';
import * as PIXI from 'pixi.js';

export class Banana extends Projectile {
    private archDelay: number;  
    private archStrength: number; 
    private archDirection: { x: number; y: number }; 

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, SpriteCache.instance.bananaTexture, SpriteCache.instance.bananaWarningTexture);

        this.speedIncrement = 0.03;
        this.archDelay = 1;         
        this.archStrength = 0.003;  

       
        if (this.sprite) {
            this.archDirection = {
                x: this.sprite.x < window.innerWidth / 2 ? 1 : -1, // Left or right
                y: this.sprite.y < window.innerHeight / 2 ? 1 : -1 // Top or bottom
            };
            this.setCustomHitPolygon();

            // const debugGraphics = new PIXI.Graphics();
            // debugGraphics.lineStyle(2, 0xFF0000);
            // debugGraphics.drawPolygon([
            //     // Define points for quadrants "b", "c", "d"
            //     this.sprite.width / 2 + 14, 0,             // Top-mid (between "a" and "b")
            //     this.sprite.width-4, 0,         // Top-right corner ("b")
            //     this.sprite.width-4, 40,                  // Bottom-right corner ("d")
            //     40, this.sprite.height - 5,            // Bottom-right corner ("d")             
            //     0, this.sprite.height - 5,                // Bottom-left corner ("c")
            //     0, this.sprite.height / 2 + 16,             // Mid-left (between "a" and "c")
            //     this.sprite.width / 2, this.sprite.height/2 + 10,  // Middle   
            // ]);
            // this.sprite.addChild(debugGraphics);
        } else {
            this.archDirection = { x: 0, y: 0 }; // Default values if sprite is null
        }
        
    }

    private setCustomHitPolygon(): void {
        const { width, height } = this.sprite;

        // Create a polygon that excludes the "a" quadrant
        const hitPolygon = new PIXI.Polygon([
            // Define points for quadrants "b", "c", "d"
            this.sprite.width / 2 + 14, 0,             // Top-mid (between "a" and "b")
                this.sprite.width-4, 0,         // Top-right corner ("b")
                this.sprite.width-4, 40,                  // Bottom-right corner ("d")
                40, this.sprite.height - 5,            // Bottom-right corner ("d")             
                0, this.sprite.height - 5,                // Bottom-left corner ("c")
                0, this.sprite.height / 2 + 16,             // Mid-left (between "a" and "c")
                this.sprite.width / 2, this.sprite.height/2 + 10,  // Middle   
        ]);

        // Offset the polygon points by adjusting for the sprite's center anchor
        hitPolygon.points = hitPolygon.points.map((value, index) => 
            index % 2 === 0 
                ? value - width / 2   // Adjust x-coordinates by half the width
                : value - height / 2  // Adjust y-coordinates by half the height
        );

        // Set the custom hit area
        this.sprite.hitArea = hitPolygon;
    }

    update(): void {

        this.warnTime++;

        if(this.warnTime > 100) {

        if(!this.direction) this.direction = this.calculateDirection(this.sprite.x, this.sprite.y, this.player.x, this.player.y);
        this.speed += this.speedIncrement;
        this.time += 0.05;


        // Pries delay judam tiesiai, po delay arka
        if (this.time > this.archDelay) {
            this.direction.x += this.archDirection.x * this.archStrength;
            this.direction.y += this.archDirection.y * this.archStrength;
        }

        // normalizuojam direction'a
        const magnitude = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        this.direction.x /= magnitude;
        this.direction.y /= magnitude;

        if (this.sprite) {
            this.sprite.x += this.direction.x * this.speed;
            this.sprite.y += this.direction.y * this.speed;
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
    }else{
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
}
