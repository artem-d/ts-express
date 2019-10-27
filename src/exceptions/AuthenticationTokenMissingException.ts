import HttpException from './HttpException';

class AuthenticationTokenMissingException extends HttpException {
    constructor() {
        super(401, 'AuthenticationTokenMissingException');
    }
}

export default AuthenticationTokenMissingException;
