import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGaurd } from '../auth/auth.guard';
import { UserEmail } from '../common/decorators/user-email.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGaurd)
  @ApiOperation({
    description:
      "Add a new task to the user's todo list. The user must be authenticated to perform this operation.",
    summary: 'Add a new task',
  })
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @UserEmail() userEmail: string) {
    return this.todoService.create(createTodoDto, userEmail);
  }
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Retrieve all tasks associated with the authenticated user.',
    summary: 'Get all tasks',
  })
  @UseGuards(JwtAuthGaurd)
  @Get()
  findAll(@UserEmail() userEmail: string) {
    console.log(userEmail);
    return this.todoService.findAll(userEmail);
  }
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Retrieve a specific task by its ID for the authenticated user.',
    summary: 'Get a task by ID',
  })
  @UseGuards(JwtAuthGaurd)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Update the details of a specific task by its ID. The user must be authenticated to perform this operation.',
    summary: 'Update a task',
  })
  @UseGuards(JwtAuthGaurd)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Delete a specific task by its ID. The user must be authenticated to perform this operation.',
    summary: 'Delete a task',
  })
  @UseGuards(JwtAuthGaurd)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}

