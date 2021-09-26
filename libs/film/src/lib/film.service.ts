import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';

import { StartDateNewCounting, TotalFilmsSeenLastCrash } from './film.const';
import type { DbMovie, Movie, PagedMovie, WordCount } from './film.type';

@Injectable()
export class FilmService {
  constructor(@Inject('SEQUELIZE') private con: Sequelize) {
  }

  async getCount(): Promise<{ count: number, metadata: unknown }> {
    const [results, metadata] = await this.con.query('SELECT count(1) as count FROM [FILM2].[DBO].[FILMS]')
    return { count: results[0]["count"], metadata };
  }

  async getWordCount(search: string): Promise<{ word: string, count: number, metadata: unknown }> {
    const word = this.escape(search);
    const [results, metadata] = await this.con.query(
      `SELECT count(1) as count FROM [FILM2].[DBO].[FILMS]` +
      `WHERE Title LIKE '%[^a-Z0-9]${word}[^a-Z0-9]%' OR ` +
      `Title LIKE '${word}[^a-Z0-9]%' OR `+
      `Title LIKE '%[^a-Z0-9]${word}' OR `+
      `Title LIKE '${word}'`);
    return { word: search, count: results[0]["count"], metadata };
  }
  
  async getFilmsForWord(search: string): Promise<{ word: string, films: unknown[], metadata: unknown }> {
    const word = this.escape(search);
    const [results, metadata] = await this.con.query(
      `SELECT Title FROM [FILM2].[DBO].[FILMS]` +
      `WHERE Title LIKE '%[^a-Z0-9]${word}[^a-Z0-9]%' OR ` +
      `Title LIKE '${word}[^a-Z0-9]%' OR `+
      `Title LIKE '%[^a-Z0-9]${word}' OR `+
      `Title LIKE '${word}'`);
    return { word: search, films: results, metadata };
  }

  async getLatest(search: string = '', pageIndex: number = 0, pageSize: number = 10): Promise<PagedMovie> {
    let searchCount: number;
    const [totalRecord] = await this.con.query(
      `SELECT count(1) FROM [Film2].[dbo].[Films] `);
    const totalDbCount = <number>totalRecord[0][""];

    if (search !== '') {
      const [searchRecord] = await this.con.query(
        `SELECT count(1) FROM [Film2].[dbo].[Films] ` +
        `WHERE Title LIKE '%${this.escape(search)}%'`);

      searchCount = <number>searchRecord[0][""];
    } else {
      searchCount = totalDbCount;
    }

    const [seenAfterCrashRecord] = await this.con.query(
      `SELECT count(1) FROM [Film2].[dbo].[Films] ` +
      `WHERE SeenAt >= '${StartDateNewCounting.toISOString().slice(0, 10)}'`);

    const [res] = await this.con.query(
      `SELECT * FROM [Film2].[dbo].[Films] ` +
      `WHERE Title ${(search === '') ? 'IS NOT NULL' : `LIKE '%${this.escape(search)}%'`} ` +
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

  async add({Title, Url, SeenAt}: DbMovie): Promise<[unknown[], unknown]> {
    return await this.con.query(
      `INSERT INTO [Film2].[dbo].[Films] (Title, Url, SeenAt)
      VALUES ('${this.escape(Title)}', '${this.escape(Url)}', '${this.escape(dayjs(SeenAt).format('YYYY-MM-DD HH:mm:ss'))}')`);
  }

  async update({Id, Title, Url, SeenAt}: DbMovie): Promise<[unknown[], unknown]> {
    return await this.con.query(
      `UPDATE [Film2].[dbo].[Films] `+ 
      `SET Title='${this.escape(Title)}', Url='${this.escape(Url)}', SeenAt='${this.escape(dayjs(SeenAt).format('YYYY-MM-DD HH:mm:ss'))}' `+
      `WHERE Id = ${Id} `);
  }

  async remove(id: number): Promise<[unknown[], unknown]> {
    console.log('service remove')
    return await this.con.query(
      `DELETE [Film2].[dbo].[Films] WHERE Id = ${this.escape(id)}`);
  }

  private escape(value: string | number): string {
    if (typeof (value) === 'number' ) return;
    return value.replace("'","''")    
  }
  private async getWords(title:string): Promise<WordCount[]> {
    // Only match words which must be 2 characters or longer than 2
    // No the, a, in, of or numbers
    // Add any of the common words which have an occurance count of 100 and higher
    const veryCommonWords: string[] = [
      'a',
      'aka',
      // 'all',
      'and',
      // 'do',
      // 'hi',
      'in',
      // 'is',
      // 'it',
      // 'me',
      // 'no',
      'of',
      // 'on',
      // 'or',
      'the',
      'to',
    ];
    const wordsRegex = new RegExp(`\\b(\\w{2,})'?(\\w{2,})?\\b(?<!\\b[0-9].*\\b|\\b${veryCommonWords.join('\\b|\\b')}\\b)`, 'g');
    //match the words and make unique
    let words = title.match(wordsRegex)
    words = (words) ? words.filter((value: string, index: number, array: string[])=> array.indexOf(value) === index) : [];
    //no patterns with "he'"" or "she'" allowed remove the '
    words.forEach((word, index)=> words[index] = word.replace("'", ""));
    //const words = title.match(/\b(\w{2,})'?(\w{2,})?\b(?<!\bthe\b|\b[0-9]\b|\ba\b|\bof\b|\bin\b|\bis\b|\bor\b|\bme\b|\bit\b|\bdo\b|\band\b)/g);
    const promises: Promise<{ word: string; count: number; metadata: unknown; }>[] =[];
    words && words.forEach(async (word)=>{
      promises.push(this.getWordCount(word));
    })
    return await Promise.all(promises);
  }
}

