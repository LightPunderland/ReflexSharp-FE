import { expect, test } from 'vitest'
import { Character } from '../src/Play/utility/character'

test('Initial number of keys pressed', () => {
    const c = new Character()
    expect(c.checkForOutOfBounds()).toBe(null);
    // Kazkokie character testai
})

// test('Initial number of keys pressed', () => {
//     KeyboardKeys.onKeyDown({altKey})
//     expect(KeyboardKeys.numberOfKeysPressed()).toBe(0)
// })