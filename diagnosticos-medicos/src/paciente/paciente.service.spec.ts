import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Diagnostico } from '../diagnostico/diagnostico.entity';
import { Medico } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<Paciente>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(Paciente),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Diagnostico),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Medico),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
  });

  it('deberia crear un paciente correctamente', async () => {
    const pacienteData = { nombre: 'Juan Perez', genero: 'Masculino' };
    const savedPaciente = {
      id: 'uuid',
      nombre: 'Juan Perez',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: [],
    };
    jest.spyOn(pacienteRepository, 'save').mockResolvedValue(savedPaciente);
    const result = await service.create(pacienteData);
    expect(result).toEqual(savedPaciente);
    expect(pacienteRepository.save).toHaveBeenCalledWith({
      ...pacienteData,
      medicos: [],
      diagnosticos: [],
    });
  });

  it('deberia lanzar una excepción si el nombre del paciente tiene menos de 3 caracteres', async () => {
    const pacienteData = { nombre: 'Ca', genero: 'Femenino' };
    await expect(service.create(pacienteData)).rejects.toThrow(BadRequestException);
    await expect(service.create(pacienteData)).rejects.toThrow(
      'El nombre del paciente debe tener al menos 3 caracteres',
    );
  });
});
