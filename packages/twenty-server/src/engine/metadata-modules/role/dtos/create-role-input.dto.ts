import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Идентификатор роли', required: false })
  @Field({ nullable: true })
  id?: string;

  @IsString()
  @ApiProperty({ example: 'Администратор', description: 'Название роли' })
  @Field({ nullable: false })
  label: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Роль с полным доступом к системе', required: false, description: 'Описание роли' })
  @Field({ nullable: true })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'admin-icon', required: false, description: 'Иконка роли' })
  @Field({ nullable: true })
  icon?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, description: 'Может ли роль обновлять все настройки' })
  @Field({ nullable: true })
  canUpdateAllSettings?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, description: 'Может ли роль читать все записи объектов' })
  @Field({ nullable: true })
  canReadAllObjectRecords?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, description: 'Может ли роль обновлять все записи объектов' })
  @Field({ nullable: true })
  canUpdateAllObjectRecords?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, description: 'Может ли роль мягко удалять все записи объектов' })
  @Field({ nullable: true })
  canSoftDeleteAllObjectRecords?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false, description: 'Может ли роль полностью удалять все записи объектов' })
  @Field({ nullable: true })
  canDestroyAllObjectRecords?: boolean;
}
