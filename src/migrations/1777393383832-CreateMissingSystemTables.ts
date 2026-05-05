import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMissingSystemTables1777393383832 implements MigrationInterface {
  name = 'CreateMissingSystemTables1777393383832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`password_reset_tokens\` (\`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`email\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`failed_jobs\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`connection\` text NOT NULL, \`queue\` text NOT NULL, \`payload\` longtext NOT NULL, \`exception\` longtext NOT NULL, \`failed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de4c36e7538147af6acb8121df\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`personal_access_tokens\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`tokenable_type\` varchar(255) NOT NULL, \`tokenable_id\` bigint NOT NULL, \`name\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`abilities\` text NULL, \`last_used_at\` datetime NULL, \`expires_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1e9d741dde247c5ede7481c65d\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_1e9d741dde247c5ede7481c65d\` ON \`personal_access_tokens\``,
    );
    await queryRunner.query(`DROP TABLE \`personal_access_tokens\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de4c36e7538147af6acb8121df\` ON \`failed_jobs\``,
    );
    await queryRunner.query(`DROP TABLE \`failed_jobs\``);
    await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
  }
}
