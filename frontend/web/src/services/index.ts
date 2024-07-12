import axios from 'axios';

import context from 'context';
import auth from './auth';
import articles from './articles';
import topics from './topics';
import anthologies from './anthologies';

const servicesURL = axios.create({
	withCredentials: true,
	baseURL: context.config.env.BACKEND_URL,
	timeout: 3000,
});

const services = {
	auth,
	articles,
	anthologies,
	topics,
};

export { servicesURL };
export default services;
