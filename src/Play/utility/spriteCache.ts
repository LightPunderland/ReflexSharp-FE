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
        PIXI.Texture.from('api/sprite/by-name/pumpkin0'),
        PIXI.Texture.from('api/sprite/by-name/pumpkin1'),
        PIXI.Texture.from('api/sprite/by-name/pumpkin2'),
        PIXI.Texture.from('api/sprite/by-name/pumpkin3'),
        PIXI.Texture.from('api/sprite/by-name/pumpkin4'),
    ]

    public ninjaTexture = PIXI.Texture.from('api/sprite/by-name/ninja');
    public bananaTexture = PIXI.Texture.from('api/sprite/by-name/banana');
    public watermelonTexture = PIXI.Texture.from('api/sprite/by-name/watermelon');
    public coinTexture = PIXI.Texture.from('api/sprite/by-name/coin');
    public kunaiTexture = PIXI.Texture.from('api/sprite/by-name/kunai');
    public backgroundTexture = PIXI.Texture.from('src/Play/background.png');
    
    public bananaWarningTexture = PIXI.Texture.from('api/sprite/by-name/bananaWarning');
    public watermelonWarningTexture = PIXI.Texture.from('api/sprite/by-name/watermelonWarning');

    public texturesLoaded(){
        const textures = [
            this.ninjaTexture,
            this.bananaTexture,
            this.watermelonTexture,
            this.backgroundTexture,
            this.coinTexture,
            this.kunaiTexture
        ];

        for(let i = 0;i<textures.length;i++){
            if(textures[i].valid == false){
                return false;
            }
        }

        for(let i = 0;i<this.pumpkinTextures.length;i++){
            if(this.pumpkinTextures[i].valid == false){
                return false;
            }
        }

        return true;
    }
}
