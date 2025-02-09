import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { Doctor } from './doctor/schemas/doctor.schema';
import { User } from './auth/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { IngestionModule } from './ingestion/ingestion.module';

console.log("??????????????",process.env.USERNAME)
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 5 * 1000,
        limit: 3,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost', // Change as per your DB host
      port: 5432, // Default PostgreSQL port
      username: 'postgres', // Change as per your DB username
      password: process.env.PASSWORD, // Change as per your DB password
      database: process.env.DATABASE, // Change as per your DB name
      autoLoadModels: true, // Automatically load models
      synchronize: true, // Auto-sync models (disable in production)
    }),
    SequelizeModule.forFeature([User]),
    // MongooseModule.forRoot(process.env.DB_URI),
    IngestionModule,
    DoctorModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
