import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    DatabaseModule,
    TodoModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ensure it points to your .env file
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('Environment Variables in AppModule:');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  }
}
