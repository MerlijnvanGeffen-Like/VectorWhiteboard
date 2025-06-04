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
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TrueFalseCreation from './components/TrueFalseCreation';
import TrueFalseCorrect from './components/TrueFalseCorrect';
import TrueFalseResult from './components/TrueFalseResult';
import PollCreation, { PollCreationHandle } from './components/PollCreation';
import PollResult from './components/PollResult';
import PollSummary from './components/PollSummary';
import domtoimage from 'dom-to-image-more';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from './config/emailjs';
import axios from 'axios';
import { Button } from '@mui/material';

// Add type declaration for dom-to-image-more
declare module 'dom-to-image-more';

const bounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.15); }
  50% { transform: scale(0.97); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const wave = keyframes`
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
  100% { transform: translateX(-50%) translateY(0); }
`;

const float = keyframes`
  0% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(10px) translateY(-5px); }
  100% { transform: translateX(0) translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Sun = styled.div`
  position: absolute;
  top: 60px;
  right: 100px;
  width: 80px;
  height: 80px;
  background: #FFD700;
  border-radius: 50%;
  box-shadow: 0 0 40px #FFD700;
  animation: ${rotate} 20s linear infinite;
`;

const Cloud = styled.div<{ delay: number; size: number; top: number; left: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size * 0.6}px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${props => props.size}px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  &:before, &:after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
  }
  &:before {
    width: ${props => props.size * 0.5}px;
    height: ${props => props.size * 0.5}px;
    top: ${props => -props.size * 0.25}px;
    left: ${props => props.size * 0.1}px;
  }
  &:after {
    width: ${props => props.size * 0.6}px;
    height: ${props => props.size * 0.6}px;
    top: ${props => -props.size * 0.3}px;
    right: ${props => props.size * 0.1}px;
  }
`;

const Sky = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #87CEEB 0%, #4ECDC4 100%);
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const OceanWave = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 200%;
  height: 100px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%);
  border-radius: 50%;
  animation: ${wave} 3s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
`;

const OceanContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
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
      : themeName === 'summer'
      ? '#fff'
      : themeName === 'space'
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
        : themeName === 'summer'
        ? '#fff'
        : themeName === 'space'
        ? '#6B48FF'
        : '#ff416c'
    };
  }
  & span {
    color: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#fff'
        : themeName === 'christmas'
        ? '#fff'
        : themeName === 'summer'
        ? '#fff'
        : themeName === 'space'
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
      : themeName === 'summer'
      ? '#fff'
      : themeName === 'space'
      ? '#fff'
      : 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)'
  };
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#000'
      : themeName === 'summer'
      ? '#45B7D1'
      : themeName === 'space'
      ? '#6B48FF'
      : '#fff'
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
      : themeName === 'summer'
      ? '#45B7D133'
      : themeName === 'space'
      ? '#6B48FF33'
      : '#ff416c33'
  };
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    background: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#616161'
        : themeName === 'christmas'
        ? '#f5f5f5'
        : themeName === 'summer'
        ? '#45B7D1'
        : themeName === 'space'
        ? '#6B48FF'
        : 'linear-gradient(90deg, #ff2b4b 0%, #ff416c 100%)'
    };
    color: ${({ themeName }) => 
      themeName === 'dark' 
        ? '#fff'
        : themeName === 'christmas'
        ? '#000'
        : themeName === 'summer'
        ? '#fff'
        : themeName === 'space'
        ? '#fff'
        : '#fff'
    };
    box-shadow: 0 4px 16px ${({ themeName }) => 
      themeName === 'dark'
        ? '#0005'
        : themeName === 'christmas'
        ? '#fff'
        : themeName === 'summer'
        ? '#45B7D155'
        : themeName === 'space'
        ? '#6B48FF55'
        : '#ff416c55'
    };
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

const EmailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const EmailForm = styled.div<{ themeName: string }>`
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#2d2d2d'
      : themeName === 'christmas'
      ? '#c62828'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, rgba(10, 10, 40, 0.95) 0%, rgba(15, 20, 50, 0.95) 100%)'
      : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  };
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
`;

const EmailButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const EmailButton = styled.button<{ themeName: string; isCancel?: boolean }>`
  background: ${({ themeName, isCancel }) => 
    isCancel
      ? '#fff4'
      : themeName === 'dark' 
        ? '#424242'
        : themeName === 'christmas'
        ? '#388e3c'
        : themeName === 'summer'
        ? '#FF8A00'
        : themeName === 'space'
        ? '#4B0082'
        : '#fff4'
  };
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  border: 1px solid ${({ themeName }) => 
    themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)'
  };

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

