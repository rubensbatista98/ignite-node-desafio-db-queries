import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(user_id, {
      relations: ['games']
    })

    if (user) return user

    throw new Error('User not found')
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      SELECT * FROM users ORDER BY first_name  
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      SELECT * FROM users 
      WHERE CONCAT(first_name, ' ', last_name) ILIKE $1
    `, [`%${first_name} ${last_name}%`]);
  }
}
