import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import MiniWhiteboard, { MiniWhiteboardHandle } from './MiniWhiteboard';
import { QuizQuestion, AnswerData } from '../App';

// Snow animation
const snowfall = keyframes`
  0% {
    transform: translateY(-10px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
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
const Title = styled.h2`
  color: #fff;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 18px;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 0 2px 8px #0002;
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
const AnswerBox = styled.div<{ isSelected?: boolean; themeName: string }>`
  display: flex;
  align-items: center;
  background: ${({ isSelected, themeName }) => {
    if (isSelected) {
      return themeName === 'dark' 
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#fff'
        : themeName === 'summer'
        ? '#FF8A00'
        : themeName === 'space'
        ? '#4B0082'
        : '#1bbf3a';
    }
    return themeName === 'dark'
      ? '#42424288'
      : themeName === 'christmas'
      ? '#fff8'
      : themeName === 'summer'
      ? '#FFB80088'
      : themeName === 'space'
      ? '#0066CC88'
      : '#fff8';
  }};
  border-radius: 12px;
  padding: 8px 12px;
  min-height: 90px;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  border: 3px solid ${({ isSelected, themeName }) => 
    isSelected 
      ? themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : themeName === 'summer'
        ? '#FF8A00'
        : themeName === 'space'
        ? '#6B48FF'
        : '#fff'
      : 'transparent'
  };
  box-shadow: ${({ isSelected, themeName }) => 
    isSelected 
      ? themeName === 'dark'
        ? '0 0 20px #4caf5088'
        : themeName === 'christmas'
        ? '0 0 20px #388e3c88'
        : themeName === 'summer'
        ? '0 0 20px #FF8A0088'
        : themeName === 'space'
        ? '0 0 20px #6B48FF88'
        : '0 0 20px #1bbf3a88'
      : 'none'
  };
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ themeName }) => 
      themeName === 'dark'
        ? '#0006'
        : themeName === 'christmas'
        ? '#0001'
        : themeName === 'summer'
        ? '#FF8A0022'
        : themeName === 'space'
        ? '#6B48FF22'
        : '#0001'
    };
  }
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 120px;
    padding: 8px 4px;
  }
`;
const AnswerNumber = styled.div<{ isSelected?: boolean; themeName: string }>`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${({ isSelected, themeName }) => {
    if (isSelected) {
      return themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : themeName === 'summer'
        ? '#FF8A00'
        : themeName === 'space'
        ? '#6B48FF'
        : '#222';
    }
    return themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : themeName === 'summer'
      ? '#FFF'
      : themeName === 'space'
      ? '#0088FF'
      : '#222';
  }};
  width: 32px;
  text-align: right;
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
  margin-top: -45px;
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

interface RevealCorrectProps {
  question: QuizQuestion;
  onSelectCorrect: (answerIds: number[]) => void;
  onShowResult: (selected: number[]) => void;
  onSelectedAnswersChange: (selected: number[]) => void;
  themeName: string;
  t: (key: string) => string;
}

const RevealCorrect: React.FC<RevealCorrectProps> = ({
  question,
  onSelectCorrect,
  onShowResult,
  onSelectedAnswersChange,
  themeName,
  t
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const toggleAnswer = (answerId: number) => {
    setSelectedAnswers(prev => {
      const next = prev.includes(answerId)
        ? prev.filter(id => id !== answerId)
        : [...prev, answerId];
      if (onSelectedAnswersChange) onSelectedAnswersChange(next);
      return next;
    });
  };

  // Sync selectie naar App
  React.useEffect(() => {
    if (onSelectedAnswersChange) onSelectedAnswersChange(selectedAnswers);
  }, [selectedAnswers, onSelectedAnswersChange]);

  // Handler voor de knop
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__quizRevealHandler = () => onShowResult(selectedAnswers);
      return () => { delete (window as any).__quizRevealHandler; };
    }
  }, [selectedAnswers, onShowResult]);

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
        {t('select_correct_answers')}
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
          <MiniWhiteboard initialPaths={question.questionDrawing || []} width={undefined} height={220} style={{ width: '100%' }} />
        </QuestionBoard>
        <AnswersGrid>
          {question.answers.map((answer, i) => (
            <AnswerBox
              key={answer.id}
              isSelected={selectedAnswers.includes(answer.id)}
              themeName={themeName}
              onClick={() => toggleAnswer(answer.id)}
            >
              <AnswerNumber 
                isSelected={selectedAnswers.includes(answer.id)}
                themeName={themeName}
              >
                {i + 1}.
              </AnswerNumber>
              <MiniWhiteboard
                initialPaths={answer.drawing || []}
                width={undefined}
                height={75}
                style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 60px)' }}
              />
            </AnswerBox>
          ))}
        </AnswersGrid>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default RevealCorrect; 