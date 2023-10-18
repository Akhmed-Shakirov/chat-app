import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createServer } from 'http';
import * as cors from 'cors';
import * as childProcess from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Chats API')
    .setDescription('The chats API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cors());
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  app.useWebSocketAdapter(new IoAdapter(httpServer));

  await app.listen(8000);

  // childProcess.exec('open http://localhost:8000/api/');
  // childProcess.exec('start http://localhost:8000/api/');
}

bootstrap();
