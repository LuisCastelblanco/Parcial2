import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico/medico.entity';
import { Paciente } from './paciente/paciente.entity';
import { Diagnostico } from './diagnostico/diagnostico.entity';
import { MedicoModule } from './medico/medico.module'; 
import { PacienteModule } from './paciente/paciente.module'; 
import { DiagnosticoModule } from './diagnostico/diagnostico.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'cheo2001',
      database: 'postgres',
      entities: [Medico, Paciente, Diagnostico],
      synchronize: true, // Sincronización automática, solo en desarrollo
    }),
    MedicoModule, // Registra el módulo del médico
    PacienteModule, // Registra el módulo del paciente
    DiagnosticoModule, // Registra el módulo del diagnóstico
  ],
})
export class AppModule {}
