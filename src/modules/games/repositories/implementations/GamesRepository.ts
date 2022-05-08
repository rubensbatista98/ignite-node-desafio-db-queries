import { getRepository, Repository, } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder()
      .select('games')
      .from(Game, 'games')
      .where("games.title ILIKE :title", { title: `%${param}%` })
      .getMany();

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT COUNT(id) as count
      FROM games;
    `);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder()
      .select('users')
      .from(User, 'users')
      .innerJoin('users.games', 'games')
      .where('games.id = :id', { id })
      .getMany()

    return users
  }

}
