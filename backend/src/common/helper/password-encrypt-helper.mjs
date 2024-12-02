import bcrypt from 'bcrypt';

export function encryptPassword(password) {

	return bcrypt.hashSync(password, 10);
}