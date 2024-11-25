export const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return response;
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  };
  