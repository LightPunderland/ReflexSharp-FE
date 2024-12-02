import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { KeyboardKeys } from "./utility/keyboardKeys";
import { Character } from "./utility/character";
import Score from './utility/Score';
import Xp from './utility/Xp';
import Gold from './utility/Gold';
import Replay from './Replay/Replay';
import { PostScore } from "./PostScore";
import { rewardGoldXp } from "./PostScore";
import { SpriteCache } from "./utility/spriteCache";
import { ProjectileSpawner } from "./utility/projectileSpawner";
import RankUpMessage from './RankUpMessage/RankUpMessage';

const characterBaseSpeed = 0.1; // error?

const Play: React.FC<{userId: string}> = ({ userId }) => {
    let doItOnce = true; // DO NOT MAKE REMOVE THIS, WILL BREAK POSTS, NEED TO FIX IN TESTING

    const gameContainer = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    
    const [isGameActive, setIsGameActive] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [xp, setXp] = useState<number>(0);
    const [gold, setGold] = useState<number>(0);
    const [playAgain, setPlayAgain] = useState<number>(0);

    // Audio setup
    const [gameAudio] = useState(() => {
        const audio = new Audio('/host/Audio/67');
        audio.volume = 0.1;
        audio.loop = true;
        return audio;
    });

    const [deathSound] = useState(() => {
        const audio = new Audio('/host/Audio/68');
        audio.volume = 0.1;
        return audio;
    });

    const [dodgeSound] = useState(() => {
        const audio = new Audio('/host/Audio/69');
        audio.volume = 0.1;
        return audio;
    });

    useEffect(() => {
        gameAudio.play();
        return () => {
            gameAudio.pause();
            gameAudio.currentTime = 0;
        };
    }, [playAgain]);

    useEffect(() => {
        // Singletonas, SpriteCache.instance po sito bus uzloadinta visur
        // Davai chebra tik nepanaikinkit sitos eilutes, nors kintamasis nenaudojamas vistiek uzloadina cia viska i memory
        const spriteCache: SpriteCache = SpriteCache.instance; 

        const app = new PIXI.Application({ antialias: true, backgroundColor: 0x1099bb, resizeTo: window });
        appRef.current = app;
        
        const backgroundSprite = new PIXI.Sprite(SpriteCache.instance.backgroundTexture);

        //useState scoras returnina rezultatus tiktai kitam renderi, o mes canvas nenorim rerenderinti
        let localGameScore = 0
        let localGameGold = 0
        let localGameXp = 0

        backgroundSprite.width = app.view.width;
        backgroundSprite.height = app.view.height;
        backgroundSprite.anchor.set(0.5);
        backgroundSprite.position.set(app.view.width / 2, app.view.height / 2);

        console.log(window.innerWidth, window.innerHeight);

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

        document.body.addEventListener("keydown", KeyboardKeys.onKeyDown);
        document.body.addEventListener("keyup", KeyboardKeys.onKeyUp);

        const projectileSpawner = new ProjectileSpawner(app, character);

        let isGameActive = true;

        const visibilityChange = () => {
            isGameActive = document.visibilityState === 'visible';

            if (document.visibilityState === 'visible') {
                setIsGameActive(true);
                gameAudio.play();
            } else {
                setIsGameActive(false);
                gameAudio.pause();
            }
        };

        document.addEventListener('visibilitychange', visibilityChange);

        let timeElapsed = 0;
  
        const loadingText = new PIXI.Text("Loading game...");
        loadingText.x = app.view.width/2 - loadingText.width/2;
        loadingText.y = app.view.height/3;
        let gameLoaded = false;

        // **Frame-independent movement using deltaTime**
        app.ticker.add((deltaTime) => {
            if (!SpriteCache.instance.texturesLoaded()){
                app.stage.addChild(loadingText);
            }
            else if (isGameActive) {
                timeElapsed += 0.01;  // Convert deltaTime from ms to seconds
                localGameXp = 1.001 * Math.pow(timeElapsed, 1.3);
                setXp(Math.floor(localGameXp));
                const deltaSpeedChar = characterBaseSpeed * Math.min(app.view.width, app.view.height) * deltaTime;
                if(!gameLoaded){
                    gameLoaded = true
                    app.stage.removeChild(loadingText);
                    character.spawnCharacter(app.view.width, app.view.height);
                }

                for (let i = projectileSpawner.pumpkins.length - 1; i >= 0; i--) {
                    if (projectileSpawner.pumpkins[i].getPhase() === 4) {
                        projectileSpawner.projectiles.push(projectileSpawner.pumpkins[i]);
                        projectileSpawner.pumpkins.splice(i, 1); // Remove the pumpkin from the pumpkins array
                    }
                }
                
                character.update(projectileSpawner.projectiles, projectileSpawner.coins, deltaTime);
                
                if (character.collected){
                    localGameGold += 1;
                    setGold(localGameGold);
                    character.collected = false;
                }

                // Player dies
                if (character.collided) {
                    setIsGameActive(false);
                    isGameActive = false;
                    setIsGameOver(true);
                    deathSound.play();  
                    gameAudio.pause(); 

                    // Score posting
                    if (localGameScore !== null && doItOnce) {
                        doItOnce = false;
                        console.log('Posting score: ', localGameXp);
                        PostScore(userId, localGameScore).catch(e => {
                            console.error('Error posting score: ', e);    
                        }); 
                        rewardGoldXp(userId, Math.floor(localGameGold), Math.floor(localGameXp)).catch(e => {
                            console.error('Error rewarding gold and xp: ', e);
                        });
                    }

                    app.ticker.stop();
                    return;
                }

                projectileSpawner.projectiles.forEach((projectile) => projectile.update(deltaTime));
                projectileSpawner.pumpkins.forEach((pumpkin) => pumpkin.update(deltaTime));
                projectileSpawner.coins.forEach((coin) => coin.update(deltaTime));

                const remainingProjectiles = projectileSpawner.projectiles.filter(projectile => projectile.sprite.parent !== null);
                const despawnedCount = projectileSpawner.projectiles.length - remainingProjectiles.length;

                // Uz kiekviena despawn'inta projectile pridedam taskus, jei dar neivyko collision
                if (!isGameOver && despawnedCount > 0) {
                    dodgeSound.play();  // Play dodge sound
                    setScore(prevScore => {
                        const newScore = (prevScore === null) ? despawnedCount : prevScore + despawnedCount; // wtf is this
                        return Math.floor(newScore); // Kad score'as visada butu int'as (jei zinot geresni buda tam uztikrint pakeiskit)
                    });

                    localGameScore += despawnedCount;
                   
                }

                projectileSpawner.projectiles = remainingProjectiles;
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
            gameAudio.pause();
            app.destroy(true, { children: true });
        };
    }, [playAgain]);

    //Rodo Score
    const handlePlayAgain = () => {
        setIsGameActive(true);
        setIsGameOver(false);
        setPlayAgain(playAgain + 1);
        setScore(null);
        setGold(0);
        gameAudio.currentTime = 0;
        gameAudio.play();
    };

    return (
        <div ref={gameContainer} style={{ width: '100%', height: '100%' }}>
            <Score score={score} />
            <Xp xp={xp} />
            <Gold gold={gold} />
            {!isGameActive && <Replay score={score} onPlayAgain={handlePlayAgain} />}
        </div>
    );
};

export default Play;