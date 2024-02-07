class Poi extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'poi');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('poi', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'poi', frame: 2 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('poi', { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });

    this.setCollideWorldBounds(true);
    this.setGravityY(300);
    this.setScale(0.5);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors) {
      if (cursors.left.isDown) {
        this.setVelocityX(-300);

        this.anims.play('left', true);
      } else if (cursors.right.isDown) {
        this.setVelocityX(300);

        this.anims.play('right', true);
      } else {
        this.setVelocityX(0);

        this.anims.play('turn');
      }

      if (cursors.up.isDown && this.body?.touching.down) {
        this.setVelocityY(-300);
      }
    }
  }
}

export default Poi;
