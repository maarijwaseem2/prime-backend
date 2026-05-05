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

  // --- Seed Categories ---
  const categoryRepository = dataSource.getRepository(Category);
  const existingCategories = await categoryRepository.count();

  if (existingCategories === 0) {
    console.log('Seeding dummy categories...');
    const parent1 = await categoryRepository.save(
      categoryRepository.create({
        name: 'Analytical Instruments',
        slug: 'analytical-instruments',
        image: 'https://placehold.co/400x300?text=Analytical',
      }),
    );
    const parent2 = await categoryRepository.save(
      categoryRepository.create({
        name: 'Laboratory Consumables',
        slug: 'laboratory-consumables',
        image: 'https://placehold.co/400x300?text=Consumables',
      }),
    );

    const sub1 = await categoryRepository.save(
      categoryRepository.create({
        name: 'Spectroscopy',
        slug: 'spectroscopy',
        parent_id: parent1.id,
      }),
    );
    const sub2 = await categoryRepository.save(
      categoryRepository.create({
        name: 'Chromatography',
        slug: 'chromatography',
        parent_id: parent1.id,
      }),
    );

    // --- Seed Products ---
    const productRepository = dataSource.getRepository(Product);
    const cpRepository = dataSource.getRepository(CategoryProduct);

    console.log('Seeding dummy products...');
    const products = [
      {
        title: 'Atomic Absorption Spectrometer',
        slug: 'aas-scanner',
        short_description: 'High precision AAS for lab use.',
        description: 'Long text description for spectrophotometer...',
        image_path: 'https://placehold.co/400x300?text=AAS',
      },
      {
        title: 'Gas Chromatograph GC-2026',
        slug: 'gc-2026',
        short_description: 'Fast and reliable GC analysis.',
        description: 'Detailed specs for GC unit...',
        image_path: 'https://placehold.co/400x300?text=GC',
      },
    ];

    for (const p of products) {
      const product = await productRepository.save(productRepository.create(p));
      // Link to spectroscopy
      await cpRepository.save(
        cpRepository.create({ product_id: product.id, category_id: sub1.id }),
      );
    }
    console.log('Seeding completed successfully!');
  } else {
    console.log('Database already has data. Skipping dummy data seed.');
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
