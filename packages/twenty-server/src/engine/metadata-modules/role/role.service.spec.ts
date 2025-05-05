import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserWorkspaceRoleEntity } from 'src/engine/metadata-modules/role/user-workspace-role.entity';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { WorkspacePermissionsCacheService } from 'src/engine/metadata-modules/workspace-permissions-cache/workspace-permissions-cache.service';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';

describe('RoleService', () => {
  let service: RoleService;
  let workspaceRepository: Repository<Workspace>;
  let roleRepository: Repository<RoleEntity>;
  let userWorkspaceRoleRepository: Repository<UserWorkspaceRoleEntity>;
  let userRoleService: UserRoleService;
  let workspacePermissionsCacheService: WorkspacePermissionsCacheService;

  const mockWorkspaceRepository = {
    findOne: jest.fn(),
  };

  const mockRoleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserWorkspaceRoleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockUserRoleService = {
    getUserRoles: jest.fn(),
    assignRolesToUser: jest.fn(),
    removeRoleFromUser: jest.fn(),
    getRolesByUserWorkspaces: jest.fn().mockResolvedValue(
      new Map().set('user-workspace-id', [{ id: 'role-id-1', label: 'Admin' }])
    ),
    getWorkspaceMembersAssignedToRole: jest.fn().mockResolvedValue([]),
    assignRoleToUserWorkspace: jest.fn(),
    getUserWorkspaceIdsAssignedToRole: jest.fn().mockResolvedValue(['user-workspace-1', 'user-workspace-2']),
  };

  const mockWorkspacePermissionsCacheService = {
    recomputeRolesPermissionsCache: jest.fn(),
  };

  const mockPermissionsService = {
    isPermissionsV2Enabled: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Workspace, 'core'),
          useValue: mockWorkspaceRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity, 'metadata'),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(UserWorkspaceRoleEntity, 'metadata'),
          useValue: mockUserWorkspaceRoleRepository,
        },
        {
          provide: UserRoleService,
          useValue: mockUserRoleService,
        },
        {
          provide: WorkspacePermissionsCacheService,
          useValue: mockWorkspacePermissionsCacheService,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    workspaceRepository = module.get<Repository<Workspace>>(
      getRepositoryToken(Workspace, 'core'),
    );
    roleRepository = module.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity, 'metadata'),
    );
    userWorkspaceRoleRepository = module.get<Repository<UserWorkspaceRoleEntity>>(
      getRepositoryToken(UserWorkspaceRoleEntity, 'metadata'),
    );
    userRoleService = module.get<UserRoleService>(UserRoleService);
    workspacePermissionsCacheService = module.get<WorkspacePermissionsCacheService>(
      WorkspacePermissionsCacheService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWorkspaceRoles', () => {
    it('should return all roles for a workspace', async () => {
      const workspaceId = 'workspace-id';
      const mockRoles = [
        {
          id: 'role-id-1',
          label: 'Admin',
          workspaceId,
        },
        {
          id: 'role-id-2',
          label: 'Member',
          workspaceId,
        },
      ];

      mockRoleRepository.find.mockResolvedValue(mockRoles);

      const result = await service.getWorkspaceRoles(workspaceId);

      expect(mockRoleRepository.find).toHaveBeenCalledWith({
        where: { workspaceId },
        relations: ['userWorkspaceRoles', 'settingPermissions', 'objectPermissions'],
      });
      expect(result).toEqual(mockRoles);
    });
  });

  describe('getRoleById', () => {
    it('should return a role by id', async () => {
      const roleId = 'role-id';
      const workspaceId = 'workspace-id';
      const mockRole = {
        id: roleId,
        label: 'Admin',
        workspaceId,
      };

      mockRoleRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.getRoleById(roleId, workspaceId);

      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId, workspaceId },
        relations: ['userWorkspaceRoles', 'settingPermissions'],
      });
      expect(result).toEqual(mockRole);
    });

    it('should return null if role not found', async () => {
      const roleId = 'non-existent-role-id';
      const workspaceId = 'workspace-id';

      mockRoleRepository.findOne.mockResolvedValue(null);

      const result = await service.getRoleById(roleId, workspaceId);

      expect(result).toBeNull();
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const workspaceId = 'workspace-id';
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
        workspaceId,
        isEditable: true,
      };

      // Мокаем метод validateRoleInput
      jest.spyOn(service as any, 'validateRoleInput').mockResolvedValue(undefined);
      mockRoleRepository.save.mockResolvedValue(mockCreatedRole);
      mockWorkspacePermissionsCacheService.recomputeRolesPermissionsCache.mockResolvedValue(undefined);

      const result = await service.createRole({
        input: createRoleInput,
        workspaceId,
      });

      expect(mockRoleRepository.save).toHaveBeenCalledWith({
        ...createRoleInput,
        isEditable: true,
        workspaceId,
      });
      expect(mockWorkspacePermissionsCacheService.recomputeRolesPermissionsCache).toHaveBeenCalledWith({
        workspaceId,
        roleIds: [mockCreatedRole.id],
      });
      expect(result).toEqual(mockCreatedRole);
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const roleId = 'role-id';
      const workspaceId = 'workspace-id';
      const updateRoleInput = {
        id: roleId,
        update: {
          label: 'Updated Role',
          description: 'Updated description',
          canUpdateAllSettings: false,
        },
      };

      const existingRole = {
        id: roleId,
        label: 'Old Role',
        description: 'Old description',
        canUpdateAllSettings: true,
        workspaceId,
        isEditable: true,
      };

      const updatedRole = {
        ...existingRole,
        ...updateRoleInput.update,
      };

      // Мокаем методы
      jest.spyOn(service as any, 'validateRoleIsEditableOrThrow').mockResolvedValue(undefined);
      mockRoleRepository.findOne.mockResolvedValue(existingRole);
      jest.spyOn(service as any, 'validateRoleInput').mockResolvedValue(undefined);
      mockRoleRepository.save.mockResolvedValue(updatedRole);
      mockWorkspacePermissionsCacheService.recomputeRolesPermissionsCache.mockResolvedValue(undefined);

      // fix: мок getWorkspaceRoles для проверки уникальности label
      mockRoleRepository.find.mockResolvedValue([existingRole]);

      const result = await service.updateRole({
        input: updateRoleInput,
        workspaceId,
      });

      expect(mockRoleRepository.save).toHaveBeenCalledWith({
        id: existingRole.id,
        ...updateRoleInput.update,
      });
      expect(mockWorkspacePermissionsCacheService.recomputeRolesPermissionsCache).toHaveBeenCalledWith({
        workspaceId,
        roleIds: [roleId],
      });
      expect(result).toEqual(updatedRole);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const roleId = 'role-id';
      const workspaceId = 'workspace-id';
      const defaultRoleId = 'default-role-id';
      
      // Мокаем методы
      jest.spyOn(service as any, 'validateRoleIsEditableOrThrow').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'validateRoleIsNotDefaultRoleOrThrow').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'assignDefaultRoleToMembersWithRoleToDelete').mockResolvedValue(undefined);
      
      // Мокаем репозитории
      mockWorkspaceRepository.findOne.mockResolvedValue({ id: workspaceId, defaultRoleId });
      mockRoleRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      mockWorkspacePermissionsCacheService.recomputeRolesPermissionsCache.mockResolvedValue(undefined);

      const result = await service.deleteRole(roleId, workspaceId);

      expect(mockRoleRepository.delete).toHaveBeenCalledWith({
        id: roleId,
        workspaceId,
      });
      expect(mockWorkspacePermissionsCacheService.recomputeRolesPermissionsCache).toHaveBeenCalledWith({
        workspaceId,
      });
      expect(result).toBe(roleId);
    });
  });

  describe('createMemberRole', () => {
    it('should create a member role', async () => {
      const workspaceId = 'workspace-id';
      const mockMemberRole = {
        id: 'member-role-id',
        label: 'Member',
        description: 'Member role',
        icon: 'IconUser',
        canUpdateAllSettings: false,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: true,
        isEditable: false,
        workspaceId,
      };

      mockRoleRepository.save.mockResolvedValue(mockMemberRole);

      const result = await service.createMemberRole({ workspaceId });

      expect(mockRoleRepository.save).toHaveBeenCalledWith({
        label: 'Member',
        description: 'Member role',
        icon: 'IconUser',
        canUpdateAllSettings: false,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: true,
        isEditable: false,
        workspaceId,
      });
      expect(result).toEqual(mockMemberRole);
    });
  });

  describe('createGuestRole', () => {
    it('should create a guest role', async () => {
      const workspaceId = 'workspace-id';
      const mockGuestRole = {
        id: 'guest-role-id',
        label: 'Guest',
        description: 'Guest role',
        icon: 'IconUser',
        canUpdateAllSettings: false,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: false,
        canSoftDeleteAllObjectRecords: false,
        canDestroyAllObjectRecords: false,
        isEditable: false,
        workspaceId,
      };

      mockRoleRepository.save.mockResolvedValue(mockGuestRole);

      const result = await service.createGuestRole({ workspaceId });

      expect(mockRoleRepository.save).toHaveBeenCalledWith({
        label: 'Guest',
        description: 'Guest role',
        icon: 'IconUser',
        canUpdateAllSettings: false,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: false,
        canSoftDeleteAllObjectRecords: false,
        canDestroyAllObjectRecords: false,
        isEditable: false,
        workspaceId,
      });
      expect(result).toEqual(mockGuestRole);
    });
  });

  describe('createAdminRole', () => {
    it('should create an admin role', async () => {
      const workspaceId = 'workspace-id';
      const mockAdminRole = {
        id: 'admin-role-id',
        label: 'Admin',
        description: 'Admin role',
        icon: 'IconUserCog',
        canUpdateAllSettings: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: true,
        isEditable: false,
        workspaceId,
      };

      mockRoleRepository.save.mockResolvedValue(mockAdminRole);

      const result = await service.createAdminRole({ workspaceId });

      expect(mockRoleRepository.save).toHaveBeenCalledWith({
        label: 'Admin',
        description: 'Admin role',
        icon: 'IconUserCog',
        canUpdateAllSettings: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: true,
        isEditable: false,
        workspaceId,
      });
      expect(result).toEqual(mockAdminRole);
    });
  });
});
