import * as dotenv from 'dotenv';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import PostsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';

dotenv.config();
validateEnv();

const controllers = [
    new AuthenticationController(),
    new PostsController(),
]

const app = new App(controllers);

app.listen();
