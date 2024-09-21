import { Projectile } from './projectileBase.js';

export class Watermelon extends Projectile {
    

    constructor(app, player, speed) {
        
        super(app, player, speed);
    

        // Apskaiciuoja krypti iki playerio
        this.direction = this.calculateDirection(this.sprite.x, this.sprite.y, player.x, player.y);

        
    }


    // Calculate the direction vector from the projectile to the player
    calculateDirection(startX, startY, targetX, targetY) {
        let dx = targetX - startX;
        let dy = targetY - startY;
        let magnitude = Math.sqrt(dx * dx + dy * dy);

        //Grazina normalizuotus vektorius
        return { x: dx / magnitude, y: dy / magnitude }; 
    }

    // Padaro kad arbuzas judetu iki playerio greitedamas
    updatePos() {
        
        this.speed+=0.1;
        this.update();
        
    }
}