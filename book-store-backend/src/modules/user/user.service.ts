import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsersDto } from './dto/user-response.dto';
import { Role } from 'src/core/enums/role.enum';
import { BcryptUtil } from 'src/core/utils/bcrypt.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedUsersDto> {
    const offset = (page - 1) * limit;

    const whereCondition: FindOptionsWhere<User> = {};
    if (search) {
      whereCondition.fullName = Like(`%${search}%`);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });

    const data = users.map(user => UserResponseDto.fromEntity(user));

    return {
      
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return UserResponseDto.fromEntity(user);
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return UserResponseDto.fromEntity(user);
  }

  async create(fullName: string, email: string, password: string, phoneNumber?: string, role: Role = Role.USER): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await BcryptUtil.hash(password);

    // Create new user
    const user = this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    const savedUser = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(savedUser);
  }

  async update(id: string, fullName?: string, phoneNumber?: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Update user properties if provided
    if (fullName) {
      user.fullName = fullName;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    const updatedUser = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userRepository.remove(user);
  }
}