import { Watermelon } from "./utility/projectiles/projectileWatermelon.js";

import { KeyboardKeys } from "./utility/keyboardKeys.js";

import { Character } from "./utility/character.js";

// Create a new application
const app = new PIXI.Application();

// Initialize the application
await app.init({ antialias: true, background: '#1099bb', resizeTo:window });

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

const character = new Character();
await character.loadSprite();

app.stage.addChild(character.getSprite());

// Pridedi keyboard listeneri, kad dictionary updatintu
document.body.addEventListener("keydown", KeyboardKeys.onKeyDown);
document.body.addEventListener("keyup", KeyboardKeys.onKeyUp);

//Sviediniu masyvas
let projectiles = [];
//Sviediniu greitis
const projectileSpeed = 5; 
// Intervalas, kas kiek sviedinys atsiras
let spawnInterval = 2000; 

await PIXI.Assets.load('./assets/watermelon.png');

function spawnProjectile() {
    //Atspawninam nauja sviedini ir pridedam i masyva
    let newProjectile = new Watermelon(character.getSprite(), projectileSpeed);

    //Prie stage pridedame sprita
    app.stage.addChild(newProjectile.getSprite());

    //Tada jam priskiria koordinates ir atspawnina
    newProjectile.spawn(app.view.width, app.view.height);

    //Prideda projectile prie projectile masyvo
    projectiles.push(newProjectile);
}

// Call'ina spawnProjectile kas spawnInterval
setInterval(spawnProjectile, spawnInterval);

// Add a ticker callback
app.ticker.add((ticker) => {
    character.update(ticker.deltaTime);

    //update'ina visus sviedinius
    projectiles.forEach((projectile) => {
        projectile.update();
    });
});



