import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ObjectPermissionEntity } from 'src/engine/metadata-modules/object-permission/object-permission.entity';
import { UserWorkspaceRoleEntity } from 'src/engine/metadata-modules/role/user-workspace-role.entity';
import { SettingPermissionEntity } from 'src/engine/metadata-modules/setting-permission/setting-permission.entity';

@Entity('role')
@Unique('IndexOnRoleUnique', ['label', 'workspaceId'])
export class RoleEntity {
  @ApiProperty({ example: 'c0a80123-4567-890a-bcde-f0123456789a', description: 'Уникальный идентификатор роли' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Администратор', description: 'Название роли' })
  @Column({ nullable: false })
  label: string;

  @ApiProperty({ example: true, description: 'Может ли роль обновлять все настройки' })
  @Column({ nullable: false, default: false })
  canUpdateAllSettings: boolean;

  @ApiProperty({ example: true, description: 'Может ли роль читать все записи объектов' })
  @Column({ nullable: false, default: false })
  canReadAllObjectRecords: boolean;

  @ApiProperty({ example: true, description: 'Может ли роль обновлять все записи объектов' })
  @Column({ nullable: false, default: false })
  canUpdateAllObjectRecords: boolean;

  @ApiProperty({ example: true, description: 'Может ли роль мягко удалять все записи объектов' })
  @Column({ nullable: false, default: false })
  canSoftDeleteAllObjectRecords: boolean;

  @ApiProperty({ example: false, description: 'Может ли роль полностью удалять все записи объектов' })
  @Column({ nullable: false, default: false })
  canDestroyAllObjectRecords: boolean;

  @ApiProperty({ example: 'Роль с полным доступом к системе', required: false, description: 'Описание роли' })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiProperty({ example: 'admin-icon', required: false, description: 'Иконка роли' })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ example: 'c0a80123-4567-890a-bcde-f0123456789a', description: 'ID рабочего пространства' })
  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: 'Дата обновления' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ example: true, description: 'Можно ли редактировать роль' })
  @Column({ nullable: false, default: true })
  isEditable: boolean;

  @ApiProperty({ type: () => [UserWorkspaceRoleEntity], description: 'Связи с пользователями рабочего пространства' })
  @OneToMany(
    () => UserWorkspaceRoleEntity,
    (userWorkspaceRole: UserWorkspaceRoleEntity) => userWorkspaceRole.role,
  )
  userWorkspaceRoles: Relation<UserWorkspaceRoleEntity[]>;

  @ApiProperty({ type: () => [ObjectPermissionEntity], description: 'Разрешения на объекты' })
  @OneToMany(
    () => ObjectPermissionEntity,
    (objectPermission: ObjectPermissionEntity) => objectPermission.role,
  )
  objectPermissions: Relation<ObjectPermissionEntity[]>;

  @ApiProperty({ type: () => [SettingPermissionEntity], description: 'Разрешения на настройки' })
  @OneToMany(
    () => SettingPermissionEntity,
    (settingPermission: SettingPermissionEntity) => settingPermission.role,
  )
  settingPermissions: Relation<SettingPermissionEntity[]>;
}
