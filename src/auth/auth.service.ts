import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../schemas/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UsersModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection,
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        let user_no_token;

        // Tìm người dùng qua email
        try {
            user_no_token = await this.UsersModel.findOne({email}).exec();
            if (!user_no_token) {
                throw new UnauthorizedException('Không tìm thấy tài khoản');
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Server error');
        }

        // Kiểm tra mật khẩu
        try {
            const check_pass = await bcrypt.compare(password, user_no_token.password);
            if (!check_pass) {
                throw new UnauthorizedException('Sai mật khẩu');
            }
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        // Tạo JWT token
        const payload = { sub: user_no_token._id, username: user_no_token.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
