function OpeningPosition() {}

OpeningPosition.prototype.draw = function (play) {
    // enemy hunter
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = '60px fatasy';
    ctx.textAlign = 'center';
    const gradient = ctx.createLinearGradient(
        play.width / 2 - 180,
        play.height / 2,
        play.width / 2 + 180,
        play.height / 2
    );

    gradient.addColorStop('0', 'mistyrose');
    gradient.addColorStop('0.25', 'hotpink');
    gradient.addColorStop('0.85', 'mistyrose');
    gradient.addColorStop('0.95', 'white');
    //gradient.addColorStop('0.97', 'pink');

    ctx.fillStyle = gradient;
    ctx.font = '50px fantasy';
    ctx.fillText('SPACEMONKEYS', play.width / 2, play.height / 2 - 100);

    ctx.font = '15px fantasy';
    ctx.fillStyle = 'mistyrose';
    ctx.fillText(
        'Ida & Iris save the planet',
        play.width / 2,
        play.height / 2 - 60
    );

    // press space to start
    //ctx.font = '40px Comic Sans MS';
    ctx.font = '20px fantasy';
    ctx.fillStyle = '#d7df01';
    ctx.fillText('Press SPACE to Start', play.width / 2, play.height / 2 + 25);

    // game controls
    ctx.fillStyle = '#929292';
    ctx.font = '20px fantasy';
    ctx.fillText('Game Controls', play.width / 2, play.height / 2 + 210);
    ctx.fillText('Left: ⬅️', play.width / 2, play.height / 2 + 260);
    ctx.fillText('Right: ➡️ ', play.width / 2, play.height / 2 + 300);
    ctx.fillText('Fire: space', play.width / 2, play.height / 2 + 340);
};

OpeningPosition.prototype.keyDown = function (play, keyboardCode) {
    if (keyboardCode == 32) {
        play.level = 1;
        play.score = 0;
        play.shields = 2;
        play.goToPosition(new TransferPosition(play.level));
    }
};
