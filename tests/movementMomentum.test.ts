import { expect, test, beforeEach, describe } from 'vitest';
import { MovementMomentum } from '../src/Play/utility/characterMovement/movementMomentum';

describe('MovementMomentum', () => {
  let movementMomentum: MovementMomentum;

  beforeEach(() => {
    movementMomentum = new MovementMomentum();
  });

  test('should reset down momentum', () => {
    movementMomentum.downMomentum = 1;
    movementMomentum._downMomentumTime = 1;

    movementMomentum.resetDownMomentum();

    expect(movementMomentum.downMomentum).toBe(0);
    expect(movementMomentum._downMomentumTime).toBe(MovementMomentum.initialMomentumTime);
  });

  test('should reset right momentum', () => {
    movementMomentum.rightMomentum = 1;
    movementMomentum._rightMomentumTime = 1;

    movementMomentum.resetRightMomentum();

    expect(movementMomentum.rightMomentum).toBe(0);
    expect(movementMomentum._rightMomentumTime).toBe(MovementMomentum.initialMomentumTime);
  });
  

  test('should reset left momentum', () => {
    movementMomentum.leftMomentum = 1;
    movementMomentum._leftMomentumTime = 1;

    movementMomentum.resetLeftMomentum();

    expect(movementMomentum.leftMomentum).toBe(0);
    expect(movementMomentum._leftMomentumTime).toBe(MovementMomentum.initialMomentumTime);
  });

  test('should reset up momentum', () => {
    movementMomentum.upMomentum = 1;
    movementMomentum._upMomentumTime = 1;

    movementMomentum.resetUpMomentum();

    expect(movementMomentum.upMomentum).toBe(0);
    expect(movementMomentum._upMomentumTime).toBe(MovementMomentum.initialMomentumTime);
  });

  test('should gain up momentum', () => {
    movementMomentum._upMomentumTime = 0;
    movementMomentum.upMomentum = 0;

    movementMomentum.gainUpMomentum(100);

    expect(movementMomentum._upMomentumTime).toBe(20);
  });

  test('should gain down momentum', () => {
    movementMomentum._downMomentumTime = 0;
    movementMomentum.downMomentum = 0;

    movementMomentum.gainDownMomentum(100);

    expect(movementMomentum._downMomentumTime).toBe(20);
  });

  test('should gain left momentum', () => {
    movementMomentum._leftMomentumTime = 0;
    movementMomentum.leftMomentum = 0;

    movementMomentum.gainLeftMomentum(100);

    expect(movementMomentum._leftMomentumTime).toBe(20);
  });

  test('should gain right momentum', () => {
    movementMomentum._rightMomentumTime = 0;
    movementMomentum.rightMomentum = 0;

    movementMomentum.gainRightMomentum(100);

    expect(movementMomentum._rightMomentumTime).toBe(20);
  });

  test('should not exceed maximum up momentum time', () => {
    movementMomentum._upMomentumTime = MovementMomentum.momentumMaxTime - 50;

    movementMomentum.gainUpMomentum(100);

    expect(movementMomentum._upMomentumTime).toBe(MovementMomentum.momentumMaxTime);
    expect(movementMomentum.upMomentum).toBeCloseTo(1);
  });

  test('should reset down momentum when gaining up momentum', () => {
    movementMomentum.downMomentum = 1;
    movementMomentum._downMomentumTime = 1;

    movementMomentum.gainUpMomentum(100);

    expect(movementMomentum.downMomentum).toBe(0);
    expect(movementMomentum._downMomentumTime).toBe(MovementMomentum.initialMomentumTime);
  });
});