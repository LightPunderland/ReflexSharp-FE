import { MovementDirection } from "./utility/characterMovement/movementDirection.js";

import { MovementPhysics } from "./utility/characterMovement/movementPhysics.js";

import { MovementMomentum } from "./utility/characterMovement/movementMomentum.js";

// Create a new application
const app = new PIXI.Application();

// Initialize the application
await app.init({ antialias: true, background: '#1099bb', resizeTo:window });

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Create the sprite and add it to the stage
await PIXI.Assets.load('./assets/sample4.png');
let sprite = PIXI.Sprite.from('./assets/sample4.png');
app.stage.addChild(sprite);

// Dictionary is kurio skaityti informacija, norint suzinoti ar mygtukas nuspaustas
// JEIGU REIKIA SUZINOTI CHARACTERIO JUDEJIMO KRYPTI NAUDOTI `MovementDirection` NE SITA
let keyboardState = {"a":false, "d":false, "s":false, "w":false};

// Pridedi keyboard listeneri, kad dictionary updatintu
document.body.addEventListener("keydown", onKeyDown);
document.body.addEventListener("keyup", onKeyUp);

// Add a ticker callback
app.ticker.add((ticker) => {
    setCharacterMovementDirection();
    updateCharacterMomentum(ticker.deltaTime);
    momentumDebugLog();
    moveCharacter();
});

//konstanta reikalinga sumazinti characterio greiti judant istrizai
const reduceDiagonalSpeed = 0.707

//klase kurioje saugoma i kuria puse juda characteris
let movementDirection = new MovementDirection();

//klase kurioje saugoma 4 krypciu inercijos jegos veikiancio characteri
let movementMomentum = new MovementMomentum();

//funkcija turi buti kvieciama every tick, kad pagal judejimo krypti apskaiciuotu inercija
function updateCharacterMomentum(tickerDeltaTime){

    if(movementDirection.upleft){
        movementMomentum.gainLeftMomentum(tickerDeltaTime);
        movementMomentum.gainUpMomentum(tickerDeltaTime);
    }
    else if(movementDirection.upright){
        movementMomentum.gainUpMomentum(tickerDeltaTime);
        movementMomentum.gainRightMomentum(tickerDeltaTime);
    }
    else if(movementDirection.downright){
        movementMomentum.gainRightMomentum(tickerDeltaTime);
        movementMomentum.gainDownMomentum(tickerDeltaTime);
    }
    else if(movementDirection.downleft){
        movementMomentum.gainDownMomentum(tickerDeltaTime);
        movementMomentum.gainLeftMomentum(tickerDeltaTime);
    }
    else if(movementDirection.left){
        movementMomentum.gainLeftMomentum(tickerDeltaTime);

        movementMomentum.resetDownMomentum();
        movementMomentum.resetUpMomentum();
    }
    else if(movementDirection.right){
        movementMomentum.gainRightMomentum(tickerDeltaTime);

        movementMomentum.resetDownMomentum();
        movementMomentum.resetUpMomentum();
    }
    else if(movementDirection.up){
        movementMomentum.gainUpMomentum(tickerDeltaTime);

        movementMomentum.resetRightMomentum();
        movementMomentum.resetLeftMomentum();
    }
    else if(movementDirection.down){
        movementMomentum.gainDownMomentum(tickerDeltaTime);

        movementMomentum.resetRightMomentum();
        movementMomentum.resetLeftMomentum();
    }

    if(!anyKeyPressed()){
        movementMomentum.loseMomentum();
    }
}

//pagal klaviaturos inputa nustato characterio judejimo direction
function setCharacterMovementDirection(){
    if(numberOfKeysPressed() == 2){
        if(keyboardState["a"] && keyboardState["w"]){
            movementDirection.upleft = true;
        }
        else if(keyboardState["w"] && keyboardState["d"]){
            movementDirection.upright = true;
        }
        else if(keyboardState["d"] && keyboardState["s"]){
            movementDirection.downright = true;
        }
        else if(keyboardState["s"] && keyboardState["a"]){
            movementDirection.downleft = true;
        }

        return;
    }

    if(keyboardState["a"]){
        movementDirection.left = true;
    }
    if(keyboardState["d"]){
        movementDirection.right = true;
    }
    if(keyboardState["w"]){
        movementDirection.up = true;
    }
    if(keyboardState["s"]){
        movementDirection.down = true;
    }
}

