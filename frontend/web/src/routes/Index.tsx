import * as React from 'react';
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import AuthRoute from './Auth';
import PrivateRoute from './Private';
import HomePage from 'pages/Home';
import ConnexionPage from 'pages/Connexion';
import InscriptionPage from 'pages/Inscription';
import Favoris from 'pages/Favoris';
import Article from 'pages/Article';
import MarquePage from 'pages/MarquePage';
import MarquePages from 'pages/MarquePages';
import Nouveautes from 'pages/Nouveautes';
import Decouvertes from 'pages/Decouvertes';
import NouvelArticle from 'pages/NouvelArticle';
import Publications from 'pages/Publications';
import Brouillons from 'pages/Brouillons';
import Reglages from 'pages/Reglages';
import IpfsConfig from 'pages/IpfsConfig';
import AuthProvider from 'providers/Auth';
import IpfsProvider from 'providers/Ipfs';
import UIProvider from 'providers/UI';

const Routes = (): JSX.Element => (
	<BrowserRouter>
		<UIProvider>
			<IpfsProvider>
				<AuthProvider>
					<RouterRoutes>
						<Route path="/" element={<AuthRoute />}>
							<Route path="/" element={<HomePage />} />
							<Route path="/inscription" element={<InscriptionPage />} />
							<Route path="/connexion" element={<ConnexionPage />} />
						</Route>
						<Route path="/" element={<PrivateRoute />}>
							<Route path="/favoris" element={<Favoris />} />
							<Route path="/articles/:articleId" element={<Article />} />
							<Route path="/marque-pages" element={<MarquePages />} />
							<Route path="/marque-page/:bookmarkId" element={<MarquePage />} />
							<Route path="/nouveautes" element={<Nouveautes />} />
							<Route path="/decouvertes" element={<Decouvertes />} />
							<Route path="/nouvel-article" element={<NouvelArticle />} />
							<Route path="/publications" element={<Publications />} />
							<Route path="/brouillons" element={<Brouillons />} />
							<Route path="/reglages" element={<Reglages />} />
							<Route path="/ipfs-config" element={<IpfsConfig />} />
						</Route>
						<Route path="*" element={<Navigate replace to="/favoris" />} />
					</RouterRoutes>
				</AuthProvider>
			</IpfsProvider>
		</UIProvider>
	</BrowserRouter>
);

export default Routes;
