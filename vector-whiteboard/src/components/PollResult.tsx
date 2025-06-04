import React, { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import MiniWhiteboard from './MiniWhiteboard';

// Snow animation (copy from QuizResult)
const snowfall = keyframes`
  0% { transform: translateY(-10px) rotate(0deg); }
  100% { transform: translateY(100vh) rotate(360deg); }
`;

const Snowflake = styled.div<{ size: number; left: number; delay: number }>`
  position: fixed;
  top: -10px;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: ${snowfall} ${props => 5 + Math.random() * 5}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1000;
  pointer-events: none;
`;

const SnowContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
`;

// Add starry background animation
const starryBackground = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 100%; }
`;

// Star animation
const twinkle = keyframes`
  0%, 100% { opacity: 0.7; transform: translate(0, 0); }
  50% { opacity: 1; transform: translate(10px, 10px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ViewportContainer = styled.div<{ themeName: string }>`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
      : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  };
`;

const LargeQuizBox = styled.div<{ themeName: string }>`
  position: relative;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  width: 90vw;
  height: 87vh;
  min-width: 320px;
  max-width: 1400px;
  max-height: 900px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #c62828 100%)'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, rgba(10, 10, 40, 0.95) 0%, rgba(15, 20, 50, 0.95) 100%)'
      : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  };
  border-radius: 18px;
  padding: 32px 32px 24px 32px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
`;

const TopLeftBlock = styled.div<{ themeName: string }>`
  position: absolute;
  top: -150px;
  left: -450px;
  width: 740px;
  height: 740px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #c62828 100%)'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FF6B6B 0%, #FFB800 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #4B0082 0%, #6B48FF 100%)'
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-125deg);
  box-shadow: 0 4px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
`;

const BottomRightBlock = styled.div<{ themeName: string }>`
  position: absolute;
  bottom: -30px;
  right: -450px;
  width: 740px;
  height: 740px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #c62828 100%)'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)'
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-45deg);
  box-shadow: 0 4px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 18px;
  letter-spacing: 2px;
  text-align: center;
`;

const QuestionBoard = styled.div`
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  @media (max-width: 600px) {
    margin-bottom: 18px;
  }
`;

const AnswersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  width: 100%;
  margin-bottom: 32px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 16px 0;
  }
`;

const AnswerBox = styled.div<{ themeName: string }>`
  display: flex;
  align-items: center;
  background: ${({ themeName }) =>
    themeName === 'dark'
      ? '#42424288'
      : themeName === 'christmas'
      ? '#fff8'
      : themeName === 'summer'
      ? '#FFB80088'
      : themeName === 'space'
      ? '#0066CC88'
      : '#fff8'};
  border-radius: 12px;
  padding: 8px 44px 8px 12px;
  min-height: 90px;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 120px;
    padding: 8px 24px 8px 4px;
  }
`;

const AnswerNumber = styled.div<{ themeName: string }>`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${({ themeName }) =>
    themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : themeName === 'summer'
      ? '#FFF'
      : themeName === 'space'
      ? '#0088FF'
      : '#222'};
  width: 32px;
  text-align: right;
`;

const AnswerText = styled.div<{ themeName: string }>`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#fff'
      : '#222'
  };
  margin: 8px 0;
  text-align: center;
`;

const VoteBox = styled.div<{ themeName: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ themeName }) => 
    themeName === 'dark'
      ? '#424242'
      : themeName === 'christmas'
      ? '#fff'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#4B0082'
      : '#fff'
  };
  border-radius: 8px;
  margin-left: 12px;
  padding: 4px 6px;
  box-shadow: 0 1px 4px #0001;
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
`;

const VoteScore = styled.div<{ themeName: string }>`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ themeName }) => 
    themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : themeName === 'summer'
      ? '#FFF'
      : themeName === 'space'
      ? '#0088FF'
      : '#222'
  };
  margin: 2px 0;
`;

const BackButton = styled.button<{ themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#388e3c'
      : '#fff'
  };
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#fff'
      : '#ff416c'
  };
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  margin-top: -42px;
  margin-bottom: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px ${({ themeName }) => 
    themeName === 'dark' 
      ? '#42424222'
      : themeName === 'christmas'
      ? '#388e3c22'
      : '#ff416c22'
  };
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#616161'
        : themeName === 'christmas'
        ? '#2e7d32'
        : '#ff416c'
    };
    color: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#fff'
        : themeName === 'christmas'
        ? '#fff'
        : '#fff'
    };
  }
`;

const THEME_COLORS: Record<string, string[]> = {
  dark: ['#388e3c', '#1976d2', '#c62828', '#f6a71b', '#ff416c', '#ff4b2b', '#2d2d2d', '#e20248'],
  christmas: ['#c62828', '#388e3c', '#fff176', '#ffb300', '#fff', '#43a047', '#e53935', '#fbc02d'],
  default: ['#ff416c', '#ff4b2b', '#1bbf3a', '#388e3c', '#1976d2', '#c62828', '#f6a71b', '#2d2d2d', '#e20248', '#43a047', '#ffa500', '#800080', '#008080', '#FF69B4']
};

