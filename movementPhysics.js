export class MovementPhysics{
    static calculateSpeed(maxSpeed, movementMomentum, reduceDiagonalSpeed){
        return maxSpeed * (movementMomentum * reduceDiagonalSpeed);
    }
}