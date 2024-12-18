import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import * as PIXI from 'pixi.js';
import { ProjectileSpawner } from '../src/Play/utility/projectileSpawner';
import { Character } from '../src/Play/utility/character';
import { Watermelon } from '../src/Play/utility/projectiles/projectileWatermelon';
import { Banana } from '../src/Play/utility/projectiles/projectileBanana';
import { Pumpkin } from '../src/Play/utility/projectiles/projectilePumpkin';
import { Coin } from '../src/Play/utility/projectiles/projectileCoin';
import { Kunai } from '../src/Play/utility/projectiles/projectileKunai';
import { JSDOM } from 'jsdom';

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

// Set up jsdom
declare const global: any;

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

let app: PIXI.Application;
let character: Character;
let spawner: ProjectileSpawner;

beforeEach(() => {
  app = {
    stage: {
      addChild: vi.fn(),
    },
    view: {
      width: 800,
      height: 600,
    },
  } as unknown as PIXI.Application;
  character = new Character();
  spawner = new ProjectileSpawner(app, character);
});

afterEach(() => {
  spawner.clearIntervals();
});

// test('ProjectileSpawner spawns a watermelon', async () => {
//   await spawner.spawnWatermelon();
//   expect(spawner.projectiles.length).toBe(1);
//   expect(spawner.projectiles[0]).toBeInstanceOf(Watermelon);
// });

// test('ProjectileSpawner spawns a banana', async () => {
//   await spawner.spawnBanana();
//   expect(spawner.projectiles.length).toBe(1);
//   expect(spawner.projectiles[0]).toBeInstanceOf(Banana);
// });

test('ProjectileSpawner spawns a pumpkin', async () => {
  await spawner.spawnPumpkin();
  expect(spawner.pumpkins.length).toBe(1);
  expect(spawner.pumpkins[0]).toBeInstanceOf(Pumpkin);
});

test('ProjectileSpawner spawns a coin', async () => {
  await spawner.spawnCoin();
  expect(spawner.coins.length).toBe(1);
  expect(spawner.coins[0]).toBeInstanceOf(Coin);
});

test('ProjectileSpawner spawns a kunai', async () => {
  await spawner.spawnKunai();
  expect(spawner.kunai.length).toBe(1);
  expect(spawner.kunai[0]).toBeInstanceOf(Kunai);
});


test('ProjectileSpawner adjusts pumpkin intervals correctly', () => {
  const initialInterval = spawner.currentIntervalPumpkin;
  spawner.adjustInterval('pumpkin');
  expect(spawner.currentIntervalPumpkin*0.5).toBeLessThan(spawner.initialInterval);
});

test('ProjectileSpawner adjusts watermelon intervals correctly', () => {
    const initialInterval = spawner.currentIntervalWatermelon;
    spawner.adjustInterval('watermelon');
    expect(spawner.currentIntervalWatermelon*0.5).toBeLessThan(spawner.initialInterval);
  });

  test('ProjectileSpawner adjusts banana intervals correctly', () => {
    const initialInterval = spawner.currentIntervalBanana;
    spawner.adjustInterval('banana');
    expect(spawner.currentIntervalBanana*0.5).toBeLessThan(spawner.initialInterval);
  });

  test('ProjectileSpawner adjusts coin intervals correctly', () => {
    const initialInterval = spawner.currentIntervalCoin;
    spawner.adjustInterval('coin');
    expect(spawner.currentIntervalCoin*0.5).toBeLessThan(spawner.initialInterval);
  });

test('ProjectileSpawner clears intervals', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    spawner.clearIntervals();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(5);
    clearIntervalSpy.mockRestore();
});