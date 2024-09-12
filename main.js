import { MovementDirection } from "./movementDirection.js";

// Create a new application
const app = new PIXI.Application();

// Initialize the application
await app.init({ antialias: true, background: '#1099bb', resizeTo:window });

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Create the sprite and add it to the stage
await PIXI.Assets.load('sample4.png');
let sprite = PIXI.Sprite.from('sample4.png');
app.stage.addChild(sprite);

// Dictionary is kurio skaityti informacija, norint suzinoti ar mygtukas nuspaustas
let keyboardState = {"a":false, "d":false, "s":false, "w":false};

// Pridedi keyboard listeneri, kad dictionary updatintu
document.body.addEventListener("keydown", onKeyDown);
document.body.addEventListener("keyup", onKeyUp);

// Add a ticker callback
app.ticker.add((ticker) => {
    setCharacterMovementDirection();
    moveCharacter(ticker.deltaTime)
    characterDirectionChange = false;
});

//greitis kuri characteris gali pasiekti max (pixeliais per tick)
const maxSpeed = 6;

//laikas per kuri characteris pasiekia maksimalu savo greiti
const timeMaxSpeedReach = 20;

//laikas, kiek laiko praejo nuo judejimo pradzios
let timeAfterMovement = 0;

//laikas nuo kurio pradeti kai characteris prarado savo inercija ir jis ja is naujo buildinasi
const timeAfterMovementReset = 8;

//bus true, kai characteris keite savo judejimo trajaktorija
let characterDirectionChange = false;

//klase kurioje saugoma i kuria puse juda characteris
let movementDirection = new MovementDirection();

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

function moveCharacter(tickerDeltaTime){

    //kai pakeicia characteris direction, jis praranda inercijos
    if(characterDirectionChange){
        timeAfterMovement = timeAfterMovementReset;
    }

    if(anyKeyPressed()){

        //jeigu timeAfterMovement hittino timeMaxSpeedReach, tai nebedidinti
        if(timeAfterMovement + tickerDeltaTime > timeMaxSpeedReach){
            timeAfterMovement = timeMaxSpeedReach;
        }
        else{
            timeAfterMovement += tickerDeltaTime
        }

        //konstanta reikalinga sumazinti characterio greiti judant istrizai
        const reduceDiagonalSpeed = 0.707

        if(movementDirection.up){
            sprite.y -= maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach));
        }
        else if(movementDirection.right){
            sprite.x += maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach));
        }
        else if(movementDirection.down){
            sprite.y += maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach));
        }
        else if(movementDirection.left){
            sprite.x -= maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach));
        }
        else if(movementDirection.upright){
            sprite.y -= maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
            sprite.x += maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
        }
        else if(movementDirection.downright){
            sprite.x += maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
            sprite.y += maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
        }
        else if(movementDirection.downleft){
            sprite.y += maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
            sprite.x -= maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
        }
        else if(movementDirection.upleft){
            sprite.x -= maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
            sprite.y -= maxSpeed*(Math.sqrt(timeAfterMovement/timeMaxSpeedReach)*reduceDiagonalSpeed);
        }
    }
    else{
        //jeigu joks klaviaturos mygtukas nenuspaustas, resetina inercija
        timeAfterMovement = 0;
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
        characterDirectionChange = true;
    }
    if(ev.key == "s"){
        keyboardState[ev.key] = false;
        characterDirectionChange = true;
    }
    if(ev.key == "w"){
        keyboardState[ev.key] = false;
        characterDirectionChange = true;
    }
    if(ev.key == "d"){
        keyboardState[ev.key] = false;
        characterDirectionChange = true;
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

