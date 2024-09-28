import { useState } from 'react';
import './UserRegisterForm.css';
import { useNavigate } from 'react-router-dom';

function UserRegisterForm() {

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: ''
	});
    const navigate = useNavigate();


	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
        

        console.log(JSON.stringify(formData));


		try {
			const response = await fetch('http://localhost:3000/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

            console.log(response);
            

			if (response.ok) {
				alert('Usuário cadastrado com sucesso!');

				setFormData({
					name: '',
					email: '',
					password: ''
				});
			} else {
				alert('Ocorreu um erro ao cadastrar o usuário!');
			}
		} catch (error) {
			console.error('Ocorreu um erro ao enviar os dados para a api', error);
		}
	};

	return (
        <div className='row'>
            <div className='box'> 
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <br />
                        <input
                            type="text"
                            name="name"
                            placeholder='Digite seu nome...'
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
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
                    <button type="submit" className="btn-form">Registrar</button>
                </form>
            </div>
            <button type='button' onClick={() => navigate('/login')} className="btn-login" > Ir para o login</button>
        </div>
    );
}

export default UserRegisterForm;