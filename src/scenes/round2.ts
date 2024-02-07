import { GameObjects } from 'phaser';

import Poi from '@/components/Poi';
import { gameRound2Problems } from '@/constants/game';
import { AnswerAlphabet } from '@/types/game';

import BaseRoundScene from './BaseRound';

const alphabets = 'abcdefghijklmnopqrstuvwxyz';

class Round2Scene extends BaseRoundScene {
  private poi: Phaser.Physics.Arcade.Sprite | undefined;
  private crocodile:
    | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    | undefined;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  private answerItems: Phaser.Physics.Arcade.StaticGroup | undefined;

  private answer: AnswerAlphabet[];
  private hpText: GameObjects.Text | undefined;

  constructor() {
    super('round2-scene');

    // 정답 상태
    this.answer = gameRound2Problems[this.currentProblemOrder]
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

    this.add
      .image(
        gameWidth - gameWidth / 2,
        gameHeight - gameHeight / 2,
        'round2Background'
      )
      .setScale(undefined, 1.1);

    this.add
      .image(gameWidth - gameWidth / 8, gameHeight / 6, 'displayBoard')
      .setScale(undefined, 1.1);

    this.poi = new Poi(this, gameWidth - gameWidth / 2, gameHeight - 150);

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

    this.hpText = this.add.text(16, 16, 'HP: 100', {
      fontSize: '32px',
      color: '#000',
    });

    this.crocodile = this.physics.add.sprite(
      gameWidth - gameWidth / 8,
      gameHeight - 150,
      'crocodile',
      0
    );

    this.crocodile.body.setGravityY(300);

    this.crocodile.setCollideWorldBounds(true);
    this.crocodile.body.onWorldBounds = true;

    this.physics.add.collider(floor, this.crocodile);
    this.crocodile!.setVelocityX(-100);

    // crocodile 스프라이트가 왼쪽 벽에 부딪혔을 때 발생하는 이벤트 핸들러
    this.physics.world.on(
      'worldbounds',
      (
        body: Phaser.Physics.Arcade.Body,
        _up: boolean,
        _down: boolean,
        left: boolean,
        right: boolean
      ) => {
        if (body.gameObject === this.crocodile && left) {
          // 왼쪽 벽에 부딪혔을 때 방향을 변경
          this.crocodile!.flipX = true;

          this.crocodile?.setX(100);
          this.crocodile!.setVelocityX(100);
        } else if (body.gameObject === this.crocodile && right) {
          this.crocodile!.flipX = false;

          this.crocodile?.setX(700);
          this.crocodile!.setVelocityX(-100);
        }
      }
    );

    this.physics.add.overlap(this.poi, this.crocodile, () => {
      this.sound.add('failureAudio').play();

      this.poi?.setX(this.poi.x - 100);

      this.setHpContent(false);
      this.hpText?.setText(`HP: ${this.hpContent}`);

      this.poi?.setTint(0xff9a9e);

      this.time.delayedCall(300, () => {
        this.poi?.clearTint();
      });
    });

    this.cursors = this.input.keyboard?.createCursorKeys();

    this.createRandomAlphabet();
    this.createAnswerAlphabet();
  }

  setAnswer() {
    this.answer = [];

    this.answer = gameRound2Problems[this.currentProblemOrder]
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
    const randomIdx = () => Math.floor(Math.random() * 26);
    const randomGravity = () => Math.ceil(Math.random() * 2) * 100;

    this.state?.forEach((item, idx) => {
      if (item.isRemoved) {
        item.currentItem = this.physics.add.image(
          item.locX,
          0,
          randomIdx() < 25
            ? `alphabet-${alphabets[randomIdx()]}`
            : randomIdx() === 25
              ? 'seed'
              : 'banana'
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

        if (this.currentProblemOrder >= gameRound2Problems.length) {
          this.time.delayedCall(500, () => {
            this.scene.stop('round2-scene');
            this.scene.launch('feedback-scene', {
              currentRound: 2,
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
    if (this.poi) {
      this.poi.update(this.cursors);
    }

    /**
     * overlap 되는 경우
     */
    this.state?.forEach((currState, index) => {
      this.poi &&
        this.physics.overlap(this.poi, currState.currentItem, () => {
          currState.currentItem?.destroy();

          const ANSWER = gameRound2Problems[this.currentProblemOrder];
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
              this.scene.stop('round2-scene');
              this.scene.launch('feedback-scene', {
                currentRound: 2,
                isGameOver: true,
              });

              return;
            });
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

export default Round2Scene;
