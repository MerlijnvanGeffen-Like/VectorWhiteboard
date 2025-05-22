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
import { keyframes } from 'styled-components';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import QuizIcon from '@mui/icons-material/Quiz';
import BallotIcon from '@mui/icons-material/Ballot';
import Login from './components/Login';

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

const bounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.15); }
  50% { transform: scale(0.97); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AnimatedFooterButton = styled(FooterButton)`
  &:hover {
    animation: ${bounce} 0.5s;
    color: #ff416c;
  }
`;

const CustomModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const CustomModal = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 32px #0003;
  padding: 40px 32px 32px 32px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalIn 0.35s cubic-bezier(.68,-0.55,.27,1.55);
  @keyframes modalIn {
    0% { transform: scale(0.7) translateY(40px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
`;

const ModalTitle = styled.h2`
  font-family: 'Poppins', Arial, sans-serif;
  font-size: 2rem;
  color: #ff416c;
  margin-bottom: 24px;
`;

const ModalOption = styled.button`
  width: 220px;
  padding: 18px 0;
  margin: 10px 0;
  font-size: 1.3rem;
  font-family: 'Poppins', Arial, sans-serif;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px #ff416c33;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: scale(1.07);
    box-shadow: 0 4px 16px #ff416c55;
  }
`;

const SubmenuBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 70px;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.95);
  border-radius: 24px;
  box-shadow: 0 4px 24px #0002;
  padding: 18px 36px 18px 36px;
  display: flex;
  align-items: center;
  gap: 36px;
  z-index: 1500;
`;

const SubmenuButton = styled.button`
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2rem;
  box-shadow: 0 2px 8px #ff416c33;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;
  &:hover {
    transform: scale(1.12);
    box-shadow: 0 4px 16px #ff416c55;
  }
`;

const SubmenuLabel = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ff416c;
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 600;
  text-align: center;
`;

const ArrowAnim = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0;
  border-radius: 50%;
  animation: arrowBounce 1.2s infinite;
  @keyframes arrowBounce {
    0% { transform: translateY(0); }
    30% { transform: translateY(-8px); }
    50% { transform: translateY(0); }
    70% { transform: translateY(4px); }
    100% { transform: translateY(0); }
  }
`;

const SubmenuFooterBar = styled(FooterBar)`
  background: #f0f2f5;
  box-shadow: 0 -2px 8px #0001;
  border-radius: 0;
`;

const App: React.FC = () => {
  const [page, setPage] = useState<'whiteboard' | 'quiz' | 'result' | 'dashboard'>('whiteboard');
  const [currentColor, setCurrentColor] = useState('#222');
  const [currentWidth, setCurrentWidth] = useState(4);
  const [currentMode, setCurrentMode] = useState('draw');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [reveal, setReveal] = useState(false);
  const [whiteboardKey, setWhiteboardKey] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateSubmenu, setShowTemplateSubmenu] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');

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

  const openTemplateMenu = () => { setShowTemplateSubmenu(true); setShowThemeSubmenu(false); };
  const openThemeMenu = () => { setShowThemeSubmenu(true); setShowTemplateSubmenu(false); };
  const closeSubmenus = () => { setShowTemplateSubmenu(false); setShowThemeSubmenu(false); };

  function handleLogin(email: string, guest?: boolean) {
    setIsLoggedIn(true);
    setUserEmail(email);
    setIsGuest(!!guest);
    localStorage.setItem('isLoggedIn', 'true');
    if (guest) localStorage.setItem('isGuest', 'true');
    else localStorage.removeItem('isGuest');
    setShowLogin(false);
  }
  function handleLogout() {
    setIsLoggedIn(false);
    setUserEmail(null);
    setIsGuest(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isGuest');
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

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
        {page === 'dashboard' && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
            <h2>Welkom, {isGuest ? 'gast' : (userEmail || 'gebruiker')}!</h2>
            <p>Je bent {isGuest ? 'ingelogd als gast' : 'ingelogd'}. Dit is je dashboard.</p>
          </div>
        )}
      </MainContent>
      {showThemeSubmenu ? (
        <SubmenuFooterBar>
          <FooterButton title="Default" onClick={() => { alert('Default theme!'); closeSubmenus(); }}><PaletteIcon /><span style={{fontSize:'0.7rem'}}>Default</span></FooterButton>
          <FooterButton title="Christmas" onClick={() => { alert('Christmas theme!'); closeSubmenus(); }}><HolidayVillageIcon /><span style={{fontSize:'0.7rem'}}>Christmas</span></FooterButton>
          <FooterButton title="Dark" onClick={() => { alert('Dark theme!'); closeSubmenus(); }}><WhatshotIcon /><span style={{fontSize:'0.7rem'}}>Dark</span></FooterButton>
          <FooterButton title="Back" onClick={closeSubmenus}><ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} /><span style={{fontSize:'0.7rem'}}>Back</span></FooterButton>
        </SubmenuFooterBar>
      ) : showTemplateSubmenu ? (
        <SubmenuFooterBar>
          <FooterButton title="Quiz" onClick={() => { setPage('quiz'); closeSubmenus(); }}>
            <QuizIcon />
            <span style={{fontSize:'0.7rem'}}>Quiz</span>
          </FooterButton>
          <FooterButton title="Whiteboard" onClick={() => { setPage('whiteboard'); closeSubmenus(); }}>
            <ViewModuleIcon />
            <span style={{fontSize:'0.7rem'}}>Whiteboard</span>
          </FooterButton>
          <FooterButton title="Poll" onClick={() => { alert('Poll functionaliteit nog niet geïmplementeerd!'); closeSubmenus(); }}>
            <BallotIcon />
            <span style={{fontSize:'0.7rem'}}>Poll</span>
          </FooterButton>
          <FooterButton title="Back" onClick={closeSubmenus}>
            <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
            <span style={{fontSize:'0.7rem'}}>Back</span>
          </FooterButton>
        </SubmenuFooterBar>
      ) : (
        <FooterBar>
          <FooterButton title="Theme" onClick={openThemeMenu}><PaletteIcon /><span style={{fontSize:'0.7rem'}}>Theme</span></FooterButton>
          <AnimatedFooterButton title="Templates" onClick={openTemplateMenu} style={{ position: 'relative' }}>
            <ViewModuleIcon />
            <span style={{fontSize:'0.7rem'}}>Templates</span>
          </AnimatedFooterButton>
          <FooterButton title="Number Board"><LooksOneIcon /><span style={{fontSize:'0.7rem'}}>Number Board</span></FooterButton>
          <FooterButton title="Tools"><DeleteSweepIcon /><span style={{fontSize:'0.7rem'}}>Tools</span></FooterButton>
          <FooterButton title="Text Recognition"><TextFieldsIcon /><span style={{fontSize:'0.7rem'}}>Text Recog.</span></FooterButton>
          <FooterButton title="Keyboard Mode"><KeyboardIcon /><span style={{fontSize:'0.7rem'}}>Keyboard</span></FooterButton>
          <FooterButton title="Help"><HelpOutlineIcon /><span style={{fontSize:'0.7rem'}}>Help</span></FooterButton>
          <FooterButton title={isLoggedIn ? (isGuest ? 'Log out (guest)' : 'Log out') : 'Log in'} onClick={isLoggedIn ? handleLogout : () => setShowLogin(true)}>
            <LoginIcon />
            <span style={{fontSize:'0.7rem'}}>{isLoggedIn ? (isGuest ? 'Log out (guest)' : 'Log out') : 'Log in'}</span>
          </FooterButton>
          <RevealButton onClick={handleReveal}>REVEAL CORRECT ANSWER</RevealButton>
        </FooterBar>
      )}
      {showLogin && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.15)',zIndex:2000}}>
          <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
        </div>
      )}
    </ThemeProvider>
  );
};

export default App; 