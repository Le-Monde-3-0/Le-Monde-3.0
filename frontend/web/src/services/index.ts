import axios from 'axios';

import context from 'context';
import authService from './auth';
import articlesService from './articles';
import topicsService from './topics';
import anthologiesService from './anthologies';

const servicesURL = axios.create({
	withCredentials: true,
	baseURL: context.config.env.BACKEND_URL,
	timeout: 3000,
});

const services = {
	auth: authService,
	articles: articlesService,
	anthologies: anthologiesService,
	topics: topicsService,
};

export { servicesURL };
export default services;
