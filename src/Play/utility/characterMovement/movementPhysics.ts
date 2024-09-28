export class MovementPhysics {
    static maxSpeed: number = 10;

    static calculateSpeed(movementMomentum: number, reduceDiagonalSpeed: number): number {
        return MovementPhysics.maxSpeed * (movementMomentum * reduceDiagonalSpeed);
    }
}
