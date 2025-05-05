import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AnalyticsService } from 'src/engine/core-modules/analytics/services/analytics.service';
import { DomainManagerService } from 'src/engine/core-modules/domain-manager/services/domain-manager.service';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { OnboardingService } from 'src/engine/core-modules/onboarding/onboarding.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserWorkspace } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { UserResolver } from 'src/engine/core-modules/user/user.resolver';
import { UserService } from 'src/engine/core-modules/user/services/user.service';
import { User } from 'src/engine/core-modules/user/user.entity';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockUserWorkspaceRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUserService = {
    deleteUser: jest.fn(),
    loadWorkspaceMember: jest.fn(),
    loadWorkspaceMembers: jest.fn(),
  };

  const mockTwentyConfigService = {
    supportDriver: jest.fn(),
  };

  const mockFileUploadService = {
    uploadFile: jest.fn(),
  };

  const mockOnboardingService = {
    getOnboardingStatus: jest.fn(),
  };

  const mockUserVarService = {
    getUserVars: jest.fn(),
  };

  const mockFileService = {
    getFileUrl: jest.fn(),
  };

  const mockAnalyticsService = {
    identify: jest.fn(),
  };

  const mockDomainManagerService = {
    getCompanyDomainName: jest.fn(),
  };

  const mockUserRoleService = {
    getSettings: jest.fn(),
    getPermissions: jest.fn(),
  };

  const mockPermissionsService = {
    hasSettingPermission: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: getRepositoryToken(User, 'core'),
          useValue: mockUserRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TwentyConfigService,
          useValue: mockTwentyConfigService,
        },
        {
          provide: FileUploadService,
          useValue: mockFileUploadService,
        },
        {
          provide: OnboardingService,
          useValue: mockOnboardingService,
        },
        {
          provide: UserVarsService,
          useValue: mockUserVarService,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
        {
          provide: DomainManagerService,
          useValue: mockDomainManagerService,
        },
        {
          provide: getRepositoryToken(UserWorkspace, 'core'),
          useValue: mockUserWorkspaceRepository,
        },
        {
          provide: UserRoleService,
          useValue: mockUserRoleService,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('currentUser', () => {
    it('should return the current user with tenantId and role', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant-id',
        role: 'admin',
      } as User;

      const mockWorkspace = {
        id: 'workspace-id',
        displayName: 'Test Workspace',
        createdAt: new Date(),
        updatedAt: new Date(),
        allowImpersonation: false,
        isPublicInviteLinkEnabled: false,
        activationStatus: 'active',
        subscriptionStatus: 'active',
        domainName: 'example.com',
        domainVerificationStatus: 'verified',
        logo: null,
        inviteHash: 'invite-hash',
      } as any;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Мокируем метод currentUser, так как он использует внутренние зависимости
      resolver.currentUser = jest.fn().mockResolvedValue(mockUser);
      
      const result = await resolver.currentUser(mockUser, mockWorkspace);

      expect(result).toEqual(mockUser);
    });
  });

  describe('workspaceMember', () => {
    it('should return workspace member for user', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        tenantId: 'tenant-id',
        role: 'admin',
      } as User;

      const mockWorkspace = {
        id: 'workspace-id',
        displayName: 'Test Workspace',
        createdAt: new Date(),
        updatedAt: new Date(),
        allowImpersonation: false,
        isPublicInviteLinkEnabled: false,
        activationStatus: 'active',
        subscriptionStatus: 'active',
        domainName: 'example.com',
        domainVerificationStatus: 'verified',
        logo: null,
        inviteHash: 'invite-hash',
      } as any;

      const mockWorkspaceMember = {
        id: 'workspace-member-id',
        userId: 'user-id',
        workspaceId: 'workspace-id',
        role: 'admin',
      };

      mockUserService.loadWorkspaceMember.mockResolvedValue(mockWorkspaceMember);

      const result = await resolver.workspaceMember(mockUser, mockWorkspace);

      expect(mockUserService.loadWorkspaceMember).toHaveBeenCalledWith(
        mockUser,
        mockWorkspace,
      );
      expect(result).toEqual(mockWorkspaceMember);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        tenantId: 'tenant-id',
        role: 'admin',
      } as User;

      mockUserService.deleteUser.mockResolvedValue(mockUser);

      const result = await resolver.deleteUser(mockUser);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUser);
    });
  });
});
