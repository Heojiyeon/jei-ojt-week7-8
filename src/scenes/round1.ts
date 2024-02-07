import { GameObjects } from 'phaser';

import { gameRound1Problems } from '@/constants/game';
import { AnswerAlphabet } from '@/types/game';

import BaseRoundScene from './BaseRound';

const alphabets = 'abcdefghijklmnopqrstuvwxyz';

class Round1Scene extends BaseRoundScene {
  private poi: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  private answerItems: Phaser.Physics.Arcade.StaticGroup | undefined;

  private answer: AnswerAlphabet[];
  private hpText: GameObjects.Text | undefined;

  constructor() {
    super('round1-scene');

    // 정답 상태
    this.answer = gameRound1Problems[this.currentProblemOrder]
      .split('')
      .map((currentAlphabet, idx) => {
        return {
          alphabet: currentAlphabet,
          isCollected: false,
          locX: 640 + idx * 30,
        };
      });
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    const gameWidth = Number(this.game.config.width);
    const gameHeight = Number(this.game.config.height);

    this.sound
      .add('backgroundAudio', {
        volume: 0.6,
        loop: true,
      })
      .play();

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

    this.poi = this.physics.add
      .sprite(gameWidth - gameWidth / 2, gameHeight - 150, 'poi', 2)
      .setScale(0.5);

    this.poi.body.setGravityY(300);
    this.poi.setCollideWorldBounds(true);

    /**
     * floor 생성
     */
    const floor = this.platforms!.create(
      gameWidth - gameWidth / 2,
      gameHeight,
      'floor'
    ).setScale(2);
    floor.refreshBody();

    this.add.existing(floor);
    this.physics.add.collider(this.poi, floor);

    this.cursors = this.input.keyboard?.createCursorKeys();

    this.anims.exists('left');
    this.anims.exists('turn');
    this.anims.exists('right');

    if (
      !this.anims.exists('left') ||
      !this.anims.exists('turn') ||
      !this.anims.exists('right')
    ) {
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

    this.hpText = this.add.text(16, 16, 'HP: 100', {
      fontSize: '32px',
      color: '#000',
    });

    this.createRandomAlphabet();
    this.createAnswerAlphabet();
  }

  setAnswer() {
    this.answer = [];

    this.answer = gameRound1Problems[this.currentProblemOrder]
      .split('')
      .map((currentAlphabet, idx) => {
        return {
          alphabet: currentAlphabet,
          isCollected: false,
          locX: 640 + idx * 30,
        };
      });
  }

  /**
   * 랜덤 알파벳 생성 함수
   */
  createRandomAlphabet() {
    const randomIdx = (lastIndex: number) =>
      Math.floor(Math.random() * lastIndex);
    const randomGravity = () => Math.ceil(Math.random() * 2) * 100;

    const answers = this.answer.map(item => item.alphabet).join('');
    const restAlphabets = alphabets
      .split('')
      .filter(item => answers.indexOf(item) === -1);

    const selects = [1, 2, 4, 5];
    const randomItemLocation = selects[randomIdx(selects.length)];

    this.state?.forEach((item, idx) => {
      if (item.isRemoved) {
        item.currentItem = this.physics.add.image(
          item.locX,
          0,
          idx === 0 || idx === 3 || idx === 6
            ? `alphabet-${restAlphabets[randomIdx(restAlphabets.length)]}`
            : randomItemLocation === idx
              ? this.hpContent! < 50
                ? 'banana'
                : 'seed'
              : `alphabet-${answers[randomIdx(answers.length)]}`
        );

        item.currentItem.setGravityY(randomGravity());

        this.setState(idx); // false
      }
    });
  }

  /**
   * 답안 알파벳 생성 함수
   */
  createAnswerAlphabet() {
    if (this.answerItems) {
      this.answerItems.destroy(true, true);
    }

    this.answerItems = this.physics.add.staticGroup();

    this.answer.forEach(item => {
      this.answerItems
        ?.create(item.locX, 80, `alphabet-${item.alphabet}`)
        .setAlpha(0.4)
        .setScale(0.5);
    });
  }

  /**
   * 획득한 정답 알파벳 생성 함수
   */
  updateAnswerAlphabet(currentAlphabet: string) {
    this.answer = this.answer.map(item => {
      return item.alphabet === currentAlphabet
        ? {
            ...item,
            isCollected: true,
          }
        : item;
    });

    const targetItem = this.answer.filter(item => item.isCollected === true);

    if (targetItem.length > 0) {
      targetItem.map(item => {
        this.answerItems
          ?.create(item.locX, 80, `alphabet-${item.alphabet}`)
          .setAlpha(1)
          .setScale(0.7);
      });

      const remainingCorrectItem = this.answer.filter(
        item => item.isCollected === false
      );

      if (remainingCorrectItem.length === 0) {
        this.setCurrentProblemOrder();

        if (this.currentProblemOrder >= gameRound1Problems.length) {
          this.time.delayedCall(500, () => {
            this.scene.stop('round1-scene');
            this.scene.launch('feedback-scene', {
              currentRound: 1,
            });
          });
          return;
        } else {
          this.setAnswer();
          this.createAnswerAlphabet();
        }
      }
    }
  }

  update(): void {
    if (this.cursors && this.poi) {
      if (this.cursors.left.isDown) {
        this.poi.setVelocityX(-300);

        this.poi.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.poi.setVelocityX(300);

        this.poi.anims.play('right', true);
      } else {
        this.poi.setVelocityX(0);

        this.poi.anims.play('turn');
      }

      if (this.cursors.up.isDown && this.poi.body.touching.down) {
        this.poi.setVelocityY(-200);
      }
    }

    /**
     * overlap 되는 경우
     */
    this.state?.forEach((currState, index) => {
      this.poi &&
        this.physics.overlap(this.poi, currState.currentItem, () => {
          currState.currentItem?.destroy();

          const ANSWER = gameRound1Problems[this.currentProblemOrder];
          const itemContent = currState.currentItem?.texture.key.slice(-1);

          // 씨앗인 경우
          if (currState.currentItem?.texture.key === 'seed') {
            this.sound.add('failureAudio').play();

            this.setHpContent(false);
            this.hpText?.setText(`HP: ${this.hpContent}`);

            this.poi?.setTint(0xff0000);

            this.time.delayedCall(500, () => {
              this.poi?.clearTint();
            });
          }

          // 바나나인 경우
          else if (currState.currentItem?.texture.key === 'banana') {
            this.sound.add('successAudio').play();

            this.setHpContent(true);
            this.hpText?.setText(`HP: ${this.hpContent}`);
          }

          // 아이템이 정답인 경우
          else if (itemContent && ANSWER.indexOf(itemContent) !== -1) {
            this.sound.add('successAudio').play();
            const targetItems = this.answer.filter(
              item => item.alphabet === itemContent
            );

            if (!targetItems) return;

            targetItems.map(targetItem => {
              if (targetItem.isCollected === false) {
                this.updateAnswerAlphabet(targetItem.alphabet);
              }
            });
          } else if (itemContent && ANSWER.indexOf(itemContent) === -1) {
            this.sound.add('failureAudio').play();

            this.setHpContent(false);
            this.hpText?.setText(`HP: ${this.hpContent}`);

            this.poi?.setTint(0xff9a9e);

            this.time.delayedCall(300, () => {
              this.poi?.clearTint();
            });
          }

          this.setState(index); // true
          this.createRandomAlphabet();

          // 게임 종료
          if (this.hpContent! <= 0) {
            this.time.delayedCall(300, () => {
              this.scene.stop('round1-scene');
              this.scene.launch('feedback-scene', {
                currentRound: 1,
                isGameOver: true,
              });
            });

            return;
          }
        });

      // 아이템과 바닥이 overlap 되는 경우
      if (currState.currentItem && this.platforms) {
        this.physics.overlap(currState.currentItem, this.platforms, () => {
          currState.currentItem?.destroy();

          this.setState(index); //true
          this.createRandomAlphabet();
        });
      }
    });
  }
}

export default Round1Scene;
