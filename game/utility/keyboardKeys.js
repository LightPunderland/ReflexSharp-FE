export class KeyboardKeys{

    // Dictionary is kurio skaityti informacija, norint suzinoti ar mygtukas nuspaustas
    static keyboardState = {"a":false, "d":false, "s":false, "w":false};   

    static onKeyDown(ev) {

        if(ev.key == "a"){
            KeyboardKeys.keyboardState[ev.key] = true;
        }
        if(ev.key == "s"){
            KeyboardKeys.keyboardState[ev.key] = true;
        }
        if(ev.key == "w"){
            KeyboardKeys.keyboardState[ev.key] = true;
        }
        if(ev.key == "d"){
            KeyboardKeys.keyboardState[ev.key] = true;
        }
    }

    static onKeyUp(ev) {

        if(ev.key == "a"){
            KeyboardKeys.keyboardState[ev.key] = false;
        }
        if(ev.key == "s"){
            KeyboardKeys.keyboardState[ev.key] = false;
        }
        if(ev.key == "w"){
            KeyboardKeys.keyboardState[ev.key] = false;
        }
        if(ev.key == "d"){
            KeyboardKeys.keyboardState[ev.key] = false;
        }
    }

    //grazina kiek nuspausta mygtuku
    static numberOfKeysPressed(){
        //FIXME: EINA LOOPINTI IR BE SITO FIXED KEYS ARRAY
        let keys = ["a","s","d","w"];
        let pressedKeys = 0;

        for(let i = 0;i<keys.length;i++){
            if(KeyboardKeys.keyboardState[keys[i]]){
                pressedKeys += 1;
            }
        }

        return pressedKeys;
    }

    //grazina true, jei bent vienas mygtukas nuspaustas
    static anyKeyPressed(){
        //FIXME: EINA LOOPINTI IR BE SITO FIXED KEYS ARRAY
        let keys = ["a","s","d","w"];

        for(let i = 0;i<keys.length;i++){
            if(KeyboardKeys.keyboardState[keys[i]]){
                return true;
            }
        }

        return false;
    }
}