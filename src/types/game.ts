export interface Item {
  currentItem: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
  isRemoved: boolean;
  locX: number;
}

export interface AnswerAlphabet {
  alphabet: string;
  isCollected: boolean;
  locX: number;
}