const BarChart: React.FC<{ data: { label: string; value: number }[]; themeName: string }> = ({ data, themeName }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const colors = THEME_COLORS[themeName] || THEME_COLORS['default'];
  return (
    <div style={{
      width: 400,
      maxWidth: '90vw',
      margin: '0 auto',
      background: themeName === 'dark' ? '#222' : themeName === 'christmas' ? '#fff8' : '#fff',
      borderRadius: 16,
      boxShadow: themeName === 'dark'
        ? '0 2px 12px #0008'
        : themeName === 'christmas'
        ? '0 2px 12px #c6282822'
        : '0 2px 12px #ff416c22',
      padding: 24
    }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 32,
            textAlign: 'right',
            fontWeight: 700,
            color: colors[i % colors.length],
            marginRight: 12,
            fontSize: 18
          }}>{d.label}</div>
          <div style={{
            flex: 1,
            background: themeName === 'dark' ? '#333' : '#eee',
            borderRadius: 8,
            height: 32,
            position: 'relative',
            overflow: 'hidden',
            marginRight: 8
          }}>
            <div style={{
              width: `${(d.value / max) * 100}%`,
              background: colors[i % colors.length],
              height: '100%',
              borderRadius: 8,
              transition: 'width 0.5s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              paddingRight: 16,
              boxShadow: '0 2px 8px #0002'
            }}>{d.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const WinnerBox = styled(AnswerBox)`
  background: linear-gradient(90deg, #ffe066 0%, #ffd700 100%) !important;
  box-shadow: 0 0 32px 0 #ffd70088, 0 0 0 4px #fff6 !important;
  border: 3px solid #ffd700 !important;
  position: relative;
`;

const ConfettiRain = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  z-index: 10;
  overflow: hidden;
`;

const ConfettiPiece = styled.div<{
  color: string;
  left: number;
  duration: number;
  rotate: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}>`
  position: absolute;
  top: -24px;
  left: ${({ left }) => left}%;
  width: ${({ shape }) => shape === 'star' ? '12px' : '8px'};
  height: ${({ shape }) => shape === 'star' ? '12px' : '8px'};
  background: ${({ color }) => color};
  opacity: 0.92;
  animation: confetti-fall ${({ duration }) => duration}s linear infinite;
  transform: rotate(${({ rotate }) => rotate}deg);
  clip-path: ${({ shape }) => {
    switch (shape) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'square':
        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      default:
        return 'circle(50% at 50% 50%)';
    }
  }};
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
    80% { opacity: 1; }
    100% { transform: translateY(180px) rotate(360deg) scale(0.95); opacity: 0.7; }
  }
`;

// Nieuwe animatie: gouden glans overlay
const GoldShine = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 12px;
  z-index: 5;
  background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 40%, rgba(255,215,0,0.25) 60%, rgba(255,255,255,0) 100%);
  background-size: 200% 200%;
  animation: gold-shine-move 2.5s linear infinite;
  @keyframes gold-shine-move {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// Ballonnen animatie
const Balloons = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  z-index: 6;
  overflow: hidden;
`;

const Balloon = styled.div<{ color: string; left: number; delay: number }>`
  position: absolute;
  bottom: -60px;
  left: ${({ left }) => left}%;
  width: 36px;
  height: 48px;
  background: ${({ color }) => color};
  border-radius: 18px 18px 18px 18px / 24px 24px 24px 24px;
  box-shadow: 0 4px 12px #0002;
  animation: balloon-float 4.5s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  @keyframes balloon-float {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    80% { transform: translateY(-120px) scale(1.05); opacity: 1; }
    100% { transform: translateY(-180px) scale(1.1); opacity: 0; }
  }
`;

// Confetti animatie
const PartyConfetti = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0; top: 0; right: 0; height: 100%;
  z-index: 7;
`;

const ConfettiStrip = styled.div<{ color: string; left: number; delay: number }>`
  position: absolute;
  top: -30px;
  left: ${({ left }) => left}%;
  width: 8px;
  height: 32px;
  background: ${({ color }) => color};
  border-radius: 4px;
  opacity: 0.85;
  animation: confetti-fall 2.8s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    80% { transform: translateY(120px) rotate(20deg); opacity: 1; }
    100% { transform: translateY(180px) rotate(40deg); opacity: 0; }
  }
`;

// StarlightBackground component
const StarlightBackground = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #000428 0%, #001e3c 100%);
`;

// Star component
const Star = styled.div<{ size: number; x: number; y: number; delay: number; duration: number }>`
  position: absolute;
  left: ${props => props.x}vw;
  top: ${props => props.y}vh;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(${props => props.size > 2 ? 1 : 0}px);
  animation: ${twinkle} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  will-change: transform, opacity;
`;

