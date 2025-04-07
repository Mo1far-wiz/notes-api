import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from '../src/notes/entities/note.entity';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let noteRepository;

  const testNote = {
    id: '1',
    title: 'Test Note',
    content: 'Test Content',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    noteRepository = moduleFixture.get(getRepositoryToken(Note));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/notes (GET)', () => {
    it('should return all notes', () => {
      jest.spyOn(noteRepository, 'find').mockResolvedValueOnce([testNote]);

      return request(app.getHttpServer())
        .get('/notes')
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toHaveProperty('items');
          expect(Array.isArray(response.body.items)).toBe(true);
          expect(response.body.items.length).toBe(1);
          expect(response.body.items[0]).toEqual(testNote);
        });
    });
  });

  describe('/notes/:id (GET)', () => {
    it('should return a note by id', () => {
      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(testNote);

      return request(app.getHttpServer())
        .get('/notes/1')
        .expect(HttpStatus.OK)
        .expect(testNote);
    });

    it('should return 404 when note not found', () => {
      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(null);

      return request(app.getHttpServer())
        .get('/notes/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/notes (POST)', () => {
    it('should create a new note', () => {
      const createNoteDto = {
        title: 'New Note',
        content: 'New Content',
      };

      const createdNote = {
        id: '2',
        ...createNoteDto,
      };

      jest.spyOn(noteRepository, 'create').mockReturnValueOnce(createdNote);
      jest.spyOn(noteRepository, 'save').mockResolvedValueOnce(createdNote);

      return request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto)
        .expect(HttpStatus.CREATED)
        .expect(createdNote);
    });

    it('should return 400 when title is missing', () => {
      const invalidDto = {
        content: 'Missing Title',
      };

      return request(app.getHttpServer())
        .post('/notes')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/notes/:id (PUT)', () => {
    it('should update a note', () => {
      const updateNoteDto = {
        title: 'Updated Title',
      };

      const updatedNote = {
        ...testNote,
        title: 'Updated Title',
      };

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(testNote);
      jest.spyOn(noteRepository, 'save').mockResolvedValueOnce(updatedNote);

      return request(app.getHttpServer())
        .put('/notes/1')
        .send(updateNoteDto)
        .expect(HttpStatus.OK)
        .expect(updatedNote);
    });

    it('should return 404 when updating non-existent note', () => {
      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(null);

      return request(app.getHttpServer())
        .put('/notes/999')
        .send({ title: 'Updated Title' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/notes/:id (DELETE)', () => {
    it('should delete a note', () => {
      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(testNote);
      jest.spyOn(noteRepository, 'remove').mockResolvedValueOnce(testNote);

      return request(app.getHttpServer())
        .delete('/notes/1')
        .expect(HttpStatus.OK)
        .expect({ success: true });
    });

    it('should return 404 when deleting non-existent note', () => {
      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(null);

      return request(app.getHttpServer())
        .delete('/notes/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});