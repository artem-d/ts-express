import * as mongoose from 'mongoose';
import IUser from './user.interface';

const addressSchema = new mongoose.Schema({
    city: String,
    street: String,
})

const userSchema = new mongoose.Schema({
    address: addressSchema,
    email: String,
    name: String,
    password: String,
});

const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

export default userModel;
