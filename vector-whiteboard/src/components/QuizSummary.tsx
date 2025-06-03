import React from 'react';
import styled, { keyframes } from 'styled-components';
import { QuizQuestion } from '../App';
import MiniWhiteboard from './MiniWhiteboard';
import { PieChart } from './QuizResult';

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

interface PieChartProps {
  data: { label: string; value: number; isCorrect?: boolean }[];
}

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

const ScrollArea = styled.div`
  flex: 1 1 0;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 18px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const QuestionContainer = styled.div<{ themeName: string }>`
  margin-bottom: 24px;
  padding: 24px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#ab2424'
      : '#f8f9fa'
  };
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const QuestionTitle = styled.h3<{ themeName: string }>`
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#fff'
      : '#222'
  };
  margin-bottom: 16px;
  font-size: 1.4rem;
  font-weight: 600;
`;

const QuestionBoard = styled.div`
  margin-bottom: 16px;
`;

const AnswersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  width: 100%;
  max-width: 1400px;
  margin-bottom: 32px;
  margin-top: 16px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 16px 0;
  }
`;

interface AnswerBoxProps {
  isCorrect?: boolean;
  themeName: string;
}

const AnswerBox = styled.div<AnswerBoxProps>`
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
`;

interface AnswerNumberProps {
  isCorrect?: boolean;
  themeName: string;
}

const AnswerNumber = styled.div<AnswerNumberProps>`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${({ isCorrect, themeName }) => {
    if (isCorrect) {
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

interface VoteBoxProps {
  isCorrect?: boolean;
}

const VoteBox = styled.div<VoteBoxProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.isCorrect ? '#fff' : '#f8f9fa'};
  border-radius: 6px;
  margin-left: 12px;
  padding: 4px 8px;
  min-width: 40px;
`;

interface VoteScoreProps {
  isCorrect?: boolean;
}

const VoteScore = styled.div<VoteScoreProps>`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${props => props.isCorrect ? '#1bbf3a' : '#222'};
`;

interface TrueFalseQuestion {
  questionDrawing: any;
  answer: boolean;
}

interface QuizSummaryProps {
  questions: Array<{
    questionDrawing: any;
    answers: Array<{
      id: number;
      votes: number;
      drawing?: any;
      isCorrect?: boolean;
    }>;
  }>;
  trueFalseQuestions: Array<{
    questionDrawing: any;
    answer: boolean;
    votes?: {
      true?: number;
      false?: number;
    };
  }>;
  pollSummaries?: {
    question: any;
    options: { text: string; votes: number; drawing?: any }[];
  }[];
  onClose: () => void;
  themeName: string;
  t: (key: string) => string;
  onDeleteQuizQuestion?: (index: number) => void;
  onDeleteTrueFalse?: (index: number) => void;
  onDeletePoll?: (index: number) => void;
}

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

interface VotesBadgeProps {
  themeName: string;
}

const VotesBadge = styled.div<VotesBadgeProps>`
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

const DeleteButton = styled.button<{ themeName: string }>`
  background: #e20248;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 16px;
  transition: background 0.2s;
  &:hover {
    background: #b8002f;
  }
`;

const QuizSummary: React.FC<QuizSummaryProps> = ({
  questions,
  trueFalseQuestions,
  pollSummaries,
  onClose,
  themeName,
  t,
  onDeleteQuizQuestion,
  onDeleteTrueFalse,
  onDeletePoll
}) => {
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
        {t('quiz_summary')}
      </div>
      <LargeQuizBox themeName={themeName}>
        <div style={{ width: '100%', overflowY: 'auto', padding: '0 16px' }}>
          {questions.map((question, index) => (
            <QuestionContainer key={index} themeName={themeName}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <QuestionTitle themeName={themeName}>Question {index + 1}</QuestionTitle>
                {onDeleteQuizQuestion && (
                  <DeleteButton themeName={themeName} onClick={() => onDeleteQuizQuestion(index)}>Verwijder</DeleteButton>
                )}
              </div>
              <QuestionBoard>
                <MiniWhiteboard
                  initialPaths={question.questionDrawing || []}
                  width={undefined}
                  height={220}
                  style={{ width: '100%' }}
                />
              </QuestionBoard>
              <AnswersGrid>
                {question.answers.filter(a => a.isCorrect).length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#E20248', fontWeight: 600, fontSize: '1.2rem', padding: '24px 0' }}>
                    Geen juiste antwoorden gemarkeerd.
                  </div>
                ) : (
                  question.answers.filter(a => a.isCorrect).map((answer, i) => (
                    <AnswerBox
                      key={answer.id}
                      isCorrect={answer.isCorrect}
                      themeName={themeName}
                    >
                      <AnswerNumber isCorrect={answer.isCorrect} themeName={themeName}>
                        {i + 1}.
                      </AnswerNumber>
                      {answer.drawing ? (
                        <MiniWhiteboard
                          initialPaths={answer.drawing || []}
                          width={undefined}
                          height={120}
                          style={{ width: '100%' }}
                        />
                      ) : null}
                      <VotesBadge themeName={themeName}>{answer.votes}</VotesBadge>
                    </AnswerBox>
                  ))
                )}
              </AnswersGrid>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                <PieChart data={question.answers.filter(a => a.isCorrect).map((answer, i) => ({
                  label: `${i + 1}`,
                  value: answer.votes,
                  isCorrect: answer.isCorrect
                }))} themeName={themeName} />
              </div>
            </QuestionContainer>
          ))}
          {trueFalseQuestions.map((question, index) => (
            <QuestionContainer key={`tf-${index}`} themeName={themeName}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <QuestionTitle themeName={themeName}>True/False Question {index + 1}</QuestionTitle>
                {onDeleteTrueFalse && (
                  <DeleteButton themeName={themeName} onClick={() => onDeleteTrueFalse(index)}>Verwijder</DeleteButton>
                )}
              </div>
              <QuestionBoard>
                <MiniWhiteboard
                  initialPaths={question.questionDrawing || []}
                  width={undefined}
                  height={220}
                  style={{ width: '100%' }}
                />
              </QuestionBoard>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                <PieChart
                  data={[
                    { label: 'True', value: question.votes?.true || 0, isCorrect: question.answer === true },
                    { label: 'False', value: question.votes?.false || 0, isCorrect: question.answer === false }
                  ]}
                  themeName={themeName}
                />
              </div>
            </QuestionContainer>
          ))}
          {pollSummaries && pollSummaries.map((poll, pollIdx) => {
            const maxVotes = poll.options.reduce((max, o) => o.votes > max ? o.votes : max, 0);
            return (
              <QuestionContainer key={`poll-${pollIdx}`} themeName={themeName}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <QuestionTitle themeName={themeName}>{`Poll ${pollIdx + 1}`}</QuestionTitle>
                  {onDeletePoll && (
                    <DeleteButton themeName={themeName} onClick={() => onDeletePoll(pollIdx)}>Verwijder</DeleteButton>
                  )}
                </div>
                <QuestionBoard>
                  <MiniWhiteboard
                    initialPaths={Array.isArray(poll.question) ? poll.question : []}
                    width={undefined}
                    height={220}
                    style={{ width: '100%' }}
                  />
                </QuestionBoard>
                <AnswersGrid>
                  {poll.options.map((opt: any, idx: number) => {
                    const isWinner = opt.votes === maxVotes && maxVotes > 0;
                    const Box = isWinner ? WinnerBox : AnswerBox;
                    return (
                      <Box key={idx} themeName={themeName} style={{ position: 'relative', overflow: isWinner ? 'hidden' : undefined }}>
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
                        <AnswerNumber themeName={themeName}>{idx + 1}.</AnswerNumber>
                        {opt.drawing ? (
                          <MiniWhiteboard
                            initialPaths={Array.isArray(opt.drawing) ? opt.drawing : []}
                            width={undefined}
                            height={120}
                            style={{ width: '100%' }}
                          />
                        ) : null}
                        <VotesBadge themeName={themeName}>{opt.votes}</VotesBadge>
                      </Box>
                    );
                  })}
                </AnswersGrid>
              </QuestionContainer>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, width: '100%', marginTop: 32 }}>
          <BackButton themeName={themeName} onClick={onClose}>{t('back')}</BackButton>
        </div>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default QuizSummary; 