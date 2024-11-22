import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Diagnostico } from './diagnostico.entity';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(Diagnostico)
    private readonly diagnosticoRepository: Repository<Diagnostico>,
  ) {}

  async create(diagnostico: Partial<Diagnostico>): Promise<Diagnostico> {
    if (diagnostico.descripcion.length > 200) {
      throw new BadRequestException('La descripcion no puede tener más de 200 caracteres');
    }

    return this.diagnosticoRepository.save(diagnostico);
  }

  async findOne(id: string): Promise<Diagnostico> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new NotFoundException('Diagnostico no encontrado');
    }
    return diagnostico;
  }

  async findAll(): Promise<Diagnostico[]> {
    return this.diagnosticoRepository.find();
  }

  async delete(id: string): Promise<void> {
    const diagnostico = await this.findOne(id);
    await this.diagnosticoRepository.remove(diagnostico);
  }
}
