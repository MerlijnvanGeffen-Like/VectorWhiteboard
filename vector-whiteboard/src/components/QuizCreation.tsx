import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import MiniWhiteboard from './MiniWhiteboard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AnswerData, QuizQuestion } from '../App';

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

const AnswerBox = styled.div`
  display: flex;
  align-items: center;
  background: #fff8;
  border-radius: 12px;
  padding: 8px 12px;
  min-height: 90px;
  width: 100%;
  position: relative;
`;

const AnswerNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 12px;
  color: #222;
  width: 32px;
  text-align: right;
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

const VoteBtn = styled.button<{ up?: boolean }>`
  background: none;
  border: none;
  color: ${({ up }) => (up ? '#1bbf3a' : '#e53935')};
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

const VoteScore = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  margin: 2px 0;
`;

const RemoveBtn = styled.button`
  background: #e53935;
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1.3rem;
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
  box-shadow: 0 2px 8px #e5393522;
  transition: background 0.2s;
  cursor: pointer;
  &:hover {
    background: #b71c1c;
  }
  & span {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 1.3rem;
    line-height: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const AddButton = styled.button`
  background: #ffb6c1;
  color: #fff;
  font-size: 2.2rem;
  border: none;
  border-radius: 10px;
  width: 100%;
  height: 80px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ff69b4;
  }
`;

const NextQuestionButton = styled.button`
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

const QuizCreation: React.FC<{ onSaveQuestion: (q: QuizQuestion) => void }> = ({ onSaveQuestion }) => {
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

  return (
    <Container>
      <QuizBox>
        <Title>QUIZ CREATION</Title>
        <QuestionBoard>
          <MiniWhiteboard ref={questionRef} width={undefined} height={220} style={{ width: '100%' }} />
        </QuestionBoard>
        <AnswersGrid>
          {answers.map((answer, i) => (
            <AnswerBox key={answer.id}>
              <AnswerNumber>{i + 1}.</AnswerNumber>
              <MiniWhiteboard ref={el => answerRefs.current[i] = el} width={340} height={75} />
              <VoteBox>
                <VoteBtn up onClick={() => vote(answer.id, 1)} title="Upvote">
                  <ArrowUpwardIcon fontSize="small" />
                </VoteBtn>
                <VoteScore>{answer.votes}</VoteScore>
                <VoteBtn onClick={() => vote(answer.id, -1)} title="Downvote">
                  <ArrowDownwardIcon fontSize="small" />
                </VoteBtn>
              </VoteBox>
              {i === answers.length - 1 && (
                <RemoveBtn title="Verwijder antwoord" onClick={() => removeAnswer(answer.id)}><span>-</span></RemoveBtn>
              )}
            </AnswerBox>
          ))}
          {answers.length % 2 === 1 && <div />} {/* For grid alignment */}
          <AddButton onClick={addAnswer}>+</AddButton>
        </AnswersGrid>
        <NextQuestionButton onClick={nextQuestion}>Next Question</NextQuestionButton>
      </QuizBox>
    </Container>
  );
};

export default QuizCreation; 