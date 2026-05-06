import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoryProduct } from './entities/category-product.entity';
import typeOrmConfig from '../typeorm.config';

async function seed() {
  const dataSource = new DataSource(typeOrmConfig.options);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const adminEmail = 'creativeinsights2023@gmail.com';

  let admin = await userRepository.findOne({ where: { email: adminEmail } });
  if (!admin) {
    console.log('Seeding initial admin user...');
    admin = userRepository.create({
      name: 'Super Admin',
      email: adminEmail,
      password: await bcrypt.hash('Primescicorp@123', 10),
    });
    await userRepository.save(admin);
    console.log('Admin seeded successfully with email: ' + adminEmail);
  } else {
    console.log('Admin already exists. Skipping user seed.');
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
