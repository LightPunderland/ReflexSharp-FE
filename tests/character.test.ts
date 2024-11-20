import { expect, test, vi, beforeEach } from 'vitest';
import { Character } from '../src/Play/utility/character';
import { Watermelon } from '../src/Play/utility/projectiles/projectileWatermelon';
import { Pumpkin } from '../src/Play/utility/projectiles/projectilePumpkin';
import { Banana } from '../src/Play/utility/projectiles/projectileBanana';

// Mock PIXI.Texture.from to return a dummy texture
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
    globalThis.window = {
      innerWidth: 1920,
      innerHeight: 953,
    } as any;
  });

test('Character initially not collided', () => {
  const characterInstance = new Character();

  expect(characterInstance).toHaveProperty('collided', false);
});

test('Character and Watermelon collided', () => {
    const character = new Character();
    character.setHitArea();

    const projectile = new Watermelon(
        {x:character.getSprite().x,y:character.getSprite().y},
    );

    character.checkForCollision([projectile])
  
    expect(character).toHaveProperty('collided', true);
});

test('Character and Banana collided', () => {
    const character = new Character();
    character.setHitArea();

    const projectile = new Banana(
        {x:character.getSprite().x,y:character.getSprite().y},
    );

    character.checkForCollision([projectile])
  
    expect(character).toHaveProperty('collided', true);
});

test('Character is not out of bounds', () => {
    const character = new Character();
    character.setHitArea();

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
    character.setHitArea();

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
    character.setHitArea();

    const initialX = 40;
    const initialY = 12340;

    character.getSprite().x = initialX;
    character.getSprite().y = initialY;
    character.checkForOutOfBounds()
  
    expect(character.getSprite().y).toBeLessThan(initialY);
    expect(character.getSprite().x).toBe(initialX);
});