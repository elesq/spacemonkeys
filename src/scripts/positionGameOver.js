function GameOverPosition() {}

GameOverPosition.prototype.draw = function () {
    ctx.clearRect(0, 0, play.width, play.height);
    // display the levels data
    ctx.fillStyle = 'mediumpurple';
    ctx.textAlign = 'center';
    ctx.font = '40px fantasy';
    ctx.fillText('GAME OVER', play.width / 2, play.height / 2 - 120);

    ctx.font = '18px fantasy';
    ctx.fillText(
        `You reached level: ${play.level}`,
        play.width / 2,
        play.height / 2
    );
    ctx.fillText(
        `You scored: ${play.score}`,
        play.width / 2,
        play.height / 2 + 30
    );

    ctx.fillStyle = 'oldlace';
    ctx.textAlign = 'center';
    ctx.fillText(
        'press SPACE to continue',
        play.width / 2,
        play.height / 2 + 80
    );
};

GameOverPosition.prototype.keyDown = function (play, keyboardCode) {
    if (keyboardCode == 32) {
        play.goToPosition(new OpeningPosition());
    }
};
