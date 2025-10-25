import { Role } from 'src/core/enums/role.enum';
import { BaseResponseDto } from 'src/core/dto/base.dto';
import { PaginatedDto } from 'src/core/dto/paginated.dto';
import { AutoExpose } from 'src/core/decorators/auto-expose.decorator';

@AutoExpose()
export class UserResponseDto extends BaseResponseDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedUsersDto extends PaginatedDto<UserResponseDto> {
}