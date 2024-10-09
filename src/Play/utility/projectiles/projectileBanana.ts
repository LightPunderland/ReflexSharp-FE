import { Projectile } from './projectile';
import BananaPNG from "../assets/banana.png";

export class Banana extends Projectile {
    private archDelay: number;  
    private archStrength: number; 
    private archDirection: { x: number; y: number }; 

    constructor(player: { x: number; y: number }, speed: number) {
        super(player, speed, BananaPNG);

        this.speedIncrement = 0.03;
        this.archDelay = 1;         
        this.archStrength = 0.003;  

       
        this.archDirection = {
            x: this.sprite.x < window.innerWidth / 2 ? 1 : -1, // Left or right
            y: this.sprite.y < window.innerHeight / 2 ? 1 : -1 // Top or bottom
        };
    }

    update(): void {
        this.speed += this.speedIncrement;
        this.time += 0.05;

        // Pries delay judam tiesiai, po delay arka
        if (this.time > this.archDelay) {
            this.direction.x += this.archDirection.x * this.archStrength;
            this.direction.y += this.archDirection.y * this.archStrength;
        }

        // normalizuojam direction'a
        const magnitude = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        this.direction.x /= magnitude;
        this.direction.y /= magnitude;

        this.sprite.x += this.direction.x * this.speed;
        this.sprite.y += this.direction.y * this.speed;

        // Panaikinam jei iseina is ekrano
        if (this.sprite.x < -Projectile._spawnOffset ||
            this.sprite.x > window.innerWidth + Projectile._spawnOffset ||
            this.sprite.y < -Projectile._spawnOffset ||
            this.sprite.y > window.innerHeight + Projectile._spawnOffset) {
            
            if (this.sprite.parent) {
                this.sprite.parent.removeChild(this.sprite);
            }
        }
    }
}
