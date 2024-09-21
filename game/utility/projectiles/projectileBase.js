//Bazine klase visiems sviediniams
export class Projectile {
    constructor(app, player, speed) {
        
        this.sprite = PIXI.Sprite.from('./assets/watermelon.png');
        app.stage.addChild(this.sprite);
        this.speed = speed;
        this.player = player;
        
        if (!this.sprite) {
            throw new Error("Projectile must have a sprite defined.");
        }

        this.spawn(app.view.width, app.view.height);
        
    }

    // Atspawn'ina sviedini atsitiktineje ekrano puseje
    spawn(screenWidth, screenHeight) {
        let side = Math.floor(Math.random() * 4); // 0: top, 1: bottom, 2: left, 3: right
        switch (side) {
            case 0: // Ekrano virsus
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = -50; 
                break;
            case 1: // Ekrano apacia
                this.sprite.x = Math.random() * screenWidth;
                this.sprite.y = screenHeight + 50; 
                break;
            case 2: // Ekrano kaire
                this.sprite.x = -50; 
                this.sprite.y = Math.random() * screenHeight;
                break;
            case 3: // Ekrano desine
                this.sprite.x = screenWidth + 50; 
                this.sprite.y = Math.random() * screenHeight;
                break;
        }
    }


    // Update'ina sviedinio pozicija
    update() {
        
        this.sprite.x += this.direction.x * this.speed;
        this.sprite.y += this.direction.y * this.speed;
    }
}