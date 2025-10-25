import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ 
    description: 'Token for password reset',
    type: String, 
    example: 'reset-token-uuid' 
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ 
    description: 'New password (minimum 6 characters)',
    type: String, 
    example: 'newpassword123' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}