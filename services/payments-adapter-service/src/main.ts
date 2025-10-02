import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Payments Adapter Service')
    .setDescription('Payment processing adapter for Telebirr/M-Pesa integration')
    .setVersion('1.0')
    .addTag('payments')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 4002;
  await app.listen(port);
  console.log(`Payments Adapter Service is running on port ${port}`);
}
bootstrap();