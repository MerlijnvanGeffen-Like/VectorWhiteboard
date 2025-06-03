import React, { useState } from 'react';
import styled from 'styled-components';
import MiniWhiteboard from './MiniWhiteboard';

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

const AnswerBox = styled.div<{ isCorrect?: boolean; themeName: string; style?: React.CSSProperties; onClick?: () => void }>`
  display: flex;
  align-items: center;
  background: ${({ isCorrect, themeName }) => {
    if (isCorrect) {
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
  border: 3px solid ${({ isCorrect, themeName }) => 
    isCorrect 
      ? themeName === 'dark'
        ? '#4caf50'
        : themeName === 'christmas'
        ? '#388e3c'
        : '#fff'
      : 'transparent'
  };
  box-shadow: ${({ isCorrect, themeName }) => 
    isCorrect 
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
  ${({ style }) => style && `
    ${Object.keys(style).map(key => `${key}: ${style[key as keyof React.CSSProperties]}`)}
  `}
  &:hover {
    cursor: pointer;
  }
`;

const AnswerNumber = styled.div<{ isCorrect?: boolean; themeName: string }>`
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

interface TrueFalseCorrectProps {
  question: {
    questionDrawing: any;
    answer: boolean;
  };
  onBack: () => void;
  onNext: (selected: boolean) => void;
  themeName: string;
  t: (key: string) => string;
}

const TrueFalseCorrect: React.FC<TrueFalseCorrectProps> = ({
  question,
  onBack,
  onNext,
  themeName,
  t
}) => {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (selected !== null) {
      onNext(selected);
    }
  };

  return (
    <ViewportContainer themeName={themeName}>
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
        {t('reveal_correct')}
      </div>
      <LargeQuizBox themeName={themeName}>
        <div style={{ marginBottom: '16px', width: '100%' }}>
          <MiniWhiteboard
            initialPaths={question.questionDrawing}
            width={undefined}
            height={220}
            style={{ width: '100%' }}
          />
        </div>
        <AnswersGrid>
          <AnswerBox
            isCorrect={selected === true}
            themeName={themeName}
            style={selected === true ? { background: '#4caf50', border: '3px solid #4caf50' } : {}}
            onClick={() => handleSelect(true)}
          >
            <AnswerNumber isCorrect={selected === true} themeName={themeName}>1.</AnswerNumber>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{t('true')}</div>
          </AnswerBox>
          <AnswerBox
            isCorrect={selected === false}
            themeName={themeName}
            style={selected === false ? { background: '#4caf50', border: '3px solid #4caf50' } : {}}
            onClick={() => handleSelect(false)}
          >
            <AnswerNumber isCorrect={selected === false} themeName={themeName}>2.</AnswerNumber>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{t('false')}</div>
          </AnswerBox>
        </AnswersGrid>
        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', justifyContent: 'center' }}>
          <BackButton onClick={onBack} themeName={themeName}>
            {t('back')}
          </BackButton>
        </div>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default TrueFalseCorrect; 