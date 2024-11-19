import { expect, test } from 'vitest'
import { MovementDirection } from '../src/Play/utility/characterMovement/movementDirection'

test('Only one movement direction', () => {
    const movementDirection = new MovementDirection();
    movementDirection.up = true;
    movementDirection.down = true;

    expect(movementDirection.up).toBe(false)
})

// test('Initial number of keys pressed', () => {
//     KeyboardKeys.onKeyDown({altKey})
//     expect(KeyboardKeys.numberOfKeysPressed()).toBe(0)
// })