import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { Diagnostico } from './diagnostico.entity';

@Controller('diagnosticos')
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() diagnostico: Partial<Diagnostico>): Promise<Diagnostico> {
    return this.diagnosticoService.create(diagnostico);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Diagnostico> {
    return this.diagnosticoService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Diagnostico[]> {
    return this.diagnosticoService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.diagnosticoService.delete(id);
  }
}
