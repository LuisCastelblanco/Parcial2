import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { Diagnostico } from '../diagnostico/diagnostico.entity';
import { Medico } from '../medico/medico.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Diagnostico)
    private readonly diagnosticoRepository: Repository<Diagnostico>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(paciente: Partial<Paciente>): Promise<Paciente> {
    if (paciente.nombre.length < 3) {
      throw new BadRequestException('El nombre del paciente debe tener al menos 3 caracteres');
    }
    const nuevoPaciente: Partial<Paciente> = {
      ...paciente,
      medicos: paciente.medicos || [],
      diagnosticos: paciente.diagnosticos || [],
    };
    return this.pacienteRepository.save(nuevoPaciente);
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find();
  }

  async delete(id: string): Promise<void> {
    const diagnosticos = await this.diagnosticoRepository.find({ where: { paciente: { id } } });
    if (diagnosticos.length > 0) {
      throw new BadRequestException('No se puede eliminar un paciente que tiene diagnósticos asociados');
    }
    const paciente = await this.findOne(id);
    await this.pacienteRepository.remove(paciente);
  }
  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    const medico = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new NotFoundException('Medico no encontrado');
    }
    if (paciente.medicos && paciente.medicos.length >= 5) {
      throw new BadRequestException('Un paciente no puede tener más de 5 medicos asignados');
    }
    paciente.medicos.push(medico);
    return this.pacienteRepository.save(paciente);
  }
}
