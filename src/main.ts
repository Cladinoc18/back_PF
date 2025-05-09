import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserSeed } from './user/seeder/user.seed';
import { ProductsSeed } from './seeds/products/products.seeds';
import { loggerGlobal } from './middleware/logger.middleware';
import { CategoriesSeed } from './seeds/categories/categories.seeds';
import { ValidationPipe } from '@nestjs/common';
import { OrderDetailSeed } from './seeds/order_details/order_details.seeds';
import { OfferSeed } from './seeds/offers/offers.seeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
    'https://proyecto-final-kvxa.vercel.app', 
    'http://localhost:3001',
    'https://back-pf-k04z.onrender.com',
  ],
    methods: 'GET, PATCH, HEAD, PUT, POST, DELETE',
    credentials: true,
  });

  app.use(loggerGlobal);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Proyecto LUXORA')
    .setDescription('Documentacion de la API - Backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const categorySeeder = app.get(CategoriesSeed);
  await categorySeeder.seedCategories();
  console.log('*** LA INSERCION DE CATEGORIAS FUE EXITOSA ***');

  const userSeeder = app.get(UserSeed);
  await userSeeder.createUserSeeder();
  console.log('*** LA INSERCION DE USUARIOS FUE EXITOSA ***');

  const productsSeed = app.get(ProductsSeed);
  await productsSeed.createSeedProduct();
  console.log('*** LA INSERCION DE PRODUCTOS FUE EXITOSA ***');

  const orderDetailsSeed = app.get(OrderDetailSeed);
  await orderDetailsSeed.orderDetailSeed();
  console.log('*** LA INSERCION DE ORDENES FUE EXITOSA ***');

  const offersSeed = app.get(OfferSeed);
  await offersSeed.offerSeed();
  console.log('*** LA INSERCION DE OFERTAS FUE EXITOSA ***');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
