import text from './text';

const textarea = {
	variants: {
		'primary-1': {
			_focus: {
				border: 'none',
				outline: 'solid 3px',
				outlineColor: 'primary.yellow',
				outlineOffset: '-2px',
			},
			borderRadius: 'sm',
			padding: '10px 16px',
			bg: 'gray.900',
			color: 'white',
			...text.variants.p,
		},
	},
};

export default textarea;
