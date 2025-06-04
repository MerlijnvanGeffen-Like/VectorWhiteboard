import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { QuizQuestion, AnswerData } from '../App';
import MiniWhiteboard, { MiniWhiteboardHandle } from './MiniWhiteboard';
import App from '../App';

// Snow animation
const snowfall = keyframes`
  0% {
    transform: translateY(-10px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
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

const ViewportContainer = styled.div<{ themeName: string }>`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #2e7d32 100%)'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
      : themeName === 'space'
      ? `linear-gradient(135deg, #000428 0%, #004e92 100%),
         radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 50px 160px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0))`
      : 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
  };
  background-attachment: fixed;
  background-size: ${({ themeName }) => 
    themeName === 'space' ? '200% 200%, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px' : '100% 100%'
  };
  ${({ themeName }) => themeName === 'space' && css`
    animation: ${starryBackground} 50s linear infinite;
    will-change: background-position;
  `}
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

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffb347 0%, #ff416c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2vw 0;
  overflow-x: hidden;
`;

const QuizBox = styled.div`
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  border-radius: 18px;
  padding: 32px 32px 24px 32px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  min-width: 320px;
  max-width: 1100px;
  width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 900px) {
    padding: 18px 4vw 18px 4vw;
    max-width: 98vw;
  }
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

const AnswerBox = styled.div<{ isCorrect: boolean; themeName: string }>`
  display: flex;
  align-items: center;
  background: ${({ isCorrect }) => 
    isCorrect 
      ? '#4caf50' // Always green for correct answers
      : '#f44336' // Always red for incorrect answers
  };
  border-radius: 12px;
  padding: 8px 12px;
  min-height: 90px;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border: 3px solid ${({ isCorrect }) => 
    isCorrect 
      ? '#4caf50' // Always green border for correct answers
      : '#f44336' // Always red border for incorrect answers
  };
  box-shadow: ${({ isCorrect }) => 
    isCorrect 
      ? '0 0 20px #4caf5088' // Green glow for correct
      : '0 0 20px #f4433688' // Red glow for incorrect
  };
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 120px;
    padding: 8px 4px;
  }
`;

const AnswerNumber = styled.div<{ isCorrect: boolean; themeName: string }>`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${({ isCorrect }) => 
    isCorrect 
      ? '#222' // Always green for correct answers
      : '#f44336' // Always red for incorrect answers
  };
  width: 32px;
  text-align: right;
`;

const Radio = styled.input`
  margin-right: 10px;
  accent-color: #1bbf3a;
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
  margin-top: -25px;
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

const NextButton = styled(BackButton)`
  background: #ff416c;
  color: #fff;
  &:hover {
    background: #ff2b4b;
  }
`;

const VoteBox = styled.div<{ isCorrect: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ isCorrect }) => isCorrect ? '#fff' : '#f44336'};
  border-radius: 6px;
  margin-left: 12px;
  padding: 4px 8px;
  min-width: 40px;
`;

const VoteScore = styled.div<{ isCorrect: boolean; themeName: string }>`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ isCorrect }) => 
    isCorrect 
      ? '#222' // Always green for correct answers
      : '#f44336' // Always red for incorrect answers
  };
`;

