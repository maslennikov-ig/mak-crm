import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantAndRoleToUser1751707260000 implements MigrationInterface {
  name = 'AddTenantAndRoleToUser1751707260000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "core"."user" ADD COLUMN "tenantId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "core"."user" ADD COLUMN "role" varchar NOT NULL DEFAULT 'employee'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "core"."user" DROP COLUMN "tenantId"`);
  }
}
