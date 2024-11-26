import Cookies from 'js-cookie';

export const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.accessToken;
        Cookies.set('token', token, { expires: 7 }); // Armazena o token por 7 dias

    } else {
        throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
      return response;
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  };
  