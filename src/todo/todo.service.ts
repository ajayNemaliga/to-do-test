import { Get, Injectable, Param } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createTodoDto: CreateTodoDto) {
    try {
      const data: Prisma.TodoCreateInput = {
        description: createTodoDto.description,
        task: createTodoDto.task,
        status: 'ACTIVE',
        user: {
          connect: { email: createTodoDto.email }, // Correct way to reference existing User
        },
      };
      console.log(data);
      return await this.databaseService.todo.create({ data });
    } catch (error) {
      return error;
    }
  }
  @Get()
  async findAll() {
    return await this.databaseService.todo.findMany();
  }
  @Get(':id')
  async findOne(id: number) {
    return this.databaseService.todo.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.databaseService.todo.update({
      where: {
        id: id,
      },
      data: updateTodoDto
    });
  }

  async remove(id: number) {
    return this.databaseService.todo.delete({
      where: {
        id: id,
      },
    });
  }
}
