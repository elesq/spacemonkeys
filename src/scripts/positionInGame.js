function InGamePosition(settings, level) {
    this.settings = settings;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = [];
    this.lastFire = null;
    this.enemys = [];
    this.bombs = [];
}

InGamePosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);

    // spaceship
    ctx.drawImage(
        this.spaceship_image,
        this.spaceship.x - this.spaceship.width / 2,
        this.spaceship.y - this.spaceship.height / 2
    );

    // bullets
    ctx.fillStyle = '#fea9dd';
    for (let i = 0; i < this.bullets.length; i++) {
        let bullet = this.bullets[i];
        ctx.fillRect(bullet.x - 1, bullet.y, 2, 8);
    }

    // enemies
    for (let i = 0; i < this.enemys.length; i++) {
        let enemy = this.enemys[i];
        ctx.drawImage(
            this.enemy_image,
            enemy.x - enemy.width / 2,
            enemy.y - enemy.height / 2
        );
    }

    // bombs
    ctx.fillStyle = '#42aff5';
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        ctx.fillRect(bomb.x - 2, bomb.y, 3, 6);
    }

    // draw sound and mute info
    ctx.font = '10px fantasy';
    ctx.fillStyle = 'mediumpurple';

    ctx.textAlign = 'left';
    ctx.fillText(
        'press s to mute/restore sounds',
        play.playBoundaries.left,
        play.playBoundaries.bottom + 90
    );

    ctx.textAlign = 'right';
    ctx.fillText(
        'press p to pause',
        play.playBoundaries.right,
        play.playBoundaries.bottom + 90
    );

    // display the levels data
    ctx.fillStyle = 'deepskyblue';
    ctx.textAlign = 'center';
    ctx.font = '12px fantasy';
    ctx.fillText(
        'Level',
        play.playBoundaries.left,
        play.playBoundaries.top - 80
    );
    ctx.font = '18px fantasy';
    ctx.fillText(
        play.level,
        play.playBoundaries.left,
        play.playBoundaries.top - 60
    );

    // display the shields data
    play.shields > 0
        ? (ctx.fillStyle = 'deepskyblue')
        : (ctx.fillStyle = 'orangered');
    ctx.textAlign = 'center';
    ctx.font = '12px fantasy';
    ctx.fillText(
        'Shields',
        play.playBoundaries.left + 150,
        play.playBoundaries.top - 80
    );
    ctx.font = '18px fantasy';
    ctx.fillText(
        play.shields,
        play.playBoundaries.left + 150,
        play.playBoundaries.top - 60
    );

    // display the scores
    ctx.fillStyle = 'deepskyblue';
    ctx.textAlign = 'center';
    ctx.font = '12px fantasy';
    ctx.fillText(
        'Score',
        play.playBoundaries.right,
        play.playBoundaries.top - 80
    );
    ctx.font = '18px fantasy';
    ctx.fillText(
        play.score,
        play.playBoundaries.right,
        play.playBoundaries.top - 60
    );
};

