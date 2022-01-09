function PausePosition() {}

PausePosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.fillStyle = 'hotpink';
    ctx.font = '50px fantasy';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', play.width / 2, play.height / 2 - 100);

    ctx.fillStyle = 'mintcream';
    ctx.font = '20px fantasy';
    ctx.textAlign = 'center';
    ctx.fillText('Resume Game: (p)', play.width / 2, play.height / 2 + 40);
    ctx.fillText('Quit Game: (esc)', play.width / 2, play.height / 2 + 100);
};

PausePosition.prototype.keyDown = function (play, keyboardCode) {
    // letter 'p' unpauses
    if (keyboardCode == 80) {
        play.popPosition();
    }

    // esc quits game
    if (keyboardCode == 27) {
        play.pushPosition(new GameOverPosition());
    }
};
