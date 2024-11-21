import { expect, test } from 'vitest'
import { KeyboardKeys } from '../src/Play/utility/keyboardKeys'
import { KeyboardEvent } from 'react'

test('Initial number of keys pressed', () => {
    expect(KeyboardKeys.numberOfKeysPressed()).toBe(0)
})
