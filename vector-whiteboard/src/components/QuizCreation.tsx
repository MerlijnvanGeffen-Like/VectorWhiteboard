import React, { useState, useRef, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import MiniWhiteboard from './MiniWhiteboard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AnswerData, QuizQuestion } from '../App';

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

// Decoratieve blokken
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
      : '#fff8'
  };
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
      : '#222'
  };
  width: 32px;
  text-align: right;
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
`;

const VoteBtn = styled.button<{ up?: boolean; themeName: string }>`
  background: none;
  border: none;
  color: ${({ up, themeName }) => {
    if (themeName === 'dark') {
      return up ? '#4caf50' : '#f44336';
    } else if (themeName === 'christmas') {
      return up ? '#388e3c' : '#c62828';
    } else if (themeName === 'summer') {
      return up ? '#FFF' : '#FFF';
    } else if (themeName === 'space') {
      return up ? '#6B48FF' : '#FF8A00';
    }
    return up ? '#1bbf3a' : '#e53935';
  }};
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    filter: brightness(1.2);
  }
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

const RemoveBtn = styled.button<{ themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#f44336'
      : themeName === 'christmas'
      ? '#c62828'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#FF8A00'
      : '#e53935'
  };
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  box-shadow: 0 2px 8px ${({ themeName }) => 
    themeName === 'dark' 
      ? '#f4433622'
      : themeName === 'christmas'
      ? '#c6282822'
      : themeName === 'summer'
      ? '#FF8A0022'
      : themeName === 'space'
      ? '#FF8A0022'
      : '#e5393522'
  };
  transition: background 0.2s;
  cursor: pointer;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#d32f2f'
        : themeName === 'christmas'
        ? '#b71c1c'
        : themeName === 'summer'
        ? '#FF6B6B'
        : themeName === 'space'
        ? '#FF6B6B'
        : '#b71c1c'
    };
  }
  & span {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    line-height: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const AddButton = styled.button<{ themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#4d4d4d'
      : themeName === 'christmas'
      ? '#388e3c'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#4B0082'
      : '#ffb6c1'
  };
  color: #fff;
  font-size: 2.2rem;
  border: none;
  border-radius: 10px;
  width: 100%;
  min-height: 90px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#7d7d7d'
        : themeName === 'christmas'
        ? '#2e7d32'
        : themeName === 'summer'
        ? '#FF6B6B'
        : themeName === 'space'
        ? '#6B48FF'
        : '#ffdbed'
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

interface QuizCreationProps {
  onSaveQuestion: (q: QuizQuestion) => void;
  onReveal?: () => void;
  currentColor?: string;
  currentWidth?: number;
  clearKey?: number;
  mode?: 'draw' | 'eraser';
  themeName: 'dark' | 'christmas' | 'default' | 'summer' | 'space';
  t: (key: string) => string;
}

const QuizCreation: React.FC<QuizCreationProps> = ({ onSaveQuestion, onReveal, currentColor = '#222', currentWidth = 4, clearKey, mode = 'draw', themeName, t }) => {
  const [answers, setAnswers] = useState<AnswerData[]>([
    { id: 0, votes: 0, drawing: null },
    { id: 1, votes: 0, drawing: null },
  ]);
  const [questionIdx, setQuestionIdx] = useState(1);
  const questionRef = useRef<any>(null);
  const answerRefs = useRef<any[]>([]);

  const addAnswer = () => {
    setAnswers(prev => [...prev, { id: prev.length ? prev[prev.length - 1].id + 1 : 0, votes: 0, drawing: null }]);
  };

  const removeAnswer = (id: number) => {
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx === -1) return prev;
      // Verwijder de ref op dezelfde index
      answerRefs.current.splice(idx, 1);
      return prev.filter((a) => a.id !== id);
    });
  };

  const vote = (id: number, delta: number) => {
    setAnswers(prev => prev.map(a => a.id === id ? { ...a, votes: a.votes + delta } : a));
  };

  const nextQuestion = () => {
    // Verzamel tekeningen
    const questionDrawing = questionRef.current?.getPaths ? questionRef.current.getPaths() : null;
    const answerDrawings = answerRefs.current.map(ref => ref?.getPaths ? ref.getPaths() : null);
    const answersWithDrawings = answers.map((a, i) => ({ ...a, drawing: answerDrawings[i] }));
    
    // Validatie: controleer of er een tekening is en minstens één antwoord met een tekening
    if (!questionDrawing || questionDrawing.length === 0) {
      alert(t('please_draw_question') || 'Teken eerst een vraag.');
      return;
    }
    const hasAnswerDrawing = answersWithDrawings.some(a => a.drawing && a.drawing.length > 0);
    if (!hasAnswerDrawing) {
      alert(t('please_draw_answer') || 'Teken minstens één antwoord.');
      return;
    }
    
    onSaveQuestion({ questionDrawing, answers: answersWithDrawings });
    setAnswers([
      { id: 0, votes: 0, drawing: null },
      { id: 1, votes: 0, drawing: null },
    ]);
    setQuestionIdx(idx => idx + 1);
    // Clear all whiteboards
    answerRefs.current.forEach(ref => ref?.clear && ref.clear());
    if (questionRef.current?.clear) questionRef.current.clear();
    answerRefs.current = [];
  };

  // Max 8 antwoorden
  const canAddAnswer = answers.length < 8;

  // Verzamel en save de vraag + antwoorden
  const handleReveal = () => {
    const questionDrawing = questionRef.current?.getPaths ? questionRef.current.getPaths() : null;
    const answerDrawings = answerRefs.current.map(ref => ref?.getPaths ? ref.getPaths() : null);
    const answersWithDrawings = answers.map((a, i) => ({ ...a, drawing: answerDrawings[i] }));
    
    // Validatie: controleer of er een tekening is en minstens één antwoord met een tekening
    if (!questionDrawing || questionDrawing.length === 0) {
      alert(t('please_draw_question') || 'Teken eerst een vraag.');
      return;
    }
    const hasAnswerDrawing = answersWithDrawings.some(a => a.drawing && a.drawing.length > 0);
    if (!hasAnswerDrawing) {
      alert(t('please_draw_answer') || 'Teken minstens één antwoord.');
      return;
    }
    
    onSaveQuestion({ questionDrawing, answers: answersWithDrawings });
  };

  // Koppel onReveal prop aan handleReveal
  React.useEffect(() => {
    if (!onReveal) return;
    (window as any).__quizRevealHandler = handleReveal;
    return () => { delete (window as any).__quizRevealHandler; };
  }, [answers, onSaveQuestion]);

  React.useEffect(() => {
    if (clearKey === undefined) return;
    if (questionRef.current?.clear) questionRef.current.clear();
    answerRefs.current.forEach(ref => ref?.clear && ref.clear());
  }, [clearKey]);

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
      {/* Titel buiten het roze vak */}
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
        {t && t('quiz_creation')}
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
          <MiniWhiteboard ref={questionRef} width={undefined} height={220} style={{ width: '100%' }} color={currentColor} lineWidth={currentWidth} mode={mode} />
        </QuestionBoard>
        <AnswersGrid>
          {answers.map((answer, i) => (
            <React.Fragment key={answer.id}>
              <AnswerBox themeName={themeName}>
                <AnswerNumber themeName={themeName}>{i + 1}.</AnswerNumber>
                <MiniWhiteboard ref={el => answerRefs.current[i] = el} width={undefined} height={75} style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 60px)' }} color={currentColor} lineWidth={currentWidth} mode={mode} />
                <VoteBox themeName={themeName}>
                  <VoteBtn up themeName={themeName} onClick={() => vote(answer.id, 1)} title="Upvote">
                    <ArrowUpwardIcon fontSize="small" />
                  </VoteBtn>
                  <VoteScore themeName={themeName}>{answer.votes}</VoteScore>
                  <VoteBtn themeName={themeName} onClick={() => vote(answer.id, -1)} title="Downvote">
                    <ArrowDownwardIcon fontSize="small" />
                  </VoteBtn>
                </VoteBox>
                {i === answers.length - 1 && (
                  <RemoveBtn themeName={themeName} title="Verwijder antwoord" onClick={() => removeAnswer(answer.id)}><span>-</span></RemoveBtn>
                )}
              </AnswerBox>
              {canAddAnswer && i === answers.length - 1 && (
                <AddButton themeName={themeName} onClick={addAnswer}>+</AddButton>
              )}
            </React.Fragment>
          ))}
          {answers.length % 2 === 1 && <div />} {/* For grid alignment */}
        </AnswersGrid>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default QuizCreation; 