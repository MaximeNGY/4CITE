import {
  Controller,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Claims } from 'src/auth/rbac/claims.decorator';
import { Claim } from 'src/auth/rbac/claims.enum';
import { RbacGuard } from 'src/auth/rbac/rbac.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Claims(Claim.READ_OWN_USER)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
    type: UserDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getUserProfile(@Req() req: { user: { email: string } }) {
    return this.usersService.getUserByEmail(req.user.email);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Claims(Claim.READ_ANY_USER)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users',
    type: [UserDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
