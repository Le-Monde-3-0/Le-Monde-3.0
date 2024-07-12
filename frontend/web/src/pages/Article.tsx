import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Badge,
	CircularProgress,
	// Collapse,
	// Grid,
	HStack,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
// import { Chart } from 'components/Chart/Chart';
// import { useAuthContext } from 'contexts/auth';
import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { Article } from 'types/article';
import frenchDate from 'utils/frenchDate';
import AnthologiesModal from 'components/modals/Anthologies';

const ArticlePage = (): JSX.Element => {
	const navigate = useNavigate();
	const { articleId } = useParams();
	const { handleToast } = useUIContext();
	const { data, methods } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [article, setArticle] = useState<Article | undefined>(undefined);
	const [isLiked, setIsLiked] = useState(false);
	// const [isViewChartDisplayed, setViewChartDisplay] = useState(false);
	// const [isLikeChartDisplayed, setLikeChartDisplay] = useState(false);

	// const toggleViewChartDisplay = () => {
	// 	setViewChartDisplay(!isViewChartDisplayed);
	// 	console.log(article?.DailyViews);
	// };

	// const toggleLikeChartDisplay = () => {
	// 	setLikeChartDisplay(!isLikeChartDisplayed);
	// };

	const uiSearchArticle = async () => {
		try {
			const res = await methods.articles.search.one({ id: +articleId! });
			handleToast(res);
			if (res.code === 404) {
				navigate('/favoris');
			} else if (res.data !== undefined && res.status === 'success') {
				// res.data.viewCounter = Math.floor(Math.random() * 1000);
				// res.data.DailyViews = generateDailyStats(res.data.viewCounter);
				// res.data.DailyLikes = generateDailyStats(Math.floor(Math.random() * 1000));
				setArticle(res.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiLikeArticle = async () => {
		try {
			const res = await methods.articles.like({ id: +articleId!, isLiked: !isLiked });
			// TODO: not clean
			handleToast(res, true, true, false, !isLiked ? 'Article ajouté aux favoris.' : 'Article retiré des favoris.');
			if (res.status === 'success') setIsLiked(!isLiked);
		} catch (error) {
			console.error(error);
		}
	};

	const uiCreateAnthology = async (title: string, description: string) => {
		try {
			const res = await methods.anthologies.create({
				name: title,
				description,
				isPublic: false,
				articles: [+articleId!],
			});
			handleToast(res, true);
			if (res.status === 'success') onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const uiAddArticleToAnthology = async (id: number) => {
		try {
			const res = await methods.anthologies.update({ id, addArticles: [+articleId!] });
			handleToast(res, true, true, false, 'Article ajouté au dossier.');
			if (res.status === 'success') onClose();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiSearchArticle();
	}, []);

	useEffect(() => {
		if (data.user.articles.liked.find((a) => a.id === +articleId!)) {
			setIsLiked(true);
		}
	}, [data.user]);

	if (!article) {
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
			<VStack w="100%" spacing={{ base: '24px', md: '32px', lg: '40px' }} align="start">
				<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
					<HStack>
						<Badge
							colorScheme="pink"
							variant={isLiked ? 'solid' : 'outline'}
							fontSize={{ base: 'small', lg: 'md' }}
							cursor="pointer"
							borderRadius="xsm"
							onClick={uiLikeArticle}
						>
							{isLiked ? <CheckIcon /> : <CloseIcon />} Favoris
						</Badge>
						<Badge fontSize={{ base: 'small', lg: 'md' }} cursor="pointer" borderRadius="xsm" onClick={onOpen}>
							<AddIcon /> Dossier
						</Badge>
					</HStack>
					<VStack align="left" spacing="0px" w="100%">
						<Text variant="h3">{article.title}</Text>
						<HStack>
							// TODO: topic
							<Badge colorScheme="red" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
								Topic
							</Badge>
							<Badge
								colorScheme="green"
								fontSize={{ base: 'small', lg: 'md' }}
								borderRadius="xsm"
								// onClick={toggleLikeChartDisplay}
								cursor={'pointer'}
							>
								{article.likeCounter} like{article.likeCounter !== 1 && 's'}
							</Badge>
							<Badge
								colorScheme="blue"
								fontSize={{ base: 'small', lg: 'md' }}
								borderRadius="xsm"
								cursor="pointer"
								// onClick={toggleViewChartDisplay}
							>
								{article.viewCounter} view{article.viewCounter !== 1 && 's'}
							</Badge>
						</HStack>
						{/* <Grid
							templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
							gap={{ base: 2, lg: 4 }}
							w="100%"
						>
							<Collapse in={isLikeChartDisplayed} animateOpacity>
								<Chart yLabel="Likes" data={article.DailyLikes} />
							</Collapse>
							<Collapse in={isViewChartDisplayed} animateOpacity>
								<Chart yLabel="Vues" data={article.DailyViews} />
							</Collapse>
						</Grid> */}
					</VStack>
					<Text variant="p" whiteSpace="pre-line">
						{article.content}
					</Text>
				</VStack>
				<VStack align="left" spacing="0px" w="100%">
					// TODO: name author
					<Text variant="h6">Écrit par {article.authorId}</Text>
					<Text variant="p">{frenchDate(new Date(article.createdAt))}</Text>
				</VStack>
			</VStack>

			<AnthologiesModal
				isOpen={isOpen}
				onClose={onClose}
				anthologies={data.user.anthologies}
				createAnthology={uiCreateAnthology}
				action={uiAddArticleToAnthology}
			/>
		</>
	);
};

export default ArticlePage;
