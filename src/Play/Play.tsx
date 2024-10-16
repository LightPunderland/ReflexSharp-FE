import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Watermelon } from "./utility/projectiles/projectileWatermelon";
import { Banana } from "./utility/projectiles/projectileBanana";
import { KeyboardKeys } from "./utility/keyboardKeys";
import { Character } from "./utility/character";
import Score from './utility/Score';

import { Projectile } from "./utility/projectiles/projectile";

const Play: React.FC = () => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    
    let isGameOver = false;

    const [score, setScore] = useState<number | null>(null);

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

        let projectiles: Projectile[] = [];
        const characterBaseSpeed = 0.005; 
        const projectileBaseSpeed = 0.01; 

        const spawnInterval = 2000; 
        let isGameActive = true;


        const spawnProjectile = async () => {
            if (isGameActive) {
                const projectileSpeed = projectileBaseSpeed * Math.min(app.view.width, app.view.height); 
                
                if(Math.random() > 0.6) {
                    await(Math.random() * 10000);
                    const newBanana = new Banana(character.getSprite(), projectileSpeed);
                    app.stage.addChild(newBanana.getSprite());
                    newBanana.spawn(app.view.width, app.view.height);
                    projectiles.push(newBanana);
                }
                
                const newWatermelon = new Watermelon(character.getSprite(), projectileSpeed);
                app.stage.addChild(newWatermelon.getSprite());
                newWatermelon.spawn(app.view.width, app.view.height);
                projectiles.push(newWatermelon);
            }
        };

        const visibilityChange = () => {
            isGameActive = document.visibilityState === 'visible';
        };

        document.addEventListener('visibilitychange', visibilityChange);
        const projectileSpawner = setInterval(spawnProjectile, spawnInterval);

        // **Frame-independent movement using deltaTime**
        app.ticker.add((deltaTime) => {
            if (isGameActive) {
                const deltaSpeedChar = characterBaseSpeed * Math.min(app.view.width, app.view.height) * deltaTime;


                character.update(deltaTime, projectiles, deltaSpeedChar);
                
                if (character.collided) {
                    app.renderer.background.color = '#ff0000'; 
                    isGameOver = true;
                }

                projectiles.forEach((projectile) => projectile.update());

                const remainingProjectiles = projectiles.filter(projectile => projectile.sprite.parent !== null);
                const despawnedCount = projectiles.length - remainingProjectiles.length;

                // Uz kiekviena despawn'inta projectile pridedam taskus, jei dar neivyko collision
                if (!isGameOver && despawnedCount > 0) {
                    setScore(prevScore => {
                        const newScore = (prevScore === null) ? despawnedCount : prevScore + despawnedCount;
                        return Math.floor(newScore); // Kad score'as visada butu int'as (jei zinot geresni buda tam uztikrint pakeiskit)
                    });
                }
                projectiles = remainingProjectiles;
            }
        });

        window.addEventListener('resize', () => {
            const scale = Math.min(window.innerWidth / app.view.width, window.innerHeight / app.view.height);
            
            character.getSprite().scale.set(scale);
            projectiles.forEach(projectile => {
                projectile.getSprite().scale.set(scale);
            });
        });

        return () => {
            clearInterval(projectileSpawner);
            document.removeEventListener('visibilitychange', visibilityChange);
            document.body.removeEventListener("keydown", KeyboardKeys.onKeyDown);
            document.body.removeEventListener("keyup", KeyboardKeys.onKeyUp);
            app.destroy(true, { children: true });
        };
    }, []);

    //Rodo Score
    return (
        <div ref={gameContainer} style={{ width: '100%', height: '100%' }}>
            <Score score={score} /> {/* Pass the score to the Score component */}
        </div>
    );
};

export default Play;
