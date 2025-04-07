import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, INoteDto, INoteListDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(): Promise<INoteListDto> {
    return this.notesService.getAllNotes();
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<INoteDto> {
    return this.notesService.getNoteById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<INoteDto> {
    return this.notesService.createNote(createNoteDto);
  }

  @Put(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<INoteDto> {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.notesService.deleteNote(id);
  }
}