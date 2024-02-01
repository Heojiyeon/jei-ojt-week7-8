import { Scene } from 'phaser';

class HomeScene extends Scene {
  constructor() {
    super('home-scene');
  }

  preload() {
    this.load.image('homeBackground', 'assets/backgrounds/bg_step_1.webp');
    this.load.image(
      'startBeforeButton',
      'assets/buttons/btn_game_start_before.webp'
    );
    this.load.image(
      'startAfterButton',
      'assets/buttons/btn_game_start_after.webp'
    );
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

    const startButton = this.add
      .image(
        gameWidth - gameWidth / 2,
        gameHeight - gameHeight / 3,
        'startBeforeButton'
      )
      .setScale(0.4, 0.4);

    startButton.setInteractive();

    const handleClickStartButton = () => {
      startButton.destroy();

      this.add
        .image(
          gameWidth - gameWidth / 2,
          gameHeight - gameHeight / 3,
          'startAfterButton'
        )
        .setScale(0.4, 0.4);

      this.cameras.main.fadeOut(500, 202, 255, 251);

      this.time.delayedCall(1000, () => {
        this.scene.launch('notice-scene');
      });
    };

    this.input.on('gameobjectdown', handleClickStartButton);
  }
}

export default HomeScene;
