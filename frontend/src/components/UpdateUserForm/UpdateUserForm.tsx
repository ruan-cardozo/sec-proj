import { useState } from 'react';
import './UpdateUserForm.css';
import { useNavigate } from 'react-router-dom';

function UpdateUserForm() {

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

        const userId = localStorage.getItem('userLogged');

		try {
			const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify(formData)
			});
            console.log(response);
			if (response.ok) {
				alert('Usuário atualizado com sucesso!');

				setFormData({
					name: '',
					email: '',
					password: ''
				});
			} else {
				alert('Ocorreu um erro ao atualizar o usuário!');
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
                    <button type="submit" className="btn-form">Salvar</button>
                </form>
            </div>
            <button type='button' onClick={() => navigate('/')} className="btn-login" > Ir para tela inicial</button>
        </div>
    );
}

export default UpdateUserForm;