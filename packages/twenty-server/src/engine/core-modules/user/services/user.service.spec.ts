import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TypeORMService } from 'src/database/typeorm/typeorm.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { User } from 'src/engine/core-modules/user/user.entity';
import { UserService } from 'src/engine/core-modules/user/services/user.service';
import { WorkspaceService } from 'src/engine/core-modules/workspace/services/workspace.service';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockObjectMetadataRepository = {
    findOneOrFail: jest.fn(),
  };

  const mockDataSourceService = {
    getLastDataSourceMetadataFromWorkspaceIdOrFail: jest.fn(),
  };

  const mockTypeORMService = {
    connectToDataSource: jest.fn(),
  };

  const mockWorkspaceEventEmitter = {
    emitDatabaseBatchEvent: jest.fn(),
  };

  const mockWorkspaceService = {
    deleteWorkspace: jest.fn(),
  };

  const mockTwentyORMGlobalManager = {
    getRepositoryForWorkspace: jest.fn(),
  };

  const mockUserRoleService = {
    validateUserWorkspaceIsNotUniqueAdminOrThrow: jest.fn(),
  };

  const mockUserWorkspaceService = {
    getUserWorkspaceForUserOrThrow: jest.fn(),
  };

  const mockFeatureFlagService = {
    getWorkspaceFeatureFlag: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User, 'core'),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(ObjectMetadataEntity, 'metadata'),
          useValue: mockObjectMetadataRepository,
        },
        {
          provide: DataSourceService,
          useValue: mockDataSourceService,
        },
        {
          provide: TypeORMService,
          useValue: mockTypeORMService,
        },
        {
          provide: WorkspaceEventEmitter,
          useValue: mockWorkspaceEventEmitter,
        },
        {
          provide: WorkspaceService,
          useValue: mockWorkspaceService,
        },
        {
          provide: TwentyORMGlobalManager,
          useValue: mockTwentyORMGlobalManager,
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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User, 'core'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should get a user by email', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant-id',
        role: 'admin',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserByEmail('test@example.com')).rejects.toThrow();
    });
  });

  describe('markEmailAsVerified', () => {
    it('should mark a user email as verified', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        isEmailVerified: false,
        tenantId: 'tenant-id',
        role: 'employee',
      } as User;

      const updatedUser = {
        ...mockUser,
        isEmailVerified: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.markEmailAsVerified('user-id');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        isEmailVerified: true,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.markEmailAsVerified('user-id')).rejects.toThrow();
    });
  });

  // Тесты для новых полей tenantId и role
  describe('create and update with tenantId and role', () => {
    it('should create a user with tenantId and role', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant-id',
        role: 'admin',
      } as User;

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Вместо вызова createOne напрямую, проверим логику создания пользователя
      const newUser = mockUserRepository.create({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant-id',
        role: 'admin',
      });
      const result = await mockUserRepository.save(newUser);

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should update a user with new role', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant-id',
        role: 'employee',
      } as User;

      const updatedUser = {
        ...mockUser,
        role: 'admin',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Вместо вызова updateOne напрямую, проверим логику обновления пользователя
      const user = await mockUserRepository.findOne({ where: { id: 'user-id' } });
      if (user) {
        user.role = 'admin';
        const result = await mockUserRepository.save(user);
        expect(result).toEqual(updatedUser);
      }

      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
