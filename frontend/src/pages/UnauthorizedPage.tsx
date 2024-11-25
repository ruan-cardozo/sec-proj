import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Não Autorizado</h1>
      <p>Desculpe, mas você não está autorizado a visualizar esta página.</p>
      <button onClick={handleLoginRedirect}>Ir para Login</button>
    </div>
  );
}