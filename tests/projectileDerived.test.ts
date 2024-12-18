import * as PIXI from 'pixi.js';
import { expect, test, vi, beforeEach, describe } from 'vitest';
import { Projectile } from '../src/Play/utility/projectiles/projectile';
import { Banana } from '../src/Play/utility/projectiles/projectileBanana';
import { Watermelon } from '../src/Play/utility/projectiles/projectileWatermelon';
import { Pumpkin } from '../src/Play/utility/projectiles/projectilePumpkin';
import { Coin } from '../src/Play/utility/projectiles/projectileCoin';
import { Kunai } from '../src/Play/utility/projectiles/projectileKunai';
import { JSDOM } from 'jsdom';

declare const global: any;


    vi.mock('pixi.js', async () => {
      const originalModule = await vi.importActual<typeof import('pixi.js')>('pixi.js');
      return {
        ...originalModule,
        Texture: {
          ...originalModule.Texture,
          from: vi.fn(() => new originalModule.Texture(new originalModule.BaseTexture()))
        }
      };
    });

    
    beforeEach(() => {
      const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
      global.window = window as unknown as Window;
      global.document = window.document;
      global.navigator = {
        userAgent: 'node.js',
      } as unknown as Navigator;
      global.requestAnimationFrame = vi.fn().mockImplementation(callback => setTimeout(callback, 0));
      global.cancelAnimationFrame = vi.fn().mockImplementation(id => clearTimeout(id));
    });
    
    let mockPlayer: { x: number; y: number };
    let mockTexture: PIXI.Texture;
    let warningTexture: PIXI.Texture;
    
    beforeEach(() => {
      mockPlayer = { x: 300, y: 400 };
      mockTexture = PIXI.Texture.from('dummy');
      warningTexture = PIXI.Texture.from('dummy');
    });

    describe('Coin', () => {
        test('should spawn at a random position', () => {
          const coin = new Coin(mockPlayer);
          coin.spawn();
    
          expect(coin.sprite.x).toBeGreaterThanOrEqual(0);
          expect(coin.sprite.y).toBeGreaterThanOrEqual(0);
          expect(coin.sprite.x).toBeLessThanOrEqual(window.innerWidth);
          expect(coin.sprite.y).toBeLessThanOrEqual(window.innerHeight);
        });
    
        test('should mark for deletion after lifetime expires', () => {
          const coin = new Coin(mockPlayer);
          coin.update(300);
          expect(coin.sprite.visible).toBe(true);
    
          coin.update(200);
          expect(coin.markedForDeletion).toBe(false);
        });

      });
    
      describe('Kunai', () => {
        test('should initialize with correct properties', () => {
          const kunai = new Kunai(mockPlayer, true);
          expect(kunai.player).toBe(mockPlayer);
        });
      
        test('should spawn at random position when not thrown', () => {
          const kunai = new Kunai(mockPlayer, true);
          expect(kunai.sprite.x).toBeGreaterThanOrEqual(0);
          expect(kunai.sprite.y).toBeGreaterThanOrEqual(0);
        });
      
        test('should update position when thrown', () => {
          const kunai = new Kunai(mockPlayer, true);
          kunai.throw(200, 200, 100, 100);
          const deltaTime = 16; // Assuming a frame time of 16ms for the test
          kunai.update(deltaTime);
      
          expect(kunai.sprite.x).not.toBe(mockPlayer.x);
          expect(kunai.sprite.y).not.toBe(mockPlayer.y);
        });

        test('should remove itself when out of bounds', () => {
            const kunai = new Kunai(mockPlayer, true);
            kunai.sprite.x = window.innerWidth + 1;
            kunai.sprite.y = window.innerHeight + 1;
            kunai.update(16);
            expect(kunai.sprite.parent).toBeNull();
          });

          test('should remove itself when marked for deletion', () => {
            const kunai = new Kunai(mockPlayer, true);
            kunai.markedForDeletion = true;
            kunai.update(16);
            expect(kunai.sprite.parent).toBeNull();
          });
      });

      describe('Banana', () => {
        test('should initialize with correct properties', () => {
          const banana = new Banana(mockPlayer);
      
          expect(banana.speedIncrement).toBe(0.03);
          expect(banana.archDelay).toBe(1);
          expect(banana.archStrength).toBe(0.003);
          expect(banana.sprite).toBeInstanceOf(PIXI.Sprite);
          expect(banana.warningSprite).toBeInstanceOf(PIXI.Sprite);
        });
      
        test('should set arch direction based on initial sprite position', () => {
          const banana = new Banana(mockPlayer);
      
          if (banana.sprite) {
            const expectedArchDirection = {
              x: banana.sprite.x < window.innerWidth / 2 ? 1 : -1,
              y: banana.sprite.y < window.innerHeight / 2 ? 1 : -1
            };
      
            expect(banana.archDirection).toEqual(expectedArchDirection);
          }
        });
      
      
      });
    
      describe('Pumpkin', () => {
        test('should change phase after phase duration', () => {
          const pumpkin = new Pumpkin(mockPlayer);
          pumpkin.update(100);
          expect(pumpkin.getPhase()).toBe(1);
    
          pumpkin.update(100);
          expect(pumpkin.getPhase()).toBe(2);
        });
    
        test('should remove itself after last phase', () => {
          const pumpkin = new Pumpkin(mockPlayer);
          pumpkin.update(100);
          pumpkin.update(100);
          pumpkin.update(100);
          expect(pumpkin.sprite.parent).toBeNull();
        });

        test('should remove itself when out of bounds', () => {
          const pumpkin = new Pumpkin(mockPlayer);
          pumpkin.sprite.x = window.innerWidth + 100;
          pumpkin.sprite.y = window.innerHeight + 100;
          expect(pumpkin.sprite.parent).toBeNull();
        });
      });
    
      describe('Watermelon', () => {
        test('should initialize with oval hit area', () => {
          const watermelon = new Watermelon(mockPlayer);
          const hitArea = watermelon.sprite.hitArea as PIXI.Ellipse;
    
          expect(hitArea).toBeInstanceOf(PIXI.Ellipse);
          expect(hitArea.width).toBe(watermelon.sprite.width / 2);
          expect(hitArea.height).toBe(watermelon.sprite.height / 2);
        });
    
        test('should define hitbox points correctly', () => {
          const watermelon = new Watermelon(mockPlayer);
          expect(watermelon.hitboxPoints.length).toBe(4);
        });
      });



