import { expect, test } from 'vitest'
import { KeyboardKeys } from '../src/Play/utility/keyboardKeys'

test('Initial number of keys pressed', () => {
    expect(KeyboardKeys.numberOfKeysPressed()).toBe(0)
})

test('Keyboard key pressed', () => {
    KeyboardKeys.keyboardState["keyA"] = true;
    expect(KeyboardKeys.numberOfKeysPressed()).toBe(1);
})


test('Any key pressed', () => {
    KeyboardKeys.keyboardState["keyA"] = true;
    KeyboardKeys.keyboardState["keyW"] = true;
    KeyboardKeys.keyboardState["keyS"] = true;
    KeyboardKeys.keyboardState["keyD"] = true;

    expect(KeyboardKeys.anyKeyPressed()).toBe(true);
})






