import axios from 'axios';

import context from 'context';
import authService from './auth';

const servicesURL = axios.create({
	baseURL: context.config.env.BACKEND_URL,
	timeout: 3000,
});

const services = {
	authService,
};

export { servicesURL };
export default services;
