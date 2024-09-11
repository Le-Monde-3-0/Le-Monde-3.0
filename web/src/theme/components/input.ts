import text from './text';

const input = {
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
		},
		'file-primary-orange': {
			field: {
				_focus: {
					border: 'none',
					outline: 'solid 3px',
					outlineColor: 'primary.yellow',
					outlineOffset: '-2px',
				},
				_hover: {
					opacity: '80%',
					transition: 'ease 0.5s',
				},
				borderRadius: 'md',
				padding: '8px 16px',
				bg: 'primary.orange',
				color: 'black',
				...text.variants.link,
			},
		},
	},
};

export default input;
