import * as PIXI from 'pixi.js';

// Singleton patternas, sita klase loadinama turi but tik viena karta
export class SpriteCache{
    static #instance: SpriteCache;

    private constructor() { }

    public static get instance(): SpriteCache {
        if (!SpriteCache.#instance) {
            SpriteCache.#instance = new SpriteCache();
        }

        return SpriteCache.#instance;
    }

    public pumpkinTextures: PIXI.Texture<PIXI.Resource>[] = [
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin0'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin1'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin2'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin3'),
        PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/pumpkin4'),
    ]

    public ninjaTexture = PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/ninja');
    public bananaTexture = PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/banana');
    public watermelonTexture = PIXI.Texture.from('http://localhost:5050/api/sprite/by-name/watermelon');
    public backgroundTexture = PIXI.Texture.from('src/Play/background.png');

}