import { DeleteIcon, ViewOffIcon } from '@chakra-ui/icons';
import { CircularProgress, Collapse, Grid, GridItem, HStack, Tag, Tooltip, VStack } from '@chakra-ui/react';
import ArticleCard from 'components/Cards/ArticleCard';
import { Chart } from 'components/Chart/Chart';
import SearchInput from 'components/Inputs/SearchInput';
import { useAuthContext } from 'contexts/auth';
import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import * as React from 'react';
import { useEffect, useState } from 'react';

const Publications = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const { user, switchArticleDraftState, deleteArticle, getArticles } = useUserContext();
	const [isViewChartDisplayed, setViewChartDisplay] = useState(false);
	const [isLikeChartDisplayed, setLikeChartDisplay] = useState(false);

	let totalViews = 0;
	for (let i = 0; i < user.publishedArticles.length; i++) {
		console.log(user.publishedArticles[i].TotalViews);
		totalViews += user.publishedArticles[i].TotalViews;
	}

	const toggleViewChartDisplay = () => {
		setViewChartDisplay(!isViewChartDisplayed);
	};

	const toggleLikeChartDisplay = () => {
		setLikeChartDisplay(!isLikeChartDisplayed);
	};

	const uiGetArticles = async () => {
		try {
			const res = await getArticles();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiDeleteArticle = async (articleId: number) => {
		try {
			const res = await deleteArticle(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiSwitchArticleDraftState = async (articleId: number) => {
		try {
			const res = await switchArticleDraftState(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiGetArticles();
	}, [auth]);

	if (!user.publishedArticles) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="black" />
				</VStack>
			</>
		);
	}

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<SearchInput
					value={search}
					inputId="publications-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles publiés"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Tag bg="primary.yellow">
						{user.publishedArticles.filter((p) => (search !== '' ? p.Title.includes(search) : true)).length} publication
						{user.publishedArticles.length !== 1 && 's'}
					</Tag>
					<Tag bg="primary.blue" onClick={toggleLikeChartDisplay} cursor="pointer">
						{user.publishedArticles
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0)}{' '}
						like
					</Tag>
					<Tag bg="primary.blue" onClick={toggleViewChartDisplay} cursor="pointer">
						{totalViews} view
					</Tag>
				</HStack>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					<Collapse in={isLikeChartDisplayed} animateOpacity>
						<Chart yLabel="Likes" data={user.overallDailyTotalLikes} />
					</Collapse>
					<Collapse in={isViewChartDisplayed} animateOpacity>
						<Chart yLabel="Vues" data={user.overallDailyTotalViews} />
					</Collapse>
				</Grid>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{user.publishedArticles
						.filter((p) => (search !== '' ? p.Title.includes(search) : true))
						.map((publication, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={publication.Id}
									title={publication.Title}
									author={publication.AuthorName}
									date={new Date().toLocaleDateString('fr-FR')}
									topic={publication.Topic}
									content={publication.Content}
									actions={[
										<Tooltip label="Archiver dans les brouillons">
											<span>
												<ViewOffIcon onClick={() => uiSwitchArticleDraftState(publication.Id)} color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => uiDeleteArticle(publication.Id)} color="black" />
											</span>
										</Tooltip>,
									]}
									likes={publication.Likes.length}
									views={publication.TotalViews}
									view="publisher"
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Publications;
