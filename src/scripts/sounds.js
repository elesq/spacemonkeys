function Sounds() {
    this.muted = false;
}

Sounds.prototype.init = function () {
    this.soundSources = [
        'src/sounds/spaceship_fire.wav',
        'src/sounds/player_dies.mp3',
        'src/sounds/enemy_dies.wav',
    ];

    this.allSounds = [];

    for (let i = 0; i < this.soundSources.length; i++) {
        this.allSounds[i] = new Audio();
        this.allSounds[i].src = this.soundSources[i];
        this.allSounds[i].setAttribute('preload', 'auto');
    }
};

Sounds.prototype.playSound = function (soundName) {
    if (this.muted) {
        return;
    }

    let soundIndex;
    switch (soundName) {
        case 'shot':
            soundIndex = 0;
            break;
        case 'takingfire':
            soundIndex = 1;
            break;
        case 'enemydown':
            soundIndex = 2;
            break;
        default:
            break;
    }

    this.allSounds[soundIndex].play();
    this.allSounds[soundIndex].currentTime = 0;
};

Sounds.prototype.mute = function () {
    this.muted = !this.muted;
};
