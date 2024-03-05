import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { LanguagesModule } from '../languages/languages.module';
import { AuthModule } from '../auth/auth.module';
import { RoleGuard } from '../auth/guard/role.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Agent]), LanguagesModule, AuthModule],
  controllers: [AgentController],
  providers: [AgentService, RoleGuard, AuthJWTGuard, ApiKeyGuard],
  exports: [AgentService],
})
export class AgentModule {}
