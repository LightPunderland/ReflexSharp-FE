import { Projectile } from './projectileBase.js';

export class Watermelon extends Projectile {
    
    constructor(player, speed) {
        super(player, speed, './assets/watermelon.png');

        this.speedIncrement = 0.1;
    }
}