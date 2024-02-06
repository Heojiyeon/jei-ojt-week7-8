import { GameObjects, Scene } from 'phaser';

import { gameRound3Problems } from '@/constants/game';

import { AnswerAlphabet, Item } from './round1';

const alphabets = 'abcdefghijklmnopqrstuvwxyz';

class Round3Scene extends Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
  private poi: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private crocodile:
    | Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    | undefined;
  private bat: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  // 떨어지는 아이템
  private item1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  private item2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  private item3: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  private item4: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  private item5: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  private item6: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  private item7: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;

  private answerItems: Phaser.Physics.Arcade.StaticGroup | undefined;

  private state: Item[];

  // 문제 번호
  private currentProblemOrder: number;

  // 알파벳을 획득한 경우의 상태
  private correctAlphabets: string[];

  // 정답과 해당 알파벳의 획득 여부
  private answer: AnswerAlphabet[];

  // hp 잔여량
  private hpContent: number;
  private hpText: GameObjects.Text | undefined;

  constructor() {
    super('round3-scene');

    this.state = [
      {
        currentItem: this.item1,
        isRemoved: true,
        locX: 100,
      },
      {
        currentItem: this.item2,
        isRemoved: true,
        locX: 200,
      },
      {
        currentItem: this.item3,
        isRemoved: true,
        locX: 300,
      },
      {
        currentItem: this.item4,
        isRemoved: true,
        locX: 400,
      },
      {
        currentItem: this.item5,
        isRemoved: true,
        locX: 500,
      },
      {
        currentItem: this.item6,
        isRemoved: true,
        locX: 600,
      },
      {
        currentItem: this.item7,
        isRemoved: true,
        locX: 700,
      },
    ];

    this.currentProblemOrder = 0;
    this.correctAlphabets = [];

    // 정답 상태
    this.answer = gameRound3Problems[this.currentProblemOrder]
      .split('')
      .map((currentAlphabet, idx) => {
        return {
          alphabet: currentAlphabet,
          isCollected: false,
          locX: 640 + idx * 30,
        };
      });

    this.hpContent = 100;
  }

  preload() {
    this.load.image('homeBackground', 'assets/backgrounds/bg_step_3.webp');
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

    this.load.spritesheet(
      'crocodile',
      'assets/characters/croc_spritesheet.webp',
      {
        frameWidth: 100,
        frameHeight: 80,
      }
    );

    this.load.spritesheet('bat', 'assets/characters/bat_spritesheet.webp', {
      frameWidth: 200,
      frameHeight: 73,
    });

    this.load.image('seed', 'assets/items/item_seed.webp');
    this.load.image('banana', 'assets/items/item_banana.webp');
  }

  setState(index: number) {
    this.state[index] = {
      ...this.state[index],
      isRemoved: !this.state[index].isRemoved,
    };
  }

  setCurrentProblemOrder() {
    this.currentProblemOrder = this.currentProblemOrder + 1;
  }

  setCorrectAlphabets(correctAlphabet: string) {
    this.correctAlphabets.push(correctAlphabet);
  }

  setAnswer() {
    this.answer = [];

    this.answer = gameRound3Problems[this.currentProblemOrder]
      .split('')
      .map((currentAlphabet, idx) => {
        return {
          alphabet: currentAlphabet,
          isCollected: false,
          locX: 640 + idx * 30,
        };
      });
  }

  setHpContent(isIncrease: boolean) {
    if (isIncrease) {
      this.hpContent <= 100 ? (this.hpContent += 10) : 100;
    } else {
      this.hpContent >= 20 ? (this.hpContent -= 20) : 0;
    }
  }

  /**
   * 랜덤 알파벳 생성 함수
   */
  createRandomAlphabet() {
    const randomIdx = () => Math.floor(Math.random() * 26);
    const randomGravity = () => Math.ceil(Math.random() * 2) * 100;

    this.state.forEach((item, idx) => {
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

        if (this.currentProblemOrder >= gameRound3Problems.length) {
          this.time.delayedCall(500, () => {
            this.scene.stop('round2-scene');
            this.scene.launch('feedback-scene', {
              currentRound: 3,
              isGameOver: false,
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

    this.crocodile = this.physics.add.sprite(
      gameWidth - gameWidth / 8,
      gameHeight - 150,
      'crocodile',
      0
    );

    this.crocodile.body.setGravityY(300);

    this.crocodile.setCollideWorldBounds(true);
    this.crocodile.body.onWorldBounds = true;

    this.physics.add.collider(this.platforms, this.crocodile);
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
      this.poi?.setX(this.poi.x - 100);

      this.setHpContent(false);
      this.hpText?.setText(`HP: ${this.hpContent}`);

      this.poi?.setTint(0xff9a9e);

      this.time.delayedCall(300, () => {
        this.poi?.clearTint();
      });
    });

    this.bat = this.physics.add
      .sprite(gameWidth - gameWidth / 2, gameHeight - 320, 'bat', 0)
      .setScale(0.6);
    this.bat.setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard?.createCursorKeys();

    /**
     * 박쥐 애니메이션
     */

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1,
    });

    /**
     * 포이 애니메이션
     */
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

    this.hpText = this.add.text(16, 16, 'HP: 100', {
      fontSize: '32px',
      color: '#000',
    });

    this.createRandomAlphabet();
    this.createAnswerAlphabet();
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
        this.poi.setVelocityY(-300);
      }

      if (this.bat) {
        this.bat.anims.play('fly', true);
      }
    }
    /**
     * overlap 되는 경우
     */
    this.state.forEach((currState, index) => {
      this.poi &&
        this.physics.overlap(this.poi, currState.currentItem, () => {
          currState.currentItem?.destroy();

          const ANSWER = gameRound3Problems[this.currentProblemOrder];
          const itemContent = currState.currentItem?.texture.key.slice(-1);

          // 씨앗인 경우
          if (currState.currentItem?.texture.key === 'seed') {
            this.setHpContent(false);
            this.hpText?.setText(`HP: ${this.hpContent}`);

            this.poi?.setTint(0xff0000);

            this.time.delayedCall(500, () => {
              this.poi?.clearTint();
            });
          }

          // 바나나인 경우
          else if (currState.currentItem?.texture.key === 'banana') {
            this.setHpContent(true);
            this.hpText?.setText(`HP: ${this.hpContent}`);
          }

          // 아이템이 정답인 경우
          else if (itemContent && ANSWER.indexOf(itemContent) !== -1) {
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
          if (this.hpContent <= 0) {
            this.time.delayedCall(300, () => {
              this.scene.stop('round3-scene');
              this.scene.launch('feedback-scene', {
                currentRound: 3,
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

export default Round3Scene;
