import { get } from 'env-var';

const env = (name: string, required = true) => get(name).required(required);

const HOST = env('REACT_APP_HOST', false).default('localhost').asString();
const PORT = env('REACT_APP_PORT', false).default('3000').asPortNumber();
const BACKEND_URL = env('REACT_APP_BACKEND_URL', false).default('http://localhost:8080').asString();

export { HOST, PORT, BACKEND_URL };
