import { get } from 'env-var';

const env = (name: string, required = true) => get(name).required(required);

const HOST = env('REACT_APP_HOST').asString();
const PORT = env('REACT_APP_PORT').asPortNumber();
const BACKEND_URL = env('REACT_APP_BACKEND_URL').asString();

export { HOST, PORT, BACKEND_URL };