// Planet component
const Planet = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${props => {
    switch(props.position) {
      case 'top':
        return `
          right: 5%;
          top: 5%;
          width: 180px;
          height: 180px;
          background: linear-gradient(45deg, #4B0082, #6B48FF);
          box-shadow: 
            inset -30px -30px 50px rgba(0,0,0,0.5),
            0 0 50px rgba(107, 72, 255, 0.3);
        `;
      case 'bottom':
        return `
          left: 5%;
          bottom: 5%;
          width: 220px;
          height: 220px;
          background: linear-gradient(45deg, #FF8A00, #FFB800);
          box-shadow: 
            inset -30px -30px 50px rgba(0,0,0,0.5),
            0 0 50px rgba(255, 184, 0, 0.3);
        `;
    }
  }}
  border-radius: 50%;
  animation: ${rotate} 60s linear infinite;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%);
  }
`;

// Galaxy component
const Galaxy = styled.div<{ size: number; x: number; y: number; delay: number }>`
  position: absolute;
  left: ${props => props.x}vw;
  top: ${props => props.y}vh;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle at center, 
    rgba(107, 72, 255, 0.2) 0%,
    rgba(75, 0, 130, 0.1) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${twinkle} ${props => 15 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  filter: blur(8px);
  z-index: 0;
`;

const PollResult = ({ poll, themeName = 'default', t = (x: string) => x, onBack }: { poll: { question: any, options: { votes: number, drawing: any, text?: string }[] }, themeName?: string, t?: (key: string) => string, onBack?: () => void }) => {
  const snowflakes = themeName === 'christmas' ? Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5
  })) : [];

  // Genereer sterren alleen 1x per mount
  const stars = useMemo(() => themeName === 'space' ? Array.from({ length: 200 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.2 + 0.8,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 7
  })) : [], [themeName]);

  // Genereer sterrenstelsels
  const galaxies = useMemo(() => themeName === 'space' ? Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 100 + Math.random() * 150,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10
  })) : [], [themeName]);

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  const maxVotes = sortedOptions.length > 0 ? sortedOptions[0].votes : 0;

  return (
    <ViewportContainer themeName={themeName}>
      {themeName === 'space' && (
        <StarlightBackground>
          {galaxies.map(({id, ...galaxyProps}) => (
            <Galaxy key={id} {...galaxyProps} />
          ))}
          {stars.map(({id, ...starProps}) => (
            <Star key={id} {...starProps} />
          ))}
          <Planet position="top" />
          <Planet position="bottom" />
        </StarlightBackground>
      )}
      {themeName === 'christmas' && (
        <SnowContainer>
          {snowflakes.map(flake => (
            <Snowflake
              key={flake.id}
              size={flake.size}
              left={flake.left}
              delay={flake.delay}
            />
          ))}
        </SnowContainer>
      )}
      <TopLeftBlock themeName={themeName} />
      <BottomRightBlock themeName={themeName} />
      <div style={{
        zIndex: 3,
        color: 'white',
        fontWeight: 800,
        fontSize: '2.2rem',
        textAlign: 'center',
        letterSpacing: '0.02em',
        marginBottom: 18,
        marginTop: 19,
        textShadow: '0 2px 8px #0002',
        fontFamily: 'Poppins, Arial, sans-serif',
        lineHeight: 1.1,
        maxWidth: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}>
        {t('poll_result')}
      </div>
      <LargeQuizBox themeName={themeName} style={{ marginTop: 64, position: 'relative', top: 0, left: '50%', transform: 'translate(-50%, 0)' }}>
        <QuestionBoard>
          <MiniWhiteboard initialPaths={poll.question || []} width={undefined} height={220} style={{ width: '100%' }} />
        </QuestionBoard>
        <AnswersGrid>
          {sortedOptions.map((opt, idx) => {
            const isWinner = opt.votes === maxVotes && maxVotes > 0;
            const Box = isWinner ? WinnerBox : AnswerBox;
            const originalIdx = poll.options.findIndex(o => o === opt);
            return (
              <Box key={originalIdx} themeName={themeName} style={{ position: 'relative', overflow: isWinner ? 'hidden' : undefined }}>
                {isWinner && (
                  <ConfettiRain>
                    {[...Array(40)].map((_, i) => (
                      <ConfettiPiece
                        key={i}
                        color={`hsl(${Math.random() * 360}, 90%, ${55 + Math.random() * 30}%)`}
                        left={Math.random() * 100}
                        duration={3 + Math.random() * 2}
                        rotate={Math.random() * 360}
                        shape={['circle', 'square', 'triangle', 'star'][Math.floor(Math.random() * 4)] as 'circle' | 'square' | 'triangle' | 'star'}
                        style={{ animationDelay: `${Math.random() * 2}s` }}
                      />
                    ))}
                  </ConfettiRain>
                )}
                <AnswerNumber themeName={themeName}>{originalIdx + 1}.</AnswerNumber>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                  <MiniWhiteboard
                    initialPaths={opt.drawing ?? []}
                    width={undefined}
                    height={75}
                    style={{ width: '100%', minHeight: 75, background: '#fff', borderRadius: 8 }}
                  />
                </div>
                <VoteBox themeName={themeName}>
                  <VoteScore themeName={themeName}>{opt.votes}</VoteScore>
                </VoteBox>
              </Box>
            );
          })}
        </AnswersGrid>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default PollResult; 