InGamePosition.prototype.update = function (play) {
    const ship = this.spaceship;
    const speed = this.spaceshipSpeed;
    const upSec = this.settings.updateSeconds;
    const bullets = this.bullets;

    if (play.pressedKeys[37]) {
        ship.x -= speed * upSec;
    }

    if (play.pressedKeys[39]) {
        ship.x += speed * upSec;
    }

    if (play.pressedKeys[32]) {
        this.shoot();
    }

    if (ship.x < play.playBoundaries.left) {
        ship.x = play.playBoundaries.left;
    }

    if (ship.x > play.playBoundaries.right) {
        ship.x = play.playBoundaries.right;
    }

    // animate bullets
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y -= upSec * this.settings.bulletSpeed;

        if (bullet.y < 0) {
            bullets.splice(i--, 1);
        }
    }

    // update enemy positions
    let touchingCloth = false;

    for (let i = 0; i < this.enemys.length; i++) {
        let enemy = this.enemys[i];
        let updated_x =
            enemy.x + this.enemySpeed * upSec * this.turnaround * this.onXaxis;
        let updated_y = enemy.y + this.enemySpeed * upSec * this.onYaxis;

        if (
            updated_x > play.playBoundaries.right ||
            updated_x < play.playBoundaries.left
        ) {
            touchingCloth = true;
            this.onXaxis = 0;
            this.onYaxis = 1;
            this.turnaround *= -1;
            this.enemyAdvancing = true;
        }

        if (!touchingCloth) {
            enemy.x = updated_x;
            enemy.y = updated_y;
        }
    }

    if (this.enemyAdvancing) {
        this.enemyAdvanceValue += this.enemySpeed * upSec;
        if (this.enemyAdvanceValue >= this.settings.enemyDropHeight) {
            this.enemyAdvancing = false;
            this.onXaxis = 1;
            this.onYaxis = 0;
            this.enemyAdvanceValue = 0;
        }
    }

    const frontlineenemys = [];
    for (let i = 0; i < this.enemys.length; i++) {
        let enemy = this.enemys[i];
        if (
            !frontlineenemys[enemy.column] ||
            frontlineenemys[enemy.column].line < enemy.line
        ) {
            frontlineenemys[enemy.column] = enemy;
        }
    }

    // manage chance based bombing patterns
    for (let i = 0; i < this.settings.enemyCols; i++) {
        let enemy = frontlineenemys[i];
        if (!enemy) continue;

        let chance = this.bombFrequency * upSec;
        this.object = new Objects();
        if (chance > Math.random()) {
            // add bomb to bomb array
            this.bombs.push(
                this.object.bomb(enemy.x, enemy.y + enemy.height / 2)
            );
        }
    }

    // animate the bombs
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        bomb.y += upSec * this.bombSpeed;

        if (bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    // enemy bullet collision
    for (let i = 0; i < this.enemys.length; i++) {
        let enemy = this.enemys[i];
        let collision = false;

        for (let j = 0; j < bullets.length; j++) {
            let bullet = bullets[j];

            if (
                bullet.x >= enemy.x - enemy.width / 2 &&
                bullet.x <= enemy.x + enemy.width / 2 &&
                bullet.y >= enemy.y - enemy.height / 2 &&
                bullet.y <= enemy.y + enemy.height / 2
            ) {
                bullets.splice(j--, 1);
                collision = true;
                play.score += this.settings.pointsPerKill;
            }
        }

        if (collision) {
            this.enemys.splice(i--, 1);
            play.sounds.playSound('enemydown');
        }
    }

    // spaceship & bomb collision
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        if (
            bomb.x + 2 >= ship.x - ship.width / 2 &&
            bomb.x - 2 <= ship.x + ship.width / 2 &&
            bomb.y + 1 >= ship.y - ship.height / 2 &&
            bomb.y <= ship.y + ship.height / 2
        ) {
            this.bombs.splice(i--, 1);
            play.sounds.playSound('takingfire');
            // handle damage and lose a shield life
            play.shields--;
        }
    }

    // spaceship and enemy collision
    for (let i = 0; i < this.enemys.length; i++) {
        let enemy = this.enemys[i];
        if (
            enemy.x + enemy.width / 2 > ship.x - ship.width / 2 &&
            enemy.x - enemy.width / 2 < ship.x + ship.width / 2 &&
            enemy.y + enemy.height / 2 > ship.y - ship.height / 2 &&
            enemy.y - enemy.height / 2 < ship.y - ship.height / 2
        ) {
            // manage the damage
            play.sounds.playSound('death');
            play.shields = -1; // instant death
        }
    }

    if (play.shields < 0) {
        play.pushPosition(new GameOverPosition());
    }

    if (this.enemys.length == 0) {
        play.level += 1;
        play.goToPosition(new TransferPosition(play.level));
    }
};

InGamePosition.prototype.entry = function (play) {
    this.onXaxis = 1;
    this.onYaxis = 0;
    this.enemyAdvancing = false;
    this.enemyAdvanceValue = 0;
    this.turnaround = 1;
    this.spaceship_image = new Image();
    this.enemy_image = new Image();
    this.upSec = this.settings.updateSeconds;

    this.spaceshipSpeed = this.settings.spaceshipSpeed;
    this.object = new Objects();

    this.spaceship = this.object.spaceship(
        play.width / 2,
        play.playBoundaries.bottom,
        this.spaceship_image
    );

    // game level (sets max level of 10)
    let presentLevel = this.level < 16 ? this.level : 15;
    this.enemySpeed = this.settings.enemySpeed + presentLevel * 7;
    this.bombSpeed = this.settings.bombSpeed + presentLevel * 10;
    this.bombFrequency = this.settings.bombFrequency + presentLevel * 0.05;

    const lines = this.settings.enemyLines;
    const cols = this.settings.enemyCols;
    const enemysInitial = [];

    let line, col;

    for (line = 0; line < lines; line++) {
        for (col = 0; col < cols; col++) {
            this.object = new Objects();

            let x, y;
            x = play.width / 2 + col * 64 - (cols - 1) * 32;
            y = play.playBoundaries.top - 30 + line * 48;
            enemysInitial.push(
                this.object.enemy(x, y, line, col, this.enemy_image)
            );

            //console.log(`line: ${line}, column: ${col}, x: ${x}, y: ${y}`);
        }
    }

    this.enemys = enemysInitial;

    this.enemys.splice(31, 1);
    this.enemys.splice(24, 1);

    this.temp = 0;
};

InGamePosition.prototype.shoot = function () {
    if (
        this.lastFire == null ||
        new Date().getTime() - this.lastFire > this.settings.bulletMaxFrequency
    ) {
        this.object = new Objects();
        this.bullets.push(
            this.object.bullet(
                this.spaceship.x,
                this.spaceship.y - this.spaceship.height / 2,
                this.settings.bulletSpeed
            )
        );
        this.lastFire = new Date().getTime();
        play.sounds.playSound('shot');
    }
};

InGamePosition.prototype.keyDown = function (play, keyboardCode) {
    // 83 is the letter 's'
    if (keyboardCode == 83) {
        play.sounds.mute();
    }

    // 80 is the letter 'p' for pause
    if (keyboardCode == 80) {
        play.pushPosition(new PausePosition());
    }
};
