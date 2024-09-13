import { MovementDirection } from "./movementDirection.js";

import { MovementPhysics } from "./movementPhysics.js";

import { MovementMomentum } from "./movementMomentum.js";

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
    //updateCharacter(ticker.deltaTime)

    updateCharacterMomentum(ticker.deltaTime);
    momentumDebugLog();
    moveCharacter();
    characterDirectionChange = false;
});

function momentumDebugLog(){
    console.log("upMomentum" + movementMomentum.upMomentum);
    console.log("rightMomentum" + movementMomentum.rightMomentum);
    console.log("downMomentum" + movementMomentum.downMomentum);
    console.log("leftMomentum" +movementMomentum.leftMomentum);
}

//greitis kuri characteris gali pasiekti max (pixeliais per tick)
const maxSpeed = 10;

//laikas per kuri characteris pasiekia maksimalu savo greiti
const timeMaxSpeedReach = 20;

//laikas, kiek laiko praejo nuo judejimo pradzios
let timeAfterMovement = 0;

//laikas nuo kurio pradeti kai characteris prarado savo inercija ir jis ja is naujo buildinasi
const timeAfterMovementReset = 8;

//konstanta reikalinga sumazinti characterio greiti judant istrizai
const reduceDiagonalSpeed = 0.707

//inercija is karto neisnyksta tad sita value sukuria kaip ir slydimo efekta 
//(jeigu sita value nustatai i labai maza characteris is tiesu slidineja -> feature?)
const timeReduceRate = 0.8

//bus true, kai characteris keite savo judejimo trajaktorija
let characterDirectionChange = false;

//klase kurioje saugoma i kuria puse juda characteris
let movementDirection = new MovementDirection();

let movementMomentum = new MovementMomentum();

function updateCharacterMomentum(tickerDeltaTime){
    if(numberOfKeysPressed() == 2){
        if(keyboardState["a"] && keyboardState["w"]){
            movementMomentum.gainLeftMomentum(tickerDeltaTime);
            movementMomentum.gainUpMomentum(tickerDeltaTime);
        }
        else if(keyboardState["w"] && keyboardState["d"]){
            movementMomentum.gainUpMomentum(tickerDeltaTime);
            movementMomentum.gainRightMomentum(tickerDeltaTime);
        }
        else if(keyboardState["d"] && keyboardState["s"]){
            movementMomentum.gainRightMomentum(tickerDeltaTime);
            movementMomentum.gainDownMomentum(tickerDeltaTime);
        }
        else if(keyboardState["s"] && keyboardState["a"]){
            movementMomentum.gainDownMomentum(tickerDeltaTime);
            movementMomentum.gainLeftMomentum(tickerDeltaTime);
        }

        return;
    }

    if(keyboardState["a"]){
        movementMomentum.gainLeftMomentum(tickerDeltaTime);
    }
    if(keyboardState["d"]){
        movementMomentum.gainRightMomentum(tickerDeltaTime);
    }
    if(keyboardState["w"]){
        movementMomentum.gainUpMomentum(tickerDeltaTime);
    }
    if(keyboardState["s"]){
        movementMomentum.gainDownMomentum(tickerDeltaTime);
    }

    // if(!anyKeyPressed()){
    //     movementMomentum.loseMomentum();
    // }
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

//funkcija kuri nusprendzia ar judinti characteri
function updateCharacter(tickerDeltaTime){

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

        moveCharacter();
    }
    else{
        //jeigu joks klaviaturos mygtukas nenuspaustas inercija is karto nepranyksta characteris dar biski juda pats is inercijos
        
        if(timeAfterMovement - timeReduceRate > 0){
            timeAfterMovement -= timeReduceRate;

            moveCharacter();
        }
        else{
            timeAfterMovement = 0;
        }
    }
}

//funkcija pajudins characteri
function moveCharacter(){
    if(movementDirection.up){
        sprite.y -= MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.upMomentum, 1);
    }
    else if(movementDirection.right){
        sprite.x += MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.rightMomentum, 1);
    }
    else if(movementDirection.down){
        sprite.y += MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.downMomentum, 1);
    }
    else if(movementDirection.left){
        sprite.x -= MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.leftMomentum, 1);
    }
    else if(movementDirection.upright){
        sprite.y -= MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.upMomentum, reduceDiagonalSpeed);
        sprite.x += MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.rightMomentum, reduceDiagonalSpeed);
    }
    else if(movementDirection.downright){
        sprite.x += MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.rightMomentum, reduceDiagonalSpeed);
        sprite.y += MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.downMomentum, reduceDiagonalSpeed);
    }
    else if(movementDirection.downleft){
        sprite.y += MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.downMomentum, reduceDiagonalSpeed);
        sprite.x -= MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.leftMomentum, reduceDiagonalSpeed);
    }
    else if(movementDirection.upleft){
        sprite.x -= MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.leftMomentum, reduceDiagonalSpeed);
        sprite.y -= MovementPhysics.calculateSpeed(maxSpeed, movementMomentum.upMomentum, reduceDiagonalSpeed);
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

