import './HomePageButton.css';
import { useLocation } from 'react-router-dom';

function HomePageButton() {

    const location = useLocation();

    if (location.pathname == '/register' || location.pathname == '/login') return; 
    
    return (

    <div className='btn-div'>
        <button type="submit" onClick={() => {
            window.location.href = '/register';
        }} className="btn-home">Ir para a tela de registrar-se</button>
    </div>
    );
}

export default HomePageButton;