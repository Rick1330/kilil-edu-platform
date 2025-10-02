import { NestFactory } from '@nestjs/core';
import { AppModule } from '@kilil/enrollment-service/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 4003;
  await app.listen(port);
  console.log(`Enrollment Service is running on port ${port}`);
}
bootstrap();