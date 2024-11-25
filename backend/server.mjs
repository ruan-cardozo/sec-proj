import express from 'express';
import { authenticateToken } from'./src/core/modules/auth-module/auth/auth.mjs';
import cors from 'cors';
import { UserController } from './src/core/modules/user-module/user-controller.mjs';
import { LoginController } from './src/core/modules/auth-module/login/login-controller.mjs';
import { sequelize } from './src/config/db.mjs';
import './src/core/models/UserModel.mjs';
import { EmployeeController } from './src/core/modules/employee-module/employee-controller.mjs';
import cookieParser from 'cookie-parser';

class Server {
	constructor() {
		this.app = express();
		this.config();
		this.routes();
		this.errorHandler();
		this.app.use(this.interceptRequest);
		// this.syncTables();
	}

	config() {
		const corsOptions = {
			origin: ['http://localhost:5173', 'http://172.21.0.7:5173'],
			credentials: true
		}

		this.app.use(cors(corsOptions));
		this.app.use(express.json());
		this.app.use(cookieParser())
	}

	syncTables() {
		sequelize.sync({ force: true }).then(() => {
			console.log('Database & tables created!');
		}).catch(error => {
			console.error('Unable to connect to the database:', error);
		});
	}

	routes() {
		this.userRoutes();
		this.loginRoutes();
		this.employeeRoutes();
	}

	userRoutes() {
		const userController = UserController.getInstance();

		this.app.get('/api/users', authenticateToken, userController.getAllUsers);
		this.app.get('/api/users/:id', authenticateToken, userController.getUserById);
		this.app.post('/api/users', userController.createUser);
		this.app.put('/api/users/:id', authenticateToken, userController.updateUser);
		this.app.delete('/api/users/:id', authenticateToken, userController.deleteUser);
	}

	loginRoutes() {
		const loginController = LoginController.getInstance();

		this.app.post('/api/login', loginController.login);
		this.app.get('/api/check-token', authenticateToken, loginController.checkToken);
	}

	employeeRoutes() {
		const employeeController = EmployeeController.getInstance();

		this.app.post('/api/employees', authenticateToken, employeeController.createEmployee);
		this.app.get('/api/employees', authenticateToken, employeeController.getAllEmployees);
		this.app.get('/api/employees/:id', authenticateToken, employeeController.getOneEmployee);
		this.app.put('/api/employees/:id', authenticateToken, employeeController.updateEmployee);
		this.app.delete('/api/employees/:id', authenticateToken, employeeController.deleteEmployee);
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
		console.log(`${req.method} ${req.url}`);
		next();
	}
}

const server = new Server();
server.start();