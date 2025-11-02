import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'es6-shim';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { SnakeCaseInterceptor } from './core/interceptors/snake_case.interceptor';
import { CamelCaseTransformPipe } from './core/pipes/camel-case-transform.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  app.useGlobalPipes(
    new CamelCaseTransformPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin:[process.env.FRONTEND_URL, process.env.LOCAL_FRONTEND_URL],
    methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Book Store API')
    .setDescription('The Book Store API description')
    .setVersion('1.0')
    .addTag('Book Store API')
    .addBearerAuth() // This name here is important for matching up with @ApiBearerAuth() in your controller!
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 4000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
  Logger.log(`Swagger is running on: ${await app.getUrl()}/api-docs`);
}

bootstrap();
