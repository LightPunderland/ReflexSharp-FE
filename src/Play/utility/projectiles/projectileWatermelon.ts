import { Projectile } from './projectile';

export class Watermelon extends Projectile {

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, 'https://i.imgur.com/3uFSRAr.jpeg');   // doesn't render properly, fix this

        this.speedIncrement = 0.1;
    }
}
