import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/check-token', {
                    method: 'GET',
                    credentials: 'include'
                 });
                const data = await response.json();

                if (data) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Incluir cookies na requisição
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                throw new Error('Erro ao fazer login. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw new Error('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    } 

    return context;
};

export { useAuth };