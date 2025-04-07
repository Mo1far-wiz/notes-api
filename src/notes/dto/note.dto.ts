import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export interface INoteDto {
  id: string;
  title: string;
  content: string;
}

export interface INoteListDto {
  items: INoteDto[];
}

export class CreateNoteDto implements ICreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class UpdateNoteDto implements IUpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export interface ICreateNoteDto {
  title: string;
  content?: string;
}

export interface IUpdateNoteDto {
  title?: string;
  content?: string;
}