import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Typography } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import MiniWhiteboard from './MiniWhiteboard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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

const ViewportContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: inherit;
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

const QuestionBoard = styled.div`
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  @media (max-width: 600px) {
    margin-bottom: 18px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 32px;
  width: 100%;
  justify-content: center;
`;

const StyledButton = styled(Button)<{ selected?: boolean; themeName: string }>`
  min-width: 180px;
  padding: 16px 32px;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: 12px;
  text-transform: none;
  background: ${props => props.selected 
    ? props.themeName === 'dark' 
      ? '#424242'
      : props.themeName === 'christmas'
      ? '#c62828'
      : 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)'
    : props.themeName === 'dark'
      ? '#2d2d2d'
      : props.themeName === 'christmas'
      ? '#388e3c'
      : '#fff8'
  };
  color: ${props => props.selected 
    ? '#fff'
    : props.themeName === 'dark'
      ? '#fff'
      : props.themeName === 'christmas'
      ? '#fff'
      : '#333'
  };
  &:hover {
    background: ${props => props.selected 
      ? props.themeName === 'dark'
        ? '#616161'
        : props.themeName === 'christmas'
        ? '#d32f2f'
        : 'linear-gradient(90deg, #ff2b4b 0%, #ff416c 100%)'
      : props.themeName === 'dark'
        ? '#424242'
        : props.themeName === 'christmas'
        ? '#43a047'
        : '#fff'
    };
  }
  box-shadow: ${props => props.selected 
    ? props.themeName === 'dark'
      ? '0 2px 8px #0003'
      : props.themeName === 'christmas'
      ? '0 2px 8px #c6282833'
      : '0 2px 8px #ff416c33'
    : 'none'
  };
`;

