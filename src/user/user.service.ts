import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { resultHandler } from 'src/common/helpers';
import { Result } from 'src/database/interfaces/result.interface';
import { CreateUserDto, GetUserMeDto, UserDto } from './dtos';
import { User } from './schemas';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,

    @InjectConnection() private connection: Connection
  ) {}

  async create(user: CreateUserDto): Promise<Result<User>> {
    const data = await this.userRepository.create({ ...user });

    return resultHandler(201, 'user created', data);
  }

  async findUser(
    query: UserDto,
    projection?: Record<string, number>
  ): Promise<Result<User>> {
    const data = await this.userRepository.findOne(query, { ...projection });

    return resultHandler(200, 'user data', data);
  }

  async getUserList(filter = {}): Promise<Result<User[]>> {
    const userList = await this.userRepository.find(filter);
    return resultHandler(200, 'user list', userList);
  }

  async findUserByWallet(
    walletAddress: string,
    projection?: Record<string, number>
  ): Promise<Result<User>> {
    const user = await this.userRepository.findOne(
      { walletAddress },
      { ...projection }
    );
    if (!user) {
      return resultHandler(404, 'user not found', null);
    }
    return resultHandler(200, 'user data', user);
  }

  async findUserById(
    userId: string,
    projection?: Record<string, number>
  ): Promise<Result<User>> {
    const user = await this.userRepository.findOne(
      { _id: userId },
      { ...projection }
    );

    if (!user) {
      return resultHandler(404, 'user not found', null);
    }
    return resultHandler(200, 'user data', user);
  }
  async updateUserById(
    userId: string,
    data: UserDto,
    removeDataList?: Array<string>
  ): Promise<Result<User>> {
    const result = this.userRepository.findOneAndUpdate(
      { _id: userId },
      data,
      removeDataList
    );

    return resultHandler(200, 'user updated', result);
  }

  async getUserData(userId: string): Promise<Result<GetUserMeDto>> {
    return await this.findUserById(userId, {
      id: 1,
      walletAddress: 1,
      createdAt: 1,
      updatedAt: 1,
    });
  }

  async getUserDataWithPaginate(
    skip: number,
    limit: number,
    filter,
    sortOption,
    projection?
  ): Promise<Result<User[]>> {
    const userList = this.userRepository.findWithPaginate(
      skip,
      limit,
      filter,
      sortOption,
      projection
    );

    return resultHandler(200, 'user data', userList);
  }

  async getUserCount(filter): Promise<Result<number>> {
    const userCount = this.userRepository.count(filter);

    return resultHandler(200, 'user count', userCount);
  }
}
