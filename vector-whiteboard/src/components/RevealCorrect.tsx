import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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
      : 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
  };
  background-attachment: fixed;
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
      : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  };
  border-radius: 18px;
  padding: 32px 32px 24px 32px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
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
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-125deg);
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
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-45deg);
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
        : '#1bbf3a';
    }
    return themeName === 'dark'
      ? '#42424288'
      : themeName === 'christmas'
      ? '#fff8'
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
  border: 3px solid ${({ isSelected, themeName }) => 
    isSelected 
      ? themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : '#fff'
      : 'transparent'
  };
  box-shadow: ${({ isSelected, themeName }) => 
    isSelected 
      ? themeName === 'dark'
        ? '0 0 20px #4caf5088'
        : themeName === 'christmas'
        ? '0 0 20px #388e3c88'
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
  color: ${({ themeName }) =>
    themeName === 'dark'
      ? '#fff'
      : '#222'};
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

interface RevealCorrectProps {
  question: QuizQuestion;
  onSelectCorrect: (answerIds: number[]) => void;
  onBack: () => void;
  onShowResult: (selected: number[]) => void;
  onSelectedAnswersChange?: (selected: number[]) => void;
  themeName: string;
  t: (key: string) => string;
}

const RevealCorrect: React.FC<RevealCorrectProps> = ({ question, onSelectCorrect, onBack, onShowResult, onSelectedAnswersChange, themeName, t }) => {
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

  return (
    <ViewportContainer themeName={themeName}>
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
        marginTop: 24,
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, width: '100%', marginTop: 32 }}>
          <BackButton themeName={themeName} onClick={onBack}>{t('back')}</BackButton>
        </div>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default RevealCorrect; 