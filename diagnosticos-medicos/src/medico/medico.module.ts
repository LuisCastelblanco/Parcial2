import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico.entity';
import { Paciente } from '../paciente/paciente.entity';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medico, Paciente])], // Importa los repositorios
  controllers: [MedicoController],
  providers: [MedicoService],
  exports: [TypeOrmModule], // Exporta para que otros módulos puedan usarlo si es necesario
})
export class MedicoModule {}
