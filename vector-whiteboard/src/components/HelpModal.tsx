import React from 'react';
import styled from 'styled-components';

interface HelpModalProps {
  themeName: string;
  onClose: () => void;
  t: (key: string) => string;
}

const ModalOverlay = styled.div`
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

const ModalContent = styled.div<{ themeName: string }>`
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
  color: #fff;
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

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255,255,255,0.25);
  }
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 18px;
`;

const ContactInfo = styled.div`
  font-size: 1rem;
  margin-top: 8px;
  text-align: center;
`;

const HelpModal: React.FC<HelpModalProps> = ({ themeName, onClose, t }) => (
  <ModalOverlay>
    <ModalContent themeName={themeName}>
      <CloseButton onClick={onClose} aria-label={t('back')}>×</CloseButton>
      <Title>{t('help')}</Title>
      <Section style={{ textAlign: 'center', marginBottom: 32, fontSize: '1.1rem' }}>
        <em>{t('coming_soon')}</em>
      </Section>
      <Section>
        <strong>{t('contact')}</strong>
        <ContactInfo>
          {t('for_questions_feedback')}<br />
          <a href="mailto:support@npqp.nl" style={{ color: '#fff', textDecoration: 'underline' }}>support@npqp.nl</a>
        </ContactInfo>
      </Section>
    </ModalContent>
  </ModalOverlay>
);

export default HelpModal; 