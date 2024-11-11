import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Watermelon } from "./utility/projectiles/projectileWatermelon";
import { Banana } from "./utility/projectiles/projectileBanana";
import { Pumpkin } from "./utility/projectiles/projectilePumpkin";
import { KeyboardKeys } from "./utility/keyboardKeys";
import { Character } from "./utility/character";
import Score from './utility/Score';
import Replay from './Replay/Replay';
import { PostScore } from "./PostScore";
import { Projectile } from "./utility/projectiles/projectile";
import { SpriteCache } from "./utility/spriteCache";

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

        let projectiles: Projectile[] = [];
        let pumpkins: Pumpkin[] = [];
        const characterBaseSpeed = 0.005; 
        const projectileBaseSpeed = 0.01; 

        let isGameActive = true;

        const projectileSpeed = projectileBaseSpeed * Math.min(app.view.width, app.view.height); 

        const initialInterval = 2500; // Initial spawn interval in milliseconds
    const minInterval = 500; // Minimum interval cap in milliseconds
    const difficultyFactor = 0.99; // How quickly the interval decreases (0.99 = 1% decrease per spawn)

    let currentIntervalWatermelon = initialInterval * 0.9;
    let currentIntervalBanana = initialInterval * 1.1;
    let currentIntervalPumpkin = initialInterval * 1.3;

    const spawnWatermelon = async () => {
        if (isGameActive) {
            const newWatermelon = new Watermelon(character.getSprite(), projectileSpeed);
            app.stage.addChild(newWatermelon.getSprite());
            app.stage.addChild(newWatermelon.getWarningSprite());
            newWatermelon.spawn(app.view.width, app.view.height);
            projectiles.push(newWatermelon);

            adjustInterval("watermelon");
        }
    };

    const spawnBanana = async () => {
        if (isGameActive) {
            const newBanana = new Banana(character.getSprite(), projectileSpeed);
            app.stage.addChild(newBanana.getSprite());
            app.stage.addChild(newBanana.getWarningSprite());
            newBanana.spawn(app.view.width, app.view.height);
            projectiles.push(newBanana);

            adjustInterval("banana");
        }
    };

    const spawnPumpkin = async () => {
        if (isGameActive) {
            const newPumpkin = new Pumpkin(character.getSprite(), projectileSpeed);
            app.stage.addChild(newPumpkin.getSprite());
            newPumpkin.spawn();
            pumpkins.push(newPumpkin);

            adjustInterval("pumpkin");
        }
    };
        let currentInterval: number;
        let interval;
        const adjustInterval = (type: string) => {
        

        // Select the appropriate interval variable based on the projectile type
        if (type === "watermelon") {
            currentInterval = currentIntervalWatermelon;
        } else if (type === "banana") {
            currentInterval = currentIntervalBanana;
        } else if (type === "pumpkin") {
            currentInterval = currentIntervalPumpkin;
        }

        currentInterval = Math.max(minInterval, currentInterval * difficultyFactor);

        // Add some randomness (±20% of the current interval)
        const randomOffset = Math.random() * 0.4 - 0.2;
        const adjustedInterval = currentInterval * (1 + randomOffset);

        // Update the interval variable for the specific type
        if (type === "watermelon") {
            currentIntervalWatermelon = adjustedInterval;
        } else if (type === "banana") {
            currentIntervalBanana = adjustedInterval;
        } else if (type === "pumpkin") {
            currentIntervalPumpkin = adjustedInterval;
        }

        // Clear and reset only the interval for the given type
        if (type === "watermelon") {
            clearInterval(watermelonInterval);
            watermelonInterval = setInterval(spawnWatermelon, adjustedInterval);
        } else if (type === "banana") {
            clearInterval(bananaInterval);
            bananaInterval = setInterval(spawnBanana, adjustedInterval);
        } else if (type === "pumpkin") {
            clearInterval(pumpkinInterval);
            pumpkinInterval = setInterval(spawnPumpkin, adjustedInterval);
        }
    };

    let bananaInterval = setInterval(spawnBanana, currentIntervalBanana);
    let pumpkinInterval = setInterval(spawnPumpkin, currentIntervalPumpkin);
    let watermelonInterval = setInterval(spawnWatermelon, currentIntervalWatermelon);



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
                const deltaSpeedChar = characterBaseSpeed * Math.min(app.view.width, app.view.height) * deltaTime;

                for (let i = pumpkins.length - 1; i >= 0; i--) {
                    if (pumpkins[i].getPhase() === 4) {
                        projectiles.push(pumpkins[i]);
                        pumpkins.splice(i, 1); // Remove the pumpkin from the pumpkins array
                    }
                }
                
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
                pumpkins.forEach((pumpkin) => pumpkin.update());

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
            clearInterval(watermelonInterval);
            clearInterval(bananaInterval);
            clearInterval(pumpkinInterval);
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
