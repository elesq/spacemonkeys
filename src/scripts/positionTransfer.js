function TransferPosition(level) {
    this.level = level;
    this.fontSize = 140;
    this.fontColor = 255;
}

TransferPosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = this.fontSize + 'px fantasy';
    ctx.textAlign = 'center';
    ctx.fillStyle =
        'rgba(255,' + this.fontColor + ', ' + this.fontColor + ', 1)';
    ctx.fillText('Level ' + this.level, play.width / 2, play.height / 2);
};

TransferPosition.prototype.update = function (play) {
    this.fontSize -= 1;
    this.fontColor -= 1.5;

    if (this.fontSize < 1) {
        play.goToPosition(new InGamePosition(play.settings, this.level));
    }
};
