import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if(error) setError('');
    }
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if(error) setError('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light-gray">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Acesse sua conta
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Bem-vindo ao FeedFort
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 bg-white border border-brand-gray placeholder-gray-400 text-brand-text rounded-t-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Senha</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 bg-white border border-brand-gray placeholder-gray-400 text-brand-text rounded-b-md focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                    placeholder="Senha"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
    
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default Login;