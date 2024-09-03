import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	Switch,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
	useBreakpointValue,
	useSteps,
	useToast,
} from '@chakra-ui/react';

import { Article } from 'types/article';
import { useIpfsContext } from 'contexts/ipfs';
import { useUserContext } from 'contexts/user';
import { useAuthContext } from 'contexts/auth';
import { useUIContext } from 'contexts/ui';
import FormInput from 'components/Inputs/FormInput';
import { CheckIcon, CloseIcon, SpinnerIcon } from '@chakra-ui/icons';

// TODO: attention déconnexion quand user pas mode hors-ligne

const steps = [
	{ title: 'Introduction', description: 'Livre blanc' },
	{ title: 'Paramètres', description: 'Accès IPFS' },
	{ title: 'Rafraîchissement', description: 'Récupération des articles' },
	{ title: 'Confirmation', description: 'Profil hors-ligne' },
];

const Settings = (): JSX.Element => {
	const auth = useAuthContext();
	const user = useUserContext();
	const navigate = useNavigate();
	const { handleToast } = useUIContext();
	const { ipfs, setArticles, setGateway, getIPFSFile } = useIpfsContext();
	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [isGatewayWorking, setIsGatewayWorking] = useState<true | false | 'loading'>(false);
	const [isRefreshWorking, setIsRefreshWorking] = useState<true | false | 'loading'>(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const horizontalStepper = useBreakpointValue({ base: false, '3xl': true });
	const toast = useToast();

	const { activeStep, setActiveStep } = useSteps({
		index: 0,
		count: steps.length,
	});

	const testGateway = async () => {
		setTimeLeft(30);
		const cid = 'Qmf8e9tCBH62GNKwYc6jypzqf5hcP5L61SMdZVBVFiqSip';
		try {
			setIsGatewayWorking('loading');
			const file = await getIPFSFile<{ message: string }>(cid);
			setIsGatewayWorking(file.message === 'OK');
			console.log(file);
		} catch (error) {
			setIsGatewayWorking(false);
			console.error(error);
		}
	};

	const refresh = async () => {
		setTimeLeft(30);
		const cid = 'QmdpUHUNR2wwkE1gXb3i7ZA62MjMy9v2ykFM6endBMfFPn';
		try {
			setIsRefreshWorking('loading');
			const file = await getIPFSFile<{ message: string; articles: Article[] }>(cid);
			setIsRefreshWorking(file.message === 'OK');
			console.log(file);
			setArticles(file.articles);
			setIsRefreshWorking(true);
		} catch (error) {
			setIsRefreshWorking(false);
			console.error(error);
		}
	};

	const downloadProfil = () => {
		const element = document.createElement('a');
		const file = new Blob([JSON.stringify(user, null, '\t')], { type: 'application/json' });
		element.href = URL.createObjectURL(file);
		element.download = 'profil.json';
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	};

	const uploadProfil = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			reader.onload = async (e: any) => {
				try {
					const content = JSON.parse(e.target.result);
					user.methods.user.upload(content);
					toast({
						status: 'success',
						title: 'Profil chargé!',
						duration: 5000,
						isClosable: true,
					});
				} catch (error) {
					console.error(error);
					toast({
						status: 'error',
						title: 'Fichier non valide.',
						description: 'Syntaxe non conforme.',
						duration: 5000,
						isClosable: true,
					});
				}
			};
			reader.readAsText(file);
		}
	};

	const deconnect = async () => {
		try {
			const res = await auth.methods.sign.out();
			handleToast(res, true);
			if (res.status === 'success') {
				navigate('/');
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		testGateway();
	}, [ipfs.config.gateway]);

	useEffect(() => {
		if (timeLeft === 0) return;
		const intervalId = setInterval(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);
		return () => clearInterval(intervalId);
	}, [timeLeft]);

	useEffect(() => {
		if (ipfs.config.gateway === undefined) {
			setGateway('http://localhost:8080');
		}
		testGateway();
		refresh();
	}, []);

	return (
		<>
			<Tabs isFitted variant="enclosed">
				<TabList>
					<Tab>Mode hors-ligne</Tab>
					<Tab isDisabled>Profil utilisateur</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<Stepper
							mt="24px"
							mb="56px"
							index={activeStep}
							orientation={horizontalStepper ? 'horizontal' : 'vertical'}
							height={horizontalStepper ? '64px' : '240px'}
							gap="0"
						>
							{steps.map((step, index) => (
								<Step key={index}>
									<StepIndicator>
										<StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
									</StepIndicator>

									<Box flexShrink="0">
										<StepTitle>{step.title}</StepTitle>
										<StepDescription>{step.description}</StepDescription>
									</Box>

									<StepSeparator />
								</Step>
							))}
						</Stepper>
						<VStack align="center" w="100%">
							{activeStep === 0 && (
								<VStack align="end" justify="center" w="100%" maxW="720px" spacing="48px">
									<VStack align="start" w="100%">
										<Text variant="h6">
											Qu'est ce que le mode <i>hors-ligne</i> ?
										</Text>
										<Text variant="p" textAlign="justify">
											Dans un paysage médiatique de plus en plus menacé par la censure et les pressions politiques,
											Anthologia se dresse comme un phare d'espoir pour la liberté de la presse.
										</Text>
										<Text variant="p" textAlign="justify">
											Au cœur d'Anthologia se trouve une vision audacieuse : créer un écosystème journalistique
											incensurable, capable de résister aux tentatives les plus acharnées de museler la liberté
											d'expression.
										</Text>
										<Text variant="p" textAlign="justify">
											Pour réaliser cette ambition, le projet s'appuie sur la technologie IPFS (InterPlanetary File
											System), une infrastructure de pointe qui repense fondamentalement la façon dont les données sont
											stockées et partagées sur internet.
										</Text>
										<Text variant="p" textAlign="justify">
											Le mode <i>hors-ligne</i> s'appuie sur cette technologie. Au lieu de récupérer la donnée de
											manière "classique", le mode <i>hors-ligne</i> va la récupérer via IPFS.
										</Text>
										<Text variant="p" textAlign="justify">
											Donc dans le cas où vous êtes censuré, autrement dit si une personne / un groupe / un gouvernement
											vous bloque l'accès à Anthologia, vous pouvez toujours grâce au mode <i>hors-ligne</i> lire
											librement tous les articles publiés. Cependant, vous ne pouvez pas encore écrire d'article.
										</Text>
										<Text variant="link" textAlign="justify">
											Pour plus d'information, lisez notre <u>Livre Blanc</u>.
										</Text>
										<Text variant="p" textAlign="justify">
											Pour savoir si vous êtes censuré, cliquez{' '}
											<b>
												<u>ici</u>
											</b>
											.
										</Text>
										<Text variant="link">
											Vous êtes censuré, cliquez sur le bouton "Suivant" en bas de page pour configurer et activer le
											mode
											<i>hors-ligne</i>.
										</Text>
										{/* <Text variant="p">
											Vous n'êtes pas censuré, nous vous conseillons de ne pas aller plus loin afin de garder accès à
											toutes les fonctionnalités. Libre à vous cependant de continuer and cliquant sur le bouton
											"Suivant" en bas de pas pour configurer et tester le mode <i>hors-ligne</i>.
										</Text> */}
									</VStack>
									<Button variant="primary-purple" maxW="240px" onClick={() => setActiveStep(1)}>
										Suivant
									</Button>
								</VStack>
							)}
							{activeStep === 1 && (
								<VStack align="start" justify="center" w="100%" maxW="720px" spacing="48px">
									<VStack align="start" w="100%" spacing="24px">
										<VStack align="start" w="100%">
											<Text variant="h6">
												Qu'est ce qu'une <i>gateway</i> IPFS ?
											</Text>
											<Text variant="p" textAlign="justify">
												Une <i>gateway</i> signifie "porte" en anglais. Pour accèder à IPFS, vous devez donc préciser
												une porte d'entrée à ce réseau. Vous avez deux options: choisir une <i>gateway</i> publique ou
												bien choisir votre <i>gateway</i> privée.
											</Text>
											<Text variant="p" textAlign="justify">
												Une <i>gateway</i> publique est un point d'accès publique à IPFS: d'autres personnes peuvent
												utiliser la même porte et ce n'est pas vous qui êtes responsable de la maintenir ouverte. Il est
												donc plus facile d'utiliser une <i>gateway</i> publique qu'une <i>gateway</i> privée. Cependant,
												une <i>gateway</i> publique n'est pas la plus rapide d'accès à IPFS et peut facilement être
												censurée. Il n'est également pas rare qu'une <i>gateway</i> ne soit plus accessible par certain
												moments: ce n'est pas vous qui la maintenez ouverte.
											</Text>
											<Text variant="p" textAlign="justify">
												Pour avoir une liste de <i>gateways</i> publiques, cliquez{' '}
												<b>
													<u>ici</u>
												</b>
												.
											</Text>
											<Text variant="p" textAlign="justify">
												Une <i>gateway</i> privée en revanche est un point d'accès privé à IPFS: seul vous pouvez
												utiliser cette porte. Vous êtes alors responsable de la maintenir ouverte. Pour ce faire, vous
												devez faire tourner un noeud IPFS sur votre ordinateur. Il est donc légèrement plus difficile
												d'utiliser une <i>gateway</i> privée qu'une <i>gateway</i> publique. Cependant, une{' '}
												<i>gateway</i> privée est plus rapide (vous êtes le seul utilisateur) et ne peut pas être
												censurée. Vous et seulement vous décidez d'ouvrir ou fermer la porte.
											</Text>
											<Text variant="p" textAlign="justify">
												Pour comprendre comment faire tourner un noeud IPFS, cliquez{' '}
												<b>
													<u>ici</u>
												</b>
												.
											</Text>
										</VStack>
										<VStack align="start" w="100%" spacing="16px">
											<Text variant="link">
												Tester une <i>gateway</i> IPFS
											</Text>
											<Text variant="p" textAlign="justify">
												Si vous utilisez une <i>gateway</i> publique, renseignez son url. Si vous utilisez une{' '}
												<i>gateway</i> privée, renseigner le point d'accès à votre noeud IPFS (trouvable dans les
												réglages).
											</Text>
											<InputGroup>
												<Input
													variant="primary-1"
													placeholder="https://ipfs.io"
													value={ipfs.config.gateway}
													onChange={(e) => setGateway(e.target.value)}
												/>
												<InputRightElement w={isGatewayWorking === 'loading' ? '80px' : '48px'}>
													{isGatewayWorking === 'loading' ? (
														<HStack>
															<Text variant="link">{timeLeft}s</Text>
															<SpinnerIcon color="orange" />
														</HStack>
													) : isGatewayWorking ? (
														<CheckIcon color="green.500" />
													) : (
														<CloseIcon color="red.500" />
													)}
												</InputRightElement>
											</InputGroup>
										</VStack>
									</VStack>
									<HStack w="100%" justify="space-between">
										<Button variant="primary-purple" maxW="240px" onClick={() => setActiveStep(0)}>
											Précédent
										</Button>
										<Button variant="primary-purple" maxW="240px" onClick={() => setActiveStep(2)}>
											Suivant
										</Button>
									</HStack>
								</VStack>
							)}
							{activeStep === 2 && (
								<VStack align="start" justify="center" w="100%" maxW="720px" spacing="48px">
									<VStack align="start" w="100%" spacing="24px">
										<VStack align="start" w="100%">
											<Text variant="h6">Récupérer les données sur IPFS</Text>
											<Text variant="p" textAlign="justify">
												Maintenant que vous avez accès à IPFS, il est temps de récupérer les articles publiés étants
												stockés sur IPFS. Pour ce faire, il vous suffit de cliquer sur le bouton "Rafraîchir"
												ci-dessous.
											</Text>
											<Text variant="p" textAlign="justify">
												Pour rester à jour, il vous est conseillé de rafraîchir les données à chaque connexion ou bien
												toutes les heures si vous restez connecté longtemps.
											</Text>
											<Text variant="p" textAlign="justify">
												Notez que cette action ne récupère pas le contenu des articles, mais leurs titres, catégories,
												dates, etc ... Le contenu d'un article sera récupéré uniquement lorsqu'il sera nécéssaire afin
												de fluidifier au maximum votre interaction avec Anthologia.
											</Text>
										</VStack>
										<VStack align="start" w="100%" spacing="8px">
											<Button
												variant="primary-purple"
												onClick={refresh}
												isDisabled={isRefreshWorking === 'loading'}
												isLoading={isRefreshWorking === 'loading'}
											>
												Rafraîchir
											</Button>
											{isRefreshWorking === 'loading' ? (
												<HStack>
													<Text variant="p" color="orange !important">
														Rafraîchissement en cours, {timeLeft}s
													</Text>
													<SpinnerIcon color="orange" />
												</HStack>
											) : isRefreshWorking ? (
												<HStack>
													<Text variant="p" color="green !important">
														Rafraîchissement réussi !
													</Text>
													<CheckIcon color="green.500" />
												</HStack>
											) : (
												<HStack>
													<Text variant="p" color="red !important">
														Rafraîchissement échoué, re-testez votre gateway.
													</Text>
													<CloseIcon color="red.500" />
												</HStack>
											)}
										</VStack>
									</VStack>
									<HStack w="100%" justify="space-between">
										<Button variant="primary-purple" maxW="240px" onClick={() => setActiveStep(1)}>
											Précédent
										</Button>
										<Button variant="primary-purple" maxW="240px" onClick={() => setActiveStep(4)}>
											Suivant
										</Button>
									</HStack>
								</VStack>
							)}
							{activeStep === 4 && (
								<VStack align="start" justify="center" w="100%" maxW="720px" spacing="48px">
									<VStack align="start" w="100%" spacing="24px">
										<VStack align="start" w="100%">
											<Text variant="h6">Profil hors-ligne</Text>
											<Text variant="link" textAlign="justify">
												Votre connexion à IPFS est complète !
											</Text>
											<Text variant="p" textAlign="justify">
												Si vous souhaitez rafraîchir les données, veuillez cliquer sur le bouton "Précédent". Pour
												rappel, dans le but de rester à jour il vous est conseillé de rafraîchir les données à chaque
												connexion ou bien toutes les heures si vous restez connecté longtemps.
											</Text>
											<Text variant="p" textAlign="justify">
												N'oubliez pas qu'en utilisant le mode hors-ligne, certaines actions ne sont pas disponibles
												comme la publication d'articles par exemple. Notez également qu'accèder à certains articles peut
												être parfois long (environ 30 secondes), puisque leur contenu n'est récupéré uniquement lorsque
												nécéssaire afin de fluidifier au maximum votre interaction avec Anthologia.
											</Text>
											<Text variant="p" textAlign="justify">
												Il est donc conseillé d'utiliser le mode hors-ligne uniquement en cas de censure, ou bien pour
												satisfaire votre curiosité envers cette fonctionnalité.
											</Text>
											<Text variant="p" textAlign="justify">
												Pour confirmer votre utilisation du mode hors-ligne, veuillez cliquer sur le bouton ci-dessous.
												Il vous suffit de re-cliquer dessus retourner au mode en-ligne.
											</Text>
											<Button variant="primary-yellow" onClick={user.methods.user.toggleIsOfflineState}>
												{user.data.user.isOffline ? 'Mode hors-ligne sélectionné' : 'Mode en-ligne sélectionné'}
											</Button>
										</VStack>
										<Text variant="p" textAlign="justify">
											Certaines interactions comme la création de dossiers, d'articles aimés, ... est également stocké
											localement dans votre navigateur. Vous avez la possibilité de télécharger cette donnée appelée
											votre "profil hors-ligne". Ainsi, vous pouvez téléverser sur n'importe appareil ce fichier pour
											retrouver votre profil, dans le cas où vous utilisez le mode hors-ligne.
										</Text>
										<HStack>
											<Button variant="primary-yellow" onClick={downloadProfil}>
												Télécharger mon profil
											</Button>
											<VStack align="start" spacing="8px" w="100%">
												<Text variant="link">Téléverser mon profil</Text>
												<Input h="100%" type="file" variant="file-primary-orange" onChange={uploadProfil} />
											</VStack>
										</HStack>
									</VStack>
									<HStack w="100%" align="start">
										<Button variant="primary-purple" maxW="240px" onClick={() => setActiveStep(2)}>
											Précédent
										</Button>
									</HStack>
								</VStack>
							)}
						</VStack>
					</TabPanel>
					<TabPanel>
						<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
							<FormControl display={'flex'} alignItems={'center'}>
								<FormLabel htmlFor="profile-status" mb="0">
									<Text variant={'h7'}>Profil public</Text>
								</FormLabel>
								<Switch id="status" size="lg" />
							</FormControl>
							<Text variant={'h5'}>Nom d'utilisateur</Text>
							<FormInput
								value={password}
								inputId="password-input"
								w="100%"
								placeholder="Nouveau nom d'utilisateur"
								onChange={(e) => setPassword(e.target.value)}
								variant="primary-1"
								isError={false}
								errorMessage=""
							/>
							<Button>Modifier</Button>
							<Text variant={'h5'}></Text>
							<Text variant={'h5'}>Mot de passe</Text>
							<FormInput
								value={password}
								inputId="password-input"
								w="100%"
								placeholder="Mot de passe"
								onChange={(e) => setPassword(e.target.value)}
								variant="primary-1"
								isError={false}
								errorMessage=""
							/>
							<FormInput
								value={newPassword}
								inputId="new-password-input"
								w="100%"
								placeholder="Nouveau mot de passe"
								onChange={(e) => setNewPassword(e.target.value)}
								variant="primary-1"
								isError={false}
								errorMessage=""
							/>
							<Button>Modifier</Button>
							<Button variant="primary-orange" onClick={deconnect}>
								Déconnexion
							</Button>
						</VStack>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

export default Settings;
