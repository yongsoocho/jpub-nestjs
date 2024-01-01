import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as session from 'express-session';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.enableCors({ origin: ['http://localhost:5173'], credentials: true });

  // app.use(cookieParser());
  app.use(
    session({
      secret: 'password',
      resave: true,
      saveUninitialized: true,
      // store: new session.MemoryStore(),
      cookie: { maxAge: 60 * 60 * 1000 },
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'images'));

  await app.listen(3000);
}
bootstrap();
