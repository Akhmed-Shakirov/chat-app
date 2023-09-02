import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req, @Query() data: UpdateUserDto) {
    const { userId } = req.user;
    console.log(userId);

    return this.usersService.findAll(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('applications/:id')
  applications(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    return this.usersService.applications(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('friends/:id')
  friends(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    return this.usersService.friends(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('friends/:id')
  removeFromFriends(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    return this.usersService.removeFromFriends(id, userId);
  }
}
