import { Test, TestingModule } from '@nestjs/testing';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectPermissionService } from 'src/engine/metadata-modules/object-permission/object-permission.service';
import { RoleDTO } from 'src/engine/metadata-modules/role/dtos/role.dto';
import { RoleResolver } from 'src/engine/metadata-modules/role/role.resolver';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { SettingPermissionService } from 'src/engine/metadata-modules/setting-permission/setting-permission.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';

describe('RoleResolver', () => {
  let resolver: RoleResolver;
  let roleService: RoleService;
  let userRoleService: UserRoleService;
  let userWorkspaceService: UserWorkspaceService;
  let featureFlagService: FeatureFlagService;
  let objectPermissionService: ObjectPermissionService;
  let settingPermissionService: SettingPermissionService;
  let permissionsService: PermissionsService;

  const mockRoleService = {
    getWorkspaceRoles: jest.fn(),
    updateWorkspaceMemberRole: jest.fn(),
    createRole: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
  };

  const mockUserRoleService = {
    getUserRoles: jest.fn(),
    assignRolesToUser: jest.fn(),
    removeRoleFromUser: jest.fn(),
    assignRoleToUserWorkspace: jest.fn(),
    getRolesByUserWorkspaces: jest.fn().mockResolvedValue(new Map([['user-workspace-id', [{ id: 'role-id-1', label: 'Admin' }]]])),
    getWorkspaceMembersAssignedToRole: jest.fn().mockResolvedValue([]),
  };

  const mockUserWorkspaceService = {
    findOne: jest.fn(),
    getWorkspaceMemberOrThrow: jest.fn().mockResolvedValue({ id: 'workspace-member-id' }),
    getUserWorkspaceForUserOrThrow: jest.fn().mockResolvedValue({ id: 'user-workspace-id' }),
    getUserWorkspaceMemberOrThrow: jest.fn().mockResolvedValue({ id: 'user-workspace-member-id' }),
    getUserWorkspaceMembers: jest.fn().mockResolvedValue([]),
    getUserWorkspaceMemberByUserId: jest.fn().mockResolvedValue({ id: 'user-workspace-member-id' }),
    getUserWorkspaceMemberByEmail: jest.fn().mockResolvedValue({ id: 'user-workspace-member-id' }),
    getUserWorkspaceMembersByRole: jest.fn().mockResolvedValue([]),
    getUserWorkspaceMembersByEmail: jest.fn().mockResolvedValue([]),
    getUserWorkspaceMemberIds: jest.fn().mockResolvedValue([]),
  };

  const mockFeatureFlagService = {
    isFeatureEnabled: jest.fn(),
  };

  const mockObjectPermissionService = {
    upsertObjectPermissions: jest.fn(),
  };

  const mockSettingPermissionService = {
    upsertSettingPermissions: jest.fn(),
  };

  const mockPermissionsService = {
    isPermissionsV2Enabled: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleResolver,
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: UserRoleService,
          useValue: mockUserRoleService,
        },
        {
          provide: UserWorkspaceService,
          useValue: mockUserWorkspaceService,
        },
        {
          provide: FeatureFlagService,
          useValue: mockFeatureFlagService,
        },
        {
          provide: ObjectPermissionService,
          useValue: mockObjectPermissionService,
        },
        {
          provide: SettingPermissionService,
          useValue: mockSettingPermissionService,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    resolver = module.get<RoleResolver>(RoleResolver);
    roleService = module.get<RoleService>(RoleService);
    userRoleService = module.get<UserRoleService>(UserRoleService);
    userWorkspaceService = module.get<UserWorkspaceService>(UserWorkspaceService);
    featureFlagService = module.get<FeatureFlagService>(FeatureFlagService);
    objectPermissionService = module.get<ObjectPermissionService>(ObjectPermissionService);
    settingPermissionService = module.get<SettingPermissionService>(SettingPermissionService);
    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getRoles', () => {
    it('should return all roles for a workspace', async () => {
      const workspace = { id: 'workspace-id' } as Workspace;
      const mockRoles = [
        {
          id: 'role-id-1',
          label: 'Admin',
        },
        {
          id: 'role-id-2',
          label: 'Member',
        },
      ] as unknown as RoleDTO[];

      mockRoleService.getWorkspaceRoles.mockResolvedValue(mockRoles);

      const result = await resolver.getRoles(workspace);

      expect(mockRoleService.getWorkspaceRoles).toHaveBeenCalledWith(workspace.id);
      expect(result).toEqual(mockRoles);
    });
  });

  describe('updateWorkspaceMemberRole', () => {
    it('should update workspace member role', async () => {
      const workspace = { id: 'workspace-id' } as Workspace;
      const workspaceMemberId = 'workspace-member-id';
      const roleId = 'role-id-1';
      const updatorWorkspaceMemberId = 'updator-member-id';

      // Мокаем все необходимые методы для корректного прохождения
      mockUserWorkspaceService.getWorkspaceMemberOrThrow.mockResolvedValue({
        id: workspaceMemberId,
        userId: 'user-id-1',
      });
      mockUserWorkspaceService.getUserWorkspaceForUserOrThrow.mockResolvedValue({
        id: 'user-workspace-id',
        userId: 'user-id-1',
      });
      mockUserRoleService.assignRoleToUserWorkspace.mockResolvedValue(undefined);
      mockUserRoleService.getRolesByUserWorkspaces.mockResolvedValue(new Map([
        ['user-workspace-id', [{ id: roleId, label: 'Admin' }]],
      ]));

      const result = await resolver.updateWorkspaceMemberRole(
        workspace,
        workspaceMemberId,
        roleId,
        updatorWorkspaceMemberId,
      );

      expect(result).toEqual({
        id: workspaceMemberId,
        userWorkspaceId: 'user-workspace-id',
        roles: [{ id: roleId, label: 'Admin' }],
        userId: 'user-id-1',
      });
      expect(mockUserRoleService.assignRoleToUserWorkspace).toHaveBeenCalledWith({
        userWorkspaceId: 'user-workspace-id',
        workspaceId: workspace.id,
        roleId,
      });
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const workspace = { id: 'workspace-id' } as Workspace;
      const createRoleInput = {
        label: 'New Role',
        description: 'Description for new role',
        icon: 'role-icon',
        canUpdateAllSettings: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: false,
      };
      const mockCreatedRole = {
        id: 'new-role-id',
        ...createRoleInput,
        workspaceId: workspace.id,
        isEditable: true,
      };
      mockRoleService.createRole.mockResolvedValue(mockCreatedRole);
      mockPermissionsService.isPermissionsV2Enabled.mockResolvedValue(true);
      jest.spyOn(resolver as any, 'validatePermissionsV2EnabledOrThrow').mockResolvedValue(undefined);
      const result = await resolver.createOneRole(workspace, createRoleInput);
      expect(result).toEqual(mockCreatedRole);
      expect(mockRoleService.createRole).toHaveBeenCalledWith({
        workspaceId: workspace.id,
        input: createRoleInput,
      });
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const workspace = { id: 'workspace-id' } as Workspace;
      const updateRoleInput = {
        id: 'role-id',
        update: {
          label: 'Updated Role',
        },
      };
      const mockUpdatedRole = {
        id: 'role-id',
        label: 'Updated Role',
        workspaceId: workspace.id,
      };
      mockRoleService.updateRole.mockResolvedValue(mockUpdatedRole);
      mockPermissionsService.isPermissionsV2Enabled.mockResolvedValue(true);
      jest.spyOn(resolver as any, 'validatePermissionsV2EnabledOrThrow').mockResolvedValue(undefined);
      const result = await resolver.updateOneRole(workspace, updateRoleInput);
      expect(result).toEqual(mockUpdatedRole);
      expect(mockRoleService.updateRole).toHaveBeenCalledWith({
        workspaceId: workspace.id,
        input: updateRoleInput,
      });
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const workspace = { id: 'workspace-id' } as Workspace;
      const roleId = 'role-id';
      mockRoleService.deleteRole.mockResolvedValue(roleId);
      mockPermissionsService.isPermissionsV2Enabled.mockResolvedValue(true);
      jest.spyOn(resolver as any, 'validatePermissionsV2EnabledOrThrow').mockResolvedValue(undefined);
      const result = await resolver.deleteOneRole(workspace, roleId);
      expect(result).toBe(roleId);
      expect(mockRoleService.deleteRole).toHaveBeenCalledWith(roleId, workspace.id);
    });
  });
});
