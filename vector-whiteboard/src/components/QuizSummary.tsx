import React, { useState, useRef, useMemo, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { QuizQuestion as BaseQuizQuestion, AnswerData } from '../App';
import MiniWhiteboard from './MiniWhiteboard';
import { PieChart } from './QuizResult';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';
import domtoimage from 'dom-to-image-more';
import axios from 'axios';

// Voeg deze regel toe boven de imports om de linter error op te lossen
declare module 'dom-to-image-more';

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

// Add starry background animation
const starryBackground = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 100%; }
`;

// Star animation
const twinkle = keyframes`
  0%, 100% { opacity: 0.7; transform: translate(0, 0); }
  50% { opacity: 1; transform: translate(10px, 10px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ViewportContainer = styled.div<{ themeName: string }>`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: ${({ themeName }) => 
    themeName === 'whiteboard'
      ? '#fff'
      : themeName === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : themeName === 'christmas'
      ? 'linear-gradient(135deg, #2e7d32 100%)'
      : themeName === 'summer'
      ? 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
      : themeName === 'space'
      ? `linear-gradient(135deg, #000428 0%, #004e92 100%),
         radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 50px 160px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
         radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0))`
      : 'linear-gradient(135deg, #FFE3B2 0%, #660020 100%)'
  };
  background-attachment: fixed;
  background-size: ${({ themeName }) => 
    themeName === 'space' ? '200% 200%, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px' : '100% 100%'
  };
  ${({ themeName }) => themeName === 'space' && css`
    animation: ${starryBackground} 50s linear infinite;
    will-change: background-position;
  `}
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
      ? 'linear-gradient(135deg, #4B0082 0%, #6B48FF 100%)'
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
    border-radius: 100px;
    z-index: 1;
    transform: rotate(-125deg);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
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
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%);'
      : themeName === 'space'
      ? 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)'
      : 'linear-gradient(135deg, #E20248 0%, #F6A71B 100%)'
  };
    border-radius: 100px;
    z-index: 1;
    transform: rotate(-45deg);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
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
      ? 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)'
      : themeName === 'space'
      ? 'linear-gradient(135deg, rgba(10, 10, 40, 0.95) 0%, rgba(15, 20, 50, 0.95) 100%)'
      : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  };
    border-radius: 18px;
    padding: 32px 32px 24px 32px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
    display: flex
;
    flex-direction: column;
    align-items: center;
    z-index: 2;
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

const Title = styled.h2`
  color: #fff;
  font-size: 2.2rem;
  font-weight: bold;
  margin-top: 19px;
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
  position: relative;
  margin-bottom: 24px;
  padding: 0px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#ab2424'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.9)'
      : themeName === 'space'
      ? 'rgba(10, 10, 40, 0.8)'
      : '#f8f9fa'
  };
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

const QuestionTitle = styled.h3<{ themeName: string }>`
  color: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#fff'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#6B48FF'
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
      return '#4caf50'; // Always green for correct answers
    }
    return themeName === 'dark'
      ? '#42424288'
      : themeName === 'christmas'
      ? '#fff8'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.9)'
      : themeName === 'space'
      ? 'rgba(10, 10, 40, 0.8)'
      : '#fff8';
  }};
  border-radius: 12px;
  padding: 8px 12px;
  min-height: 90px;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border: 3px solid ${({ isCorrect }) => 
    isCorrect 
      ? '#4caf50' // Always green border for correct answers
      : '#f44336' // Always red border for incorrect answers
  };
  box-shadow: ${({ isCorrect }) => 
    isCorrect 
      ? '0 0 20px #4caf5088' // Green glow for correct
      : '0 0 20px #f4433688' // Red glow for incorrect
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
      return '#222'; // Always green for correct answers
    }
    return themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#0088FF'
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
  themeName: string;
}

const VoteScore = styled.div<VoteScoreProps>`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ isCorrect, themeName }) => {
    if (isCorrect) {
      return '#4caf50'; // Always green for correct answers
    }
    return themeName === 'dark'
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#0088FF'
      : '#222';
  }};
