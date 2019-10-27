import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();
        this.initMiddleware();
        this.initControllers(controllers);
        this.initErrorHandling();
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private initMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private connectToTheDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;

        const uri: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}?useUnifiedTopology=true&w=majority`;
        const options: mongoose.ConnectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        try {
            mongoose.connect(uri, options, (err) => {
                if (err) { throw err; }
                console.log('Database connection established');
            });
        } catch (err) {
            console.log('Error connecting to the database', err);
            process.exit(22);
        }
    }
}

export default App;
