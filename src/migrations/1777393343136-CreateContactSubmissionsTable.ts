import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactSubmissionsTable1777393343136 implements MigrationInterface {
  name = 'CreateContactSubmissionsTable1777393343136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`contact_submissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`subject\` varchar(255) NULL, \`message\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_0328b0ec84cf6e08b4d7a78fe3\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_0328b0ec84cf6e08b4d7a78fe3\` ON \`contact_submissions\``,
    );
    await queryRunner.query(`DROP TABLE \`contact_submissions\``);
  }
}
