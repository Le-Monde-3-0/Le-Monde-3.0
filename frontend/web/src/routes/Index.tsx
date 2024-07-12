import * as React from 'react';
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import UIProvider from 'providers/UI';
import AuthProvider from 'providers/auth/Index';
import UserProvider from 'providers/user/Index';
import IpfsProvider from 'providers/Ipfs';
import AuthRoute from './Auth';
import PrivateRoute from './Private';
import Article from 'pages/Article';
import Author from 'pages/Author';
import Connexion from 'pages/Connexion';
import Explore from 'pages/Explore';
import Favorites from 'pages/Favorites';
import Folder from 'pages/Folder';
import Home from 'pages/Home';
import Inscription from 'pages/Inscription';
import Library from 'pages/Library';
import Settings from 'pages/Settings';
import Write from 'pages/Write';
import Writings from 'pages/Writings';

const Routes = (): JSX.Element => (
	<BrowserRouter>
		<UIProvider>
			<IpfsProvider>
				<AuthProvider>
					<UserProvider>
						<RouterRoutes>
							<Route path="/" element={<AuthRoute />}>
								<Route path="/" element={<Home />} />
								<Route path="/inscription" element={<Inscription />} />
								<Route path="/connexion" element={<Connexion />} />
							</Route>
							<Route path="/" element={<PrivateRoute />}>
								<Route path="/bibliotheque" element={<Library />} />
								<Route path="/bibliotheque/favoris" element={<Favorites />} />
								<Route path="/bibliotheque/dossiers/:anthologyId" element={<Folder />} />
								<Route path="/redactions" element={<Writings />} />
								<Route path="/ecrire" element={<Write />} />
								<Route path="/explorer" element={<Explore />} />
								<Route path="/articles/:articleId" element={<Article />} />
								<Route path="/auteurs/:userId" element={<Author />} />
								<Route path="/reglages" element={<Settings />} />
							</Route>
							<Route path="*" element={<Navigate replace to="/bibliotheque" />} />
						</RouterRoutes>
					</UserProvider>
				</AuthProvider>
			</IpfsProvider>
		</UIProvider>
	</BrowserRouter>
);

export default Routes;
