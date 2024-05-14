import axios from 'axios';

import context from 'context';
import authService from './auth';
import articlesService from './articles';
import bookmarksService from './bookmarks';
import usersService from './users';

const servicesURL = axios.create({
	baseURL: context.config.env.BACKEND_URL,
	timeout: 3000,
});

const services = {
	auth: authService,
	articles: articlesService,
	bookmarks: bookmarksService,
	users: usersService,
};

export { servicesURL };
export default services;
