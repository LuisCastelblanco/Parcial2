import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Medico } from './medico.entity';
import { Paciente } from '../paciente/paciente.entity';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(medico: Partial<Medico>): Promise<Medico> {
    if (!medico.nombre || !medico.especialidad) {
      throw new BadRequestException('El nombre y la especialidad no pueden estar vacios');
    }

    return this.medicoRepository.save(medico);
  }

  async findOne(id: string): Promise<Medico> {
    const medico = await this.medicoRepository.findOne({ where: { id } });
    if (!medico) {
      throw new NotFoundException('Medico no encontrado');
    }
    return medico;
  }

  async findAll(): Promise<Medico[]> {
    return this.medicoRepository.find();
  }

  async delete(id: string): Promise<void> {
    const pacientes = await this.pacienteRepository.find({ where: { medicos: { id } } });
    if (pacientes.length > 0) {
      throw new BadRequestException('No se puede eliminar un medico que tiene pacientes asociados');
    }

    const medico = await this.findOne(id);
    await this.medicoRepository.remove(medico);
  }
}
