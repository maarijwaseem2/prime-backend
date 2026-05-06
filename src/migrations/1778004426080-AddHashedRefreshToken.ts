import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashedRefreshToken1778004426080 implements MigrationInterface {
    name = 'AddHashedRefreshToken1778004426080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`short_description\` text NULL, \`description\` longtext NULL, \`image_path\` varchar(255) NULL, \`image\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_c30f00a871de74c8e8c213acc4\` (\`title\`), UNIQUE INDEX \`IDX_464f927ae360106b783ed0b410\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`category_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`parent_id\` int NULL, \`image\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email_verified_at\` datetime NULL, \`remember_token\` varchar(255) NULL, \`hashedRefreshToken\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quotes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`company\` varchar(255) NULL, \`quantity\` int NOT NULL DEFAULT '1', \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_dcab96e44e48f51b62f3af2f44\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contact_submissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`subject\` varchar(255) NULL, \`message\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_0328b0ec84cf6e08b4d7a78fe3\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_reset_tokens\` (\`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`email\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`failed_jobs\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`connection\` text NOT NULL, \`queue\` text NOT NULL, \`payload\` longtext NOT NULL, \`exception\` longtext NOT NULL, \`failed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de4c36e7538147af6acb8121df\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`personal_access_tokens\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`tokenable_type\` varchar(255) NOT NULL, \`tokenable_id\` bigint NOT NULL, \`name\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`abilities\` text NULL, \`last_used_at\` datetime NULL, \`expires_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1e9d741dde247c5ede7481c65d\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`category_product\` ADD CONSTRAINT \`FK_0919bf58087db45b6e72ad4e4ee\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_product\` ADD CONSTRAINT \`FK_3258d80899c96127f31dfaab87b\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_88cea2dc9c31951d06437879b40\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quotes\` ADD CONSTRAINT \`FK_768dc2b0dcc9843d058f12835bf\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quotes\` DROP FOREIGN KEY \`FK_768dc2b0dcc9843d058f12835bf\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_88cea2dc9c31951d06437879b40\``);
        await queryRunner.query(`ALTER TABLE \`category_product\` DROP FOREIGN KEY \`FK_3258d80899c96127f31dfaab87b\``);
        await queryRunner.query(`ALTER TABLE \`category_product\` DROP FOREIGN KEY \`FK_0919bf58087db45b6e72ad4e4ee\``);
        await queryRunner.query(`DROP INDEX \`IDX_1e9d741dde247c5ede7481c65d\` ON \`personal_access_tokens\``);
        await queryRunner.query(`DROP TABLE \`personal_access_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_de4c36e7538147af6acb8121df\` ON \`failed_jobs\``);
        await queryRunner.query(`DROP TABLE \`failed_jobs\``);
        await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_0328b0ec84cf6e08b4d7a78fe3\` ON \`contact_submissions\``);
        await queryRunner.query(`DROP TABLE \`contact_submissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_dcab96e44e48f51b62f3af2f44\` ON \`quotes\``);
        await queryRunner.query(`DROP TABLE \`quotes\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`category_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_464f927ae360106b783ed0b410\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_c30f00a871de74c8e8c213acc4\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
