import * as React from 'react';
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import AuthRoute from './Auth';
import PrivateRoute from './Private';
import AuthProvider from 'providers/Auth';
import UserProvider from 'providers/User';
import IpfsProvider from 'providers/Ipfs';
import UIProvider from 'providers/UI';
import HomePage from 'pages/Home';
import ConnexionPage from 'pages/Connexion';
import InscriptionPage from 'pages/Inscription';
import Favoris from 'pages/Favoris';
import Article from 'pages/Article';
import Dossier from 'pages/Dossier';
import Dossiers from 'pages/Dossiers';
import Nouveautes from 'pages/Nouveautes';
import Decouvertes from 'pages/Decouvertes';
import NouvelArticle from 'pages/NouvelArticle';
import Publications from 'pages/Publications';
import Brouillons from 'pages/Brouillons';
import Reglages from 'pages/Reglages';
import UserProfil from 'pages/UserProfil';

const Routes = (): JSX.Element => (
	<BrowserRouter>
		<UIProvider>
			<IpfsProvider>
				<AuthProvider>
					<UserProvider>
						<RouterRoutes>
							<Route path="/" element={<AuthRoute />}>
								<Route path="/" element={<HomePage />} />
								<Route path="/inscription" element={<InscriptionPage />} />
								<Route path="/connexion" element={<ConnexionPage />} />
							</Route>
							<Route path="/" element={<PrivateRoute />}>
								<Route path="/favoris" element={<Favoris />} />
								<Route path="/articles/:articleId" element={<Article />} />
								<Route path="/utilisateurs/:userId" element={<UserProfil />} />
								<Route path="/dossiers" element={<Dossiers />} />
								<Route path="/dossier/:anthologyId" element={<Dossier />} />
								<Route path="/nouveautes" element={<Nouveautes />} />
								<Route path="/decouvertes" element={<Decouvertes />} />
								<Route path="/nouvel-article" element={<NouvelArticle />} />
								<Route path="/publications" element={<Publications />} />
								<Route path="/brouillons" element={<Brouillons />} />
								<Route path="/reglages" element={<Reglages />} />
							</Route>
							<Route path="*" element={<Navigate replace to="/favoris" />} />
						</RouterRoutes>
					</UserProvider>
				</AuthProvider>
			</IpfsProvider>
		</UIProvider>
	</BrowserRouter>
);

export default Routes;
