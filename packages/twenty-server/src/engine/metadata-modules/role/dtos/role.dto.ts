import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { Relation } from 'typeorm';

import { WorkspaceMember } from 'src/engine/core-modules/user/dtos/workspace-member.dto';
import { ObjectPermissionDTO } from 'src/engine/metadata-modules/object-permission/dtos/object-permission.dto';
import { UserWorkspaceRoleEntity } from 'src/engine/metadata-modules/role/user-workspace-role.entity';
import { SettingPermissionDTO } from 'src/engine/metadata-modules/setting-permission/dtos/setting-permission.dto';

@ObjectType('Role')
export class RoleDTO {
  @ApiProperty({ example: 'c0a80123-4567-890a-bcde-f0123456789a', description: 'Уникальный идентификатор роли' })
  @Field({ nullable: false })
  id: string;

  @ApiProperty({ example: 'Администратор', description: 'Название роли' })
  @Field({ nullable: false })
  label: string;

  @ApiProperty({ example: 'Роль с полным доступом к системе', required: false, description: 'Описание роли' })
  @Field({ nullable: true })
  description: string;

  @ApiProperty({ example: 'admin-icon', required: false, description: 'Иконка роли' })
  @Field({ nullable: true })
  icon: string;

  @ApiProperty({ example: true, description: 'Можно ли редактировать роль' })
  @Field({ nullable: false })
  isEditable: boolean;

  @ApiProperty({ type: () => [UserWorkspaceRoleEntity], description: 'Связи с пользователями рабочего пространства' })
  @HideField()
  userWorkspaceRoles: Relation<UserWorkspaceRoleEntity[]>;

  @ApiProperty({ type: () => [WorkspaceMember], description: 'Участники рабочего пространства с этой ролью' })
  @Field(() => [WorkspaceMember], { nullable: true })
  workspaceMembers?: WorkspaceMember[];

  @ApiProperty({ example: true, description: 'Может ли роль обновлять все настройки' })
  @Field({ nullable: false })
  canUpdateAllSettings: boolean;

  @ApiProperty({ example: true, description: 'Может ли роль читать все записи объектов' })
  @Field({ nullable: false })
  canReadAllObjectRecords: boolean;

  @ApiProperty({ example: true, description: 'Может ли роль обновлять все записи объектов' })
  @Field({ nullable: false })
  canUpdateAllObjectRecords: boolean;

  @ApiProperty({ example: true, description: 'Может ли роль мягко удалять все записи объектов' })
  @Field({ nullable: false })
  canSoftDeleteAllObjectRecords: boolean;

  @ApiProperty({ example: false, description: 'Может ли роль полностью удалять все записи объектов' })
  @Field({ nullable: false })
  canDestroyAllObjectRecords: boolean;

  @ApiProperty({ type: () => [SettingPermissionDTO], description: 'Разрешения на настройки' })
  @Field(() => [SettingPermissionDTO], { nullable: true })
  settingPermissions?: SettingPermissionDTO[];

  @ApiProperty({ type: () => [ObjectPermissionDTO], description: 'Разрешения на объекты' })
  @Field(() => [ObjectPermissionDTO], { nullable: true })
  objectPermissions?: ObjectPermissionDTO[];
}
