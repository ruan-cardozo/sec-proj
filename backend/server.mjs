import express from 'express';
import { authenticateToken } from'./src/core/modules/auth-module/auth/auth.mjs';
import cors from 'cors';
import { UserController } from './src/core/modules/user-module/user-controller.mjs';
import { LoginController } from './src/core/modules/auth-module/login/login-controller.mjs';
import { sequelize } from './src/config/db.mjs';
import './src/core/models/UserModel.mjs';

class Server {
	constructor() {
		this.app = express();
		this.config();
		this.routes();
		this.errorHandler();
		this.syncTables();
	}

	config() {
		const corsOptions = {
			origin: 'http://localhost:5173',
		}

		this.app.use(cors(corsOptions));
		this.app.use(express.json());
	}

	syncTables() {
		sequelize.sync({ force: true }).then(() => {
			console.log('Database & tables created!');
		}).catch(error => {
			console.error('Unable to connect to the database:', error);
		});
	}

	routes() {

		const userController = UserController.getInstance();
		const loginController = LoginController.getInstance();

		this.app.get('/api/users', authenticateToken, userController.getAllUsers);
		this.app.get('/api/users/:id', authenticateToken, userController.getUserById);
		this.app.post('/api/users', userController.createUser);
		this.app.put('/api/users/:id', authenticateToken, userController.updateUser);
		this.app.delete('/api/users/:id', authenticateToken, userController.deleteUser);
		this.app.post('/api/login', loginController.login);
	}

	errorHandler() {
		this.app.use((err, req, res, next) => {
		  console.error(err.stack);
		  res.status(500).send('Server Error');
		});
	}

	start() {
		this.app.listen(process.env.PORT || 3000, () => {
		  console.log('Server started on port 3000');
		});
	}

	interceptRequest(req, res, next) {
		console.log('Request intercepted');
		console.log('Request for ' + req.url);
		next();
	}
}

const server = new Server();
server.start();