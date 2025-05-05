import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@InputType()
export class UpdateRolePayload {
  @ApiProperty({ example: 'Менеджер', required: false, description: 'Новое название роли' })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  label?: string;

  @ApiProperty({ example: 'Роль с ограниченным доступом', required: false, description: 'Новое описание роли' })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @ApiProperty({ example: 'manager-icon', required: false, description: 'Новая иконка роли' })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  icon?: string;

  @ApiProperty({ example: true, required: false, description: 'Может ли роль обновлять все настройки' })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  canUpdateAllSettings?: boolean;

  @ApiProperty({ example: true, required: false, description: 'Может ли роль читать все записи объектов' })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  canReadAllObjectRecords?: boolean;

  @ApiProperty({ example: true, required: false, description: 'Может ли роль обновлять все записи объектов' })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  canUpdateAllObjectRecords?: boolean;

  @ApiProperty({ example: true, required: false, description: 'Может ли роль мягко удалять все записи объектов' })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  canSoftDeleteAllObjectRecords?: boolean;

  @ApiProperty({ example: false, required: false, description: 'Может ли роль полностью удалять все записи объектов' })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  canDestroyAllObjectRecords?: boolean;
}

@InputType()
export class UpdateRoleInput {
  @ApiProperty({ example: 'c0a80123-4567-890a-bcde-f0123456789a', description: 'Идентификатор обновляемой роли' })
  @IsNotEmpty()
  @Field(() => UUIDScalarType, {
    description: 'The id of the role to update',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: 'Данные для обновления роли' })
  @Field(() => UpdateRolePayload)
  update: UpdateRolePayload;
}
