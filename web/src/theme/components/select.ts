import text from './text';

const select = {
	variants: {
		'primary-1': {
			field: {
				_focus: {
					border: 'none',
					outline: 'solid 3px',
					outlineColor: 'primary.yellow',
					outlineOffset: '-2px',
				},
				borderRadius: 'sm',
				padding: '8px 16px',
				bg: 'gray.900',
				color: 'white',
				...text.variants.p,
			},
			icon: {
				color: 'white',
			},
		},
	},
};

export default select;
