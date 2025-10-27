import { Controller, Get, HttpCode, HttpStatus, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { UserService } from './user.service';
import { UserResponseDto, PaginatedUsersDto } from './dto/user-response.dto';
import { Public } from 'src/core/decorators/public.decorator';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  // @Roles(Role.ADMIN)
  @Public()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by full name' })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedUsersDto> {
    return await this.userService.findAll(page, limit, search);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserById(
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    return await this.userService.findOne(id);
  }
}