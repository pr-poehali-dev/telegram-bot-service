import { useEffect, useRef } from 'react';

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

const TelegramLoginButton = ({ botName, onAuth }: TelegramLoginButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем глобальную функцию для callback
    window.onTelegramAuth = (user: any) => {
      console.log('Telegram auth callback received:', user);
      onAuth(user);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      // Очищаем глобальную функцию
      delete window.onTelegramAuth;
    };
  }, [botName, onAuth]);

  return <div ref={containerRef} />;
};

export default TelegramLoginButton;