import { Projectile } from './projectileBase.js';

export class Watermelon extends Projectile {
    
    constructor(app, player, speed) {
        super(app, player, speed, './assets/watermelon.png');

        this.speedIncrement = 0.1;
    }
}