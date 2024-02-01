import { Scene } from 'phaser';

class NoticeScene extends Scene {
  constructor() {
    super('notice-scene');
  }

  preload() {
    this.load.image('homeBackground', 'assets/backgrounds/bg_step_1.webp');
    this.load.image('noticeBoard', 'assets/boards/board_notice.webp');
  }

  create() {
    this.cameras.main.fadeIn(500, 202, 255, 251);

    const gameWidth = Number(this.game.config.width);
    const gameHeight = Number(this.game.config.height);

    this.add
      .image(
        gameWidth - gameWidth / 2,
        gameHeight - gameHeight / 2,
        'homeBackground'
      )
      .setScale(undefined, 1.1);

    this.add.image(
      gameWidth - gameWidth / 2,
      gameHeight - gameHeight / 2,
      'noticeBoard'
    );

    this.time.delayedCall(500, () => {
      this.scene.launch('round1-scene');
    });
  }
}

export default NoticeScene;
