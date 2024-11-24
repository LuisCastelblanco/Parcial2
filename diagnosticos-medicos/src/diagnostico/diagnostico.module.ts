import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnostico.entity';
import { Medico } from '../medico/medico.entity';
import { Paciente } from '../paciente/paciente.entity';
import { DiagnosticoController } from './diagnostico.controller';
import { DiagnosticoService } from './diagnostico.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diagnostico, Paciente, Medico]), 
  ],
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService],
  exports: [TypeOrmModule], 
})
export class DiagnosticoModule {}
