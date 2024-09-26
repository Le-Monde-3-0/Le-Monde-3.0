export type Handler<Type> = {
	code: number;
	status: 'error' | 'info' | 'warning' | 'success' | 'loading';
	message?: string;
	data?: Type;
};

export type UIHandling = {
	res: Handler<unknown>;
	settings: {
		showIfSuccess?: boolean;
		showIfNotSuccess?: boolean;
		showIfAuthError?: boolean;
	};
	messages: {
		1?: { message: string; subMessage?: string };
		2?: { message: string; subMessage?: string };
		3?: { message: string; subMessage?: string };
		200?: { message: string; subMessage?: string };
		201?: { message: string; subMessage?: string };
		400?: { message: string; subMessage?: string };
		401?: { message: string; subMessage?: string };
		404?: { message: string; subMessage?: string };
		409?: { message: string; subMessage?: string };
		500?: { message: string; subMessage?: string };
	};
};
