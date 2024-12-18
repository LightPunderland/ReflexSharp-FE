import { expect, test, vi, beforeEach, describe } from 'vitest';
import { MovementDirection } from '../src/Play/utility/characterMovement/movementDirection'
import { MovementPhysics } from '../src/Play/utility/characterMovement/movementPhysics';

test('Not moving', async () => {
    const movementDirection = new MovementDirection();

    movementDirection.right = true;
    movementDirection._resetDirection();

    expect(movementDirection.down).toBe(false);
    expect(movementDirection.downleft).toBe(false);
    expect(movementDirection.downright).toBe(false);
    expect(movementDirection.left).toBe(false);
    expect(movementDirection.right).toBe(false);
    expect(movementDirection.up).toBe(false);
    expect(movementDirection.upleft).toBe(false);
    expect(movementDirection.upright).toBe(false);
});

test('Only one direction movement', async () => {
    const movementDirection = new MovementDirection();

    movementDirection.downright = false;
    movementDirection.left = true; 
    movementDirection.right = true;

    expect(movementDirection.down).toBe(false);
    expect(movementDirection.downleft).toBe(false);
    expect(movementDirection.downright).toBe(false);
    expect(movementDirection.left).toBe(false);
    expect(movementDirection.right).toBe(true);
    expect(movementDirection.up).toBe(false);
    expect(movementDirection.upleft).toBe(false);
    expect(movementDirection.upright).toBe(false);
});

describe('MovementPhysics', () => {
    test('should have a maxSpeed property set to 17', () => {
      expect(MovementPhysics.maxSpeed).toBe(17);
    });
  
    test('should calculate speed correctly', () => {
      const speed = MovementPhysics.calculateSpeed();
      expect(speed).toBe(MovementPhysics.maxSpeed);
    });
  });