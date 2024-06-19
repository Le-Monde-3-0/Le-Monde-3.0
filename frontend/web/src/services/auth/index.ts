import signUp from './signUp';
import signIn from './signIn';
import signOut from './signOut';
import refresh from './refresh';
import { updateEmail, updatePassword, updateUsername } from './update';

const authService = {
	signUp,
	signIn,
	signOut,
	refresh,
	updatePassword,
	updateEmail,
	updateUsername,
};

export default authService;
