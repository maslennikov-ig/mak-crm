import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToRole1743970300000 implements MigrationInterface {
  name = 'AddTenantIdToRole1743970300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Проверяем, существует ли уже колонка tenantId
    const hasColumn = await queryRunner.hasColumn('metadata.role', 'tenantId');
    
    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE "metadata"."role" ADD "tenantId" uuid NOT NULL`,
      );
      
      // Заполняем tenantId значением workspaceId для существующих записей
      await queryRunner.query(
        `UPDATE "metadata"."role" SET "tenantId" = "workspaceId"`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('metadata.role', 'tenantId');
    
    if (hasColumn) {
      await queryRunner.query(
        `ALTER TABLE "metadata"."role" DROP COLUMN "tenantId"`,
      );
    }
  }
}
