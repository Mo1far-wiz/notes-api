import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { INoteDto, CreateNoteDto, UpdateNoteDto, INoteListDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async getAllNotes(): Promise<INoteListDto> {
    const notes = await this.notesRepository.find();
    return { items: notes };
  }

  async getNoteById(id: string): Promise<INoteDto> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async createNote(createNoteDto: CreateNoteDto): Promise<INoteDto> {
    const note = this.notesRepository.create({
      title: createNoteDto.title,
      content: createNoteDto.content || '',
    });

    return this.notesRepository.save(note);
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<INoteDto> {
    const note = await this.getNoteById(id);

    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }

    if (updateNoteDto.content !== undefined) {
      note.content = updateNoteDto.content;
    }

    return this.notesRepository.save(note);
  }

  async deleteNote(id: string): Promise<{ success: boolean }> {
    const note = await this.getNoteById(id);
    await this.notesRepository.remove(note);
    return { success: true };
  }
}