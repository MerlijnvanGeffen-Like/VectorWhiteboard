import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { QuizQuestion, AnswerData } from '../App';
import MiniWhiteboard, { MiniWhiteboardHandle } from './MiniWhiteboard';

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

const AnswerBox = styled.div<{ correct?: boolean; faded?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ correct }) => correct ? '#c8f7c5' : '#fff8'};
  border-radius: 12px;
  padding: 8px 12px;
  min-height: 90px;
  width: 100%;
  position: relative;
  border: ${({ correct }) => correct ? '2px solid #1bbf3a' : 'none'};
  box-shadow: ${({ correct }) => correct ? '0 0 0 2px #1bbf3a44' : 'none'};
  opacity: ${({ faded }) => faded ? 0.4 : 1};
  cursor: pointer;
  transition: opacity 0.2s, box-shadow 0.2s;
`;

const AnswerNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: #222;
  width: 32px;
  text-align: right;
`;

const Radio = styled.input`
  margin-right: 10px;
  accent-color: #1bbf3a;
`;

const BackButton = styled.button`
  background: #fff;
  color: #ff416c;
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px #ff416c22;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ff416c;
    color: #fff;
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
`;

const VoteScore = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  margin: 2px 0;
`;

interface QuizResultProps {
  quiz: QuizQuestion[];
  reveal: boolean;
  onBack: () => void;
  onSetCorrectAnswer: (questionIdx: number, answerId: number) => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ quiz, reveal, onBack, onSetCorrectAnswer }) => {
  const [correctAnswers, setCorrectAnswers] = useState<(number | null)[]>(
    quiz.map(q => q.answers.find(a => a.isCorrect)?.id ?? null)
  );

  useEffect(() => {
    setCorrectAnswers(quiz.map(q => q.answers.find(a => a.isCorrect)?.id ?? null));
  }, [quiz]);

  const handleSelect = (qIdx: number, aId: number) => {
    setCorrectAnswers(prev => prev.map((val, idx) => idx === qIdx ? aId : val));
    onSetCorrectAnswer(qIdx, aId);
  };

  return (
    <Container>
      <QuizBox>
        <Title>Quiz Result</Title>
        {quiz.map((q, qIdx) => (
          <div key={qIdx} style={{ width: '100%', marginBottom: 32 }}>
            <div style={{ marginBottom: 12, fontWeight: 600, color: '#fff', fontSize: '1.1rem' }}>
              Vraag {qIdx + 1}
            </div>
            <QuestionBoard>
              <MiniWhiteboard width={undefined} height={220} style={{ width: '100%' }} initialPaths={q.questionDrawing} />
            </QuestionBoard>
            <AnswersGrid>
              {q.answers.map((a, aIdx) => (
                <AnswerBox
                  key={a.id}
                  correct={correctAnswers[qIdx] === a.id}
                  faded={correctAnswers[qIdx] !== a.id && correctAnswers[qIdx] !== null}
                  onClick={() => handleSelect(qIdx, a.id)}
                >
                  <AnswerNumber>{aIdx + 1}.</AnswerNumber>
                  <MiniWhiteboard width={340} height={75} initialPaths={a.drawing} />
                  <VoteBox>
                    <VoteScore>{a.votes}</VoteScore>
                  </VoteBox>
                </AnswerBox>
              ))}
              {q.answers.length % 2 === 1 && <div />} {/* For grid alignment */}
            </AnswersGrid>
          </div>
        ))}
        <BackButton onClick={onBack}>Back to Quiz Creation</BackButton>
      </QuizBox>
    </Container>
  );
};

export default QuizResult; 