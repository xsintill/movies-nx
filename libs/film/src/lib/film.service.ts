import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FilmService {
  constructor(@Inject('SEQUELIZE') private con: Sequelize){        
  }
  
  async getCount(): Promise<{ count: number, metadata: unknown }> {

    const [results, metadata] = await this.con.query('SELECT count(1) as count FROM [FILM2].[DBO].[FILMS]')
    return { count:results[0]["count"], metadata};    
  }

  async getLatest(pageSize: number = 10): Promise<{ results: unknown[], metadata: unknown }> {
    const [results, metadata] = await this.con.query(`SELECT TOP(${pageSize}) * FROM [Film2].[dbo].[Films] order by SeenAt desc`);
    return { results, metadata};    
  }
}
