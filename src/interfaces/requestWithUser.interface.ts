import { Request } from 'express';
import IUser from '../users/user.interface';

interface IRequestWithUser extends Request {
    user: IUser;
}

export default RequestWithUser;
