import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Watermelon } from "./utility/projectiles/projectileWatermelon";
import { KeyboardKeys } from "./utility/keyboardKeys";
import { Character } from "./utility/character";

import  WatermelonPNG from "./utility/assets/watermelon.png" // RECHECK LATER, MAYBE WE DONT NEED THIS

const Play = () => {
    const gameContainer = useRef<HTMLDivElement>(null); 
    const appRef = useRef<PIXI.Application | null>(null);

    useEffect(() => {

        const app = new PIXI.Application({ antialias: true, backgroundColor: 0x1099bb, resizeTo: window });
        appRef.current = app;

        if (gameContainer.current) {
            gameContainer.current.appendChild(app.view as HTMLCanvasElement);
        }

        const character = new Character();
        character.loadSprite().then(() => {
            app.stage.addChild(character.getSprite());
            character.spawnCharacter(app.view.width, app.view.height);
        });

        document.body.addEventListener("keydown", KeyboardKeys.onKeyDown);
        document.body.addEventListener("keyup", KeyboardKeys.onKeyUp);

        let projectiles: Watermelon[] = [];
        const projectileSpeed = 1;
        const spawnInterval = 2000;
        let isGameActive = true;

        PIXI.Assets.load(WatermelonPNG);

        const spawnProjectile = () => {
            if (isGameActive) {
                const newProjectile = new Watermelon(character.getSprite(), projectileSpeed);
                app.stage.addChild(newProjectile.getSprite());
                newProjectile.spawn(app.view.width, app.view.height);
                projectiles.push(newProjectile);
            }
        };

        const visibilityChange = () => {
            isGameActive = document.visibilityState === 'visible';
        };

        document.addEventListener('visibilitychange', visibilityChange);

        const projectileSpawner = setInterval(spawnProjectile, spawnInterval);

        app.ticker.add((deltaTime) => {
            if (isGameActive) {
                character.update(deltaTime);

                projectiles.forEach((projectile) => projectile.update());

                projectiles = projectiles.filter(projectile => projectile.sprite.parent !== null);
            }
        });

        return () => {
            clearInterval(projectileSpawner);
            document.removeEventListener('visibilitychange', visibilityChange);
            document.body.removeEventListener("keydown", KeyboardKeys.onKeyDown);
            document.body.removeEventListener("keyup", KeyboardKeys.onKeyUp);
            app.destroy(true, { children: true });
        };
    }, []);

    return <div ref={gameContainer} style={{ width: '100%', height: '100%' }}></div>;
};

export default Play;
