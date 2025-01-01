import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRefreshToken1735764554127 implements MigrationInterface {
    name = 'UpdateRefreshToken1735764554127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`)
        await queryRunner.query(`ALTER TABLE "refreshTokens" ALTER COLUMN "userId" SET NOT NULL`)
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`)
        await queryRunner.query(`ALTER TABLE "refreshTokens" ALTER COLUMN "userId" DROP NOT NULL`)
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
    }
}
