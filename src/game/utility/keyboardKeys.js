export class KeyboardKeys{

    // Dictionary is kurio skaityti informacija, norint suzinoti ar mygtukas nuspaustas
    static keyboardState = {"KeyA":false, "KeyD":false, "KeyS":false, "KeyW":false};   

    static onKeyDown(ev) {
        switch(ev.code){
            case "KeyA":
                KeyboardKeys.keyboardState[ev.code] = true;
                break;
            case "KeyS":
                KeyboardKeys.keyboardState[ev.code] = true;
                break;
            case "KeyW":
                KeyboardKeys.keyboardState[ev.code] = true;
                break;
            case "KeyD":
                KeyboardKeys.keyboardState[ev.code] = true;
                break;
        }
    }

    static onKeyUp(ev) {
        switch(ev.code){
            case "KeyA":
                KeyboardKeys.keyboardState[ev.code] = false;
                break;
            case "KeyS":
                KeyboardKeys.keyboardState[ev.code] = false;
                break;
            case "KeyW":
                KeyboardKeys.keyboardState[ev.code] = false;
                break;
            case "KeyD":
                KeyboardKeys.keyboardState[ev.code] = false;
                break;
        }
    }

    //grazina kiek nuspausta mygtuku
    static numberOfKeysPressed(){
        let pressedKeys = 0;

        for(const [key, isPressed] of Object.entries(KeyboardKeys.keyboardState)){
            if(isPressed){
                pressedKeys += 1;
            }
        }

        return pressedKeys;
    }

    //grazina true, jei bent vienas mygtukas nuspaustas
    static anyKeyPressed(){
        for(const [key, isPressed] of Object.entries(KeyboardKeys.keyboardState)){
            if(isPressed){
                return true;
            }
        }

        return false;
    }
}