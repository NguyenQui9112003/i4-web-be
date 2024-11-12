import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { userDTO } from '../DTOs/userDTO';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();
const salt_rounds = 7;


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UsersModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection,
    ) { }

    async register(user: userDTO): Promise<User | String> {
        var newUser = null;

        try {
            const inputEmail = await this.UsersModel.findOne({ email: user.email }).exec();
            if (inputEmail) {
                return "Email đã tồn tại";
            }
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        const hashed_pw = await bcrypt.hash(user.password, salt_rounds);

        try {
            newUser = await this.UsersModel.create({
                email: user.email,
                username: user.username,
                password: hashed_pw,
            });
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        const { email, username, ...data } = newUser.toObject();
        return { username, ...data };
    }
}

