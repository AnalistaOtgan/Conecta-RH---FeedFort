import React from 'react';
import { useLocation } from 'react-router-dom';
import { SearchIcon, BellIcon, MenuIcon } from './icons';

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/feedback': 'Novo Feedback',
  '/reports': 'Relatórios',
  '/employees': 'Funcionários',
  '/structure': 'Estrutura',
  '/configuration': 'Configurações',
};

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'FeedFort';

    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);


  return (
    <header className="h-20 bg-white flex items-center justify-between px-4 sm:px-8 border-b border-brand-gray flex-shrink-0">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="md:hidden mr-4 text-brand-text-light hover:text-brand-text" aria-label="Abrir menu">
            <MenuIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-text truncate">{title}</h1>
          <p className="text-sm text-brand-text-light hidden sm:block">{formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 sm:space-x-6">
        <button className="text-brand-text-light hover:text-brand-text">
          <SearchIcon className="w-6 h-6" />
        </button>
        <button className="relative text-brand-text-light hover:text-brand-text">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;