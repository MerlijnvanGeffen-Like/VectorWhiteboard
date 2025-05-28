import React, { useState, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Whiteboard from './components/Whiteboard';
import QuizCreation from './components/QuizCreation';
import QuizResult from './components/QuizResult';
import RevealCorrect from './components/RevealCorrect';
import styled, { keyframes } from 'styled-components';
import PaletteIcon from '@mui/icons-material/Palette';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import QuizIcon from '@mui/icons-material/Quiz';
import BallotIcon from '@mui/icons-material/Ballot';
import Login from './components/Login';
import QuizSummary from './components/QuizSummary';
import RefreshIcon from '@mui/icons-material/Refresh';
import BuildIcon from '@mui/icons-material/Build';
import CreateIcon from '@mui/icons-material/Create';
import MouseIcon from '@mui/icons-material/Mouse';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import NoteIcon from '@mui/icons-material/Note';
import Slider from '@mui/material/Slider';
import TranslateIcon from '@mui/icons-material/Translate';

const bounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.15); }
  50% { transform: scale(0.97); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const FooterBar = styled.div<{ whiteboard?: boolean; themeName: string }>`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  background: ${({ whiteboard, themeName }) => {
    if (whiteboard) {
      return themeName === 'dark'
        ? 'linear-gradient(90deg, #2d2d2d 0%, #1a1a1a 100%)'
        : themeName === 'christmas'
        ? 'linear-gradient(90deg, #c62828 0%, #388e3c 100%)'
        : 'linear-gradient(90deg, #ff5f6d 0%, #ff416c 100%)';
    }
    return 'none !important';
  }};
  background-color: ${({ whiteboard }) => whiteboard ? 'transparent' : 'transparent !important'};
  padding: 10px 0 10px 0;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: none !important;
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

const FooterButton = styled.button<{ themeName: string }>`
  background: none;
  border: none;
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#fff'
      : '#fff'
  };
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.2s;
  &:hover {
    animation: ${bounce} 0.5s;
    color: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#4d4d4d'
        : themeName === 'christmas'
        ? '#c62828'
        : '#ff416c'
    };
  }
  & span {
    color: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#fff'
        : themeName === 'christmas'
        ? '#fff'
        : '#fff'
    };
  }
`;

const RevealButton = styled.button<{ themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#fff'
      : '#fff'
  };
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#000'
      : '#000'
  };
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  margin-left: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px ${({ themeName }) => 
    themeName === 'dark'
      ? '#0003'
      : themeName === 'christmas'
      ? '#fff'
      : '#fff'
  };
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#616161'
        : themeName === 'christmas'
        ? '#fff'
        : '#fff'
    };
    color: #c62828;
  }
  & span {
    color: #c62828;
  }
`;

const MainContent = styled.div<{ themeName: string }>`
  min-height: calc(100vh - 60px);
  padding-bottom: 60px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #2e7d32 100%)'
      : 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
  };
  background-attachment: fixed;
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
  background: ${({ whiteboard, themeName }) => {
    if (whiteboard) {
      return themeName === 'dark'
        ? 'linear-gradient(90deg, #2d2d2d 0%, #1a1a1a 100%)'
        : themeName === 'christmas'
        ? 'linear-gradient(90deg, #c62828 0%, #388e3c 100%)'
        : 'linear-gradient(90deg, #ff5f6d 0%, #ff416c 100%)';
    }
    return themeName === 'dark'
      ? '#2d2d2d'
      : themeName === 'christmas'
      ? '#388e3c'
      : '#f0f2f5';
  }};
  box-shadow: 0 -2px 8px ${({ themeName }) => 
    themeName === 'dark'
      ? '#0003'
      : themeName === 'christmas'
      ? '#0003'
      : '#0001'
  };
  border-radius: 0;
`;

