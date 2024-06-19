import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { CircularProgress, Grid, GridItem, Tag, Tooltip, VStack } from '@chakra-ui/react';

import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import { Article } from 'types/article';
import { Anthology } from 'types/anthology';

const Dossier = (): JSX.Element => {
	const navigate = useNavigate();
	const { requestResponseToast } = useUIContext();
	const { loadAnthologyArticles, searchAnthology, updateAnthology } = useUserContext();
	const { anthologyId } = useParams();
	const [search, setSearch] = useState('');
	const [anthology, setAnthology] = useState<Anthology | undefined>(undefined);
	const [articles, setArticles] = useState<Article[]>([]);

	const uiSearchAnthology = async () => {
		try {
			const res = await searchAnthology(+anthologyId!);
			requestResponseToast(res);
			if (res.code === 404) {
				navigate('/marque-pages');
			} else if (res.status === 'success') {
				setAnthology(res.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiLoadAnthologyArticles = async () => {
		try {
			const res = await loadAnthologyArticles(+anthologyId!);
			requestResponseToast(res);
			if (res.code === 404) {
				navigate('/marque-pages');
			} else if (res.status === 'success') {
				if (res.data === null) setArticles([]);
				else setArticles(res.data!);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiUpdateAnthology = async (id: number) => {
		try {
			const res = await updateAnthology({ id: +anthologyId!, removeArticles: [id] });
			requestResponseToast(res, true);
			if (res.status === 'success') {
				setArticles(articles.filter((a) => a.id !== id));
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiSearchAnthology();
		console.log(anthology);
		uiLoadAnthologyArticles();
	}, []);

	if (!anthology) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="black" />
				</VStack>
			</>
		);
	}

	return (
		<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
			<SearchInput
				value={search}
				inputId="favoris-search-input"
				w={{ base: '100%', xl: '640px' }}
				placeholder="Cherchez parmis vos articles favoris"
				onChange={(e) => setSearch(e.target.value)}
				variant="primary-1"
			/>
			<Tag bg="primary.yellow">
				{articles.length} article
				{articles.length !== 1 && 's'}
			</Tag>
			<Grid
				templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
				gap={{ base: 2, lg: 4 }}
				w="100%"
			>
				{articles
					.filter((a) => (search !== '' ? a.title.includes(search) : true))
					.map((article, index) => (
						<GridItem key={`${index.toString()}`}>
							<ArticleCard
								id={article.id}
								title={article.title}
								// TODO: author name
								author="Author"
								date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
								// TODO: Topic name
								topic="Topic"
								content={article.content}
								actions={[
									<Tooltip label="Ajouter à un marque-page">
										<span>
											<AddIcon onClick={() => {}} color="black" />
										</span>
									</Tooltip>,
									<Tooltip label="Supprimer du marque-page">
										<span>
											<CloseIcon onClick={() => uiUpdateAnthology(article.id)} color="black" />
										</span>
									</Tooltip>,
								]}
								likes={article.totalLikes}
								views={article.totalViews}
							/>
						</GridItem>
					))}
			</Grid>
		</VStack>
	);
};

export default Dossier;
