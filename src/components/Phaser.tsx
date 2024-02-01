import { AUTO, Game, WEBGL } from 'phaser';
import { useEffect, useRef } from 'react';

import HomeScene from '@/scenes/home';
import NoticeScene from '@/scenes/notice';

/**
 * @returns 페이저 캔버스 컴포넌트
 */
const Phaser = () => {
  const PhaserGameRef = useRef<Game | null>(null);

  useEffect(() => {
    const gameArea = document.getElementById('game-area');

    const config = {
      type: WEBGL,
      width: 800,
      height: 500,
      AUTO,
      gameArea,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: [HomeScene, NoticeScene],
    };

    PhaserGameRef.current = new Game(config);

    return () => {
      PhaserGameRef.current?.destroy(true, true);
      PhaserGameRef.current = null;
    };
  }, []);

  return <div id="game-area" className="font-MaplestoryBold"></div>;
};

export default Phaser;