const App: React.FC = () => {
  const [page, setPage] = useState<'whiteboard' | 'quiz' | 'reveal' | 'result' | 'dashboard' | 'summary'>('quiz');
  const [currentColor, setCurrentColor] = useState('#222');
  const [currentWidth, setCurrentWidth] = useState(4);
  const [currentMode, setCurrentMode] = useState('draw');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [reveal, setReveal] = useState(false);
  const [whiteboardKey, setWhiteboardKey] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateSubmenu, setShowTemplateSubmenu] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const [showToolsSubmenu, setShowToolsSubmenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedCorrect, setSelectedCorrect] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [revealHandler, setRevealHandler] = useState<(() => void) | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [lastQuizPage, setLastQuizPage] = useState<'quiz' | 'reveal' | 'result'>('quiz');
  const [quizClearKey, setQuizClearKey] = useState(0);
  const [quizMode, setQuizMode] = useState<'draw' | 'eraser'>('draw');
  const [themeName, setThemeName] = useState<'default' | 'christmas' | 'dark'>('default');

  const theme = createTheme({
    palette: {
      mode: themeName === 'dark' ? 'dark' : 'light',
      primary: themeName === 'christmas' ? { main: '#388e3c' } : { main: '#1976d2' },
      secondary: themeName === 'christmas' ? { main: '#c62828' } : { main: '#dc004e' },
      background: {
        default:
          themeName === 'dark'
            ? '#181818'
            : themeName === 'christmas'
            ? '#e8f5e9'
            : '#fff',
      },
    },
    typography: {
      fontFamily: 'Poppins, Arial, sans-serif',
    },
  });

  // Save a question to the quiz
  const handleSaveQuestion = (question: QuizQuestion) => {
    setCurrentQuestion(question);
    setPage('reveal');
  };

  // Update correct answer for a question
  const handleSetCorrectAnswer = (answerIds: number[]) => {
    if (currentQuestion) {
      const updatedQuestion = {
        ...currentQuestion,
        answers: currentQuestion.answers.map(answer => ({
          ...answer,
          isCorrect: answerIds.includes(answer.id)
        }))
      };
      setSelectedCorrect(answerIds);
      setQuiz(prev => [...prev, updatedQuestion]);
      setPage('result');
    }
  };

  // Register reveal handler
  React.useEffect(() => {
    if (page === 'reveal') {
      setRevealHandler(() => {
        if ((window as any).__quizRevealHandler) {
          (window as any).__quizRevealHandler();
        }
      });
    } else {
      setRevealHandler(null);
    }
  }, [page]);

  // Next Question: reset alles
  const handleNextQuestion = () => {
    setCurrentQuestion(null);
    setSelectedCorrect([]);
    setPage('quiz');
  };

  // Back naar reveal
  const handleBackToReveal = () => {
    setPage('reveal');
  };

  const openTemplateMenu = () => { setShowTemplateSubmenu(true); setShowThemeSubmenu(false); };
  const openThemeMenu = () => { setShowThemeSubmenu(true); setShowTemplateSubmenu(false); };
  const openToolsMenu = () => {
    setShowToolsSubmenu(true);
    setShowThemeSubmenu(false);
    setShowTemplateSubmenu(false);
  };
  const closeSubmenus = () => {
    setShowThemeSubmenu(false);
    setShowTemplateSubmenu(false);
    setShowToolsSubmenu(false);
  };

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
      <MainContent themeName={themeName}>
        {page === 'whiteboard' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
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
          <QuizCreation 
            onSaveQuestion={handleSaveQuestion} 
            onReveal={() => {}} 
            currentColor={currentColor} 
            currentWidth={currentWidth} 
            clearKey={quizClearKey} 
            mode={quizMode} 
            themeName={themeName}
          />
        )}
        {page === 'reveal' && currentQuestion && (
          <RevealCorrect
            question={currentQuestion}
            onSelectCorrect={handleSetCorrectAnswer}
            onBack={() => setPage('quiz')}
            onShowResult={(selected: number[]) => {
              if (selected.length > 0) handleSetCorrectAnswer(selected);
            }}
            onSelectedAnswersChange={setSelectedAnswers}
            themeName={themeName}
          />
        )}
        {page === 'result' && currentQuestion && selectedCorrect.length > 0 && (
          <QuizResult
            question={currentQuestion}
            correctIds={selectedCorrect}
            onBack={handleBackToReveal}
            onNext={handleNextQuestion}
            themeName={themeName}
          />
        )}
        {page === 'summary' && (
          <QuizSummary
            questions={quiz}
            onClose={() => setPage(lastQuizPage)}
          />
        )}
        {page === 'dashboard' && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
            <h2>Welkom, {isGuest ? 'gast' : (userEmail || 'gebruiker')}!</h2>
            <p>Je bent {isGuest ? 'ingelogd als gast' : 'ingelogd'}. Dit is je dashboard.</p>
          </div>
        )}
      </MainContent>
      {showToolsSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          {page === 'whiteboard' ? (
            <>
              <FooterButton themeName={themeName} title="Draw" onClick={() => { setCurrentMode('draw'); closeSubmenus(); }}>
                <CreateIcon />
                <span style={{fontSize:'0.7rem'}}>Draw</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Select" onClick={() => { setCurrentMode('select'); closeSubmenus(); }}>
                <MouseIcon />
                <span style={{fontSize:'0.7rem'}}>Select</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Move" onClick={() => { setCurrentMode('move'); closeSubmenus(); }}>
                <OpenWithIcon />
                <span style={{fontSize:'0.7rem'}}>Move</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Eraser" onClick={() => { setCurrentMode('eraser'); closeSubmenus(); }}>
                <DeleteIcon />
                <span style={{fontSize:'0.7rem'}}>Eraser</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Lasso" onClick={() => { setCurrentMode('lasso'); closeSubmenus(); }}>
                <AutoFixHighIcon />
                <span style={{fontSize:'0.7rem'}}>Lasso</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Post-it" onClick={() => { setCurrentMode('postit'); closeSubmenus(); }}>
                <NoteIcon />
                <span style={{fontSize:'0.7rem'}}>Post-it</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Clear All" onClick={() => { setWhiteboardKey(prev => prev + 1); closeSubmenus(); }}>
                <DeleteSweepIcon />
                <span style={{fontSize:'0.7rem'}}>Clear All</span>
              </FooterButton>
              {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#008080', '#FF69B4'].map((color) => (
                <Box
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    border: `2px solid ${color === currentColor ? '#1976d2' : '#ccc'}`,
                    borderRadius: 1,
                    cursor: 'pointer',
                    display: 'inline-block',
                    marginLeft: '2px',
                    marginRight: '2px',
                    '&:hover': {
                      borderColor: '#1976d2'
                    }
                  }}
                />
              ))}
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                style={{ width: 24, height: 24, padding: 0, border: 'none', marginLeft: 4, marginRight: 4 }}
              />
              <Box sx={{ width: 120, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 2, marginRight: 2 }}>
                <Slider
                  value={currentWidth}
                  onChange={(_, value) => setCurrentWidth(value as number)}
                  min={1}
                  max={20}
                  valueLabelDisplay="auto"
                  size="small"
                />
              </Box>
              <FooterButton themeName={themeName} title="Back" onClick={closeSubmenus}>
                <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
                <span style={{fontSize:'0.7rem'}}>Back</span>
              </FooterButton>
            </>
          ) : (
            <>
              <FooterButton themeName={themeName} title="Draw" onClick={() => { setQuizMode('draw'); closeSubmenus(); }}>
                <CreateIcon />
                <span style={{fontSize:'0.7rem'}}>Draw</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Eraser" onClick={() => { setQuizMode('eraser'); closeSubmenus(); }}>
                <DeleteIcon />
                <span style={{fontSize:'0.7rem'}}>Eraser</span>
              </FooterButton>
              <FooterButton themeName={themeName} title="Clear All" onClick={() => { setQuizClearKey(prev => prev + 1); closeSubmenus(); }}>
                <DeleteSweepIcon />
                <span style={{fontSize:'0.7rem'}}>Clear All</span>
              </FooterButton>
              {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#008080', '#FF69B4'].map((color) => (
                <Box
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    border: `2px solid ${color === currentColor ? '#1976d2' : '#ccc'}`,
                    borderRadius: 1,
                    cursor: 'pointer',
                    display: 'inline-block',
                    marginLeft: '2px',
                    marginRight: '2px',
                    '&:hover': {
                      borderColor: '#1976d2'
                    }
                  }}
                />
              ))}
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                style={{ width: 24, height: 24, padding: 0, border: 'none', marginLeft: 4, marginRight: 4 }}
              />
              <Box sx={{ width: 120, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 2, marginRight: 2 }}>
                <Slider
                  value={currentWidth}
                  onChange={(_, value) => setCurrentWidth(value as number)}
                  min={1}
                  max={20}
                  valueLabelDisplay="auto"
                  size="small"
                />
              </Box>
              <FooterButton themeName={themeName} title="Back" onClick={closeSubmenus}>
                <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
                <span style={{fontSize:'0.7rem'}}>Back</span>
              </FooterButton>
            </>
          )}
        </SubmenuFooterBar>
      ) : showThemeSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          <FooterButton themeName={themeName} title="Default" onClick={() => { setThemeName('default'); closeSubmenus(); }}><PaletteIcon /><span style={{fontSize:'0.7rem'}}>Default</span></FooterButton>
          <FooterButton themeName={themeName} title="Christmas" onClick={() => { setThemeName('christmas'); closeSubmenus(); }}><HolidayVillageIcon /><span style={{fontSize:'0.7rem'}}>Christmas</span></FooterButton>
          <FooterButton themeName={themeName} title="Dark" onClick={() => { setThemeName('dark'); closeSubmenus(); }}><WhatshotIcon /><span style={{fontSize:'0.7rem'}}>Dark</span></FooterButton>
          <FooterButton themeName={themeName} title="Back" onClick={closeSubmenus}><ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} /><span style={{fontSize:'0.7rem'}}>Back</span></FooterButton>
        </SubmenuFooterBar>
      ) : showTemplateSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          <FooterButton themeName={themeName} title="Quiz" onClick={() => { setPage('quiz'); closeSubmenus(); }}>
            <QuizIcon />
            <span style={{fontSize:'0.7rem'}}>Quiz</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Whiteboard" onClick={() => { setPage('whiteboard'); closeSubmenus(); }}>
            <ViewModuleIcon />
            <span style={{fontSize:'0.7rem'}}>Whiteboard</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Poll" onClick={() => { alert('Poll functionaliteit nog niet geïmplementeerd!'); closeSubmenus(); }}>
            <BallotIcon />
            <span style={{fontSize:'0.7rem'}}>Poll</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Back" onClick={closeSubmenus}>
            <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
            <span style={{fontSize:'0.7rem'}}>Back</span>
          </FooterButton>
        </SubmenuFooterBar>
      ) : (
        <FooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          <FooterButton themeName={themeName} title="Theme" onClick={openThemeMenu}><PaletteIcon /><span style={{fontSize:'0.7rem'}}>Theme</span></FooterButton>
          <FooterButton themeName={themeName} title="Templates" onClick={openTemplateMenu} style={{ position: 'relative' }}>
            <ViewModuleIcon />
            <span style={{fontSize:'0.7rem'}}>Templates</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Tools" onClick={openToolsMenu}>
            <BuildIcon />
            <span style={{fontSize:'0.7rem'}}>Tools</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Refresh" onClick={() => window.location.reload()}>
            <RefreshIcon />
            <span style={{fontSize:'0.7rem'}}>Refresh</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Vertaal" onClick={() => alert('Vertaalfunctie nog niet geïmplementeerd')}>
            <TranslateIcon />
            <span style={{fontSize:'0.7rem'}}>Vertaal</span>
          </FooterButton>
          <FooterButton themeName={themeName} title="Text Recognition"><TextFieldsIcon /><span style={{fontSize:'0.7rem'}}>Text Recog.</span></FooterButton>
          <FooterButton themeName={themeName} title="Keyboard Mode"><KeyboardIcon /><span style={{fontSize:'0.7rem'}}>Keyboard</span></FooterButton>
          <FooterButton themeName={themeName} title="Help"><HelpOutlineIcon /><span style={{fontSize:'0.7rem'}}>Help</span></FooterButton>
          <FooterButton themeName={themeName} title={isLoggedIn ? (isGuest ? 'Log out (guest)' : 'Log out') : 'Log in'} onClick={isLoggedIn ? handleLogout : () => setShowLogin(true)}>
            <LoginIcon />
            <span style={{fontSize:'0.7rem'}}>{isLoggedIn ? (isGuest ? 'Log out (guest)' : 'Log out') : 'Log in'}</span>
          </FooterButton>
          {page !== 'whiteboard' && (
            page === 'summary' ? (
            <RevealButton themeName={themeName} onClick={() => setPage('quiz')}>QUIZ CREATION</RevealButton>
          ) : (
            <>
              <RevealButton themeName={themeName} onClick={() => {
                if ((page as string) !== 'summary') {
                  if (['quiz', 'reveal', 'result'].includes(page as string)) setLastQuizPage(page as any);
                  setPage('summary');
                }
              }}>SHOW SUMMARY</RevealButton>
              {page === 'result' && (
                <RevealButton themeName={themeName} onClick={handleNextQuestion}>NEXT QUESTION</RevealButton>
              )}
              {page === 'reveal' && (
                <RevealButton
                  themeName={themeName}
                  onClick={() => {
                    if (selectedAnswers.length > 0) handleSetCorrectAnswer(selectedAnswers);
                  }}
                  id="show-result-btn"
                  disabled={selectedAnswers.length === 0}
                >
                  SHOW RESULT
                </RevealButton>
              )}
              {page !== 'result' && page !== 'reveal' && (
                <RevealButton
                  themeName={themeName}
                  onClick={() => {
                    if (page === 'quiz') {
                      if ((window as any).__quizRevealHandler) (window as any).__quizRevealHandler();
                    }
                  }}
                >
                  {page === 'quiz' ? 'REVEAL CORRECT ANSWERS' : ''}
                </RevealButton>
              )}
            </>
            )
          )}
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