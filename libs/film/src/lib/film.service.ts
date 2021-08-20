import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { StartDateNewCounting, TotalFilmsSeenLastCrash } from './film.const';
import type { Movie, PagedMovie, WordCount } from './film.type';

@Injectable()
export class FilmService {
  constructor(@Inject('SEQUELIZE') private con: Sequelize) {
  }

  async getCount(): Promise<{ count: number, metadata: unknown }> {
    const [results, metadata] = await this.con.query('SELECT count(1) as count FROM [FILM2].[DBO].[FILMS]')
    return { count: results[0]["count"], metadata };
  }

  async getWordCount(search: string): Promise<{ word: string, count: number, metadata: unknown }> {
    const [results, metadata] = await this.con.query(
      `SELECT count(1) as count FROM [FILM2].[DBO].[FILMS]` +
      `WHERE Title LIKE '%${search}%'`);
    return { word: search, count: results[0]["count"], metadata };
  }

  async getLatest(search: string = '', pageIndex: number = 0, pageSize: number = 10): Promise<PagedMovie> {
    let searchCount: number;
    const [totalRecord] = await this.con.query(
      `SELECT count(1) FROM [Film2].[dbo].[Films] `);
    const totalDbCount = <number>totalRecord[0][""];

    if (search !== '') {
      const [searchRecord] = await this.con.query(
        `SELECT count(1) FROM [Film2].[dbo].[Films] ` +
        `WHERE Title LIKE '%${search}%'`);

      searchCount = <number>searchRecord[0][""];
    } else {
      searchCount = totalDbCount;
    }

    const [seenAfterCrashRecord] = await this.con.query(
      `SELECT count(1) FROM [Film2].[dbo].[Films] ` +
      `WHERE SeenAt >= '${StartDateNewCounting.toISOString().slice(0, 10)}'`);

    const [res] = await this.con.query(
      `SELECT * FROM [Film2].[dbo].[Films] ` +
      `WHERE Title ${(search === '') ? 'IS NOT NULL' : `LIKE '%${search}%'`} ` +
      `ORDER BY SeenAt DESC ` +
      `OFFSET ${pageIndex * pageSize} ROWS ` +
      `FETCH NEXT ${pageSize} ROWS ONLY;`);

    const results = (<Movie[]>res);

    let promises: Promise<void | WordCount[]>[] = []; 
    results.forEach((item)=> {
      promises.push(this.getWords(item.Title).then((values)=>{
        item.wordCount = values;
      }));
    })

    let values = await Promise.all(promises);
    console.log('values',values)
    console.log('results',results)

    const seenAfterCrashCount = <number>seenAfterCrashRecord[0][""];
    const totalCount = seenAfterCrashCount + TotalFilmsSeenLastCrash;
    const filmsToAddUntilCompletion = TotalFilmsSeenLastCrash - (totalDbCount - seenAfterCrashCount);

    return {
      results,
      filmsToAddUntilCompletion,
      seenAfterCrashCount,
      totalDbCount,
      totalCount,
      searchCount,
      pageCount: (totalDbCount > 0) ? Math.ceil(totalDbCount / pageSize) : 0,
      pageIndex,
      pageSize,
    };
  }

  private async getWords(title:string): Promise<WordCount[]> {
    const words = title.match(/\b(\w+)'?(\w+)?\b(?<!\bthe\b|\b[0-9]\b|\ba\b)/g);
    const promises: Promise<{ word: string; count: number; metadata: unknown; }>[] =[];
    words && words.forEach(async (word)=>{
      promises.push(this.getWordCount(word));
    })
    return await Promise.all(promises);
  }
}

