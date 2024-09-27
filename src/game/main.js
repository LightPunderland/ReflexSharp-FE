import { Watermelon } from "./utility/projectiles/projectileWatermelon.js";

import { KeyboardKeys } from "./utility/keyboardKeys.js";

import { Character } from "./utility/character.js";

// Create a new application
const app = new PIXI.Application();

// Initialize the application
await app.init({ antialias: true, background: '#1099bb', resizeTo: window });

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

const character = new Character();
await character.loadSprite();

app.stage.addChild(character.getSprite());

//atspawnina characteri viduri ekrano
character.spawnCharacter(app.view.width, app.view.height);

// Pridedi keyboard listeneri, kad dictionary updatintu
document.body.addEventListener("keydown", KeyboardKeys.onKeyDown);
document.body.addEventListener("keyup", KeyboardKeys.onKeyUp);

//Sviediniu masyvas
let projectiles = [];
//Sviediniu greitis
const projectileSpeed = 5; 
// Intervalas, kas kiek sviedinys atsiras
let spawnInterval = 2000; 
// Tikrina ar zaidimas aktyvus
let isGameActive = true;

await PIXI.Assets.load('./assets/watermelon.png');

function spawnProjectile() {
    // Tikrina ar zaidimas aktyvus
    if (isGameActive) {
        //Atspawninam nauja sviedini ir pridedam i masyva
        let newProjectile = new Watermelon(character.getSprite(), projectileSpeed);

        //Prie stage pridedame sprita
        app.stage.addChild(newProjectile.getSprite());

        //Tada jam priskiria koordinates ir atspawnina
        newProjectile.spawn(app.view.width, app.view.height);

        //Prideda projectile prie projectile masyvo
        projectiles.push(newProjectile);
    }
}

// Keicia isGameActive state'a priklausant nuo to ar zaidimas aktyvus
function visibilityChange() {
    if (document.visibilityState === 'hidden') {
        isGameActive = false; 
    } else if (document.visibilityState === 'visible') {
        isGameActive = true; 
    }
}

document.addEventListener('visibilitychange', visibilityChange);

// Call'ina spawnProjectile kas spawnInterval
setInterval(spawnProjectile, spawnInterval);

// Add a ticker callback
app.ticker.add((ticker) => {
    // Tikrina ar app'as aktyvus
    if (isGameActive){
        character.update(ticker.deltaTime, projectiles);

        if(character.collided){
            app.renderer.background.color = '#ff0000';
        }

        //update'ina visus sviedinius
        projectiles.forEach((projectile) => {
            projectile.update();
            
        });

        //Panaikina is masyvo projectiles, kurie buvo istrinti
        projectiles = projectiles.filter(projectile => projectile.sprite.parent !== null);

        //console.log("Number of projectiles on screen:", projectiles.length);
    }
});



