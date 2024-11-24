import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { Diagnostico } from '../diagnostico/diagnostico.entity';
import { Medico } from '../medico/medico.entity';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Diagnostico, Medico])], // Importa las entidades necesarias
  controllers: [PacienteController],
  providers: [PacienteService],
  exports: [TypeOrmModule], // Exporta TypeOrmModule si otros módulos lo necesitan
})
export class PacienteModule {}
