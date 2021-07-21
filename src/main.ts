import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule, { cors: true });
  await app.listen(3300);
}
bootstrap();
