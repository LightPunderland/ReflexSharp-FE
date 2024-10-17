import { Projectile } from './projectile';

export class Watermelon extends Projectile {
    static WatermelonPNG= 'http://localhost:5050/api/sprite/by-name/watermelon';

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, Watermelon.WatermelonPNG);   // doesn't render properly, fix this

        this.speedIncrement = 0.04;
    }
}
