import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { AppToken } from 'src/engine/core-modules/app-token/app-token.entity';
import { KeyValuePair } from 'src/engine/core-modules/key-value-pair/key-value-pair.entity';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import { UserWorkspace } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceMember } from 'src/engine/core-modules/user/dtos/workspace-member.dto';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';

registerEnumType(OnboardingStatus, {
  name: 'OnboardingStatus',
  description: 'Onboarding status',
});

@Entity({ name: 'user', schema: 'core' })
@ObjectType()
@Index('UQ_USER_EMAIL', ['email'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class User {
  @ApiProperty({ example: 'c0a80123-4567-890a-bcde-f0123456789a', description: 'Уникальный идентификатор пользователя' })
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Field()
  @Column({ default: '' })
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Field()
  @Column({ default: '' })
  lastName: string;

  @ApiProperty({ example: 'ivanov@example.com', description: 'Email пользователя' })
  @Field()
  @Column()
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false, description: 'URL аватара по умолчанию' })
  @Field({ nullable: true })
  @Column({ nullable: true })
  defaultAvatarUrl: string;

  @ApiProperty({ example: true, description: 'Подтверждён ли email' })
  @Field()
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: false, required: false, description: 'Отключён ли пользователь' })
  @Field({ nullable: true })
  @Column({ default: false })
  disabled: boolean;

  @ApiProperty({ example: 'ru', description: 'Локаль пользователя' })
  @Field()
  @Column({ default: 'ru' })
  locale: string;

  @ApiProperty({ example: ['workspace-uuid-1', 'workspace-uuid-2'], description: 'ID рабочих пространств пользователя' })
  @Field(() => [UserWorkspace])
  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.user)
  workspaces: Relation<UserWorkspace[]>;

  @ApiProperty({ example: 'admin', enum: ['admin', 'employee', 'partner', 'franchisee', 'guest'], description: 'Роль пользователя' })
  @Field()
  @Column({ default: 'employee' })
  role: string;

  @ApiProperty({ example: 'c0a80123-4567-890a-bcde-f0123456789a', description: 'ID арендатора (tenantId)' })
  @Field()
  @Column({ type: 'uuid' })
  tenantId: string;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z', description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: null, required: false, description: 'Дата удаления (если пользователь удалён)' })
  @DeleteDateColumn()
  deletedAt?: Date;

  @ApiProperty({ example: true, description: 'Может ли пользователь имитировать других пользователей' })
  @Field()
  @Column({ default: false })
  canImpersonate: boolean;

  @ApiProperty({ example: true, description: 'Может ли пользователь доступа к полной админ-панели' })
  @Field()
  @Column({ default: false })
  canAccessFullAdminPanel: boolean;

  @ApiProperty({ example: 'password-hash', required: false, description: 'Хеш пароля' })
  @Field({ nullable: true })
  @Column({ nullable: true })
  passwordHash: string;

  @OneToMany(() => AppToken, (appToken) => appToken.user, {
    cascade: true,
  })
  appTokens: Relation<AppToken[]>;

  @OneToMany(() => KeyValuePair, (keyValuePair) => keyValuePair.user, {
    cascade: true,
  })
  keyValuePairs: Relation<KeyValuePair[]>;

  @Field(() => WorkspaceMember, { nullable: true })
  workspaceMember: Relation<WorkspaceMember>;

  @Field(() => OnboardingStatus, { nullable: true })
  onboardingStatus: OnboardingStatus;

  @Field(() => Workspace, { nullable: true })
  currentWorkspace: Relation<Workspace>;

  @Field(() => UserWorkspace, { nullable: true })
  currentUserWorkspace?: Relation<UserWorkspace>;
}
