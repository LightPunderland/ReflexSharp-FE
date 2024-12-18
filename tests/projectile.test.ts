import * as PIXI from 'pixi.js';
import { expect, test, vi, beforeEach, describe } from 'vitest';
import { Projectile } from '../src/Play/utility/projectiles/projectile';
import { Banana } from '../src/Play/utility/projectiles/projectileBanana';
import { Watermelon } from '../src/Play/utility/projectiles/projectileWatermelon';
import { Pumpkin } from '../src/Play/utility/projectiles/projectilePumpkin';
import { Coin } from '../src/Play/utility/projectiles/projectileCoin';
import { Kunai } from '../src/Play/utility/projectiles/projectileKunai';



    let mockPlayer: { x: number; y: number };
    let mockTexture: PIXI.Texture;
    let warningTexture: PIXI.Texture;



    
    beforeEach(() => {
        mockPlayer = { x: 300, y: 400 };
        mockTexture = PIXI.Texture.EMPTY; // Use empty textures for simplicity
        warningTexture = PIXI.Texture.EMPTY;
    });


    test('calculateDirection correctly normalizes direction', () => {
        const projectile = new Projectile(mockPlayer, mockTexture, warningTexture);
        const direction = projectile.calculateDirection(0, 0, 3, 4);

        expect(direction.x).toBeCloseTo(0.6, 1);
        expect(direction.y).toBeCloseTo(0.8, 1);
    });

    test('getIsWarningActive returns true for warnTime < 100', () => {
        const projectile = new Projectile(mockPlayer, mockTexture, warningTexture);
        projectile.warnTime = 50;

        expect(projectile.getIsWarningActive()).toBe(true);
    });

    test('getIsWarningActive returns false for warnTime >= 100', () => {
        const projectile = new Projectile(mockPlayer, mockTexture, warningTexture);
        projectile.warnTime = 100;

        expect(projectile.getIsWarningActive()).toBe(false);
    });

    test('Projectile initializes with correct properties', () => {
        const projectile = new Projectile(mockPlayer, mockTexture, warningTexture);
      
        expect(projectile.player).toBe(mockPlayer);
        expect(projectile.sprite.texture).toBe(mockTexture);
        expect(projectile.warningSprite.texture).toBe(warningTexture);
        expect(projectile.time).toBe(0);
        expect(projectile.side).toBeGreaterThanOrEqual(0);
        expect(projectile.side).toBeLessThanOrEqual(3);
      });
      
      
      
      
    



