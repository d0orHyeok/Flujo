import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  generateRandomString() {
    return (
      Math.random().toString(36).substring(2, 9) +
      Date.now().toString().substring(7)
    );
  }

  async createUser(authRegisterlDto: AuthRegisterDto): Promise<void> {
    let randomString = this.generateRandomString();

    while (true) {
      const findUser = await this.findOne({ permaId: randomString });
      if (!findUser) {
        break;
      } else {
        randomString = this.generateRandomString();
      }
    }

    const user = this.create({ ...authRegisterlDto, permaId: randomString });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({ username });

    if (!user) {
      throw new UnauthorizedException(`Can't find User with id: ${username}`);
    }

    return user;
  }

  async findUserByPermaId(permaId: string) {
    const user = await this.findOne({ permaId });

    if (!user) {
      throw new NotFoundException(`Can't find User with permaId: ${permaId}`);
    }

    return user;
  }
}
