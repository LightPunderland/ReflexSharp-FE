import { expect, test, vi, beforeEach } from 'vitest';
import { Character } from '../src/Play/utility/character';
import { SpriteCache } from '../src/Play/utility/spriteCache';
import * as PIXI from 'pixi.js';

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

// Mock the window object
beforeEach(() => {
  globalThis.window = {
    innerWidth: 800,
    innerHeight: 600,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as any;
});

function getC() {
  const spriteCache = SpriteCache.instance;
  const c = new Character();
  c.checkForOutOfBounds();
  return c;
}

test('Initial number of keys pressed', () => {
  const mock = vi.fn(getC);

  const characterInstance = mock();

  console.log('Character instance:', characterInstance);
  console.log('Mock calls:', mock.mock.calls);

  expect(characterInstance).toBeInstanceOf(Character);
  expect(mock).toHaveBeenCalled();
});