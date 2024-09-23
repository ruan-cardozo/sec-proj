import './UserRegisterForm.css';

function UserRegisterForm() {
    return (
	<div className='row'>
		<div className='box'> 
			<div className="register-form">
    	        <div className="form-group">
    	            <label>Nome:</label>
					<br></br>
    	            <input type="text" className="form-control" />
    	        </div>
				<div className="form-group">
    	            <label>CPF:</label>
					<br></br>
    	            <input type="text" className="form-control" />
    	        </div>
    	        <div className="form-group">
    	            <label>Email:</label>
					<br></br>
    	            <input type="text" className="form-control" />
    	        </div>
    	        <div className="form-group">
    	            <label>Senha:</label>
					<br></br>
    	            <input type="text" className="form-control" />
    	        </div>
    	    </div>
		</div>
	</div>
	
    );
}

export default UserRegisterForm;