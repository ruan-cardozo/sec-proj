import { HTMLInputTypeAttribute, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserLoginForm.css';

function UserLoginForm() {

	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [userMessage, setUserMessage] = useState('');  // Para exibir uma mensagem com potencial de XSS
	const navigate = useNavigate();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		
		setUserMessage(`Bem-vindo, ${formData.email}`);

		console.log('aaa', userMessage);

		try {
			const response = await fetch('http://localhost:3000/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				alert('Usuário foi logado com sucesso');
				setFormData({
					email: '',
					password: ''
				});
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

			{/* Exibindo a mensagem de boas-vindas diretamente no DOM, sem sanitização */}
			<div className="user-message" dangerouslySetInnerHTML={{ __html: userMessage }}></div>

			<button type='button' onClick={() => navigate('/register')} className="btn-register" > Ir para registrar-se</button>
		</div>
	);
}

export default UserLoginForm;
