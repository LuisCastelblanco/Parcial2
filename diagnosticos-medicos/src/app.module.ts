import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico/medico.entity';
import { Paciente } from './paciente/paciente.entity';
import { Diagnostico } from './diagnostico/diagnostico.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'contraseña123',
      database: 'diagnosticos_medicos',
      entities: [Medico, Paciente, Diagnostico],
      synchronize: true, 
    }),
  ],
})
export class AppModule {}
