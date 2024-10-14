import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserLoginForm.css';

function UserLoginForm() {

	const [formData, setFormData] = useState({
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

		try {
			const response = await fetch('http://localhost:3000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {

				const data = await response.json();
				localStorage.setItem('token', data.accessToken);
				localStorage.setItem('userLogged', data.userId);
				document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24}; Secure; SameSite=Stric;`;
				setFormData({
					email: '',
					password: ''
				});
				alert('Usuário autenticado com sucesso!');
			} else {
				alert('Ocorreu um erro ao autenticar o usuário!');
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
            <button type='button' onClick={() => navigate('/update')} className="btn-login" > Ir para a tela de atualizar usuário</button>
			<button type='button' onClick={() => navigate('/register')} className="btn-register" > Ir para registrar-se</button>
		</div>
	);
}

export default UserLoginForm;
