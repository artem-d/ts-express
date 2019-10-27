import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import IDataStoredInToken from '../interfaces/dataStoredInToken';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../users/user.model';

async function authMiddleware(req: IRequestWithUser, res: Response, next: NextFunction) {
    const cookies = req.cookies;

    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;

        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);

            if (!user) { next(new WrongAuthenticationTokenException()); }

            req.user = user;
            next();
        } catch (err) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;
