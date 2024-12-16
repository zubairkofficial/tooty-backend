import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeeder } from '../seeds/user.seeder';

async function runSeeders() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userSeeder = app.get(UserSeeder);

    await userSeeder.seed();

    console.log('Seeding completed.');
    await app.close();
}

runSeeders().catch((err) => {
    console.error('Seeding failed:', err);
});
