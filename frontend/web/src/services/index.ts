import axios from 'axios';
import context from 'context';

import articlesService from './articles';
import authService from './auth';
import bookmarksService from './bookmarks';
import userService from './user';

const servicesURL = axios.create({
	baseURL: context.config.env.BACKEND_URL,
	timeout: 3000,
});

const services = {
	auth: authService,
	user: userService,
	articles: articlesService,
	bookmarks: bookmarksService,
};

export { servicesURL };
export default services;
