import { Scene } from 'phaser';

import { gameRound1Problems } from '@/constants/game';

const alphabets = 'abcdefghijklmnopqrstuvwxyz';

interface Item {
  currentItem: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  isRemoved: boolean;
  locX: number;
}

interface AnswerAlphabet {
  alphabet: string;
  isCollected: boolean;
  locX: number;
}

class Round1Scene extends Scene {
  private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
  private poi: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
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

  constructor() {
    super('round1-scene');

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

    this.createRandomAlphabet();
    this.createAnswerAlphabet();
  }

  /**
   * 랜덤 알파벳 생성 함수
   */
  createRandomAlphabet() {
    const randomIdx = () => Math.floor(Math.random() * 25);
    const randomGravity = () => Math.ceil(Math.random() * 2) * 100;

    this.state.forEach((item, idx) => {
      if (item.isRemoved) {
        item.currentItem = this.physics.add.image(
          item.locX,
          0,
          `alphabet-${alphabets[randomIdx()]}`
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
        .setScale(0.7);
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

        this.setAnswer();
        this.createAnswerAlphabet();
      }
    }
  }

  update(): void {
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

    /**
     * overlap 되는 경우
     */
    this.state.forEach((currState, index) => {
      this.poi &&
        this.physics.overlap(this.poi, currState.currentItem, () => {
          currState.currentItem?.destroy();

          const ANSWER = gameRound1Problems[this.currentProblemOrder];
          const itemContent = currState.currentItem?.texture.key.slice(-1);

          // 아이템이 정답인 경우
          if (itemContent && ANSWER.indexOf(itemContent) !== -1) {
            const targetItems = this.answer.filter(
              item => item.alphabet === itemContent
            );

            targetItems.map(targetItem => {
              if (targetItem.isCollected === false) {
                this.updateAnswerAlphabet(targetItem.alphabet);
              }
            });
          }
          this.setState(index); // true
          this.createRandomAlphabet();
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
