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

let player;
let cursors;
let worldWidth;
let worldHeight;
let redCar;
let purpleCar;
let gameOver = false;

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

  function shuffle(array) {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  const cars = [{
    x: -150,
    y: worldHeight - 223,
    v: 200,
    flipX: false,
  }, {
    x: worldWidth + 450,
    y: worldHeight - 317,
    v: -200,
    flipX: true,
  }];

  const carsRandomized = shuffle(cars);

  console.log(carsRandomized[0].x);

  redCar = this.physics.add.image(carsRandomized[0].x, carsRandomized[0].y, 'redCar');
  redCar.setVelocity(carsRandomized[0].v, 0);
  redCar.flipX = carsRandomized[0].flipX;

  purpleCar = this.physics.add.image(carsRandomized[1].x, carsRandomized[1].y, 'purpleCar');
  purpleCar.setVelocity(carsRandomized[1].v, 0);
  purpleCar.flipX = carsRandomized[1].flipX;

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