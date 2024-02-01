import { AUTO, Game, WEBGL } from 'phaser';
import { useEffect, useRef } from 'react';

/**
 * @returns 페이저 캔버스 컴포넌트
 */
const Phaser = () => {
  const PhaserGameRef = useRef<Game | null>(null);

  useEffect(() => {
    const gameArea = document.getElementById('game-area');

    const config = {
      type: WEBGL,
      width: 1200,
      height: 700,
      AUTO,
      gameArea,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: [],
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
