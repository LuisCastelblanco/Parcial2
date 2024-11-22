import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Medico } from '../medico/medico.entity';
import { Diagnostico } from '../diagnostico/diagnostico.entity';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  genero: string;

 
  @ManyToMany(() => Medico, (medico) => medico.pacientes)
  @JoinTable() 
  medicos: Medico[];


  @OneToMany(() => Diagnostico, (diagnostico) => diagnostico.paciente)
  diagnosticos: Diagnostico[];
}

