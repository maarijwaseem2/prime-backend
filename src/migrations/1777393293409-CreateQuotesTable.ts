import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuotesTable1777393293409 implements MigrationInterface {
  name = 'CreateQuotesTable1777393293409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`quotes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`company\` varchar(255) NULL, \`quantity\` int NOT NULL DEFAULT '1', \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_dcab96e44e48f51b62f3af2f44\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`quotes\` ADD CONSTRAINT \`FK_768dc2b0dcc9843d058f12835bf\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`quotes\` DROP FOREIGN KEY \`FK_768dc2b0dcc9843d058f12835bf\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_dcab96e44e48f51b62f3af2f44\` ON \`quotes\``,
    );
    await queryRunner.query(`DROP TABLE \`quotes\``);
  }
}
