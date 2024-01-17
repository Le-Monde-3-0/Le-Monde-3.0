import text from './text';

const defaultPrimary = {
	...text.variants.link,
	color: 'black',
	borderRadius: 'md',
	padding: '24px 32px',
	width: '100%',
	transition: 'ease 0.5s',
	_hover: {
		opacity: '80%',
		transition: 'ease 0.5s',
	},
};

const button = {
	variants: {
		'primary-black': {
			bg: 'black',
			...defaultPrimary,
		},
		'primary-white': {
			bg: 'white',
			...defaultPrimary,
			color: 'black',
		},
		'primary-yellow': {
			bg: 'yellow',
			...defaultPrimary,
		},
		'primary-blue': {
			bg: 'blue',
			...defaultPrimary,
		},
		'primary-purple': {
			bg: 'purple',
			...defaultPrimary,
		},
		'primary-orange': {
			bg: 'orange',
			...defaultPrimary,
		},
		// 'secondary-1': {
		// 	bg: 'secondary.1',
		// 	...text.variants.h6,
		// 	color: 'white',
		// 	borderRadius: 'sm',
		// 	padding: '8px 16px',
		// 	width: '100%',
		// },
		// 'secondary-2': {
		// 	bg: 'secondary.2',
		// 	...text.variants.h6,
		// 	color: 'white',
		// 	borderRadius: 'sm',
		// 	padding: '8px 16px',
		// 	width: '100%',
		// },
		// 'secondary-3': {
		// 	bg: 'secondary.3',
		// 	...text.variants.h6,
		// 	color: 'white',
		// 	borderRadius: 'sm',
		// 	padding: '8px 16px',
		// 	width: '100%',
		// },
		// 'secondary-4': {
		// 	bg: 'secondary.4',
		// 	...text.variants.h6,
		// 	borderRadius: 'sm',
		// 	padding: '8px 16px',
		// 	width: '100%',
		// },
	},
};

export default button;
