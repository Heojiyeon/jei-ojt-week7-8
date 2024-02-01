import { Scene } from 'phaser';

const alphabets = 'abcdefghijklmnopqrstuvwxyz';

class Round1Scene extends Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
  private poi: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  constructor() {
    super('round1-scene');
  }

  preload() {
    this.load.image('homeBackground', 'assets/backgrounds/bg_step_1.webp');
    this.load.image('floor', 'assets/backgrounds/floor.webp');
    this.load.image('hpBackground', 'assets/backgrounds/hp_background.webp');
    this.load.image('hpContent', 'assets/backgrounds/hp_content.webp');
    this.load.image('displayBoard', 'assets/boards/board_display.webp');

    alphabets.split('').map(alphabet => {
      this.load.image(
        `alphabet-${alphabet}`,
        `assets/alphabets/color_${alphabet}.webp`
      );
    });

    this.load.spritesheet('poi', 'assets/characters/poi_spritesheet.webp', {
      frameWidth: 168,
      frameHeight: 181,
    });
  }

  create() {
    const gameWidth = Number(this.game.config.width);
    const gameHeight = Number(this.game.config.height);

    this.add
      .image(
        gameWidth - gameWidth / 2,
        gameHeight - gameHeight / 2,
        'homeBackground'
      )
      .setScale(undefined, 1.1);

    this.add
      .image(gameWidth - gameWidth / 8, gameHeight / 6, 'displayBoard')
      .setScale(undefined, 1.1);

    this.add.image(gameWidth / 7, gameHeight / 12, 'hpBackground');
    this.add
      .image(gameWidth / 7, gameHeight / 12, 'hpContent')
      .setSize(120, 20);

    this.platforms = this.physics.add.staticGroup();

    this.platforms
      .create(gameWidth - gameWidth / 2, gameHeight, 'floor')
      .setScale(2)
      .refreshBody();

    this.poi = this.physics.add
      .sprite(gameWidth - gameWidth / 2, gameHeight - 150, 'poi', 2)
      .setScale(0.5);

    this.poi.body.setGravityY(300);
    this.poi.setCollideWorldBounds(true);

    this.physics.add.collider(this.poi, this.platforms);

    this.cursors = this.input.keyboard?.createCursorKeys();

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
  }

  update(time: number, delta: number): void {
    if (this.cursors && this.poi) {
      if (this.cursors.left.isDown) {
        this.poi.setVelocityX(-160);

        this.poi.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.poi.setVelocityX(160);

        this.poi.anims.play('right', true);
      } else {
        this.poi.setVelocityX(0);

        this.poi.anims.play('turn');
      }

      if (this.cursors.up.isDown && this.poi.body.touching.down) {
        this.poi.setVelocityY(-400);
      }
    }
  }
}

export default Round1Scene;
