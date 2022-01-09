function Objects() {}

Objects.prototype.spaceship = function (x, y, spaceship_image) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 28;
    this.spaceship_image = spaceship_image;
    this.spaceship_image.src = 'src/img/ship.png';
    return this;
};

Objects.prototype.bullet = function (x, y) {
    this.x = x;
    this.y = y;

    return this;
};

Objects.prototype.enemy = function (x, y, line, column, enemy_image) {
    this.x = x;
    this.y = y;
    this.line = line;
    this.column = column;
    this.width = 32;
    this.height = 32;
    this.enemy_image = enemy_image;
    this.enemy_image.src = 'src/img/alien.png';
    return this;
};

Objects.prototype.bomb = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
};
