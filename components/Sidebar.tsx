import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DashboardIcon, PlusCircleIcon, FileTextIcon, UsersIcon, LayersIcon, SettingsIcon, LogOutIcon, XIcon } from './icons';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allNavItems = [
        { icon: DashboardIcon, label: 'Dashboard', path: '/', roles: ['Líder de Loja', 'RH', 'Diretor'] },
        { icon: PlusCircleIcon, label: 'Novo Feedback', path: '/feedback', roles: ['Líder de Loja', 'RH', 'Diretor'] },
        { icon: FileTextIcon, label: 'Relatórios', path: '/reports', roles: ['RH', 'Diretor'] },
        { icon: UsersIcon, label: 'Funcionários', path: '/employees', roles: ['RH', 'Diretor'] },
        { icon: LayersIcon, label: 'Estrutura', path: '/structure', roles: ['RH', 'Diretor'] },
        { icon: SettingsIcon, label: 'Configurações', path: '/configuration', roles: ['RH', 'Diretor'] },
    ];
    
    const navItems = allNavItems.filter(item => user && item.roles.includes(user.role));

    if (!user) {
        return null; // Sidebar is not rendered if there is no user
    }
    
    const NavItem: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
        <li>
            <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)} // Close sidebar on navigation
                className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 my-1 text-sm rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-blue-100 text-brand-blue font-semibold'
                        : 'text-brand-text-light hover:bg-gray-100'
                    }`
                }
            >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
            </NavLink>
        </li>
    );


    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>
            <aside className={`w-64 bg-white flex flex-col border-r border-brand-gray fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} role="navigation">
                <div className="h-20 flex items-center justify-between px-6 border-b border-brand-gray">
                    <div className="flex items-center">
                        <div className="bg-brand-blue text-white rounded-lg p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-brand-text">FeedFort</h1>
                            <p className="text-xs text-brand-text-light">Sistema de Feedback</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-1 rounded-md text-brand-text-light hover:bg-gray-100" aria-label="Fechar menu">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 py-6 px-4">
                    <h2 className="px-2 text-xs font-semibold text-brand-text-light uppercase tracking-wider mb-2">Navegação Principal</h2>
                    <ul>
                        {navItems.map((item, index) => (
                           <NavItem key={index} item={item} />
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-brand-gray">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-brand-text mr-3">
                                {user.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-brand-text">{user.name}</p>
                                <p className="text-xs text-brand-text-light">{user.role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} title="Sair" className="p-2 rounded-md text-brand-text-light hover:bg-red-100 hover:text-red-600 transition-colors">
                            <LogOutIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;