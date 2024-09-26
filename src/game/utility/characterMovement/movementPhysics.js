export class MovementPhysics{
    //greitis kuri characteris gali pasiekti max (pixeliais per tick)
    static maxSpeed = 10;

    static calculateSpeed(movementMomentum, reduceDiagonalSpeed){
        return MovementPhysics.maxSpeed * (movementMomentum * reduceDiagonalSpeed);
    }

}