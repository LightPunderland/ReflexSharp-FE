export class MovementPhysics{
    static calculateSpeed(maxSpeed, timeAfterMovement, timeMaxSpeedReach, reduceDiagonalSpeed){
        return maxSpeed * (Math.sqrt(timeAfterMovement/timeMaxSpeedReach) * reduceDiagonalSpeed);
    }
}