interface TrueFalseQuestion {
  questionDrawing: any;
  answer: boolean;
  votes?: {
    true: number;
    false: number;
  };
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

const languages = [
  { code: 'nl', label: 'Nederlands', icon: '🇳🇱' },
  { code: 'en', label: 'English', icon: '🇬🇧' },
  { code: 'de', label: 'Deutsch', icon: '🇩🇪' },
  { code: 'fr', label: 'Français', icon: '🇫🇷' },
];

const CLOUDINARY_CLOUD_NAME = 'djmejezed';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

async function uploadImageToCloudinary(base64Image: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', base64Image);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
  return response.data.secure_url;
}

const THEME_COLORS: Record<string, string[]> = {
  dark: ['#388e3c', '#1976d2', '#c62828', '#f6a71b', '#ff416c', '#ff4b2b', '#2d2d2d', '#e20248'],
  christmas: ['#c62828', '#388e3c', '#fff176', '#ffb300', '#fff', '#43a047', '#e53935', '#fbc02d'],
  summer: ['#FFB800', '#FF8A00', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'],
  space: ['#6B48FF', '#FF48B8', '#48FFB8', '#B848FF', '#48B8FF', '#FFB848', '#B8FF48', '#FF4848'],
  default: ['#ff416c', '#ff4b2b', '#1bbf3a', '#388e3c', '#1976d2', '#c62828', '#f6a71b', '#2d2d2d', '#e20248', '#43a047', '#ffa500', '#800080', '#008080', '#FF69B4']
};

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
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
  };
  background-attachment: fixed;
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
      : themeName === 'summer'
      ? 'linear-gradient(135deg, rgba(78, 205, 196, 0.95) 0%, rgba(69, 183, 209, 0.95) 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)'
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
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FF6B6B 0%, #FFB800 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #6B48FF 0%, #48FFB8 100%)'
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
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #FF48B8 0%, #B848FF 100%)'
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
  border-radius: 100px;
  z-index: 1;
  transform: rotate(-45deg);
`;

type ThemeName = 'default' | 'christmas' | 'dark' | 'summer' | 'space';

const App: React.FC = () => {
  const [page, setPage] = useState<'whiteboard' | 'quiz' | 'reveal' | 'result' | 'dashboard' | 'summary' | 'truefalse' | 'truefalsecorrect' | 'truefalseresult' | 'poll' | 'pollresult'>('quiz');
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
  const [lastQuizPage, setLastQuizPage] = useState<'quiz' | 'reveal' | 'result' | 'truefalse'>('quiz');
  const [quizClearKey, setQuizClearKey] = useState(0);
  const [quizMode, setQuizMode] = useState<'draw' | 'eraser'>('draw');
  const [themeName, setThemeName] = useState<ThemeName>('default');
  const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('nl');
  const [trueFalseQuestions, setTrueFalseQuestions] = useState<TrueFalseQuestion[]>([]);
  const [currentTrueFalseQuestion, setCurrentTrueFalseQuestion] = useState<TrueFalseQuestion | null>(null);
  const [showTrueFalseResult, setShowTrueFalseResult] = useState(false);
  const [selectedTrueFalseAnswer, setSelectedTrueFalseAnswer] = useState<boolean | null>(null);
  const [trueFalseVotes, setTrueFalseVotes] = useState<{ questionDrawing: any; answer: boolean; votes: { true: number; false: number } }[]>([]);
  const [currentTrueFalseVote, setCurrentTrueFalseVote] = useState<boolean | null>(null);
  const [currentTrueFalseVotes, setCurrentTrueFalseVotes] = useState<{ true: number; false: number }>({ true: 0, false: 0 });
  const [currentPoll, setCurrentPoll] = useState<any>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([
    { id: 0, text: '', votes: 0, drawing: null },
    { id: 1, text: '', votes: 0, drawing: null }
  ]);
  const questionRef = useRef<any>(null);
  const pollCreationRef = useRef<PollCreationHandle>(null);
  const [pollSummaries, setPollSummaries] = useState<any[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

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

  const translations: Record<string, Record<string, string>> = {
    nl: {
      'theme': 'Thema',
      'templates': 'Sjablonen',
      'tools': 'Gereedschap',
      'refresh': 'Vernieuwen',
      'translate': 'Vertaal',
      'text_recog': 'Tekstherkenning',
      'keyboard': 'Toetsenbord',
      'help': 'Help',
      'login': 'Inloggen',
      'logout': 'Uitloggen',
      'logout_guest': 'Uitloggen (gast)',
      'show_summary': 'Toon samenvatting',
      'show_result': 'Toon resultaat',
      'show_next': 'Volgende vraag',
      'reveal_correct': 'Toon juiste antwoorden',
      'reveal_correct_answer': 'Toon juiste antwoord',
      'quiz_creation': 'Quiz maken',
      'quiz_result': 'Quiz resultaat',
      'quiz_summary': 'Quiz samenvatting',
      'truefalse_creation': 'Waar/Niet waar aanmaken',
      'truefalse_result': 'Waar/Niet waar resultaat',
      'select_correct_answers': 'Selecteer juiste antwoorden',
      'summary': 'Samenvatting',
      'back': 'Terug',
      'draw': 'Tekenen',
      'select': 'Selecteren',
      'move': 'Verplaatsen',
      'whiteboard': 'Whiteboard',
      'eraser': 'Gum',
      'lasso': 'Lasso',
      'postit': 'Post-it',
      'clear_all': 'Alles wissen',
      'default': 'Standaard',
      'christmas': 'Kerst',
      'dark': 'Donker',
      'quiz': 'Quiz',
      'poll': 'Peiling',
      'truefalse': 'Waar/Niet waar',
      'guest': 'gast',
      'user': 'gebruiker',
      'dashboard_welcome': 'Welkom,',
      'dashboard_loggedin': 'Je bent ingelogd.',
      'dashboard_guest': 'Je bent ingelogd als gast.',
      'dashboard_text': 'Dit is je dashboard.',
      'true': 'Waar',
      'false': 'Niet waar',
      'poll_creation': 'Peiling aanmaken',
      'save_poll': 'Peiling opslaan',
      'poll_result': 'Peiling resultaten',
      'share_via_email': 'Deel via email',
      'share_quiz_summary': 'Deel quiz samenvatting',
      'no_correct_answers': 'Geen juiste antwoorden gemarkeerd.',
      'question': 'Vraag',
      'true_false_question': 'Waar/Niet waar vraag',
      'delete': 'Verwijder',
      'select_correct_answers_to_share': 'Selecteer juiste antwoorden om te delen',
      'select_correct_answer': 'Selecteer juiste antwoord',
      'summer': 'Zomer',
      'space': 'Ruimte',
    },
    en: {
      'theme': 'Theme',
      'templates': 'Templates',
      'tools': 'Tools',
      'refresh': 'Refresh',
      'translate': 'Translate',
      'text_recog': 'Text Recog.',
      'keyboard': 'Keyboard',
      'help': 'Help',
      'login': 'Log in',
      'logout': 'Log out',
      'logout_guest': 'Log out (guest)',
      'show_summary': 'Show Summary',
      'show_result': 'Show Result',
      'show_next': 'Next Question',
      'reveal_correct': 'Reveal Correct Answers',
      'reveal_correct_answer': 'Reveal correct answer',
      'quiz_creation': 'Quiz Creation',
      'quiz_result': 'Quiz Result',
      'quiz_summary': 'Quiz Summary',
      'truefalse_creation': 'True/False Creation',
      'truefalse_result': 'True/False Result',
      'select_correct_answers': 'Select Correct Answers',
      'summary': 'Summary',
      'back': 'Back',
      'draw': 'Draw',
      'select': 'Select',
      'move': 'Move',
      'eraser': 'Eraser',
      'lasso': 'Lasso',
      'postit': 'Post-it',
      'clear_all': 'Clear All',
      'default': 'Default',
      'christmas': 'Christmas',
      'dark': 'Dark',
      'quiz': 'Quiz',
      'whiteboard': 'Whiteboard',
      'poll': 'Poll',
      'truefalse': 'True/False',
      'guest': 'guest',
      'user': 'user',
      'dashboard_welcome': 'Welcome,',
      'dashboard_loggedin': 'You are logged in.',
      'dashboard_guest': 'You are logged in as guest.',
      'dashboard_text': 'This is your dashboard.',
      'true': 'True',
      'false': 'False',
      'poll_creation': 'Poll Creation',
      'save_poll': 'Save Poll',
      'poll_result': 'Poll Result',
      'share_via_email': 'Share via Email',
      'share_quiz_summary': 'Share Quiz Summary',
      'no_correct_answers': 'No correct answers marked.',
      'question': 'Question',
      'true_false_question': 'True/False Question',
      'delete': 'Delete',
      'select_correct_answers_to_share': 'Select correct answers to share',
      'select_correct_answer': 'Select correct answer',
      'summer': 'Summer',
      'space': 'Space',
    },
    de: {
      'theme': 'Thema',
      'templates': 'Vorlagen',
      'tools': 'Werkzeuge',
      'refresh': 'Aktualisieren',
      'translate': 'Übersetzen',
      'text_recog': 'Texterkennung',
      'keyboard': 'Tastatur',
      'help': 'Hilfe',
      'login': 'Anmelden',
      'logout': 'Abmelden',
      'logout_guest': 'Abmelden (Gast)',
      'show_summary': 'Zusammenfassung',
      'show_result': 'Ergebnis anzeigen',
      'show_next': 'Nächste Frage',
      'reveal_correct': 'Korrekte Antworten anzeigen',
      'reveal_correct_answer': 'Korrekte Antwort anzeigen',
      'quiz_creation': 'Quiz erstellen',
      'quiz_result': 'Quiz Ergebnis',
      'quiz_summary': 'Quiz Zusammenfassung',
      'truefalse_creation': 'Wahr/Falsch erstellen',
      'truefalse_result': 'Wahr/Falsch Ergebnis',
      'select_correct_answers': 'Korrekte Antworten auswählen',
      'summary': 'Zusammenfassung',
      'back': 'Zurück',
      'draw': 'Zeichnen',
      'select': 'Auswählen',
      'move': 'Verschieben',
      'eraser': 'Radierer',
      'lasso': 'Lasso',
      'postit': 'Post-it',
      'clear_all': 'Alles löschen',
      'default': 'Standard',
      'christmas': 'Weihnachten',
      'dark': 'Dunkel',
      'quiz': 'Quiz',
      'whiteboard': 'Whiteboard',
      'poll': 'Umfrage',
      'truefalse': 'Wahr/Falsch',
      'guest': 'Gast',
      'user': 'Benutzer',
      'dashboard_welcome': 'Willkommen,',
      'dashboard_loggedin': 'Du bist eingeloggt.',
      'dashboard_guest': 'Du bist als Gast eingeloggt.',
      'dashboard_text': 'Das ist dein Dashboard.',
      'true': 'Wahr',
      'false': 'Falsch',
      'poll_creation': 'Umfrage erstellen',
      'save_poll': 'Umfrage speichern',
      'poll_result': 'Umfrage Ergebnis',
      'share_via_email': 'Per Email teilen',
      'share_quiz_summary': 'Quiz Zusammenfassung teilen',
      'no_correct_answers': 'Keine korrekten Antworten markiert.',
      'question': 'Frage',
      'true_false_question': 'Wahr/Falsch Frage',
      'delete': 'Löschen',
      'select_correct_answers_to_share': 'Korrekte Antworten auswählen, um zu teilen',
      'select_correct_answer': 'Korrekte Antwort auswählen',
      'summer': 'Sommer',
      'space': 'Weltraum',
    },
    fr: {
      'theme': 'Thème',
      'templates': 'Modèles',
      'tools': 'Outils',
      'refresh': 'Rafraîchir',
      'translate': 'Traduire',
      'text_recog': 'Recon. texte',
      'keyboard': 'Clavier',
      'help': 'Aide',
      'login': 'Connexion',
      'logout': 'Déconnexion',
      'logout_guest': 'Déconnexion (invité)',
      'show_summary': 'Voir le résumé',
      'show_result': 'Voir le résultat',
      'show_next': 'Question suivante',
      'reveal_correct': 'Révéler les bonnes réponses',
      'reveal_correct_answer': 'Révéler la bonne réponse',
      'quiz_creation': 'Création du quiz',
      'quiz_result': 'Résultat du quiz',
      'quiz_summary': 'Résumé du quiz',
      'truefalse_creation': 'Création Vrai/Faux',
      'truefalse_result': 'Résultat Vrai/Faux',
      'select_correct_answers': 'Sélectionner les bonnes réponses',
      'summary': 'Résumé',
      'back': 'Retour',
      'draw': 'Dessiner',
      'select': 'Sélectionner',
      'move': 'Déplacer',
      'eraser': 'Gomme',
      'lasso': 'Lasso',
      'postit': 'Post-it',
      'clear_all': 'Tout effacer',
      'default': 'Défaut',
      'christmas': 'Noël',
      'dark': 'Sombre',
      'quiz': 'Quiz',
      'whiteboard': 'Tableau',
      'poll': 'Sondage',
      'truefalse': 'Vrai/Faux',
      'guest': 'invité',
      'user': 'utilisateur',
      'dashboard_welcome': 'Bienvenue,',
      'dashboard_loggedin': 'Vous êtes connecté.',
      'dashboard_guest': "Vous êtes connecté en tant qu'invité.",
      'dashboard_text': 'Ceci est votre tableau de bord.',
      'true': 'Vrai',
      'false': 'Faux',
      'poll_creation': 'Créer une enquête',
      'save_poll': 'Enregistrer l\'enquête',
      'poll_result': 'Résultat du sondage',
      'share_via_email': 'Partager par email',
      'share_quiz_summary': 'Partager la résumé du quiz',
      'no_correct_answers': 'Aucune réponse correcte marquée.',
      'question': 'Question',
      'true_false_question': 'Question Vrai/Faux',
      'delete': 'Supprimer',  
      'select_correct_answers_to_share': 'Sélectionner les bonnes réponses pour partager',
      'summer': 'Été',
      'space': 'Espace',
    },
  };
  function t(key: string) {
    return translations[currentLanguage][key] || key;
  }

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
      setCurrentQuestion(updatedQuestion);
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
  const openLanguageMenu = () => {
    setShowLanguageSubmenu(true);
    setShowThemeSubmenu(false);
    setShowTemplateSubmenu(false);
    setShowToolsSubmenu(false);
  };
  const closeSubmenus = () => {
    setShowThemeSubmenu(false);
    setShowTemplateSubmenu(false);
    setShowToolsSubmenu(false);
    setShowLanguageSubmenu(false);
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

  // Add handler for True/False questions
  const handleSaveTrueFalseQuestion = (question: { questionDrawing: any; answer: boolean; votes: { true: number; false: number } }) => {
    setCurrentTrueFalseQuestion({ ...question, votes: currentTrueFalseVotes });
    setTrueFalseVotes(prev => {
      const idx = prev.findIndex(q => JSON.stringify(q.questionDrawing) === JSON.stringify(question.questionDrawing));
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], votes: currentTrueFalseVotes };
        return updated;
      } else {
        return [...prev, { questionDrawing: question.questionDrawing, answer: question.answer, votes: currentTrueFalseVotes }];
      }
    });
    setPage('truefalsecorrect');
  };

  const handleTrueFalseVote = (vote: boolean) => {
    setCurrentTrueFalseVote(vote);
    setPage('truefalsecorrect');
  };

  const handleTrueFalseCorrect = () => {
    if (currentTrueFalseQuestion && currentTrueFalseVote !== null) {
      setTrueFalseVotes(prev => [
        ...prev,
        {
          questionDrawing: currentTrueFalseQuestion.questionDrawing,
          answer: currentTrueFalseQuestion.answer,
          votes: currentTrueFalseVotes
        }
      ]);
      setCurrentTrueFalseQuestion(null);
      setCurrentTrueFalseVote(null);
      setPage('summary');
    }
  };

  const handleDeleteQuizQuestion = (index: number) => {
    setQuiz(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteTrueFalse = (index: number) => {
    setTrueFalseVotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeletePoll = (index: number) => {
    setPollSummaries(prev => prev.filter((_, i) => i !== index));
  };

  const handleShare = async () => {
    if (!userEmail) {
      setError('Please log in to share.');
      return;
    }
    setSending(true);
    try {
      // Implement the logic to share the quiz summary via email
      // This is a placeholder and should be replaced with the actual implementation
      console.log('Sharing quiz summary via email');
      setShowEmailModal(false);
    } catch (e) {
      console.error('Error sharing quiz summary:', e);
      setError('An error occurred while sharing.');
    } finally {
      setSending(false);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContent themeName={themeName}>
        {themeName === 'summer' && (
          <OceanContainer>
            <Sky>
              <Sun />
              <Cloud delay={0} size={120} top={80} left={200} />
              <Cloud delay={2} size={100} top={120} left={400} />
              <Cloud delay={1} size={140} top={60} left={600} />
              <Cloud delay={3} size={90} top={100} left={800} />
              <Cloud delay={1.5} size={110} top={40} left={300} />
              <Cloud delay={2.5} size={130} top={90} left={500} />
              <Cloud delay={0.5} size={95} top={70} left={700} />
              <Cloud delay={3.5} size={115} top={50} left={900} />
            </Sky>
            <OceanWave />
            <OceanWave style={{ bottom: '20px', animationDelay: '1.5s' }} />
            <OceanWave style={{ bottom: '40px', animationDelay: '0.75s' }} />
          </OceanContainer>
        )}
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
            t={t}
          />
        )}
        {page === 'reveal' && currentQuestion && (
          <RevealCorrect
            question={currentQuestion}
            onSelectCorrect={handleSetCorrectAnswer}
            onShowResult={(selected: number[]) => {
              if (selected.length > 0) handleSetCorrectAnswer(selected);
            }}
            onSelectedAnswersChange={setSelectedAnswers}
            themeName={themeName}
            t={t}
          />
        )}
        {page === 'result' && currentQuestion && selectedCorrect.length > 0 && (
          <QuizResult
            question={currentQuestion}
            correctIds={selectedCorrect}
            themeName={themeName}
            t={t}
          />
        )}
        {page === 'summary' && (
          <QuizSummary
            questions={quiz}
            trueFalseQuestions={trueFalseVotes}
            pollSummaries={pollSummaries}
            onDeleteQuizQuestion={handleDeleteQuizQuestion}
            onDeleteTrueFalse={handleDeleteTrueFalse}
            onDeletePoll={handleDeletePoll}
            onClose={() => setPage('quiz')}
            themeName={themeName}
            t={t}
          />
        )}
        {page === 'dashboard' && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
            <h2>{t('dashboard_welcome')} {isGuest ? t('guest') : (userEmail || t('user'))}!</h2>
            <p>{isGuest ? t('dashboard_guest') : t('dashboard_loggedin')} {t('dashboard_text')}</p>
          </div>
        )}
        {page === 'truefalse' && (
          <TrueFalseCreation
            ref={questionRef}
            onSave={handleSaveTrueFalseQuestion}
            onReveal={() => {}}
            themeName={themeName}
            t={t}
            onSelectAnswer={setSelectedTrueFalseAnswer}
            showNextButton={true}
            nextButtonDisabled={selectedTrueFalseAnswer === null}
            onVotesChange={setCurrentTrueFalseVotes}
          />
        )}
        {page === 'truefalsecorrect' && currentTrueFalseQuestion && (
          <TrueFalseCorrect
            question={currentTrueFalseQuestion}
            onBack={() => setPage('truefalse')}
            onNext={(selected) => {
              setTrueFalseVotes(prev => {
                const idx = prev.findIndex(q => JSON.stringify(q.questionDrawing) === JSON.stringify(currentTrueFalseQuestion.questionDrawing));
                if (idx !== -1) {
                  const updated = [...prev];
                  updated[idx] = {
                    ...updated[idx],
                    answer: selected
                  };
                  return updated;
                } else {
                  return [
                    ...prev,
                    {
                      questionDrawing: currentTrueFalseQuestion.questionDrawing,
                      answer: selected,
                      votes: currentTrueFalseVotes
                    }
                  ];
                }
              });
              setPage('summary');
            }}
            themeName={themeName}
            t={t}
          />
        )}
        {page === 'poll' && (
          <PollCreation
            ref={pollCreationRef}
            themeName={themeName}
            t={t}
            onSave={(poll) => {
              setCurrentPoll(poll);
              setPollSummaries(prev => [...prev, poll]);
              setPage('pollresult');
            }}
            question={pollQuestion}
            setQuestion={setPollQuestion}
            pageTitle={t('poll_creation')}
            saveLabel={t('save_poll')}
          />
        )}
        {page === 'pollresult' && currentPoll && (
          <PollResult
            poll={currentPoll}
            themeName={themeName}
            t={t}
            onBack={() => {
              setPage('poll');
            }}
          />
        )}
      </MainContent>
      {showToolsSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          {page === 'whiteboard' ? (
            <>
              <FooterButton themeName={themeName} title={t('draw')} onClick={() => { setCurrentMode('draw'); closeSubmenus(); }}>
                <CreateIcon />
                <span style={{fontSize:'0.7rem'}}>{t('draw')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('select')} onClick={() => { setCurrentMode('select'); closeSubmenus(); }}>
                <MouseIcon />
                <span style={{fontSize:'0.7rem'}}>{t('select')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('move')} onClick={() => { setCurrentMode('move'); closeSubmenus(); }}>
                <OpenWithIcon />
                <span style={{fontSize:'0.7rem'}}>{t('move')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('eraser')} onClick={() => { setCurrentMode('eraser'); closeSubmenus(); }}>
                <DeleteIcon />
                <span style={{fontSize:'0.7rem'}}>{t('eraser')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('lasso')} onClick={() => { setCurrentMode('lasso'); closeSubmenus(); }}>
                <AutoFixHighIcon />
                <span style={{fontSize:'0.7rem'}}>{t('lasso')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('postit')} onClick={() => { setCurrentMode('postit'); closeSubmenus(); }}>
                <NoteIcon />
                <span style={{fontSize:'0.7rem'}}>{t('postit')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('clear_all')} onClick={() => { setWhiteboardKey(prev => prev + 1); closeSubmenus(); }}>
                <DeleteSweepIcon />
                <span style={{fontSize:'0.7rem'}}>{t('clear_all')}</span>
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
              <FooterButton themeName={themeName} title={t('back')} onClick={closeSubmenus}>
                <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
                <span style={{fontSize:'0.7rem'}}>{t('back')}</span>
              </FooterButton>
            </>
          ) : (
            <>
              <FooterButton themeName={themeName} title={t('draw')} onClick={() => { setQuizMode('draw'); closeSubmenus(); }}>
                <CreateIcon />
                <span style={{fontSize:'0.7rem'}}>{t('draw')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('eraser')} onClick={() => { setQuizMode('eraser'); closeSubmenus(); }}>
                <DeleteIcon />
                <span style={{fontSize:'0.7rem'}}>{t('eraser')}</span>
              </FooterButton>
              <FooterButton themeName={themeName} title={t('clear_all')} onClick={() => { setQuizClearKey(prev => prev + 1); closeSubmenus(); }}>
                <DeleteSweepIcon />
                <span style={{fontSize:'0.7rem'}}>{t('clear_all')}</span>
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
              <FooterButton themeName={themeName} title={t('back')} onClick={closeSubmenus}>
                <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
                <span style={{fontSize:'0.7rem'}}>{t('back')}</span>
              </FooterButton>
            </>
          )}
        </SubmenuFooterBar>
      ) : showThemeSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          <FooterButton themeName={themeName} title={t('default')} onClick={() => { setThemeName('default'); closeSubmenus(); }}><PaletteIcon /><span style={{fontSize:'0.7rem'}}>{t('default')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('christmas')} onClick={() => { setThemeName('christmas'); closeSubmenus(); }}><AcUnitIcon /><span style={{fontSize:'0.7rem'}}>{t('christmas')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('dark')} onClick={() => { setThemeName('dark'); closeSubmenus(); }}><WhatshotIcon /><span style={{fontSize:'0.7rem'}}>{t('dark')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('summer')} onClick={() => { setThemeName('summer'); closeSubmenus(); }}><HolidayVillageIcon /><span style={{fontSize:'0.7rem'}}>{t('summer')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('space')} onClick={() => { setThemeName('space'); closeSubmenus(); }}><WhatshotIcon /><span style={{fontSize:'0.7rem'}}>{t('space')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('back')} onClick={closeSubmenus}><ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} /><span style={{fontSize:'0.7rem'}}>{t('back')}</span></FooterButton>
        </SubmenuFooterBar>
      ) : showTemplateSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          <FooterButton themeName={themeName} title={t('quiz')} onClick={() => { setPage('quiz'); closeSubmenus(); }}>
            <QuizIcon />
            <span style={{fontSize:'0.7rem'}}>{t('quiz')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('whiteboard')} onClick={() => { setPage('whiteboard'); closeSubmenus(); }}>
            <ViewModuleIcon />
            <span style={{fontSize:'0.7rem'}}>{t('whiteboard')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('truefalse')} onClick={() => { setPage('truefalse'); closeSubmenus(); }}>
            <BallotIcon />
            <span style={{fontSize:'0.7rem'}}>{t('truefalse')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('poll')} onClick={() => { setPage('poll'); closeSubmenus(); }}>
            <BallotIcon />
            <span style={{fontSize:'0.7rem'}}>{t('poll')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('back')} onClick={closeSubmenus}>
            <ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} />
            <span style={{fontSize:'0.7rem'}}>{t('back')}</span>
          </FooterButton>
        </SubmenuFooterBar>
      ) : showLanguageSubmenu ? (
        <SubmenuFooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          {languages.map(lang => (
            <FooterButton
              key={lang.code}
              themeName={themeName}
              title={lang.label}
              onClick={() => { setCurrentLanguage(lang.code); closeSubmenus(); }}
              style={{ fontWeight: currentLanguage === lang.code ? 'bold' : undefined, fontSize: '2.2rem' }}
            >
              <span role="img" aria-label={lang.label}>{lang.icon}</span>
            </FooterButton>
          ))}
          <FooterButton themeName={themeName} title={t('back')} onClick={closeSubmenus}><ArrowForwardIosIcon style={{transform:'rotate(180deg)'}} /><span style={{fontSize:'0.7rem'}}>{t('back')}</span></FooterButton>
        </SubmenuFooterBar>
      ) : (
        <FooterBar whiteboard={page === 'whiteboard'} themeName={themeName}>
          <FooterButton themeName={themeName} title={t('theme')} onClick={openThemeMenu}><PaletteIcon /><span style={{fontSize:'0.7rem'}}>{t('theme')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('templates')} onClick={openTemplateMenu} style={{ position: 'relative' }}>
            <ViewModuleIcon />
            <span style={{fontSize:'0.7rem'}}>{t('templates')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('tools')} onClick={openToolsMenu}>
            <BuildIcon />
            <span style={{fontSize:'0.7rem'}}>{t('tools')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('refresh')} onClick={() => window.location.reload()}>
            <RefreshIcon />
            <span style={{fontSize:'0.7rem'}}>{t('refresh')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('translate')} onClick={openLanguageMenu}>
            <TranslateIcon />
            <span style={{fontSize:'0.7rem'}}>{t('translate')}</span>
          </FooterButton>
          <FooterButton themeName={themeName} title={t('text_recog')}><TextFieldsIcon /><span style={{fontSize:'0.7rem'}}>{t('text_recog')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('keyboard')}><KeyboardIcon /><span style={{fontSize:'0.7rem'}}>{t('keyboard')}</span></FooterButton>
          <FooterButton themeName={themeName} title={t('help')}><HelpOutlineIcon /><span style={{fontSize:'0.7rem'}}>{t('help')}</span></FooterButton>
          <FooterButton themeName={themeName} title={isLoggedIn ? (isGuest ? t('logout_guest') : t('logout')) : t('login')} onClick={isLoggedIn ? handleLogout : () => setShowLogin(true)}>
            <LoginIcon />
            <span style={{fontSize:'0.7rem'}}>{isLoggedIn ? (isGuest ? t('logout_guest') : t('logout')) : t('login')}</span>
          </FooterButton>
          {page !== 'whiteboard' && (
            page === 'summary' ? (
              <>
                <RevealButton themeName={themeName} onClick={() => setPage('quiz')}>{t('quiz_creation')}</RevealButton>
                <RevealButton themeName={themeName} onClick={() => setShowEmailModal(true)}>{t('share_via_email')}</RevealButton>
                <RevealButton themeName={themeName} onClick={() => setPage('quiz')}>{t('back')}</RevealButton>
              </>
            ) : (
              <>
                <RevealButton themeName={themeName} onClick={() => {
                  if ((page as string) !== 'summary') {
                    if (['quiz', 'reveal', 'result', 'truefalse'].includes(page as string)) setLastQuizPage(page as any);
                    setPage('summary');
                  }
                }}>{t('show_summary')}</RevealButton>
                {page === 'result' && (
                  <>
                    <RevealButton
                      themeName={themeName}
                      onClick={handleNextQuestion}
                    >
                      {t('show_next')}
                    </RevealButton>
                    <RevealButton
                      themeName={themeName}
                      onClick={handleBackToReveal}
                    >
                      {t('back')}
                    </RevealButton>
                  </>
                )}
                {page === 'reveal' && (
                  <>
                    <RevealButton
                      themeName={themeName}
                      onClick={() => {
                        if (selectedAnswers.length > 0) handleSetCorrectAnswer(selectedAnswers);
                      }}
                      id="show-result-btn"
                      disabled={selectedAnswers.length === 0}
                    >
                      {t('show_result')}
                    </RevealButton>
                    <RevealButton
                      themeName={themeName}
                      onClick={() => setPage('quiz')}
                    >
                      {t('back')}
                    </RevealButton>
                  </>
                )}
                {page === 'truefalsecorrect' && (
                  <>
                    <RevealButton
                      themeName={themeName}
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).__quizRevealHandler) {
                          (window as any).__quizRevealHandler();
                        }
                      }}
                    >
                      {t('show_result')}
                    </RevealButton>
                    <RevealButton
                      themeName={themeName}
                      onClick={() => setPage('truefalse')}
                    >
                      {t('back')}
                    </RevealButton>
                  </>
                )}
                {page !== 'result' && page !== 'reveal' && page !== 'truefalsecorrect' && page !== 'poll' && (
                  <RevealButton
                    themeName={themeName}
                    onClick={() => {
                      if (page === 'quiz') {
                        if ((window as any).__quizRevealHandler) (window as any).__quizRevealHandler();
                      } else if (page === 'truefalse') {
                        if (selectedTrueFalseAnswer !== null) {
                          const questionDrawing = questionRef.current?.getPaths ? questionRef.current.getPaths() : null;
                          if (questionDrawing) {
                            handleSaveTrueFalseQuestion({ questionDrawing, answer: selectedTrueFalseAnswer, votes: { true: 0, false: 0 } });
                            setPage('truefalsecorrect');
                          }
                        }
                      }
                    }}
                    disabled={page === 'truefalse' && selectedTrueFalseAnswer === null}
                  >
                    {currentLanguage === 'nl' ? 'Toon juiste antwoord' : 'Reveal correct answer'}
                  </RevealButton>
                )}
              </>
            )
          )}
          {page === 'poll' && (
            <RevealButton
              themeName={themeName}
              onClick={() => pollCreationRef.current?.savePoll()}
            >
              {t('save_poll')}
            </RevealButton>
          )}
          {page === 'pollresult' && (
            <RevealButton
              themeName={themeName}
              onClick={() => setPage('poll')}
            >
              {t('back')}
            </RevealButton>
          )}
        </FooterBar>
      )}
      {showLogin && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.15)',zIndex:2000}}>
          <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
        </div>
      )}
      {showEmailModal && (
        <EmailModal>
          <EmailForm themeName={themeName}>
            <h3 style={{ color: themeName === 'dark' ? '#fff' : '#fff', marginBottom: '16px' }}>
              {t('share_quiz_summary')}
            </h3>
            <EmailInput
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p style={{ color: '#ff4444', margin: '8px 0' }}>{error}</p>}
            <EmailButtons>
              <EmailButton 
                themeName={themeName} 
                isCancel 
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </EmailButton>
              <EmailButton 
                themeName={themeName} 
                onClick={handleShare}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send'}
              </EmailButton>
            </EmailButtons>
          </EmailForm>
        </EmailModal>
      )}
    </ThemeProvider>
  );
};

export default App; 