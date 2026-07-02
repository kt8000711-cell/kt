// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene, HomeScene, BattlegroundScene, TransitionScene],
    backgroundColor: '#2a2a2a'
};

const game = new Phaser.Game(config);

// ==================== PRELOAD SCENE ====================
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // Assets are generated in-game so no file loading needed
    }

    create() {
        this.scene.start('Home');
    }
}

// ==================== HOME SCENE ====================
class HomeScene extends Phaser.Scene {
    constructor() {
        super('Home');
    }

    create() {
        // Create background
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Draw bedroom background
        this.drawBedroom();
        
        // Create commando character
        this.commando = this.createCommando(width / 2 - 100, height / 2 - 50, 'sleeping');
        
        // Title
        this.add.text(width / 2, 30, '🎮 COMMANDO: ACTION HERO 🎮', {
            fontSize: '32px',
            fill: '#FFD700',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // UI Text
        this.missionText = this.add.text(width - 30, 80, 'Stage 1: Wake Up!', {
            fontSize: '24px',
            fill: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(1, 0);
        
        this.instructionText = this.add.text(width / 2, height - 60, 
            'Press SPACE to wake up and get ready for battle!', {
            fontSize: '16px',
            fill: '#fff',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            borderRadius: 5
        }).setOrigin(0.5, 0);
        
        // Input handling
        this.input.keyboard.on('keydown-SPACE', () => {
            this.startPreparation();
        });
        
        this.stage = 'sleeping';
    }

    drawBedroom() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Wall
        this.add.rectangle(0, 0, width, height, 0x8b7355).setOrigin(0, 0).setDepth(-1);
        
        // Bed
        const bedX = 100;
        const bedY = 150;
        this.add.rectangle(bedX, bedY, 200, 150, 0xd2691e).setOrigin(0, 0);
        this.add.rectangle(bedX + 5, bedY + 5, 190, 140, 0xff6b9d).setOrigin(0, 0); // Bedsheet
        
        // Window
        this.add.rectangle(width - 220, 50, 200, 200, 0x87ceeb).setOrigin(0, 0);
        this.add.rectangle(width - 210, 60, 180, 180, 0xe0f6ff).setOrigin(0, 0);
        this.add.line(width - 110, 60, width - 110, 240, 0x333333, 2);
        this.add.line(width - 210, 150, width - 10, 150, 0x333333, 2);
        
        // Door
        this.add.rectangle(30, height - 250, 80, 200, 0x8b4513).setOrigin(0, 0);
        this.add.circle(105, height - 150, 5, 0xffd700);
        
        // Closet
        this.add.rectangle(width - 150, 350, 120, 200, 0x654321).setOrigin(0, 0);
        this.add.text(width - 90, 450, '👔', { fontSize: '48px' }).setOrigin(0.5, 0.5);
    }

    createCommando(x, y, pose) {
        // Simple character representation using graphics
        const character = this.add.container(x, y);
        
        // Head - Beautiful face
        this.add.circle(0, -30, 15, 0xf4a460).setParent(character);
        this.add.text(0, -30, '😴', { fontSize: '20px' }).setOrigin(0.5, 0.5).setParent(character);
        
        // Hair (long brown)
        this.add.arc(0, -30, 16, Math.PI, 0, false, 0x8b4513).setParent(character);
        
        // Body - T-shirt
        this.add.rectangle(0, -10, 30, 25, 0xff6b6b).setParent(character);
        
        // Jacket
        this.add.rectangle(0, -8, 35, 30, 0x1a1a2e).setParent(character);
        
        // Jeans
        this.add.rectangle(-8, 15, 15, 25, 0x2c3e50).setParent(character);
        this.add.rectangle(8, 15, 15, 25, 0x2c3e50).setParent(character);
        
        // Boots
        this.add.rectangle(-8, 38, 15, 8, 0x000000).setParent(character);
        this.add.rectangle(8, 38, 15, 8, 0x000000).setParent(character);
        
        // Arms
        this.add.rectangle(-20, -5, 12, 20, 0xf4a460).setParent(character);
        this.add.rectangle(20, -5, 12, 20, 0xf4a460).setParent(character);
        
        character.setData('health', 100);
        character.setData('maxHealth', 100);
        character.setData('ammo', 30);
        
        return character;
    }

    startPreparation() {
        if (this.stage === 'sleeping') {
            // Animate waking up
            this.stage = 'waking';
            this.instructionText.setText('Getting dressed... Looking beautiful! 💄');
            this.missionText.setText('Stage 2: Dress Up!');
            
            this.tweens.add({
                targets: this.commando,
                y: this.commando.y - 30,
                duration: 500,
                ease: 'Back.easeOut'
            });
            
            // Add gun to hand after a delay
            this.time.delayedCall(800, () => {
                this.addGunToCommando();
                this.instructionText.setText('✅ Ready for action! Press SPACE to head to the car!');
                this.stage = 'dressed';
            });
        } else if (this.stage === 'dressed') {
            // Move to car scene
            this.scene.start('Transition');
        }
    }

    addGunToCommando() {
        // Add gun sprite to right hand
        const gun = this.add.text(20, -10, '🔫', { fontSize: '24px' }).setParent(this.commando);
        this.commando.gun = gun;
    }

    update() {
        // Optional: Add idle animation to character
    }
}

// ==================== TRANSITION SCENE ====================
class TransitionScene extends Phaser.Scene {
    constructor() {
        super('Transition');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Draw house exterior
        this.add.rectangle(0, 0, width, height, 0x87ceeb).setOrigin(0, 0); // Sky
        this.add.rectangle(0, height / 2, width, height / 2, 0x90ee90).setOrigin(0, 0); // Ground
        
        // Draw house
        this.drawHouse(width / 4, height / 2 - 200);
        
        // Create commando character walking out
        this.commando = this.createCommandoFull(width / 4 + 80, height / 2 - 100);
        
        // Draw BMW car
        this.drawBMW(width * 0.65, height / 2 + 50);
        
        this.add.text(width / 2, 30, '🚗 COMMANDO READY FOR ACTION 🚗', {
            fontSize: '28px',
            fill: '#fff',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            align: 'center'
        }).setOrigin(0.5, 0);
        
        this.missionText = this.add.text(width / 2, height - 40, 
            'Press SPACE to get in the BMW and drive to the battlefield!', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Animate character walking to car
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: this.commando,
                x: width * 0.65 - 30,
                duration: 3000,
                ease: 'Linear'
            });
        });
        
        this.input.keyboard.on('keydown-SPACE', () => {
            this.tweens.add({
                targets: this.commando,
                alpha: 0,
                duration: 300
            });
            this.time.delayedCall(300, () => {
                this.scene.start('Battleground');
            });
        });
    }

