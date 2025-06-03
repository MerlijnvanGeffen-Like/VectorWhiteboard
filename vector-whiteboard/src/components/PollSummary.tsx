import React from 'react';
import styled from 'styled-components';

const LargeQuizBox = styled.div<{ themeName: string }>`
  position: relative;
  left: 50%;
  top: 64px;
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

const Title = styled.h2`
  color: #fff;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 18px;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 0 2px 8px #0002;
`;

const QuestionBlock = styled.div`
  width: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 18px 24px;
  margin-bottom: 24px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #222;
  text-align: center;
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

const AnswerBox = styled.div<{ isWinner?: boolean; themeName: string }>`
  display: flex;
  align-items: center;
  background: ${({ isWinner, themeName }) => {
    if (isWinner) {
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
  border: 3px solid ${({ isWinner, themeName }) => 
    isWinner 
      ? themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : '#fff'
      : 'transparent'
  };
  box-shadow: ${({ isWinner, themeName }) => 
    isWinner 
      ? themeName === 'dark'
        ? '0 0 20px #4caf5088'
        : themeName === 'christmas'
        ? '0 0 20px #388e3c88'
        : '0 0 20px #1bbf3a88'
      : 'none'
  };
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 120px;
    padding: 8px 4px;
  }
`;

const AnswerNumber = styled.div<{ themeName: string }>`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${({ themeName }) => themeName === 'dark' ? '#fff' : '#222'};
  width: 32px;
  text-align: right;
`;

const VotesBadge = styled.div<{ themeName: string }>`
  display: inline-block;
  background: ${props => props.themeName === 'dark' ? '#424242' : '#f0f2f5'};
  color: ${props => props.themeName === 'dark' ? '#fff' : '#222'};
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 4px 12px;
  margin-left: 12px;
  min-width: 36px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

const PollSummary = ({ poll, themeName = 'default', t = (x: string) => x, onClose }: { poll: { question: string, options: { text: string, votes: number }[] }, themeName?: string, t?: (key: string) => string, onClose?: () => void }) => {
  const maxVotes = Math.max(...poll.options.map(opt => opt.votes));
  return (
    <LargeQuizBox themeName={themeName}>
      <Title>{t('poll_results') || 'Poll resultaten'}</Title>
      <QuestionBlock>{poll.question}</QuestionBlock>
      <AnswersGrid>
        {poll.options.map((opt, idx) => (
          <AnswerBox key={idx} isWinner={opt.votes === maxVotes && maxVotes > 0} themeName={themeName}>
            <AnswerNumber themeName={themeName}>{idx + 1}.</AnswerNumber>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{opt.text}
              <VotesBadge themeName={themeName}>{opt.votes}</VotesBadge>
            </div>
          </AnswerBox>
        ))}
      </AnswersGrid>
      {onClose && <BackButton themeName={themeName} onClick={onClose}>{t('back') || 'Terug'}</BackButton>}
    </LargeQuizBox>
  );
};

export default PollSummary; 