`;

type QuizQuestion = BaseQuizQuestion & {
  id: number;
};

type TrueFalseQuestion = {
  id: number;
  questionDrawing: any;
  answer: boolean;
  votes: { true: number; false: number };
};

type PollSummary = {
  id: number;
  question: any;
  options: { text: string; votes: number; drawing?: any }[];
};

interface QuizSummaryProps {
  onClose: () => void;
  themeName: string;
  t: (key: string) => string;
  onDeleteQuizQuestion: (index: number) => void;
  onDeleteTrueFalse: (index: number) => void;
  onDeletePoll: (index: number) => void;
  onShareEmail: () => void;
  summaryRef?: React.RefObject<HTMLDivElement>;
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
  isCorrect?: boolean;
}

const VotesBadge = styled.div<VotesBadgeProps>`
  display: inline-block;
  background: ${({ isCorrect, themeName }) => {
    if (isCorrect) {
      return '#4caf50'; // Always green for correct answers
    }
    return themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#f0f2f5'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.9)'
      : themeName === 'space'
      ? 'rgba(10, 10, 40, 0.8)'
      : '#f0f2f5';
  }};
  color: ${({ isCorrect, themeName }) => {
    if (isCorrect) {
      return '#fff'; // White text on green background for correct
    }
    return themeName === 'dark' 
      ? '#fff'
      : themeName === 'christmas'
      ? '#222'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#0088FF'
      : '#222';
  }};
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 4px 12px;
  min-width: 36px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ isCorrect, themeName }) => {
    if (isCorrect) {
      return 'rgba(255, 255, 255, 0.2)'; // Subtle white border for correct
    }
    return themeName === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : themeName === 'christmas'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'summer'
      ? 'rgba(255, 255, 255, 0.2)'
      : themeName === 'space'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)';
  }};
  margin-left: 18px;
`;

const DeleteButton = styled.button<{ themeName: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#ab2424'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#4B0082'
      : 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.2s ease;
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
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
      : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  };
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
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
        : '#fff4'
  };
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`;

const CLOUDINARY_CLOUD_NAME = 'djmejezed'; // <-- Vul hier je Cloudinary cloud name in
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // <-- Vul hier je Cloudinary upload preset in

async function uploadImageToCloudinary(base64Image: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', base64Image);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
  return response.data.secure_url;
}

// StarlightBackground component
const StarlightBackground = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #000428 0%, #001e3c 100%);
`;

// Star component
const Star = styled.div<{ size: number; x: number; y: number; delay: number; duration: number }>`
  position: absolute;
  left: ${props => props.x}vw;
  top: ${props => props.y}vh;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(${props => props.size > 2 ? 1 : 0}px);
  animation: ${twinkle} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  will-change: transform, opacity;
`;

// Planet component
const Planet = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${(props) =>
    props.position === 'top'
      ? `right: 5%; top: 5%; width: 180px; height: 180px; background: linear-gradient(45deg, #4B0082, #6B48FF); box-shadow: inset -30px -30px 50px rgba(0,0,0,0.5), 0 0 50px rgba(107, 72, 255, 0.3);`
      : `left: 5%; bottom: 5%; width: 220px; height: 220px; background: linear-gradient(45deg, #FF8A00, #FFB800); box-shadow: inset -30px -30px 50px rgba(0,0,0,0.5), 0 0 50px rgba(255, 184, 0, 0.3);`}
  border-radius: 50%;
  animation: ${rotate} 60s linear infinite;
  z-index: 1;
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%;
    background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%);
  }
