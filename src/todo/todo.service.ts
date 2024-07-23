import { Get, Injectable, Param, Patch } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UserEmail } from '../common/decorators/user-email.decorator';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createTodoDto: CreateTodoDto, email: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          email,
        }
      })
      const data: Prisma.TodoCreateInput = {
        description: createTodoDto.description,
        task: createTodoDto.task,
        status: 'ACTIVE',
        user: {
          connect: { email: user.email }, // Correct way to reference existing User
        },
      };
      console.log(data);
      return await this.databaseService.todo.create({ data });
    } catch (error) {
      return error;
    }
  }
  @Get()
  async findAll(@UserEmail() userEmail: string) {
    console.log(userEmail);
    const user = await this.databaseService.user.findUnique({
      where: { email: userEmail },
    });
    if (!user) {
      throw new Error('User not found.');
    }
    return await this.databaseService.todo.findMany({
      where: {
        userEmail
      }
    });
  }
  @Get(':id')
  async findOne(id: number) {
    return this.databaseService.todo.findFirst({
      where: {
        id: id,
      },
    });
  }
  @Patch(':id')
  async update(id: number, updateTodoDto: UpdateTodoDto) {
    console.log(`Updating task with ID: ${id}`);
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