const VotesBadge = styled.div<{ isCorrect: boolean; themeName: string }>`
  display: inline-block;
  background: ${({ isCorrect }) => 
    isCorrect 
      ? '#4caf50' // Always green for correct answers
      : '#f44336' // Always red for incorrect answers
  };
  color: #fff; // Always white text
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 4px 12px;
  min-width: 36px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

interface QuizResultProps {
  question: QuizQuestion;
  correctIds: number[];
  themeName: string;
  t: (key: string) => string;
}

const THEME_COLORS: Record<string, string[]> = {
  dark: ['#388e3c', '#1976d2', '#c62828', '#f6a71b', '#ff416c', '#ff4b2b', '#2d2d2d', '#e20248'],
  christmas: ['#c62828', '#388e3c', '#fff176', '#ffb300', '#fff', '#43a047', '#e53935', '#fbc02d'],
  summer: ['#FF8A00', '#FFB800', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFF', '#FF8A00', '#FFB800'],
  space: ['#4B0082', '#6B48FF', '#FF8A00', '#FFB800', '#0088FF', '#0066CC', '#4B0082', '#6B48FF'],
  default: ['#ff416c', '#ff4b2b', '#1bbf3a', '#388e3c', '#1976d2', '#c62828', '#f6a71b', '#2d2d2d', '#e20248', '#43a047', '#ffa500', '#800080', '#008080', '#FF69B4']
};

const QuizResult: React.FC<QuizResultProps> = ({
  question,
  correctIds,
  themeName,
  t
}) => {
  // Generate snowflakes for Christmas theme
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

  // Pie chart data
  const pieData = question.answers.map((answer, i) => ({
    label: `${i + 1}`,
    value: answer.votes,
    isCorrect: correctIds.includes(answer.id)
  }));

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
        {t('quiz_result')}
      </div>
      <LargeQuizBox
        themeName={themeName}
        style={{
          marginTop: 64,
          position: 'relative',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      >
        <QuestionBoard>
          <MiniWhiteboard initialPaths={question.questionDrawing} width={undefined} height={220} style={{ width: '100%' }} />
        </QuestionBoard>
        <AnswersGrid>
          {question.answers.filter(a => a.isCorrect).length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#E20248', fontWeight: 600, fontSize: '1.2rem', padding: '24px 0' }}>
              Geen juiste antwoorden gemarkeerd.
            </div>
          ) : (
            question.answers.filter(a => a.isCorrect).map((answer) => (
              <AnswerBox key={answer.id} isCorrect={correctIds.includes(answer.id)} themeName={themeName}>
                <AnswerNumber isCorrect={correctIds.includes(answer.id)} themeName={themeName}>
                  {question.answers.findIndex(a => a.id === answer.id) + 1}.
                </AnswerNumber>
                <MiniWhiteboard
                  initialPaths={answer.drawing}
                  width={undefined}
                  height={75}
                  style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 60px)' }}
                />
                <VoteBox isCorrect={correctIds.includes(answer.id)}>
                  <VoteScore isCorrect={correctIds.includes(answer.id)} themeName={themeName}>{answer.votes}</VoteScore>
                </VoteBox>
              </AnswerBox>
            ))
          )}
        </AnswersGrid>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
          <PieChart data={pieData} themeName={themeName} />
        </div>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

// Pie chart component
export const PieChart: React.FC<{ data: { label: string; value: number; isCorrect?: boolean }[]; themeName?: string; disableAnimation?: boolean }> = ({ data, themeName = 'default', disableAnimation }) => {
  const size = 200;
  const radius = size / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let angle = 0;
  // Helper to determine font size based on label length
  const getFontSize = (label: string) => {
    if (label.length <= 4) return 22;
    if (label.length <= 8) return 16;
    if (label.length <= 12) return 13;
    return 11;
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        filter: themeName === 'dark' ? 'drop-shadow(0 4px 16px #0008)' : themeName === 'christmas' ? 'drop-shadow(0 4px 16px #388e3c88)' : 'drop-shadow(0 4px 16px #ff416c55)',
        borderRadius: '50%',
        background: themeName === 'dark' ? '#222' : themeName === 'christmas' ? '#fff8' : '#fff',
        animation: disableAnimation ? undefined : 'pieIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
      }}
    >
      {!disableAnimation && (
        <style>{`
          @keyframes pieIn {
            0% { transform: scale(0.7); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      )}
      {data.map((d, i) => {
        const a0 = angle;
        const a1 = angle + (d.value / total) * Math.PI * 2;
        const x0 = radius + radius * Math.cos(a0 - Math.PI / 2);
        const y0 = radius + radius * Math.sin(a0 - Math.PI / 2);
        const x1 = radius + radius * Math.cos(a1 - Math.PI / 2);
        const y1 = radius + radius * Math.sin(a1 - Math.PI / 2);
        const largeArc = a1 - a0 > Math.PI ? 1 : 0;
        angle = a1;
        return (
          <g key={i}>
            <path
              fill={d.isCorrect ? '#4caf50' : '#f44336'}
              stroke="#fff"
              strokeWidth={2}
              d={`M${radius},${radius} L${x0},${y0} A${radius},${radius} 0 ${largeArc} 1 ${x1},${y1} Z`}
            />
            {d.value > 0 && (
              <text
                x={radius + (radius * 0.6) * Math.cos((a0 + a1) / 2 - Math.PI / 2)}
                y={radius + (radius * 0.6) * Math.sin((a0 + a1) / 2 - Math.PI / 2)}
                fill={themeName === 'dark' ? '#fff' : '#222'}
                fontSize={getFontSize(d.label)}
                fontWeight={500}
                textAnchor="middle"
                alignmentBaseline="middle"
                pointerEvents="none"
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const BarChart: React.FC<{ data: { label: string; value: number; id?: number }[]; themeName: string; correctIds?: number[] }> = ({ data, themeName, correctIds }) => {
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
      {data.map((d, i) => {
        let barColor = colors[i % colors.length];
        if (correctIds) {
          barColor = correctIds.includes(d.id ?? i) ? '#1bbf3a' : '#E20248';
        }
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 32,
              textAlign: 'right',
              fontWeight: 700,
              color: barColor,
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
                background: barColor,
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
        );
      })}
    </div>
  );
};

export default QuizResult; 