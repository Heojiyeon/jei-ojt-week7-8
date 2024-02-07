import { AUTO, Game, WEBGL } from 'phaser';
import { useEffect, useRef } from 'react';

import FeedbackScene from '@/scenes/feedback';
import HomeScene from '@/scenes/home';
import NoticeScene from '@/scenes/notice';
import Round1Scene from '@/scenes/round1';
import Round2Scene from '@/scenes/round2';
import Round3Scene from '@/scenes/round3';

/**
 * @returns 페이저 캔버스 컴포넌트
 */
const Player = () => {
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
          debug: false,
        },
      },
      scene: [
        HomeScene,
        NoticeScene,
        Round1Scene,
        Round2Scene,
        Round3Scene,
        FeedbackScene,
      ],
    };

    PhaserGameRef.current = new Game(config);

    return () => {
      PhaserGameRef.current?.destroy(true, true);
      PhaserGameRef.current = null;
    };
  }, []);

  return <div id="game-area" className="font-MaplestoryBold"></div>;
};

export default Player;
