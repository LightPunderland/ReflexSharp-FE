import * as PIXI from "pixi.js";
import { Watermelon } from "./projectiles/projectileWatermelon";
import { Projectile } from "./projectiles/projectile";
import { Character } from "./character";
import { Banana } from "./projectiles/projectileBanana";
import { Pumpkin } from "./projectiles/projectilePumpkin";

export class ProjectileSpawner{
    initialInterval = 2500; // Initial spawn interval in milliseconds
    minInterval = 500; // Minimum interval cap in milliseconds
    difficultyFactor = 0.99; // How quickly the interval decreases (0.99 = 1% decrease per spawn)

    currentIntervalWatermelon = this.initialInterval * 0.9;
    currentIntervalBanana = this.initialInterval * 1.1;
    currentIntervalPumpkin = this.initialInterval * 1.3;

    isGameActive = true;

    app: undefined | PIXI.Application = undefined;
    projectiles: Projectile[] = [];
    character: Character = new Character();
    pumpkins: Pumpkin[] = [];
    bananaInterval: number = 0;
    pumpkinInterval: number = 0;
    watermelonInterval: number = 0;


    constructor(app: PIXI.Application, character: Character){
        this.app = app 
        this.character = character;

        this.bananaInterval = setInterval(this.spawnBanana, this.currentIntervalBanana);
        this.pumpkinInterval = setInterval(this.spawnPumpkin, this.currentIntervalPumpkin);
        this.watermelonInterval = setInterval(this.spawnWatermelon, this.currentIntervalWatermelon);
    }

    spawnWatermelon = async () => {
        if(!this.app){
            return;
        }
        if (this.isGameActive) {
            const newWatermelon = new Watermelon(this.character.getSprite());
            this.app.stage.addChild(newWatermelon.getSprite());
            this.app.stage.addChild(newWatermelon.getWarningSprite());
            newWatermelon.spawn(this.app.view.width, this.app.view.height);
            this.projectiles.push(newWatermelon);

            this.adjustInterval("watermelon");
        }
    };

    spawnBanana = async () => {
        if(!this.app){
            return;
        }
        console.log("Spawning banana wow!")
        if (this.isGameActive) {
            const newBanana = new Banana(this.character.getSprite());
            this.app.stage.addChild(newBanana.getSprite());
            this.app.stage.addChild(newBanana.getWarningSprite());
            newBanana.spawn(this.app.view.width, this.app.view.height);
            this.projectiles.push(newBanana);

            this.adjustInterval("banana");
        }
    };

    spawnPumpkin = async () => {
        if(!this.app){
            return;
        }
        console.log("Spawning pumpkin wow!")
        if (this.isGameActive) {
            const newPumpkin = new Pumpkin(this.character.getSprite());
            this.app.stage.addChild(newPumpkin.getSprite());
            newPumpkin.spawn();
            this.pumpkins.push(newPumpkin);

            this.adjustInterval("pumpkin");
        }
    };



    currentInterval: number = 0;
    adjustInterval = (type: string) => {
    
        // Select the appropriate interval variable based on the projectile type
        if (type === "watermelon") {
            this.currentInterval = this.currentIntervalWatermelon;
        } else if (type === "banana") {
            this.currentInterval = this.currentIntervalBanana;
        } else if (type === "pumpkin") {
            this.currentInterval = this.currentIntervalPumpkin;
        }

        this.currentInterval = Math.max(this.minInterval, this.currentInterval * this.difficultyFactor);

        // Add some randomness (±20% of the current interval)
        const randomOffset = Math.random() * 0.4 - 0.2;
        const adjustedInterval = this.currentInterval * (1 + randomOffset);

        // Update the interval variable for the specific type
        if (type === "watermelon") {
            this.currentIntervalWatermelon = adjustedInterval;
        } else if (type === "banana") {
            this.currentIntervalBanana = adjustedInterval;
        } else if (type === "pumpkin") {
            this.currentIntervalPumpkin = adjustedInterval;
        }

        // Clear and reset only the interval for the given type
        if (type === "watermelon") {
            clearInterval(this.watermelonInterval);
            this.watermelonInterval = setInterval(this.spawnWatermelon, adjustedInterval);
        } else if (type === "banana") {
            clearInterval(this.bananaInterval);
            this.bananaInterval = setInterval(this.spawnBanana, adjustedInterval);
        } else if (type === "pumpkin") {
            clearInterval(this.pumpkinInterval);
            this.pumpkinInterval = setInterval(this.spawnPumpkin, adjustedInterval);
        }
    };

    clearIntervals(){
        clearInterval(this.watermelonInterval);
        clearInterval(this.bananaInterval);
        clearInterval(this.pumpkinInterval);
    }
}