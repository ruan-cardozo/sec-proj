import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './UserLoginForm.css';

function UserLoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await login(formData.email, formData.password);

            setFormData({
                email: '',
                password: ''
            });
            alert('Usuário autenticado com sucesso!');
            navigate('/home');
        } catch (error) {
            alert('Ocorreu um erro ao autenticar o usuário!');
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className='row'>
            <h1 style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '70px'
            }}>Faça o login</h1>
            <div className='box'> 
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <br />
                        <input
                            type="text"
                            name="email"
                            placeholder='Digite seu email...'
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha:</label>
                        <br />
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder='Digite sua senha...'
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn-form">Login</button>
                </form>
            </div>
            <p
            style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '20px'
            }}
            >Ainda não tem conta ? Clique no botão abaixo</p>
            <button type='button' onClick={() => navigate('/register')} className="btn-register" >Registrar-se</button>
        </div>
    );
}

export default UserLoginForm;