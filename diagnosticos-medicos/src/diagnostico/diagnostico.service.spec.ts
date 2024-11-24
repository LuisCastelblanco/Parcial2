import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Diagnostico } from './diagnostico.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let mockDiagnosticoRepository: Partial<Record<keyof Repository<Diagnostico>, jest.Mock>>;

  beforeEach(async () => {
    // Crear un mock explícito para cada método de Repository
    mockDiagnosticoRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(Diagnostico),
          useValue: mockDiagnosticoRepository,
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deberia crear un diagnostico si la descripcion es valida (caso positivo)', async () => {
      const diagnosticoData = { descripcion: 'Diagnostico inicial' };
      (mockDiagnosticoRepository.save as jest.Mock).mockResolvedValue(diagnosticoData);

      const result = await service.create(diagnosticoData);

      expect(mockDiagnosticoRepository.save).toHaveBeenCalledWith(diagnosticoData);
      expect(result).toEqual(diagnosticoData);
    });

    it('deberia lanzar BadRequestException si la descripcion supera 200 caracteres (caso negativo)', async () => {
      const diagnosticoData = { descripcion: 'a'.repeat(201) };

      await expect(service.create(diagnosticoData)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('deberia devolver un diagnostico existente por su ID (caso positivo)', async () => {
      const diagnostico = { id: '1', descripcion: 'Diagnostico existente' };
      (mockDiagnosticoRepository.findOne as jest.Mock).mockResolvedValue(diagnostico);

      const result = await service.findOne('1');

      expect(mockDiagnosticoRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(diagnostico);
    });

    it('deberia lanzar NotFoundException si el diagnostico no existe (caso negativo)', async () => {
      (mockDiagnosticoRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deberia devolver todos los diagnosticos (caso positivo)', async () => {
      const diagnosticos = [
        { id: '1', descripcion: 'Diagnostico 1' },
        { id: '2', descripcion: 'Diagnostico 2' },
      ];
      (mockDiagnosticoRepository.find as jest.Mock).mockResolvedValue(diagnosticos);

      const result = await service.findAll();

      expect(mockDiagnosticoRepository.find).toHaveBeenCalled();
      expect(result).toEqual(diagnosticos);
    });
  });

  describe('delete', () => {
    it('deberia eliminar un diagnostico si existe (caso positivo)', async () => {
      const diagnostico = { id: '1', descripcion: 'Diagnostico a eliminar' };
      (mockDiagnosticoRepository.findOne as jest.Mock).mockResolvedValue(diagnostico);
      (mockDiagnosticoRepository.remove as jest.Mock).mockResolvedValue(diagnostico);

      await service.delete('1');

      expect(mockDiagnosticoRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockDiagnosticoRepository.remove).toHaveBeenCalledWith(diagnostico);
    });

    it('deberia lanzar NotFoundException si el diagnostico no existe (caso negativo)', async () => {
      (mockDiagnosticoRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
