//Bazine klase visiems sviediniams
export class Projectile {

    //Kiek px uz ekrano atspawnins projectile
    static _spawnOffset = 50; 

    constructor(app, player, speed, imagePath) {
        this.projectile = PIXI.Sprite.from(imagePath);
        this.speed = speed;
        this.player = player;

        //Default speed increment value, galima pakeisti per child
        this.speedIncrement = 0.1;
        
        if (!this.projectile) {
            throw new Error("Projectile must have a sprite defined.");
        }

        this.spawn(app, app.view.width, app.view.height);

        this.direction = this.calculateDirection(this.projectile.x, this.projectile.y, player.x, player.y);
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
    spawn(app, screenWidth, screenHeight) {
        app.stage.addChild(this.projectile);

        let side = Math.floor(Math.random() * 4); // 0: top, 1: bottom, 2: left, 3: right

        switch (side) {
            case 0: // Ekrano virsus
                this.projectile.x = Math.random() * screenWidth;
                this.projectile.y = -Projectile._spawnOffset; 
                break;
            case 1: // Ekrano apacia
                this.projectile.x = Math.random() * screenWidth;
                this.projectile.y = screenHeight + Projectile._spawnOffset; 
                break;
            case 2: // Ekrano kaire
                this.projectile.x = -Projectile._spawnOffset; 
                this.projectile.y = Math.random() * screenHeight;
                break;
            case 3: // Ekrano desine
                this.projectile.x = screenWidth + Projectile._spawnOffset; 
                this.projectile.y = Math.random() * screenHeight;
                break;
        }
    }

    // Update'ina sviedinio pozicija, funkcija kvieciama every tick
    update() {
        this.speed += this.speedIncrement;

        this.projectile.x += this.direction.x * this.speed;
        this.projectile.y += this.direction.y * this.speed;
    }
}