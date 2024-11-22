import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../paciente/paciente.entity';

@Entity()
export class Diagnostico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ length: 200 })
  descripcion: string;


  @ManyToOne(() => Paciente, (paciente) => paciente.diagnosticos)
  paciente: Paciente;
}
