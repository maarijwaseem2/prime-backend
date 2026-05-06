import { DataSource } from 'typeorm';
import typeOrmConfig from './typeorm.config';

async function run() {
  const ds = new DataSource(typeOrmConfig.options);
  await ds.initialize();
  try {
    await ds.query(
      'ALTER TABLE users ADD COLUMN hashedRefreshToken varchar(255) NULL;',
    );
    console.log('Column added successfully.');
  } catch (err: any) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists.');
    } else {
      console.error(err);
    }
  }
  await ds.destroy();
}
run();