`;

// Galaxy component
const Galaxy = styled.div<{ size: number; x: number; y: number; delay: number }>`
  position: absolute;
  left: ${props => props.x}vw;
  top: ${props => props.y}vh;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle at center, 
    rgba(107, 72, 255, 0.2) 0%,
    rgba(75, 0, 130, 0.1) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: ${twinkle} ${props => 15 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  filter: blur(8px);
  z-index: 0;
`;

// Place these after the AnswerBox definition, before QuizSummary:
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

const DeleteAllButton = styled.button<{ themeName: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ themeName }) => 
    themeName === 'dark' 
      ? '#424242'
      : themeName === 'christmas'
      ? '#ab2424'
      : themeName === 'summer'
      ? '#FF8A00'
      : themeName === 'space'
      ? '#4B0082'
      : 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 1000;
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

const AnswerText = styled.div`
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyAnswers = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: #E20248;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 24px 0;
`;

const QuizSummary: React.FC<QuizSummaryProps> = ({
  onClose,
  themeName,
  t,
  onDeleteQuizQuestion,
  onDeleteTrueFalse,
  onDeletePoll,
  onShareEmail,
  summaryRef
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [trueFalseQuestions, setTrueFalseQuestions] = useState<TrueFalseQuestion[]>([]);
  const [polls, setPolls] = useState<PollSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all questions for the user
  useEffect(() => {
    loadAllQuestions();
  }, []);

  const loadAllQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user-quizzes', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      setQuestions(data.quiz_questions || []);
      setTrueFalseQuestions(data.true_false_questions || []);
      setPolls(data.polls || []);
    } catch (error) {
      setError('Failed to load questions');
      setQuestions([]);
      setTrueFalseQuestions([]);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuizQuestion = async (index: number) => {
    try {
      const question = questions[index];
      const response = await fetch(`http://localhost:5000/api/quiz-question/${question.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setQuestions(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteTrueFalse = async (index: number) => {
    try {
      const question = trueFalseQuestions[index];
      const response = await fetch(`http://localhost:5000/api/quiz-question/${question.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setTrueFalseQuestions(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting true/false question:', error);
    }
  };

  const handleDeletePoll = async (index: number) => {
    try {
      const poll = polls[index];
      const response = await fetch(`http://localhost:5000/api/quiz-question/${poll.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setPolls(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm(t('delete_all_confirm'))) {
      try {
        const response = await fetch('http://localhost:5000/api/quiz-questions/all', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          setQuestions([]);
          setTrueFalseQuestions([]);
          setPolls([]);
        }
      } catch (error) {
        console.error('Error deleting all questions:', error);
      }
    }
  };

  const snowflakes = themeName === 'christmas' ? Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5
  })) : [];
  const stars = React.useMemo(() => themeName === 'space' ? Array.from({ length: 200 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.2 + 0.8,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 7
  })) : [], [themeName]);
  const galaxies = React.useMemo(() => themeName === 'space' ? Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 100 + Math.random() * 150,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10
  })) : [], [themeName]);

  return (
    <ViewportContainer themeName={themeName}>
      {themeName !== 'whiteboard' && <TopLeftBlock themeName={themeName} />}
      {themeName !== 'whiteboard' && <BottomRightBlock themeName={themeName} />}
      {themeName === 'christmas' && (
        <SnowContainer>
          {snowflakes.map(({id, ...props}) => (
            <Snowflake key={id} {...props} />
          ))}
        </SnowContainer>
      )}
      {themeName === 'space' && (
        <StarlightBackground>
          {galaxies.map(({id, ...galaxyProps}) => (
            <Galaxy key={id} {...galaxyProps} />
          ))}
          {stars.map(({id, ...starProps}) => (
            <Star key={id} {...starProps} />
          ))}
          <Planet position="top" />
          <Planet position="bottom" />
        </StarlightBackground>
      )}
      <div style={{
        zIndex: 3,
        color: 'white',
        fontWeight: 800,
        fontSize: '2.2rem',
        textAlign: 'center',
        letterSpacing: '0.02em',
        marginBottom: 18,
        marginTop: 19,
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
      <LargeQuizBox ref={summaryRef} className="quiz-summary-main-box" themeName={themeName} style={{ marginTop: 64, position: 'relative', top: 0, left: '50%', transform: 'translate(-50%, 0)' }}>
        <DeleteAllButton themeName={themeName} onClick={handleDeleteAll}>
          {t('delete_all') || 'Delete All'}
        </DeleteAllButton>
        <ScrollArea>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
          ) : (
            <>
              {questions.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ color: 'white', marginBottom: '1rem' }}>{t('quiz_questions')}</h2>
                  {questions.map((question, index) => (
                    <QuestionContainer key={`q-${index}`} themeName={themeName} className="question-container">
                      <DeleteButton themeName={themeName} onClick={() => handleDeleteQuizQuestion(index)}>
                        {t('delete')}
                      </DeleteButton>
                      <QuestionBoard>
                        <MiniWhiteboard
                          initialPaths={question.questionDrawing ?? []}
                          width={undefined}
                          height={220}
                          style={{ width: '100%' }}
                        />
                      </QuestionBoard>
                      <AnswersGrid>
                        {(question.answers ?? []).map((answer, i) => {
                          let isCorrect = false;
                          if (typeof answer.isCorrect !== 'undefined') {
                            isCorrect = !!answer.isCorrect;
                          } else if ('correctAnswers' in question && Array.isArray((question as any).correctAnswers)) {
                            const correctAnswers = (question as any).correctAnswers;
                            isCorrect = correctAnswers.includes(i) || (typeof (answer as any).text !== 'undefined' && correctAnswers.includes((answer as any).text));
                          } else if ('correctAnswer' in question) {
                            const correctAnswer = (question as any).correctAnswer;
                            isCorrect = correctAnswer === i || (typeof (answer as any).text !== 'undefined' && correctAnswer === (answer as any).text);
                          }
                          return (
                            <AnswerBox
                              key={i}
                              isCorrect={isCorrect}
                              themeName={themeName}
                            >
                              <AnswerNumber isCorrect={isCorrect} themeName={themeName}>
                                {i + 1}.
                              </AnswerNumber>
                              {answer.drawing ? (
                                <MiniWhiteboard
                                  initialPaths={answer.drawing ?? []}
                                  width={undefined}
                                  height={120}
                                  style={{ width: '100%' }}
                                />
                              ) : (
                                <AnswerText>{answer.text}</AnswerText>
                              )}
                              <VotesBadge themeName={themeName} isCorrect={isCorrect}>{answer.votes ?? 0}</VotesBadge>
                            </AnswerBox>
                          );
                        })}
                      </AnswersGrid>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                        <PieChart
                          data={(question.answers ?? []).map((answer, i) => ({
                            label: `${i + 1}`,
                            value: answer.votes ?? 0,
                            isCorrect: answer.isCorrect
                          }))}
                          themeName={themeName}
                        />
                      </div>
                    </QuestionContainer>
                  ))}
                </div>
              )}

              {trueFalseQuestions.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ color: 'white', marginBottom: '1rem' }}>{t('true_false_questions')}</h2>
                  {trueFalseQuestions.map((question, index) => (
                    <QuestionContainer key={`tf-${index}`} themeName={themeName} className="true-false-container">
                      <DeleteButton themeName={themeName} onClick={() => handleDeleteTrueFalse(index)}>
                        {t('delete')}
                      </DeleteButton>
                      <QuestionBoard>
                        <MiniWhiteboard
                          initialPaths={question.questionDrawing ?? []}
                          width={undefined}
                          height={220}
                          style={{ width: '100%' }}
                        />
                      </QuestionBoard>
                      <AnswersGrid>
                        <AnswerBox
                          isCorrect={question.answer === true}
                          themeName={themeName}
                        >
                          <AnswerNumber isCorrect={question.answer === true} themeName={themeName}>
                            {t('true')}
                          </AnswerNumber>
                          <AnswerText>{t('true')}</AnswerText>
                          <VotesBadge themeName={themeName} isCorrect={question.answer === true}>{question.votes?.true ?? 0}</VotesBadge>
                        </AnswerBox>
                        <AnswerBox
                          isCorrect={question.answer === false}
                          themeName={themeName}
                        >
                          <AnswerNumber isCorrect={question.answer === false} themeName={themeName}>
                            {t('false')}
                          </AnswerNumber>
                          <AnswerText>{t('false')}</AnswerText>
                          <VotesBadge themeName={themeName} isCorrect={question.answer === false}>{question.votes?.false ?? 0}</VotesBadge>
                        </AnswerBox>
                      </AnswersGrid>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                        <PieChart
                          data={[
                            { label: t('true'), value: question.votes?.true ?? 0, isCorrect: question.answer === true },
                            { label: t('false'), value: question.votes?.false ?? 0, isCorrect: question.answer === false }
                          ]}
                          themeName={themeName}
                        />
                      </div>
                    </QuestionContainer>
                  ))}
                </div>
              )}

              {polls.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ color: 'white', marginBottom: '1rem' }}>{t('polls')}</h2>
                  {polls.map((poll, index) => {
                    const maxVotes = Math.max(...(poll.options ?? []).map(opt => opt.votes ?? 0));
                    return (
                      <QuestionContainer key={`p-${index}`} themeName={themeName} className="poll-container">
                        <DeleteButton themeName={themeName} onClick={() => handleDeletePoll(index)}>
                          {t('delete')}
                        </DeleteButton>
                        <QuestionBoard>
                          <MiniWhiteboard
                            initialPaths={poll.question ?? []}
                            width={undefined}
                            height={220}
                            style={{ width: '100%' }}
                          />
                        </QuestionBoard>
                        <AnswersGrid>
                          {(poll.options ?? []).map((option, i) => {
                            const isWinner = option.votes === maxVotes && maxVotes > 0;
                            const Box = isWinner ? WinnerBox : AnswerBox;
                            return (
                              <Box key={i} isCorrect={isWinner} themeName={themeName} style={{ position: 'relative', overflow: isWinner ? 'hidden' : undefined }}>
                                {isWinner && (
                                  <ConfettiRain>
                                    {[...Array(40)].map((_, idx) => (
                                      <ConfettiPiece
                                        key={idx}
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
                                <AnswerNumber themeName={themeName}>{i + 1}.</AnswerNumber>
                                {option.drawing ? (
                                  <MiniWhiteboard
                                    initialPaths={option.drawing}
                                    width={undefined}
                                    height={120}
                                    style={{ width: '100%' }}
                                  />
                                ) : (
                                  <AnswerText>{option.text}</AnswerText>
                                )}
                                <VotesBadge themeName={themeName} isCorrect={option.votes === maxVotes && maxVotes > 0}>{option.votes ?? 0}</VotesBadge>
                              </Box>
                            );
                          })}
                        </AnswersGrid>
                      </QuestionContainer>
                    );
                  })}
                </div>
              )}

              {questions.length === 0 && trueFalseQuestions.length === 0 && polls.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                  {t('no_questions')}
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </LargeQuizBox>
    </ViewportContainer>
  );
};

export default QuizSummary; 