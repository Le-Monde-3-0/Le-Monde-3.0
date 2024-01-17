import text from './text';

const input = {
	variants: {
		'primary-1': {
			field: {
				_focus: {
					border: 'none',
					outline: 'solid 3px',
					outlineColor: 'yellow',
					outlineOffset: '-2px',
				},
				borderRadius: 'sm',
				padding: '8px 16px',
				bg: 'gray.900',
				color: 'white',
				...text.variants.p,
			},
		},
	},
};

export default input;
