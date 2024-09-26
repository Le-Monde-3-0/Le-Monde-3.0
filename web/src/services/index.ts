import axios from 'axios';

import context from 'context';
import auth from './auth';
import user from './user';
import articles from './articles';
import anthologies from './anthologies';
import topics from './topics';

const servicesURL = axios.create({
	withCredentials: true,
	baseURL: context.config.env.BACKEND_URL,
	timeout: 3000,
});

const services = {
	auth,
	user,
	articles,
	anthologies,
	topics,
};

export { servicesURL };
export default services;
