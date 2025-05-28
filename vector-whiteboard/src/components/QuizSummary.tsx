import React from 'react';
import styled from 'styled-components';
import { QuizQuestion } from '../App';
import MiniWhiteboard from './MiniWhiteboard';
import { PieChart } from './QuizResult';

interface PieChartProps {
  data: { label: string; value: number; isCorrect?: boolean }[];
}

const ViewportContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #FFE3B2 0%, #660020 100%);
  background-attachment: fixed;
`;

const TopLeftBlock = styled.div`
  position: absolute;
  top: -150px;
  left: -450px;
  width: 740px;
  height: 740px;
  background: linear-gradient(135deg, #E20248 0%, #F6A71B 100%);
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-125deg);
`;

const BottomRightBlock = styled.div`
  position: absolute;
  bottom: -30px;
  right: -450px;
  width: 740px;
  height: 740px;
  background: linear-gradient(135deg, #E20248 0%, #F6A71B 100%);
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-45deg);
`;

const LargeQuizBox = styled.div`
  position: relative;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  width: 90vw;
  height: 87vh;
  min-width: 320px;
  max-width: 1400px;
  max-height: 900px;
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
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

const QuestionCard = styled.div`
  margin-bottom: 24px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const QuestionTitle = styled.h3`
  color: #222;
  margin-bottom: 16px;
  font-size: 1.4rem;
  font-weight: 600;
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
}

const AnswerBox = styled.div<AnswerBoxProps>`
  display: flex;
  align-items: center;
  background: ${props => props.isCorrect ? '#1bbf3a' : '#fff'};
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

interface AnswerNumberProps {
  isCorrect?: boolean;
}

const AnswerNumber = styled.div<AnswerNumberProps>`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 12px;
  color: ${props => props.isCorrect ? '#fff' : '#222'};
  width: 24px;
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

interface QuizSummaryProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({ questions, onClose }) => {
  return (
    <ViewportContainer>
      <TopLeftBlock />
      <BottomRightBlock />
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
        QUIZ SUMMARY
      </div>
      <LargeQuizBox
        style={{
          marginTop: 64,
          position: 'relative',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      >
        <ScrollArea>
          {questions.map((question, i) => {
            const pieData = question.answers.map((answer, j) => ({
              label: `${j + 1}`,
              value: answer.votes,
              isCorrect: answer.isCorrect
            }));
            return (
              <QuestionCard key={i}>
                <QuestionTitle>Question {i + 1}</QuestionTitle>
                <div style={{ marginBottom: '16px' }}>
                  <MiniWhiteboard
                    initialPaths={question.questionDrawing}
                    width={undefined}
                    height={220}
                    style={{ width: '100%' }}
                  />
                </div>
                <AnswersGrid>
                  {question.answers.map((answer, j) => (
                    <AnswerBox key={j} isCorrect={answer.isCorrect}>
                      <AnswerNumber isCorrect={answer.isCorrect}>{j + 1}.</AnswerNumber>
                      <MiniWhiteboard
                        initialPaths={answer.drawing}
                        width={undefined}
                        height={75}
                        style={{ width: '100%', minWidth: 0, maxWidth: 'calc(100% - 60px)' }}
                      />
                      <VoteBox isCorrect={answer.isCorrect}>
                        <VoteScore isCorrect={answer.isCorrect}>{answer.votes}</VoteScore>
                      </VoteBox>
                    </AnswerBox>
                  ))}
                </AnswersGrid>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
                  <PieChart data={pieData} />
                </div>
              </QuestionCard>
            );
          })}
        </ScrollArea>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default QuizSummary; 