import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Paciente } from './paciente.entity';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() paciente: Partial<Paciente>): Promise<Paciente> {
    return this.pacienteService.create(paciente);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Paciente> {
    return this.pacienteService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Paciente[]> {
    return this.pacienteService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.pacienteService.delete(id);
  }
}
