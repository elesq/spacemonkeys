/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas');
canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

/**
 * handler for screen resizing. Requires a refresh to reset proportions
 * calculated on the updated screen height and width.
 */
const resize = () => {
    const height = window.innerHeight - 20;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

window.addEventListener('load', resize, false);

/**
 * game basics and settings respository
 */
function GameBasics(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    this.playBoundaries = {
        top: 125,
        bottom: 650,
        left: 100,
        right: 800,
    };

    this.level = 1;
    this.score = 0;
    this.shields = 2;

    this.settings = {
        // ship
        updateSeconds: 1 / 60,
        spaceshipSpeed: 200,
        bulletSpeed: 130,
        bulletMaxFrequency: 500,

        // enemy
        enemyLines: 4,
        enemyCols: 8,
        enemySpeed: 35,
        enemyDropHeight: 32,

        // enemy fire
        bombSpeed: 75,
        bombFrequency: 0.05,

        // scores
        pointsPerKill: 250,
    };

    // collects states
    this.positionContainer = [];

    this.pressedKeys = [];
}

/**
 * gets the current game position. Always returns the top element of positionContainer
 */
GameBasics.prototype.presentPosition = function () {
    return this.positionContainer.length > 0
        ? this.positionContainer[this.positionContainer.length - 1]
        : null;
};

/**
 * move to desired position
 */
GameBasics.prototype.goToPosition = function (position) {
    // if already in position clear the positionContainer
    if (this.presentPosition()) {
        this.positionContainer.length = 0;
    }

    // if entry is in postion call it.
    if (position.entry) {
        position.entry(play);
    }

    // set current game position in the positionContainer state mananger
    this.positionContainer.push(position);
};

// push new position into the positionContainer
GameBasics.prototype.pushPosition = function (position) {
    this.positionContainer.push(position);
};

// pop position from the positionContainer
GameBasics.prototype.popPosition = function () {
    this.positionContainer.pop();
};

GameBasics.prototype.start = function () {
    setInterval(function () {
        gameLoop(play);
    }, this.settings.updateSeconds * 1000);
    this.goToPosition(new OpeningPosition());
};

GameBasics.prototype.keyDown = function (keyboardCode) {
    this.pressedKeys[keyboardCode] = true;
    if (this.presentPosition() && this.presentPosition().keyDown) {
        this.presentPosition().keyDown(this, keyboardCode);
    }
};

GameBasics.prototype.keyUp = function (keyboardCode) {
    delete this.pressedKeys[keyboardCode];
};

function gameLoop(play) {
    let presentPosition = play.presentPosition();

    if (presentPosition) {
        // update
        if (presentPosition.update) {
            presentPosition.update(play);
        }

        // draw
        if (presentPosition.draw) {
            presentPosition.draw(play);
        }
    }
}

window.addEventListener('keydown', function (e) {
    const keyboardCode = e.which || e.keyCode;
    console.log('keyboardCode is: ', keyboardCode);
    if (keyboardCode == 32 || keyboardCode == 37 || keyboardCode == 39) {
        e.preventDefault();
    }
    play.keyDown(keyboardCode);
});

window.addEventListener('keyup', function (e) {
    const keyboardCode = e.which || e.keyCode;
    play.keyUp(keyboardCode);
});

const play = new GameBasics(canvas);
play.sounds = new Sounds();
play.sounds.init();
play.start();
