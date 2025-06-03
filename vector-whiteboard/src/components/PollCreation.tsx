import React, { useState, useRef, useImperativeHandle, forwardRef, ForwardRefRenderFunction } from 'react';
import styled, { keyframes } from 'styled-components';
import MiniWhiteboard from './MiniWhiteboard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';

// Snow animation
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
  background: #fff8;
  border-radius: 12px;
  padding: 8px 44px 8px 12px;
  min-height: 90px;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  box-sizing: border-box;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 120px;
    padding: 8px 24px 8px 4px;
  }
`;

const AnswerNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: #222;
  width: 32px;
  text-align: right;
`;

const OptionInput = styled.input`
  flex: 1;
  font-size: 1.2rem;
  border: none;
  background: #fff;
  outline: none;
  font-weight: bold;
  color: #222;
  margin-right: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px #0001;
  &::placeholder {
    color: #bbb;
    opacity: 1;
  }
`;

const VoteBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
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
  color: ${({ themeName }) => themeName === 'dark' ? '#000' : '#222'};
  margin: 2px 0;
`;

const RemoveBtn = styled.button<{ themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#f44336'
      : themeName === 'christmas'
      ? '#c62828'
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
      : '#ffb6c1'
  };
  color: #fff;
  font-size: 2.2rem;
  border: none;
  border-radius: 10px;
  width: 100%;
  height: 80px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#7d7d7d'
        : themeName === 'christmas'
        ? '#2e7d32'
        : '#ffdbed'
    };
  }
`;

type PollOption = { id: number; text: string; votes: number; drawing: any };

interface PollCreationProps {
  themeName?: string;
  t?: (key: string) => string;
  onSave?: (poll: any) => void;
  question: string;
  setQuestion: (q: string) => void;
  pageTitle?: string;
  saveLabel?: string;
  initialOptions?: PollOption[]; // optioneel
}

export interface PollCreationHandle {
  savePoll: () => void;
}

const PollCreation: React.ForwardRefRenderFunction<PollCreationHandle, PollCreationProps> = (props, ref) => {
  const {
    themeName = 'default',
    t = (x: string) => x,
    onSave,
    question,
    setQuestion,
    pageTitle,
    saveLabel,
    initialOptions
  } = props;
  const [options, setOptions] = React.useState<PollOption[]>(
    initialOptions && initialOptions.length > 0
      ? initialOptions
      : [
          { id: 0, text: '', votes: 0, drawing: null },
          { id: 1, text: '', votes: 0, drawing: null }
        ]
  );
  const whiteboardRef = useRef<any>(null);
  const optionRefs = useRef<{ [id: number]: any }>({});

  // Snowflakes
  const snowflakes = themeName === 'christmas' ? Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5
  })) : [];

  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: options.length ? options[options.length - 1].id + 1 : 0, text: '', votes: 0, drawing: null }
    ]);
  };

  const handleRemoveOption = (id: number) => {
    if (options.length <= 2) return;
    delete optionRefs.current[id];
    setOptions(options.filter(opt => opt.id !== id));
  };

  const handleOptionChange = (id: number, value: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text: value } : opt));
  };

  const handleVote = (id: number, delta: number) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, votes: Math.max(0, opt.votes + delta) } : opt));
  };

  useImperativeHandle(ref, () => ({
    savePoll: () => {
      const drawing = whiteboardRef.current?.getPaths ? whiteboardRef.current.getPaths() : [];
      const optionsWithDrawings = options.map(opt => ({
        ...opt,
        drawing: optionRefs.current[opt.id]?.getPaths ? optionRefs.current[opt.id].getPaths() : [],
        text: opt.text || `Option ${opt.id + 1}`
      }));
      if (onSave) onSave({
        question: Array.isArray(drawing) ? drawing : [],
        options: optionsWithDrawings
      });
    }
  }), [options, onSave]);

  const canAddOption = options.length < 8;

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
        {pageTitle}
      </div>
      <LargeQuizBox themeName={themeName} style={{ marginTop: 64, position: 'relative', top: 0, left: '50%', transform: 'translate(-50%, 0)' }}>
        <QuestionBoard>
          <MiniWhiteboard ref={whiteboardRef} width={undefined} height={220} style={{ width: '100%' }} initialPaths={Array.isArray(question) ? question : []} />
        </QuestionBoard>
        <AnswersGrid>
          {options.map((opt, idx) => (
            <AnswerBox key={opt.id} themeName={themeName}>
              <AnswerNumber>{idx + 1}.</AnswerNumber>
              <MiniWhiteboard
                ref={el => { if (el) optionRefs.current[opt.id] = el; else delete optionRefs.current[opt.id]; }}
                width={undefined}
                height={75}
                style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 60px)' }}
                initialPaths={opt.drawing || []}
              />
              <VoteBox>
                <VoteBtn up themeName={themeName} onClick={() => handleVote(opt.id, 1)} title="Upvote">
                  <ArrowUpwardIcon fontSize="small" />
                </VoteBtn>
                <VoteScore themeName={themeName}>{opt.votes}</VoteScore>
                <VoteBtn themeName={themeName} onClick={() => handleVote(opt.id, -1)} title="Downvote">
                  <ArrowDownwardIcon fontSize="small" />
                </VoteBtn>
              </VoteBox>
              {options.length > 2 && idx === options.length - 1 && (
                <RemoveBtn themeName={themeName} title="Verwijder optie" onClick={() => handleRemoveOption(opt.id)}><span>-</span></RemoveBtn>
              )}
            </AnswerBox>
          ))}
          {options.length % 2 === 1 && <div />} {/* For grid alignment */}
          {canAddOption && <AddButton themeName={themeName} onClick={handleAddOption}>+</AddButton>}
        </AnswersGrid>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default React.forwardRef(PollCreation); 