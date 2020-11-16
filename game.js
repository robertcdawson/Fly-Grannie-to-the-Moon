var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#333",
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('grass', 'assets/grass.png');
  this.load.image('street', 'assets/street.png');
  this.load.image('player', 'assets/phaser-dude.png');
  this.load.image('redCar', 'assets/car-red.png');
  this.load.image('purpleCar', 'assets/car-purple.png');
}

var player;
var cursors;
var worldWidth;
var worldHeight;
var redCar;
var purpleCar;
var gameOver = false;

function create() {
  this.physics.world.setBounds(0, 0, 800, 1500, 0, true, true, true, true);

  worldWidth = this.physics.world.bounds.width;
  worldHeight = this.physics.world.bounds.height;

  cursors = this.input.keyboard.createCursorKeys();

  grass = this.physics.add.staticGroup();
  grass.create(worldWidth / 2, worldHeight - 90, 'grass').setScale(.9).refreshBody();

  street = this.physics.add.staticGroup();
  street.create(worldWidth / 2, worldHeight - 270, 'street').setScale(.9).refreshBody();

  grass.create(worldWidth / 2, worldHeight - 450, 'grass').setScale(.9).refreshBody();

  street.create(worldWidth / 2, worldHeight - 630, 'street').setScale(.9).refreshBody();
  street.create(worldWidth / 2, worldHeight - 830, 'street').setScale(.9).refreshBody();

  grass.create(worldWidth / 2, worldHeight - 1000, 'grass').setScale(.9).refreshBody();

  redCar = this.physics.add.image(-150, worldHeight - 223, 'redCar');
  redCar.setVelocity(200, 0);

  purpleCar = this.physics.add.image(worldWidth + 450, worldHeight - 317, 'purpleCar');
  purpleCar.setSize(192, 85, -150);
  purpleCar.flipX = true;
  purpleCar.setVelocity(-200, 0);

  player = this.physics.add.sprite(worldWidth / 2, worldHeight - 120, 'player');
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, redCar, hitCar, null, this);
  this.physics.add.collider(player, purpleCar, hitCar, null, this);
}

function update() {
  if (gameOver) {
    return;
  }

  player.setVelocity(0, 0);
  if (cursors.up.isDown) {
    player.setVelocityY(-100);
  }
  else if (cursors.down.isDown) {
    player.setVelocityY(100);
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-100);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(100);
  }

  var camera = this.cameras.main;
  this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
  camera.startFollow(player, false, 1, 1, 0, 0);

  this.physics.world.wrap(redCar, 300);
  this.physics.world.wrap(purpleCar, 300);
}

function hitCar(player, car) {
  this.physics.pause();

  player.setTint(0xff0000);

  gameOver = true;
}