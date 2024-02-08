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

    this.add.text(350, 150, '게임 방법', {
      fontFamily: 'Maplestory-Light',
      fontSize: 20,
      color: '#000000',
    });

    this.add.text(290, 210, '올바른 알파벳을 획득해주세요.', {
      fontFamily: 'Maplestory-Light',
      fontSize: 15,
      color: '#000000',
    });

    this.add.text(290, 240, '틀린 알파벳과 씨앗은 닿으면 아파요.', {
      fontFamily: 'Maplestory-Light',
      fontSize: 15,
      color: '#000000',
    });

    this.add.text(290, 270, '단계 별 악어와 박쥐도 닿으면 아파요.', {
      fontFamily: 'Maplestory-Light',
      fontSize: 15,
      color: '#000000',
    });

    this.add.text(290, 300, '바나나를 먹으면 힘이 나요! :)', {
      fontFamily: 'Maplestory-Light',
      fontSize: 15,
      color: '#0000FF',
    });

    this.time.delayedCall(3000, () => {
      this.scene.stop('notice-scene');
      this.scene.launch('round1-scene');
    });
  }
}

export default NoticeScene;