//funkcija kvieciama every tick, judina characteri pagal ji veikiancias inercijos jegas
function moveCharacter(){
    if(movementDirection.up){
        sprite.y -= MovementPhysics.calculateSpeed(movementMomentum.upMomentum, 1);
    }
    else if(movementDirection.right){
        sprite.x += MovementPhysics.calculateSpeed(movementMomentum.rightMomentum, 1);
    }
    else if(movementDirection.down){
        sprite.y += MovementPhysics.calculateSpeed(movementMomentum.downMomentum, 1);
    }
    else if(movementDirection.left){
        sprite.x -= MovementPhysics.calculateSpeed(movementMomentum.leftMomentum, 1);
    }
    else if(movementDirection.upright){
        sprite.y -= MovementPhysics.calculateSpeed(movementMomentum.upMomentum, reduceDiagonalSpeed);
        sprite.x += MovementPhysics.calculateSpeed(movementMomentum.rightMomentum, reduceDiagonalSpeed);
    }
    else if(movementDirection.downright){
        sprite.x += MovementPhysics.calculateSpeed(movementMomentum.rightMomentum, reduceDiagonalSpeed);
        sprite.y += MovementPhysics.calculateSpeed(movementMomentum.downMomentum, reduceDiagonalSpeed);
    }
    else if(movementDirection.downleft){
        sprite.y += MovementPhysics.calculateSpeed(movementMomentum.downMomentum, reduceDiagonalSpeed);
        sprite.x -= MovementPhysics.calculateSpeed(movementMomentum.leftMomentum, reduceDiagonalSpeed);
    }
    else if(movementDirection.upleft){
        sprite.x -= MovementPhysics.calculateSpeed(movementMomentum.leftMomentum, reduceDiagonalSpeed);
        sprite.y -= MovementPhysics.calculateSpeed(movementMomentum.upMomentum, reduceDiagonalSpeed);
    }
}

function onKeyDown(ev) {

    if(ev.key == "a"){
        keyboardState[ev.key] = true;
    }
    if(ev.key == "s"){
        keyboardState[ev.key] = true;
    }
    if(ev.key == "w"){
        keyboardState[ev.key] = true;
    }
    if(ev.key == "d"){
        keyboardState[ev.key] = true;
    }
}

function onKeyUp(ev) {

    if(ev.key == "a"){
        keyboardState[ev.key] = false;
    }
    if(ev.key == "s"){
        keyboardState[ev.key] = false;
    }
    if(ev.key == "w"){
        keyboardState[ev.key] = false;
    }
    if(ev.key == "d"){
        keyboardState[ev.key] = false;
    }
}

//grazina kiek nuspausta mygtuku
function numberOfKeysPressed(){
    let keys = ["a","s","d","w"];
    let pressedKeys = 0;

    for(let i = 0;i<keys.length;i++){
        if(keyboardState[keys[i]]){
            pressedKeys += 1;
        }
    }

    return pressedKeys;
}

//grazina true, jei bent vienas mygtukas nuspaustas
function anyKeyPressed(){
    let keys = ["a","s","d","w"];

    for(let i = 0;i<keys.length;i++){
        if(keyboardState[keys[i]]){
            return true;
        }
    }

    return false;
}

//debugginimo funkcija
function momentumDebugLog(){
    console.log("upMomentum" + movementMomentum.upMomentum);
    console.log("rightMomentum" + movementMomentum.rightMomentum);
    console.log("downMomentum" + movementMomentum.downMomentum);
    console.log("leftMomentum" +movementMomentum.leftMomentum);
}

