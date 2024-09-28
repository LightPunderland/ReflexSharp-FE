export class KeyboardKeys {
    static keyboardState: { [key: string]: boolean } = { "KeyA": false, "KeyD": false, "KeyS": false, "KeyW": false };

    static onKeyDown(ev: KeyboardEvent) {
        if (ev.code in KeyboardKeys.keyboardState) {
            KeyboardKeys.keyboardState[ev.code] = true;
        }
    }

    static onKeyUp(ev: KeyboardEvent) {
        if (ev.code in KeyboardKeys.keyboardState) {
            KeyboardKeys.keyboardState[ev.code] = false;
        }
    }

    static numberOfKeysPressed(): number {
        let pressedKeys = 0;
        for (const isPressed of Object.values(KeyboardKeys.keyboardState)) {
            if (isPressed) {
                pressedKeys += 1;
            }
        }
        return pressedKeys;
    }

    static anyKeyPressed(): boolean {
        return Object.values(KeyboardKeys.keyboardState).some(isPressed => isPressed);
    }
}
