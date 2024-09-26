import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Link,
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
import { CheckIcon, CloseIcon, SpinnerIcon } from '@chakra-ui/icons';

import { useUserContext } from 'contexts/user';
import { useOnlineUserContext } from 'contexts/onlineUser';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { useUIContext } from 'contexts/ui';
import FormInput from 'components/Inputs/FormInput';

const steps = [
	{ title: 'Introduction', description: 'Livre blanc' },
	{ title: 'Paramètres', description: 'Accès IPFS' },
	{ title: 'Rafraîchissement', description: 'Récupération des articles' },
	{ title: 'Confirmation', description: 'Profil hors-ligne' },
];

// TODO: cut this component
const Settings = (): JSX.Element => {
	const ui = useUIContext();
	const user = useUserContext();
	const onlineUser = useOnlineUserContext();
	const offlineUser = useOfflineUserContext();
	const toast = useToast();
	const navigate = useNavigate();
	const [isCensored, setIsCensored] = useState<boolean | undefined>(undefined);
	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [isGatewayWorking, setIsGatewayWorking] = useState<true | false | 'loading'>(false);
	const [isRefreshWorking, setIsRefreshWorking] = useState<true | false | 'loading'>(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const horizontalStepper = useBreakpointValue({ base: false, '3xl': true });

	const { activeStep, setActiveStep } = useSteps({
		index: offlineUser.data.config.step,
		count: steps.length,
	});

	const testCensorship = async () => {
		try {
			const res = await onlineUser.methods.user.me();
			if (res.code === -1) setIsCensored(true);
			else setIsCensored(false);
		} catch (error) {
			console.error(error);
		}
	};

	const testGateway = async () => {
		setTimeLeft(30);
		try {
			setIsGatewayWorking('loading');
			const test = await offlineUser.methods.config.testGateway();
			setIsGatewayWorking(test);
		} catch (error) {
			setIsGatewayWorking(false);
			console.error(error);
		}
	};

	// TODO: Annoying as it needs to be executed each refresh
	const refresh = async () => {
		setTimeLeft(30);
		try {
			setIsRefreshWorking('loading');
			const load = await offlineUser.methods.articles.loadCatalog();
			console.log(offlineUser.articlesCatalog);
			setIsRefreshWorking(load);
		} catch (error) {
			setIsRefreshWorking(false);
			console.error(error);
		}
	};

	const downloadProfil = () => {
		const element = document.createElement('a');
		const file = new Blob([JSON.stringify(offlineUser.data, null, '\t')], { type: 'application/json' });
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
					console.log(content);
					offlineUser.methods.data.upload(content);
					toast({
						status: 'success',
						title: 'Profil chargé !',
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

	useEffect(() => {
		testGateway();
	}, [offlineUser.data.config.gateway]);

	useEffect(() => {
		offlineUser.methods.config.setStep(activeStep);
	}, [activeStep]);

	useEffect(() => {
		if (timeLeft === 0) return;
		const intervalId = setInterval(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);
		return () => clearInterval(intervalId);
	}, [timeLeft]);

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
											Au cœur d'Anthologia se trouve une vision audacieuse: créer un écosystème journalistique
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
											{/* TODO: use something else than google doc */}
											Pour plus d'information, lisez notre{' '}
											<Link
												href="https://docs.google.com/document/d/11RIsW4aiMNqTvEdjwzu6p3mA6TN_FH0gSYrbj699pds/edit?usp=sharing"
												isExternal
											>
												<u>Livre Blanc</u>
											</Link>
											.
										</Text>
										<Text variant="p" textAlign="justify" cursor="pointer" onClick={testCensorship}>
											Pour savoir si vous êtes censuré, cliquez{' '}
											<b>
												<u>ici</u>
											</b>
											.
										</Text>
										{isCensored === true && (
											<Text variant="link">
												Vous êtes censuré, cliquez sur le bouton "Suivant" en bas de page pour configurer et activer le
												mode
												<i>hors-ligne</i>.
											</Text>
										)}
										{isCensored === false && (
											<Text variant="p">
												Vous n'êtes pas censuré, nous vous conseillons de ne pas aller plus loin afin de garder accès à
												toutes les fonctionnalités. Libre à vous cependant de continuer and cliquant sur le bouton
												"Suivant" en bas de pas pour configurer et tester le mode <i>hors-ligne</i>.
											</Text>
										)}
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
												<Link href="https://ipfs.github.io/public-gateway-checker/" isExternal>
													<b>
														<u>ici</u>
													</b>
												</Link>
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
												<Link href="https://docs.ipfs.tech/how-to/desktop-app/#install-ipfs-desktop" isExternal>
													<b>
														<u>ici</u>
													</b>
												</Link>
												.
											</Text>
										</VStack>
										<VStack align="start" w="100%" spacing="16px">
											<Text variant="link">
												Tester une <i>gateway</i> IPFS
											</Text>
											<Text variant="p" textAlign="justify">
												Si vous utilisez une <i>gateway</i> publique, renseignez son url. Si vous utilisez une{' '}
												<i>gateway</i> privée, renseigner le point d'accès de votre noeud IPFS (trouvable dans les
												réglages).
											</Text>
											{/* TODO: redirect here if there is an IPFS problem somewhere else */}
											<InputGroup>
												<Input
													variant="primary-1"
													placeholder="https://ipfs.io"
													value={offlineUser.data.config.gateway}
													onChange={(e) => {
														console.log(e.target.value);
														offlineUser.methods.config.setGateway(e.target.value);
													}}
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
										<Button
											variant="primary-purple"
											maxW="240px"
											onClick={() => setActiveStep(2)}
											isDisabled={!isGatewayWorking}
										>
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
										<Button
											variant="primary-purple"
											maxW="240px"
											onClick={() => setActiveStep(4)}
											isDisabled={!isRefreshWorking}
										>
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
												nécéssaire afin de fluidifier au maximum votre interaction avec Anthologia. Pour finir, les
												données entre compte en-ligne et compte hors-ligne ne sont pas partagées: un changement sur le
												compte en-ligne n'est valable que pour le compte en-ligne; un changement sur le compte
												hors-ligne n'est valable que pour le compte hors-ligne.
											</Text>
											<Text variant="p" textAlign="justify">
												Il est donc conseillé d'utiliser le mode hors-ligne uniquement en cas de censure, ou bien pour
												satisfaire votre curiosité envers cette fonctionnalité.
											</Text>
											<Text variant="p" textAlign="justify">
												Pour confirmer votre utilisation du mode hors-ligne, veuillez cliquer sur le bouton ci-dessous.
												Il vous suffit de re-cliquer dessus retourner au mode en-ligne.
											</Text>
											<Button
												variant="primary-yellow"
												onClick={async () => {
													// TODO: verify with backend the user is redirected if not already login
													if (user.data.isOffline) await ui.online.user.me();
													user.methods.toggleIsOfflineState();
												}}
											>
												{user.data.isOffline ? 'Mode hors-ligne sélectionné' : 'Mode en-ligne sélectionné'}
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
							<Button variant="primary-orange" onClick={async () => await ui.online.auth.sign.out(() => navigate('/'))}>
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
