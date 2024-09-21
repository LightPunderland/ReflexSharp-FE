//Bazine klase visiems sviediniams
export class Projectile {

    //Kiek px uz ekrano atspawnins projectile
    static _spawnOffset = 50; 

    constructor(player, speed, imagePath) {
        this.speed = speed;
        this.player = player;
        this.imagePath = imagePath;
        this.sprite = PIXI.Sprite.from(this.imagePath);

        //Default speed increment value, galima pakeisti per child
        this.speedIncrement = 0.1;

        if (!this.sprite) {
            throw new Error("ProjectileBase sprite not loaded");
        }        
    }

    getSprite(){
        if (!this.sprite) {
            throw new Error("ProjectileBase sprite not loaded");
        }

        return this.sprite;
    }

    // Calculate the direction vector from the projectile to the player
    calculateDirection(startX, startY, targetX, targetY) {
        let dx = targetX - startX;
        let dy = targetY - startY;
        let magnitude = Math.sqrt(dx * dx + dy * dy);

        //Grazina normalizuotus vektorius
        return { x: dx / magnitude, y: dy / magnitude }; 
    }

    // Atspawn'ina sviedini atsitiktineje ekrano puseje
    spawn(screenWidth, screenHeight) {
        
        if(this.sprite.parent == null){
            throw new Error("Sprite not added to the stage");
        }
        
        let side = Math.floor(Math.random() * 4); // 0: top, 1: bottom, 2: left, 3: right

        switch (side) {
            case 0: // Ekrano virsus
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = -1*Projectile._spawnOffset; 
                break;
            case 1: // Ekrano apacia
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = screenHeight + Projectile._spawnOffset; 
                break;
            case 2: // Ekrano kaire
                this.sprite.x = -1*Projectile._spawnOffset; 
                this.sprite.y = Math.random() * screenHeight;
                break;
            case 3: // Ekrano desine
                this.sprite.x = screenWidth + Projectile._spawnOffset; 
                this.sprite.y = Math.random() * screenHeight;
                break;
        }

        //calculateDirection() kad teisingai veiktu privalo buti iskvieciama tiktais po to kai spawn() funkcija baige apskaiciavimus
        this.direction = this.calculateDirection(this.sprite.x, this.sprite.y, this.player.x, this.player.y);
    }

    // Update'ina sviedinio pozicija, funkcija kvieciama every tick
    update() {
        this.speed += this.speedIncrement;

        this.sprite.x += this.direction.x * this.speed;
        this.sprite.y += this.direction.y * this.speed;

        // console.log("projectile direction x: " + this.direction.x);
        // console.log("projectile direction y: " + this.direction.y);

        // console.log("projectile speed: " + this.speed);
        // console.log("projectile x: " + this.sprite.x);
        // console.log("projectile y: " + this.sprite.y);
    }
}