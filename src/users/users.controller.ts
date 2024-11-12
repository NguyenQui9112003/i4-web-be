import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { userDTO } from '../DTOs/userDTO';
import { UsersService } from '../users/users.service';

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async signUp(@Body() user: userDTO) {
        try {
            console.log(user);
            return await this.usersService.register(user);
        } catch (error) {
            throw new BadRequestException('Điều tệ xảy ra với yêu cầu', {
                cause: new Error(),
                description: 'Không thể đăng kí tài khoản',
            });
        }
    }
}
