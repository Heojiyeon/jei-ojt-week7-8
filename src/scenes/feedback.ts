import { Scene } from 'phaser';

type InitProp = {
  currentRound: number | undefined;
  isGameOver?: boolean | undefined;
};

class FeedbackScene extends Scene {
  private currentRound: number | undefined;
  private isGameOver?: boolean | undefined;

  constructor() {
    super('feedback-scene');
  }

  init(props: InitProp) {
    this.currentRound = props.currentRound;
    this.isGameOver = props.isGameOver;
  }

  preload() {
    this.load.image('round1Background', 'assets/backgrounds/bg_step_1.webp');
    this.load.image('round2Background', 'assets/backgrounds/bg_step_2.webp');
    this.load.image('round3Background', 'assets/backgrounds/bg_step_3.webp');

    this.load.image('gameOverText', 'assets/texts/gameover.webp');
    this.load.image('gameSuccessText', 'assets/texts/gamesuccess.webp');
    this.load.image('roundText', 'assets/texts/round.webp');
  }

  create() {
    const gameWidth = Number(this.game.config.width);
    const gameHeight = Number(this.game.config.height);

    if (this.isGameOver !== undefined) {
      this.currentRound &&
        this.add
          .image(
            gameWidth - gameWidth / 2,
            gameHeight - gameHeight / 2,
            `round${this.currentRound}Background`
          )
          .setScale(undefined, 1.1);

      this.add.image(
        gameWidth - gameWidth / 2,
        gameHeight - gameHeight / 2,
        `${this.isGameOver ? 'gameOverText' : 'gameSuccessText'}`
      );
    } else {
      this.currentRound &&
        this.add
          .image(
            gameWidth - gameWidth / 2,
            gameHeight - gameHeight / 2,
            `round${this.currentRound + 1}Background`
          )
          .setScale(undefined, 1.1);

      this.add.image(
        gameWidth - gameWidth / 2,
        gameHeight - gameHeight / 2,
        'roundText'
      );

      this.currentRound &&
        this.add.text(
          gameWidth - gameWidth / 2 + 100,
          gameHeight - gameHeight / 2 - 20,
          String(this.currentRound + 1),
          {
            color: '000000',
            fontSize: '40px',
          }
        );
    }

    if (this.isGameOver === undefined && this.currentRound !== 3) {
      this.time.delayedCall(2000, () => {
        this.scene.stop('feedback-scene');
        this.scene.launch(`round${this.currentRound! + 1}-scene`);
      });
    } else {
      this.time.delayedCall(2000, () => {
        this.scene.remove('feedback-scene');
        this.scene.start(`home-scene`);
      });
    }
  }
}

export default FeedbackScene;
