import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  task: string
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
  
}