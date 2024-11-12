import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards, BadRequestException
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('signIn')
    async signIn(@Body() body: {email: string, password: string}): Promise<any> {
        const { email, password } = body;

        try {
            const token = await this.authService.signIn(email, password);
            return token;
        } catch (error) {
            throw new BadRequestException('Điều tệ xảy ra với yêu cầu', {
                cause: new Error(), 
                description: 'Đăng nhập thất bại',
            });
        }
    };

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}