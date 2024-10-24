import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Watermelon } from "./utility/projectiles/projectileWatermelon";
import { Banana } from "./utility/projectiles/projectileBanana";
import { KeyboardKeys } from "./utility/keyboardKeys";
import { Character } from "./utility/character";
import Score from './utility/Score';
import Replay from './Replay/Replay';
import { PostScore } from "./PostScore";

import { Projectile } from "./utility/projectiles/projectile";

const Play: React.FC<{userId: string}> = ({ userId }) => {

    let doItOnce = true; // DO NOT MAKE REMOVE THIS, WILL BREAK POSTS, NEED TO FIX IN TESTING

    const gameContainer = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);

    const [isGameActive, setIsGameActive] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        const app = new PIXI.Application({ antialias: true, backgroundColor: 0x1099bb, resizeTo: window });
        appRef.current = app;
        
        const backgroundTexture = PIXI.Texture.from('src/Play/background.png');
        const backgroundSprite = new PIXI.Sprite(backgroundTexture);

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

              if (document.visibilityState === 'visible') {
                setIsGameActive(true);
            } else {
                setIsGameActive(false);
            }
        };

        document.addEventListener('visibilitychange', visibilityChange);
        const projectileSpawner = setInterval(spawnProjectile, spawnInterval);
        

        // **Frame-independent movement using deltaTime**
        app.ticker.add((deltaTime) => {
            if (isGameActive) {
                const deltaSpeedChar = characterBaseSpeed * Math.min(app.view.width, app.view.height) * deltaTime;


                character.update(deltaTime, projectiles, deltaSpeedChar);
                
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

                projectiles.forEach((projectile) => projectile.update());

                const remainingProjectiles = projectiles.filter(projectile => projectile.sprite.parent !== null);
                const despawnedCount = projectiles.length - remainingProjectiles.length;

                // Uz kiekviena despawn'inta projectile pridedam taskus, jei dar neivyko collision
                if (!isGameOver && despawnedCount > 0) {
                    setScore(prevScore => {
                        const newScore = (prevScore === null) ? despawnedCount : prevScore + despawnedCount; // wtf is this
                        return Math.floor(newScore); // Kad score'as visada butu int'as (jei zinot geresni buda tam uztikrint pakeiskit)
                    });

                    localGameScore += despawnedCount;
                }
                projectiles = remainingProjectiles;

                
                if (isGameOver) {
                    app.stage.removeChild(backgroundSprite);
                }
                
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
