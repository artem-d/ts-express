import * as mongoose from 'mongoose';
import IUser from './user.interface';

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
});

const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

export default userModel;
