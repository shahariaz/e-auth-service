import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1735593418922 implements MigrationInterface {
    name = 'Migration1735593418922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('user', 'users')
        await queryRunner.renameTable('refresh_token', 'refreshTokens')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('refreshTokens', 'refresh_token')
        await queryRunner.renameTable('users', 'user')
    }
}
