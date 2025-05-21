import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from './components/Toolbar';
import Whiteboard from './components/Whiteboard';
import QuizCreation from './components/QuizCreation';
import QuizResult from './components/QuizResult';
import styled from 'styled-components';
import PaletteIcon from '@mui/icons-material/Palette';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
});

const FooterBar = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  background: #f0f2f5;
  padding: 10px 0 10px 0;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 -2px 8px #0001;
  flex-wrap: wrap;
`;

const SwitchButton = styled.button<{ active: boolean }>`
  font-size: 1.1rem;
  font-weight: bold;
  padding: 8px 28px;
  border-radius: 8px;
  border: none;
  background: ${({ active }) => (active ? '#ff416c' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#222')};
  box-shadow: ${({ active }) => (active ? '0 2px 8px #ff416c44' : 'none')};
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ff416c;
    color: #fff;
  }
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  color: #222;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.2s;
  &:hover {
    color: #ff416c;
  }
`;

const RevealButton = styled.button`
  background: #fff;
  color: #ff416c;
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  margin-left: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px #ff416c22;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ff416c;
    color: #fff;
  }
`;

const MainContent = styled.div`
  min-height: calc(100vh - 60px);
  padding-bottom: 60px;
  @media (max-width: 900px) {
    padding-bottom: 120px;
  }
`;

// Types for quiz data
export interface AnswerData {
  id: number;
  votes: number;
  drawing?: any;
  isCorrect?: boolean;
}
export interface QuizQuestion {
  questionDrawing: any;
  answers: AnswerData[];
}

const App: React.FC = () => {
  const [page, setPage] = useState<'whiteboard' | 'quiz' | 'result'>('whiteboard');
  const [currentColor, setCurrentColor] = useState('#222');
  const [currentWidth, setCurrentWidth] = useState(4);
  const [currentMode, setCurrentMode] = useState('draw');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [reveal, setReveal] = useState(false);
  const [whiteboardKey, setWhiteboardKey] = useState(0);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);

  // Save a question to the quiz
  const handleSaveQuestion = (question: QuizQuestion) => {
    setQuiz(prev => [...prev, question]);
  };

  // Update correct answer for a question
  const handleSetCorrectAnswer = (questionIdx: number, answerId: number) => {
    setQuiz(prevQuiz => prevQuiz.map((q, idx) => {
      if (idx !== questionIdx) return q;
      return {
        ...q,
        answers: q.answers.map(a => ({ ...a, isCorrect: a.id === answerId }))
      };
    }));
  };

  // Reveal correct answers and show result page
  const handleReveal = () => {
    setReveal(true);
    setPage('result');
  };

  // Go back to quiz creation
  const handleBackToQuiz = () => {
    setReveal(false);
    setPage('quiz');
  };

  const openTemplateMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTemplateMenuAnchor(event.currentTarget);
  };
  const closeTemplateMenu = () => {
    setTemplateMenuAnchor(null);
  };
  const handleTemplateSelect = (page: 'whiteboard' | 'quiz') => {
    setPage(page);
    closeTemplateMenu();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContent>
        {page === 'whiteboard' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
            <Toolbar
              onColorChange={setCurrentColor}
              onWidthChange={setCurrentWidth}
              onModeChange={setCurrentMode}
              currentColor={currentColor}
              currentWidth={currentWidth}
              currentMode={currentMode}
              onClearAll={() => setWhiteboardKey(prev => prev + 1)}
            />
            <Whiteboard
              key={whiteboardKey}
              currentColor={currentColor}
              currentWidth={currentWidth}
              currentMode={currentMode}
              onClearAll={() => setWhiteboardKey(prev => prev + 1)}
            />
          </Box>
        )}
        {page === 'quiz' && (
          <QuizCreation onSaveQuestion={handleSaveQuestion} />
        )}
        {page === 'result' && (
          <QuizResult quiz={quiz} reveal={reveal} onBack={handleBackToQuiz} onSetCorrectAnswer={handleSetCorrectAnswer} />
        )}
      </MainContent>
      <FooterBar>
        <FooterButton title="Theme"><PaletteIcon /><span style={{fontSize:'0.7rem'}}>Theme</span></FooterButton>
        <FooterButton title="Templates" onClick={openTemplateMenu} style={{ position: 'relative' }}>
          <ViewModuleIcon />
          <span style={{fontSize:'0.7rem'}}>Templates</span>
        </FooterButton>
        <Menu
          anchorEl={templateMenuAnchor}
          open={Boolean(templateMenuAnchor)}
          onClose={closeTemplateMenu}
          PaperProps={{
            style: {
              borderRadius: 12,
              minWidth: 160,
              background: '#fff',
              boxShadow: '0 4px 24px #0002',
              marginTop: 8,
            },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MenuItem onClick={() => handleTemplateSelect('whiteboard')} style={{ fontWeight: page === 'whiteboard' ? 700 : 400, color: '#ff416c', fontFamily: 'Poppins' }}>Whiteboard</MenuItem>
          <MenuItem onClick={() => handleTemplateSelect('quiz')} style={{ fontWeight: page === 'quiz' ? 700 : 400, color: '#ff416c', fontFamily: 'Poppins' }}>Quiz</MenuItem>
        </Menu>
        <FooterButton title="Number Board"><LooksOneIcon /><span style={{fontSize:'0.7rem'}}>Number Board</span></FooterButton>
        <FooterButton title="Eraser Tool"><DeleteSweepIcon /><span style={{fontSize:'0.7rem'}}>Eraser Tool</span></FooterButton>
        <FooterButton title="Text Recognition"><TextFieldsIcon /><span style={{fontSize:'0.7rem'}}>Text Recog.</span></FooterButton>
        <FooterButton title="Keyboard Mode"><KeyboardIcon /><span style={{fontSize:'0.7rem'}}>Keyboard</span></FooterButton>
        <FooterButton title="Help"><HelpOutlineIcon /><span style={{fontSize:'0.7rem'}}>Help</span></FooterButton>
        <FooterButton title="Log in"><LoginIcon /><span style={{fontSize:'0.7rem'}}>Log in</span></FooterButton>
        <RevealButton onClick={handleReveal}>REVEAL CORRECT ANSWER</RevealButton>
      </FooterBar>
    </ThemeProvider>
  );
};

export default App; 