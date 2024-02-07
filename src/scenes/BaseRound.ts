import Phaser, { Scene } from 'phaser';

import { Item } from '@/types/game';

const alphabets = 'abcdefghijklmnopqrstuvwxyz';

class BaseRoundScene extends Scene {
  state: Item[] | undefined;
  // 떨어지는 아이템
  item1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  item2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  item3: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  item4: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  item5: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  item6: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  item7: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;

  currentProblemOrder: number;
  // 알파벳을 획득한 경우의 상태
  correctAlphabets: string[];
  hpContent: number | undefined;

  constructor(key: string) {
    super(key);

    this.currentProblemOrder = 0;
    this.correctAlphabets = [];
  }

  preload() {
    this.load.image('homeBackground', 'assets/backgrounds/bg_step_1.webp');
    this.load.image('round2Background', 'assets/backgrounds/bg_step_2.webp');

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

    this.load.audio('backgroundAudio', 'assets/audios/background.mp3');
    this.load.audio('successAudio', 'assets/audios/success.mp3');
    this.load.audio('failureAudio', 'assets/audios/failure.mp3');

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
    this.hpContent = 100;
  }

  /**
   * 랜덤 아이템의 제거 여부 변수를 변경하는 함수
   * @param index 랜덤 아이템의 위치
   */
  setState(index: number) {
    if (this.state) {
      this.state[index] = {
        ...this.state[index],
        isRemoved: !this.state[index].isRemoved,
      };
    }
  }

  setHpContent(isIncrease: boolean) {
    if (this.hpContent) {
      if (isIncrease) {
        this.hpContent <= 100 ? (this.hpContent += 10) : 100;
      } else {
        this.hpContent >= 20 ? (this.hpContent -= 20) : 0;
      }
    }
  }

  setCurrentProblemOrder() {
    this.currentProblemOrder = this.currentProblemOrder + 1;
  }

  setCorrectAlphabets(correctAlphabet: string) {
    this.correctAlphabets.push(correctAlphabet);
  }
}

export default BaseRoundScene;
