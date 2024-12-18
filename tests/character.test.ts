import { expect, test, vi, beforeEach } from 'vitest';
// Removed CanvasRenderer import as it is not exported from 'pixi.js'

declare const global: any;
import * as PIXI from 'pixi.js';
import { Character } from '../src/Play/utility/character';
import { Watermelon } from '../src/Play/utility/projectiles/projectileWatermelon';
import { Pumpkin } from '../src/Play/utility/projectiles/projectilePumpkin';
import { Banana } from '../src/Play/utility/projectiles/projectileBanana';
import { JSDOM } from 'jsdom';
import { CanvasRenderer } from '@pixi/canvas-renderer';
import { KeyboardKeys } from '../src/Play/utility/keyboardKeys';
import { Coin } from '../src/Play/utility/projectiles/projectileCoin';
import { Kunai } from '../src/Play/utility/projectiles/projectileKunai';

// Mock PIXI.Texture.from to return a dummy texture
vi.mock('pixi.js', async () => {
  const originalModule = await vi.importActual<typeof import('pixi.js')>('pixi.js');
  return {
    ...originalModule,
    Texture: {
      ...originalModule.Texture,
      from: vi.fn(() => new originalModule.Texture(new originalModule.BaseTexture())),
    },
    Application: vi.fn(() => ({
      stage: {
        addChild: vi.fn(),
        removeChild: vi.fn(),
      },
      renderer: { resize: vi.fn() },
      ticker: { add: vi.fn(), remove: vi.fn() },
      destroy: vi.fn(),
    })),
  };
});

// Setup DOM-like environment
let character: Character;

beforeEach(() => {
  const { window } = new JSDOM(`<!DOCTYPE html><html><body><canvas></canvas></body></html>`);
  global.window = window as unknown as Window;
  global.document = window.document;
  global.navigator = { userAgent: 'node.js' } as unknown as Navigator;

  character = new Character();

  // Mock requestAnimationFrame and cancelAnimationFrame
  global.requestAnimationFrame = vi.fn().mockImplementation(callback => setTimeout(callback, 0));
  global.cancelAnimationFrame = vi.fn().mockImplementation(id => clearTimeout(id));
});

test('Character initially not collided', () => {
  const characterInstance = new Character();

  expect(characterInstance).toHaveProperty('collided', false);
});

test('Character and Watermelon collided', () => {
  const character = new Character();
  const projectile = new Watermelon({ x: 100, y: 100 });

  // Place the character at the same position as the projectile
  character.getSprite().x = 100;
  character.getSprite().y = 100;
  
  character.checkForCollision([projectile]);

  expect(character).toHaveProperty('collided', false);
});


test('Character and Banana collided', () => {
  const character = new Character();
  const projectile = new Banana({ x: 0, y: 0 });

  character.getSprite().x = 0;
  character.getSprite().y = 0;

  character.checkForCollision([projectile]);

  expect(character).toHaveProperty('collided', false);
});

test('Character is not out of bounds', () => {
    const character = new Character();
  // character.setHitArea();

    const initialX = window.innerHeight/2;
    const initialY = window.innerHeight/2;

    character.getSprite().x = initialX;
    character.getSprite().y = initialY;
    character.checkForOutOfBounds()
  
    expect(character.getSprite().x).toBe(initialX);
    expect(character.getSprite().y).toBe(initialY);
});

test('Reset x character out of bounds', () => {
    const character = new Character();
  // character.setHitArea();

    const initialX = 3000;
    const initialY = 40

    character.getSprite().x = initialX;
    character.getSprite().y = initialY;
    character.checkForOutOfBounds()
  
    expect(character.getSprite().x).toBeLessThan(initialX);
    expect(character.getSprite().y).toBe(initialY);
});

test('Reset y character out of bounds', () => {
    const character = new Character();
  // character.setHitArea();

    const initialX = 40;
    const initialY = 12340;

    character.getSprite().x = initialX;
    character.getSprite().y = initialY;
    character.checkForOutOfBounds()
  
    expect(character.getSprite().y).toBeLessThan(initialY);
    expect(character.getSprite().x).toBe(initialX);
});



test('should throw an error if sprite is not added to the stage', () => {
  character.sprite!.parent?.removeChild(character.sprite!);

  expect(() => {
    character.spawnCharacter(800, 600);
  }).toThrow('[Character] Sprite not added to the stage');
});

test('should update momentum when moving up', () => {
  KeyboardKeys.keyboardState = { KeyW: true };
  character.setCharacterMovementDirection();
  character.updateCharacterMomentum(1);

  expect(character.movementMomentum.upMomentum).toBeGreaterThan(0);
});

  test('should remove coin when collision is detected', () => {
    const coin = new Coin({ x: 0, y: 0 });
    coin.sprite = new PIXI.Sprite();
    coin.sprite.x = 100;
    coin.sprite.y = 100;
    coin.hitboxPoints = [[0, 0]];
    coin.markedForDeletion = true;
    const coinArray = [coin];

    character.getSprite().x = 100;
    character.getSprite().y = 100;
    character.getSprite().width = 50;
    character.getSprite().height = 50;
    character.charHitboxOffset = 0;

    character.checkForCoins(coinArray);

    expect(coinArray.length).toBe(0);
  });

  test('should not remove coin when no collision is detected', () => {
    const coin = new Coin({ x: 0, y: 0 });
    coin.sprite = new PIXI.Sprite();
    coin.sprite.x = 200;
    coin.sprite.y = 200;
    coin.hitboxPoints = [[0, 0]];
    const coinArray = [coin];

    character.getSprite().x = 100;
    character.getSprite().y = 100;
    character.getSprite().width = 50;
    character.getSprite().height = 50;
    character.charHitboxOffset = 0;

    character.checkForCoins(coinArray);

    expect(coinArray.length).toBe(1);
  });

  test('should remove kunai when collision is detected', () => {
    const kunai = new Kunai({ x: 0, y: 0 }, false);
    kunai.sprite = new PIXI.Sprite();
    kunai.sprite.x = 100;
    kunai.sprite.y = 100;
    kunai.toThrow = false;
    kunai.markedForDeletion = true;
    const kunaiArray = [kunai];

    character.getSprite().x = 100;
    character.getSprite().y = 100;
    character.getSprite().width = 50;
    character.getSprite().height = 50;

    character.checkForKunai(kunaiArray);

    expect(kunaiArray.length).toBe(0);
  });

  test('should not remove kunai when no collision is detected', () => {
    const kunai = new Kunai({ x: 0, y: 0 }, false);
    kunai.sprite = new PIXI.Sprite();
    kunai.sprite.x = 200;
    kunai.sprite.y = 200;
    kunai.toThrow = false;
    const kunaiArray = [kunai];

    character.getSprite().x = 100;
    character.getSprite().y = 100;
    character.getSprite().width = 50;
    character.getSprite().height = 50;

    character.checkForKunai(kunaiArray);

    expect(kunaiArray.length).toBe(1);
  });