    drawHouse(x, y) {
        // Walls
        this.add.rectangle(x, y, 200, 250, 0xcd853f).setOrigin(0, 0);
        
        // Roof
        this.add.triangle(x, y, x + 200, y, x + 100, y - 80, 0x8b4513);
        
        // Door
        this.add.rectangle(x + 75, y + 150, 50, 100, 0x654321).setOrigin(0, 0);
        this.add.circle(x + 125, y + 200, 4, 0xffd700);
        
        // Window 1
        this.add.rectangle(x + 30, y + 40, 50, 50, 0x87ceeb).setOrigin(0, 0);
        
        // Window 2
        this.add.rectangle(x + 120, y + 40, 50, 50, 0x87ceeb).setOrigin(0, 0);
    }

    drawBMW(x, y) {
        // Car body
        this.add.ellipse(x + 60, y, 140, 50, 0x000080);
        
        // Car top
        this.add.rectangle(x + 40, y - 30, 80, 30, 0x000080);
        
        // Windows
        this.add.rectangle(x + 30, y - 25, 30, 20, 0x87ceeb);
        this.add.rectangle(x + 70, y - 25, 30, 20, 0x87ceeb);
        
        // Wheels
        this.add.circle(x + 30, y + 30, 15, 0x333333);
        this.add.circle(x + 90, y + 30, 15, 0x333333);
        this.add.circle(x + 30, y + 30, 8, 0x888888);
        this.add.circle(x + 90, y + 30, 8, 0x888888);
        
        // Headlights
        this.add.circle(x + 10, y - 8, 5, 0xffff00);
        this.add.circle(x + 10, y + 8, 5, 0xffff00);
        
        // BMW Logo
        this.add.text(x + 60, y, 'BMW', { 
            fontSize: '16px', 
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
    }

    createCommandoFull(x, y) {
        const character = this.add.container(x, y);
        
        // Head with happy face
        this.add.circle(0, -30, 15, 0xf4a460).setParent(character);
        this.add.text(0, -30, '😊', { fontSize: '20px' }).setOrigin(0.5, 0.5).setParent(character);
        
        // Hair (long, beautiful)
        this.add.arc(0, -30, 16, Math.PI, 0, false, 0x8b4513).setParent(character);
        
        // Body - T-shirt (red)
        this.add.rectangle(0, -10, 30, 25, 0xff6b6b).setParent(character);
        
        // Jacket (black)
        this.add.rectangle(0, -8, 35, 30, 0x1a1a2e).setParent(character);
        
        // Jeans (blue-ish)
        this.add.rectangle(-8, 15, 15, 25, 0x2c3e50).setParent(character);
        this.add.rectangle(8, 15, 15, 25, 0x2c3e50).setParent(character);
        
        // Boots
        this.add.rectangle(-8, 38, 15, 8, 0x000000).setParent(character);
        this.add.rectangle(8, 38, 15, 8, 0x000000).setParent(character);
        
        // Arms
        this.add.rectangle(-20, -5, 12, 20, 0xf4a460).setParent(character);
        this.add.rectangle(20, -5, 12, 20, 0xf4a460).setParent(character);
        
        // Gun in hand
        this.add.text(20, -10, '🔫', { fontSize: '24px' }).setParent(character);
        
        return character;
    }
}

// ==================== BATTLEGROUND SCENE ====================
class BattlegroundScene extends Phaser.Scene {
    constructor() {
        super('Battleground');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x556b2f).setOrigin(0, 0); // Ground
        this.add.rectangle(0, 0, width, height / 2, 0x87ceeb).setOrigin(0, 0); // Sky
        
        // Draw terrain
        this.drawTerrain(width, height);
        
        // Create physics groups
        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.explosions = this.add.group();
        
        // Create commando
        this.commando = this.createCommando(100, height - 150);
        this.physics.add.existing(this.commando);
        this.commando.body.setCollideWorldBounds(true);
        this.commando.body.setBounce(0.2);
        
        this.commando.setData('health', 100);
        this.commando.setData('maxHealth', 100);
        this.commando.setData('ammo', 30);
        this.commando.setData('score', 0);
        this.commando.isJumping = false;
        
        // Spawn enemies
        this.spawnEnemies(8);
        
        // Setup collisions
        this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            this.hitEnemy(bullet, enemy);
        });
        
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => this.jump());
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'j' || event.key === 'J') this.shoot();
        });
        
        // UI
        this.healthText = this.add.text(20, 20, '', {
            fontSize: '18px',
            fill: '#00ff00',
            fontStyle: 'bold'
        });
        
        this.ammoText = this.add.text(20, 50, '', {
            fontSize: '18px',
            fill: '#ffff00',
            fontStyle: 'bold'
        });
        
        this.scoreText = this.add.text(width - 20, 20, '', {
            fontSize: '18px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(1, 0);
        
        this.stageText = this.add.text(20, height - 30, 'BATTLE IN PROGRESS - Enemies: 8', {
            fontSize: '14px',
            fill: '#fff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        
        this.waveCount = 1;
        this.enemiesKilled = 0;
    }

    drawTerrain(width, height) {
        // Ground
        this.add.rectangle(0, height - 20, width, 20, 0x654321).setOrigin(0, 0);
        
        // Rock obstacles
        this.add.rectangle(width * 0.3, height - 80, 60, 60, 0x808080).setOrigin(0.5, 0.5);
        this.add.rectangle(width * 0.6, height - 100, 80, 80, 0x808080).setOrigin(0.5, 0.5);
        this.add.rectangle(width * 0.85, height - 90, 70, 70, 0x808080).setOrigin(0.5, 0.5);
    }

    createCommando(x, y) {
        const character = this.add.container(x, y);
        
        // Head with happy face
        this.add.circle(0, -30, 15, 0xf4a460).setParent(character);
        this.add.text(0, -30, '😊', { fontSize: '20px' }).setOrigin(0.5, 0.5).setParent(character);
        
        // Hair
        this.add.arc(0, -30, 16, Math.PI, 0, false, 0x8b4513).setParent(character);
        
        // Body
        this.add.rectangle(0, -10, 30, 25, 0xff6b6b).setParent(character);
        this.add.rectangle(0, -8, 35, 30, 0x1a1a2e).setParent(character);
        
        // Jeans
        this.add.rectangle(-8, 15, 15, 25, 0x2c3e50).setParent(character);
        this.add.rectangle(8, 15, 15, 25, 0x2c3e50).setParent(character);
        
        // Boots
        this.add.rectangle(-8, 38, 15, 8, 0x000000).setParent(character);
        this.add.rectangle(8, 38, 15, 8, 0x000000).setParent(character);
        
        // Arms
        this.add.rectangle(-20, -5, 12, 20, 0xf4a460).setParent(character);
        this.add.rectangle(20, -5, 12, 20, 0xf4a460).setParent(character);
        
        // Gun
        const gun = this.add.text(20, -10, '🔫', { fontSize: '24px' }).setParent(character);
        character.gun = gun;
        
        return character;
    }

    createEnemy(x, y) {
        const enemy = this.add.container(x, y);
        
        // Head (red)
        this.add.circle(0, -30, 12, 0xff0000).setParent(enemy);
        this.add.text(0, -30, '😠', { fontSize: '16px' }).setOrigin(0.5, 0.5).setParent(enemy);
        
        // Body (military green)
        this.add.rectangle(0, -10, 28, 25, 0x556b2f).setParent(enemy);
        
        // Pants
        this.add.rectangle(-7, 15, 14, 25, 0x2f4f4f).setParent(enemy);
        this.add.rectangle(7, 15, 14, 25, 0x2f4f4f).setParent(enemy);
        
        // Boots
        this.add.rectangle(-7, 38, 14, 8, 0x000000).setParent(enemy);
        this.add.rectangle(7, 38, 14, 8, 0x000000).setParent(enemy);
        
        // Arms
        this.add.rectangle(-18, -5, 10, 18, 0xff8c00).setParent(enemy);
        this.add.rectangle(18, -5, 10, 18, 0xff8c00).setParent(enemy);
        
        // Gun
        this.add.text(18, -8, '🔫', { fontSize: '20px' }).setParent(enemy);
        
        enemy.setData('health', 20);
        enemy.setData('maxHealth', 20);
        enemy.setData('shootTimer', 0);
        enemy.setData('shootInterval', 1500 + Math.random() * 1500);
        
        return enemy;
    }

    spawnEnemies(count) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        for (let i = 0; i < count; i++) {
            const x = width * (0.3 + Math.random() * 0.5);
            const y = height - 180 + Math.random() * 100;
            const enemy = this.createEnemy(x, y);
            
            this.physics.add.existing(enemy);
            enemy.body.setCollideWorldBounds(true);
            enemy.body.setBounce(0.3);
            enemy.body.setVelocityX((-50 + Math.random() * 100));
            
            this.enemies.add(enemy);
        }
    }

    shoot() {
        const commando = this.commando;
        
        if (commando.getData('ammo') <= 0) {
            this.showMessage('OUT OF AMMO!', '#ff0000');
            return;
        }
        
        // Create bullet
        const bulletX = commando.x + 20;
        const bulletY = commando.y - 10;
        
        const bullet = this.add.text(bulletX, bulletY, '•', {
            fontSize: '12px',
            fill: '#ffff00'
        });
        
        this.physics.add.existing(bullet);
        bullet.body.setVelocityX(400);
        
        this.bullets.add(bullet);
        
        // Reduce ammo
        commando.setData('ammo', commando.getData('ammo') - 1);
        
        // Auto-reload when out
        if (commando.getData('ammo') <= 0) {
            this.time.delayedCall(2000, () => {
                commando.setData('ammo', 30);
                this.showMessage('RELOADED!', '#00ff00');
            });
        }
    }

    jump() {
        if (!this.commando.isJumping) {
            this.commando.body.setVelocityY(-300);
            this.commando.isJumping = true;
            
            this.time.delayedCall(100, () => {
                this.commando.isJumping = false;
            });
        }
    }

    hitEnemy(bullet, enemy) {
        const damage = 10;
        const health = enemy.getData('health') - damage;
        enemy.setData('health', health);
        
        // Bullet flash
        bullet.setFill('#ffffff');
        this.time.delayedCall(50, () => bullet.setFill('#ffff00'));
        
        if (health <= 0) {
            this.killEnemy(enemy, bullet);
        }
    }

    killEnemy(enemy, bullet) {
        // Create explosion
        const explosion = this.add.text(enemy.x, enemy.y, '💥', {
            fontSize: '32px'
        });
        
        this.tweens.add({
            targets: explosion,
            scale: 0,
            alpha: 0,
            duration: 500,
            ease: 'Back.easeIn',
            onComplete: () => explosion.destroy()
        });
        
        enemy.destroy();
        bullet.destroy();
        
        this.enemiesKilled++;
        this.commando.setData('score', this.commando.getData('score') + 100);
        
        // Check wave completion
        if (this.enemies.getChildren().length === 0) {
            this.nextWave();
        }
    }

    nextWave() {
        this.waveCount++;
        this.enemiesKilled = 0;
        this.commando.setData('ammo', 30);
        
        const newEnemyCount = 3 + this.waveCount;
        this.spawnEnemies(newEnemyCount);
        
        this.showMessage(`WAVE ${this.waveCount} - ${newEnemyCount} Enemies!`, '#ffff00');
    }

    showMessage(text, color) {
        const width = this.cameras.main.width;
        const msg = this.add.text(width / 2, 100, text, {
            fontSize: '28px',
            fill: color,
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            align: 'center'
        }).setOrigin(0.5, 0);
        
        this.tweens.add({
            targets: msg,
            y: 30,
            alpha: 0,
            duration: 2000,
            ease: 'Quad.easeOut',
            onComplete: () => msg.destroy()
        });
    }

    update() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Update commando movement
        if (this.cursors.left.isDown) {
            this.commando.body.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.commando.body.setVelocityX(200);
        } else {
            this.commando.body.setVelocityX(0);
        }
        
        // Update commando direction
        if (this.cursors.left.isDown) {
            this.commando.gun.setScale(-1, 1);
        } else if (this.cursors.right.isDown) {
            this.commando.gun.setScale(1, 1);
        }
        
        // Keep commando in bounds
        if (this.commando.x < 50) this.commando.x = 50;
        if (this.commando.x > width - 50) this.commando.x = width - 50;
        
        // Update UI
        this.healthText.setText(`❤️ Health: ${this.commando.getData('health')}/${this.commando.getData('maxHealth')}`);
        this.ammoText.setText(`🔫 Ammo: ${this.commando.getData('ammo')}`);
        this.scoreText.setText(`Score: ${this.commando.getData('score')}`);
        this.stageText.setText(`WAVE ${this.waveCount} - Enemies: ${this.enemies.getChildren().length}`);
        
        // Enemy AI
        this.enemies.getChildren().forEach(enemy => {
            // Simple enemy movement toward player
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y, 
                this.commando.x, this.commando.y
            );
            
            if (distance < 300) {
                const direction = this.commando.x > enemy.x ? 1 : -1;
                enemy.body.setVelocityX(direction * 80);
            }
            
            // Enemy shooting
            const shootTimer = enemy.getData('shootTimer');
            const shootInterval = enemy.getData('shootInterval');
            
            enemy.setData('shootTimer', shootTimer + 16);
            
            if (shootTimer > shootInterval && distance < 250) {
                this.enemyShoot(enemy);
                enemy.setData('shootTimer', 0);
            }
        });
        
        // Remove off-screen bullets
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x > width || bullet.x < 0 || bullet.y > height || bullet.y < 0) {
                bullet.destroy();
            }
        });
        
        // Check game over
        if (this.commando.getData('health') <= 0) {
            this.gameOver();
        }
    }

    enemyShoot(enemy) {
        // Enemy bullets
        const bulletX = enemy.x - 15;
        const bulletY = enemy.y - 10;
        
        const bullet = this.add.text(bulletX, bulletY, '●', {
            fontSize: '10px',
            fill: '#ff6b6b'
        });
        
        this.physics.add.existing(bullet);
        bullet.body.setVelocityX(-300);
        
        // Collision with commando
        this.physics.add.overlap(bullet, this.commando, (bullet, commando) => {
            const newHealth = commando.getData('health') - 5;
            commando.setData('health', newHealth);
            bullet.destroy();
            
            // Hit feedback
            this.cameras.main.shake(100, 0.01);
        });
    }

    gameOver() {
        this.physics.pause();
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.add.text(width / 2, height / 2 - 50, 'MISSION FAILED', {
            fontSize: '48px',
            fill: '#ff0000',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 },
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        this.add.text(width / 2, height / 2 + 40, `Final Score: ${this.commando.getData('score')}`, {
            fontSize: '28px',
            fill: '#fff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        this.add.text(width / 2, height / 2 + 120, 'Press R to Restart', {
            fontSize: '20px',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }
}
