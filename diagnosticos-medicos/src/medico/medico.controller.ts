import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { Medico } from './medico.entity';

@Controller('medicos')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() medico: Partial<Medico>): Promise<Medico> {
    return this.medicoService.create(medico);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Medico> {
    return this.medicoService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Medico[]> {
    return this.medicoService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.medicoService.delete(id);
  }
}
