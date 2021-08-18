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
  
  async getLatest(search: string = '', pageIndex: number = 0, pageSize: number = 10): Promise<{results: unknown[], totalCount: number, searchCount: number, metadata?: unknown }> {    
    const [totalCountRecord] = await this.con.query(
      `SELECT count(1) FROM [Film2].[dbo].[Films] `+
      `WHERE Title IS NOT NULL`);
    const [searchCountRecord] = await this.con.query(
      `SELECT count(1) FROM [Film2].[dbo].[Films] `+
      `WHERE Title LIKE '%${search}%'`);
    const [results] = await this.con.query(
      `SELECT * FROM [Film2].[dbo].[Films] `+
      `WHERE Title ${(search === '') ? 'IS NOT NULL' : `LIKE '%${search}%'`} `+
      `ORDER BY SeenAt DESC ` +
      `OFFSET     ${pageIndex * pageSize} ROWS `+
      `FETCH NEXT ${pageSize} ROWS ONLY;`);

    const totalCount: number = <number>totalCountRecord[0][""];
    const searchCount: number = <number>searchCountRecord[0][""];

    return { results, totalCount, searchCount };    
  }
}
