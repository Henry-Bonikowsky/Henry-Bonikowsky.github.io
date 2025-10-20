const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#f0f0f0',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player, cursors, token;

function preload() {
  this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  this.load.image('token', 'https://labs.phaser.io/assets/sprites/star.png');
}

function create() {
  player = this.physics.add.sprite(400, 300, 'player');
  token = this.physics.add.sprite(200, 200, 'token');

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.overlap(player, token, () => {
    token.destroy();
    console.log('Token collected!');
  }, null, this);
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    player.setVelocityY(200);
  }
}