const SaveButton = styled(Button)<{ themeName: string }>`
  background: ${props => props.themeName === 'dark'
    ? 'linear-gradient(90deg, #424242 0%, #616161 100%)'
    : props.themeName === 'christmas'
    ? 'linear-gradient(90deg, #c62828 0%, #d32f2f 100%)'
    : 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)'
  };
  color: white;
  padding: 16px 48px;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: 12px;
  text-transform: none;
  box-shadow: ${props => props.themeName === 'dark'
    ? '0 2px 8px #0003'
    : props.themeName === 'christmas'
    ? '0 2px 8px #c6282833'
    : '0 2px 8px #ff416c33'
  };
  &:hover {
    background: ${props => props.themeName === 'dark'
      ? 'linear-gradient(90deg, #616161 0%, #757575 100%)'
      : props.themeName === 'christmas'
      ? 'linear-gradient(90deg, #d32f2f 0%, #e53935 100%)'
      : 'linear-gradient(90deg, #ff2b4b 0%, #ff416c 100%)'
    };
    box-shadow: ${props => props.themeName === 'dark'
      ? '0 4px 16px #0005'
      : props.themeName === 'christmas'
      ? '0 4px 16px #c6282855'
      : '0 4px 16px #ff416c55'
    };
  }
  &:disabled {
    background: ${props => props.themeName === 'dark'
      ? '#2d2d2d'
      : props.themeName === 'christmas'
      ? '#388e3c'
      : '#f0f2f5'
    };
    color: ${props => props.themeName === 'dark'
      ? '#666'
      : props.themeName === 'christmas'
      ? '#81c784'
      : '#999'
    };
    box-shadow: none;
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

const AnswerBox = styled.div<{ selected?: boolean; themeName: string }>`
  display: flex;
  align-items: center;
  background: ${({ selected, themeName }) => {
    if (selected) {
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
  border: 3px solid ${({ selected, themeName }) => 
    selected 
      ? themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : '#fff'
      : 'transparent'
  };
  box-shadow: ${({ selected, themeName }) => 
    selected 
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

const AnswerNumber = styled.div<{ selected?: boolean; themeName: string }>`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${({ selected, themeName }) => {
    if (selected) {
      return themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : '#1bbf3a';
    }
    return themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : '#222';
  }};
  width: 32px;
  text-align: right;
`;

const VoteBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
`;

const VoteBtn = styled.button<{ up?: boolean; themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark'
      ? '#424242'
      : themeName === 'christmas'
      ? '#fff'
      : '#fff'
  };
  border: none;
  color: ${({ themeName }) => 
    themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : '#222'
  };
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark'
        ? '#616161'
        : themeName === 'christmas'
        ? '#f5f5f5'
        : '#f5f5f5'
    };
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
      : '#222'
  };
`;

interface TrueFalseCreationProps {
  onSave: (question: { questionDrawing: any; answer: boolean; votes: { true: number; false: number } }) => void;
  onReveal: () => void;
  themeName: 'dark' | 'christmas' | 'default';
  t: (key: string) => string;
  onSelectAnswer?: (answer: boolean) => void;
  showNextButton: boolean;
  nextButtonDisabled: boolean;
  onVotesChange?: (votes: { true: number; false: number }) => void;
}

const TrueFalseCreation = forwardRef<any, TrueFalseCreationProps>(({
  onSave,
  onReveal,
  themeName,
  t,
  onSelectAnswer,
  showNextButton,
  nextButtonDisabled,
  onVotesChange
}, ref) => {
  const [trueVotes, setTrueVotes] = useState(0);
  const [falseVotes, setFalseVotes] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [currentColor, setCurrentColor] = useState('#222');
  const [currentWidth, setCurrentWidth] = useState(4);
  const [mode, setMode] = useState<'draw' | 'eraser'>('draw');
  const questionRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getPaths: () => questionRef.current?.getPaths ? questionRef.current.getPaths() : null,
    getVotes: () => ({ true: trueVotes, false: falseVotes })
  }));

  // Generate snowflakes for Christmas theme
  const snowflakes = themeName === 'christmas' ? Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5
  })) : [];

  const handleNext = () => {
    console.log('handleNext aangeroepen, selectedAnswer:', selectedAnswer);
    if (selectedAnswer === null) return;
    const questionDrawing = questionRef.current?.getPaths ? questionRef.current.getPaths() : null;
    onSave({
      questionDrawing,
      answer: selectedAnswer,
      votes: { true: trueVotes, false: falseVotes }
    });
    if (onReveal) {
      onReveal();
    }
  };

  const handleVote = (isTrue: boolean, delta: number) => {
    if (isTrue) {
      setTrueVotes(prev => {
        const newVotes = prev + delta;
        if (onVotesChange) onVotesChange({ true: newVotes, false: falseVotes });
        return newVotes;
      });
      setSelectedAnswer(true);
    } else {
      setFalseVotes(prev => {
        const newVotes = prev + delta;
        if (onVotesChange) onVotesChange({ true: trueVotes, false: newVotes });
        return newVotes;
      });
      setSelectedAnswer(false);
    }
    if (onSelectAnswer) onSelectAnswer(isTrue);
  };

  return (
    <ViewportContainer>
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
        {t('truefalse_creation')}
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
          <AnswerBox themeName={themeName}>
            <AnswerNumber themeName={themeName}>1.</AnswerNumber>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{t('true')}</div>
            <VoteBox>
              <VoteBtn up themeName={themeName} onClick={() => handleVote(true, 1)} title="Upvote">
                <ArrowUpwardIcon fontSize="small" />
              </VoteBtn>
              <VoteScore themeName={themeName}>{trueVotes}</VoteScore>
              <VoteBtn themeName={themeName} onClick={() => handleVote(true, -1)} title="Downvote">
                <ArrowDownwardIcon fontSize="small" />
              </VoteBtn>
            </VoteBox>
          </AnswerBox>
          <AnswerBox themeName={themeName}>
            <AnswerNumber themeName={themeName}>2.</AnswerNumber>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{t('false')}</div>
            <VoteBox>
              <VoteBtn up themeName={themeName} onClick={() => handleVote(false, 1)} title="Upvote">
                <ArrowUpwardIcon fontSize="small" />
              </VoteBtn>
              <VoteScore themeName={themeName}>{falseVotes}</VoteScore>
              <VoteBtn themeName={themeName} onClick={() => handleVote(false, -1)} title="Downvote">
                <ArrowDownwardIcon fontSize="small" />
              </VoteBtn>
            </VoteBox>
          </AnswerBox>
        </AnswersGrid>
      </LargeQuizBox>
    </ViewportContainer>
  );
});

export default TrueFalseCreation; 