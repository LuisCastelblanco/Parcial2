import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Medico } from './medico.entity';
import { Paciente } from '../paciente/paciente.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MedicoService', () => {
  let service: MedicoService;

  const mockMedicoRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockPacienteRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(Medico),
          useValue: mockMedicoRepository,
        },
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockPacienteRepository,
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deberia crear un medico si los datos son validos (caso positivo)', async () => {
      const medicoData = { nombre: 'Dr. Juan', especialidad: 'Cardiologia' };
      mockMedicoRepository.save.mockResolvedValue(medicoData);

      const result = await service.create(medicoData);

      expect(mockMedicoRepository.save).toHaveBeenCalledWith(medicoData);
      expect(result).toEqual(medicoData);
    });

    it('deberia lanzar BadRequestException si faltan datos obligatorios (caso negativo)', async () => {
      await expect(service.create({ nombre: '' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('deberia devolver un medico existente por su ID (caso positivo)', async () => {
      const medico = { id: '1', nombre: 'Dr. Juan', especialidad: 'Cardiologia' };
      mockMedicoRepository.findOne.mockResolvedValue(medico);

      const result = await service.findOne('1');

      expect(mockMedicoRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(medico);
    });

    it('deberia lanzar NotFoundException si no se encuentra el medico (caso negativo)', async () => {
      mockMedicoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deberia devolver todos los medicos (caso positivo)', async () => {
      const medicos = [
        { id: '1', nombre: 'Dr. Juan', especialidad: 'Cardiologia' },
        { id: '2', nombre: 'Dra. Ana', especialidad: 'Pediatria' },
      ];
      mockMedicoRepository.find.mockResolvedValue(medicos);

      const result = await service.findAll();

      expect(mockMedicoRepository.find).toHaveBeenCalled();
      expect(result).toEqual(medicos);
    });
  });

  describe('delete', () => {
    it('deberia eliminar un medico si no tiene pacientes asociados (caso positivo)', async () => {
      const medico = { id: '1', nombre: 'Dr. Juan', especialidad: 'Cardiologia' };
      mockPacienteRepository.find.mockResolvedValue([]);
      mockMedicoRepository.findOne.mockResolvedValue(medico);
      mockMedicoRepository.remove.mockResolvedValue(medico);

      await service.delete('1');

      expect(mockPacienteRepository.find).toHaveBeenCalledWith({ where: { medicos: { id: '1' } } });
      expect(mockMedicoRepository.remove).toHaveBeenCalledWith(medico);
    });

    it('deberia lanzar BadRequestException si el medico tiene pacientes asociados (caso negativo)', async () => {
      const pacientes = [{ id: '1', nombre: 'Paciente 1' }];
      mockPacienteRepository.find.mockResolvedValue(pacientes);

      await expect(service.delete('1')).rejects.toThrow(BadRequestException);
    });

    it('deberia lanzar NotFoundException si el medico no existe (caso negativo)', async () => {
      mockPacienteRepository.find.mockResolvedValue([]);
      mockMedicoRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
