import { Projectile } from './projectile';
import WatermelonPNG from "../assets/watermelon.png"

export class Watermelon extends Projectile {

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, WatermelonPNG);   // doesn't render properly, fix this

        this.speedIncrement = 0.07;
    }
}
