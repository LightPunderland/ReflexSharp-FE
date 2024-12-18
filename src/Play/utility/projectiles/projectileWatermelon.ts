import { SpriteCache } from '../spriteCache';
import { Projectile } from './projectile';
import * as PIXI from 'pixi.js';

export class Watermelon extends Projectile {
    static WatermelonPNG= 'api/sprite/by-name/watermelon';

    constructor(player: { x: number; y: number }) {

        super(player, SpriteCache.instance.watermelonTexture, SpriteCache.instance.watermelonWarningTexture);   // doesn't render properly, fix this


        this.speedIncrement = 0.08;

        const width = this.sprite.width;
        const height = this.sprite.height; // Remove 5 pixels from top and bottom
        const centerX = width / 2;
        const centerY = this.sprite.height / 2;

        // Define an oval hit area
        this.sprite.hitArea = new PIXI.Ellipse(centerX, centerY, width / 2, height / 2);

        // Hitboxu debuginimmas
        this.addHitBoxesPoints()
    }

    addHitBoxesPoints(){
        // Atkomentuoti jei nori nupiesti hitbox pointus
        // for(var i = 0;i<4;i++){
        //     const hitboxSprite = PIXI.Sprite.from('src/assets/redhitboxpoint.png')
        //     hitboxSprite.height = 4;
        //     hitboxSprite.width = 4;
    
        //     this.hitboxSpriteArray.push(hitboxSprite);
        // }

        this.hitboxPoints.push([8,8]);
        this.hitboxPoints.push([this.sprite.width-8,12]);
        this.hitboxPoints.push([8,this.sprite.height-12]);
        this.hitboxPoints.push([this.sprite.width-8,this.sprite.height-14]);
    }
}
