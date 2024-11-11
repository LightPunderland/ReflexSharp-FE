import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { KeyboardKeys } from "./utility/keyboardKeys";
import { Character } from "./utility/character";
import Score from './utility/Score';
import Replay from './Replay/Replay';
import { PostScore } from "./PostScore";
import { SpriteCache } from "./utility/spriteCache";
import { ProjectileSpawner } from "./utility/projectileSpawner";

const Play: React.FC<{userId: string}> = ({ userId }) => {

    let doItOnce = true; // DO NOT MAKE REMOVE THIS, WILL BREAK POSTS, NEED TO FIX IN TESTING

    // Singletonas, SpriteCache.instance po sito bus uzloadinta visur
    // Davai chebra tik nepanaikinkit sitos eilutes, nors kintamasis nenaudojamas vistiek uzloadina cia viska i memory
    const spriteCache: SpriteCache = SpriteCache.instance; 

    const gameContainer = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);

    const [isGameActive, setIsGameActive] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        const app = new PIXI.Application({ antialias: true, backgroundColor: 0x1099bb, resizeTo: window });
        appRef.current = app;
        
        const backgroundSprite = new PIXI.Sprite(SpriteCache.instance.backgroundTexture);

        //useState scoras returnina rezultatus tiktai kitam renderi, o mes canvas nenorim rerenderinti
        let localGameScore = 0

        backgroundSprite.width = app.view.width;
        backgroundSprite.height = app.view.height;
        backgroundSprite.anchor.set(0.5);
        backgroundSprite.position.set(app.view.width / 2, app.view.height / 2);

        app.stage.addChild(backgroundSprite);

        window.addEventListener('resize', () => {
            backgroundSprite.width = app.screen.width;
            backgroundSprite.height = app.screen.height;
        });

        if (gameContainer.current) {
            gameContainer.current.appendChild(app.view as HTMLCanvasElement);
        }

        const character = new Character();
        app.stage.addChild(character.getSprite());
        character.spawnCharacter(app.view.width, app.view.height);

        document.body.addEventListener("keydown", KeyboardKeys.onKeyDown);
        document.body.addEventListener("keyup", KeyboardKeys.onKeyUp);

        const projectileSpawner = new ProjectileSpawner(app, character);

        let isGameActive = true;

        const visibilityChange = () => {
            isGameActive = document.visibilityState === 'visible';

              if (document.visibilityState === 'visible') {
                setIsGameActive(true);
            } else {
                setIsGameActive(false);
            }
        };

        document.addEventListener('visibilitychange', visibilityChange);

        // **Frame-independent movement using deltaTime**
        app.ticker.add((deltaTime) => {
            if (isGameActive) {

                for (let i = projectileSpawner.pumpkins.length - 1; i >= 0; i--) {
                    if (projectileSpawner.pumpkins[i].getPhase() === 4) {
                        projectileSpawner.projectiles.push(projectileSpawner.pumpkins[i]);
                        projectileSpawner.pumpkins.splice(i, 1); // Remove the pumpkin from the pumpkins array
                    }
                }
                
                character.update(projectileSpawner.projectiles, deltaTime);
                
                // Player dies
                if (character.collided) {
                    setIsGameActive(false);
                    isGameActive = false;

                    setIsGameOver(true);
                    app.renderer.background.color = '#ff0000'; 


                    // Score posting
                    if (localGameScore !== null && doItOnce) {
                        doItOnce = false;
                        PostScore(userId, localGameScore).catch(e => {
                            console.error('Error posting score: ', e);
                        }); 
                    }

                    return;
                }


                projectileSpawner.projectiles.forEach((projectile) => projectile.update(deltaTime));

                projectileSpawner.pumpkins.forEach((pumpkin) => pumpkin.update(deltaTime));


                const remainingProjectiles = projectileSpawner.projectiles.filter(projectile => projectile.sprite.parent !== null);
                const despawnedCount = projectileSpawner.projectiles.length - remainingProjectiles.length;

                // Uz kiekviena despawn'inta projectile pridedam taskus, jei dar neivyko collision
                if (!isGameOver && despawnedCount > 0) {
                    setScore(prevScore => {
                        const newScore = (prevScore === null) ? despawnedCount : prevScore + despawnedCount; // wtf is this
                        return Math.floor(newScore); // Kad score'as visada butu int'as (jei zinot geresni buda tam uztikrint pakeiskit)
                    });

                    localGameScore += despawnedCount;
                }

                projectileSpawner.projectiles = remainingProjectiles;
                
                if (isGameOver) {
                    app.stage.removeChild(backgroundSprite);
                }
                
            }
        });

        window.addEventListener('resize', () => {
            const scale = Math.min(window.innerWidth / app.view.width, window.innerHeight / app.view.height);
            
            character.getSprite().scale.set(scale);
            projectileSpawner.projectiles.forEach(projectile => {
                projectile.getSprite().scale.set(scale);
            });
        });

        return () => {
            projectileSpawner.clearIntervals();
            document.removeEventListener('visibilitychange', visibilityChange);
            document.body.removeEventListener("keydown", KeyboardKeys.onKeyDown);
            document.body.removeEventListener("keyup", KeyboardKeys.onKeyUp);
            app.destroy(true, { children: true });
        };
    }, []);

    //Rodo Score
    const handlePlayAgain = () => {
        window.location.reload();
    };

    return (
        <div ref={gameContainer} style={{ width: '100%', height: '100%' }}>
            <Score score={score} />
            {!isGameActive && <Replay score={score} onPlayAgain={handlePlayAgain} />}
        </div>
    );
};

export default Play;
