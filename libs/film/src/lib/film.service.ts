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

  async getAllOcurring2and3LetterCombos(): Promise<string[]> {
    //call multiple queries in one
    const [results] = await this.con.query(
    //26*26*26+26*26 are all the possible combinations of 3 and 2 letters

      //get 2 and 3 letter combos from anywhere in the movie title. Some queries do not need to be executed since all letter combos are known to occur for that starting letter
      `
       SELECT * from (VALUES('aa'),('ab'),('ac'),('ad'),('ae'),('af'),('ag'),('ah'),('ai'),('aj'),('ak'),('al'),('am'),('an'),('ao'),('ap'),('aq'),('ar'),('as'),('at'),('au'),('av'),('aw'),('ax'),('ay'),('az')) as t1(LetterCombo);      
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%b[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%b[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%c[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%c[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%d[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%d[a-zA-Z]%' ORDER BY 1;
       SELECT * from (VALUES('ea'),('eb'),('ec'),('ed'),('ee'),('ef'),('eg'),('eh'),('ei'),('ej'),('ek'),('el'),('em'),('en'),('eo'),('ep'),('eq'),('er'),('es'),('et'),('eu'),('ev'),('ew'),('ex'),('ey'),('ez')) as t1(LetterCombo);
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%f[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%f[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%g[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%g[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%h[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%h[a-zA-Z]%' ORDER BY 1;
       SELECT * from (VALUES('ia'),('ib'),('ic'),('id'),('ie'),('if'),('ig'),('ih'),('ii'),('ij'),('ik'),('il'),('im'),('in'),('io'),('ip'),('iq'),('ir'),('is'),('it'),('iu'),('iv'),('iw'),('ix'),('iy'),('iz')) as t1(LetterCombo);
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%j[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%j[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%k[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%k[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%l[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%l[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%m[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%m[a-zA-Z]%' ORDER BY 1;
       SELECT * from (VALUES('na'),('nb'),('nc'),('nd'),('ne'),('nf'),('ng'),('nh'),('ni'),('nj'),('nk'),('nl'),('nm'),('nn'),('no'),('np'),('nq'),('nr'),('ns'),('nt'),('nu'),('nv'),('nw'),('nx'),('ny'),('nz')) as t1(LetterCombo);
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%o[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%o[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%p[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%p[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%q[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%q[a-zA-Z]%' ORDER BY 1;
       SELECT * from (VALUES('ra'),('rb'),('rc'),('rd'),('re'),('rf'),('rg'),('rh'),('ri'),('rj'),('rk'),('rl'),('rm'),('rn'),('ro'),('rp'),('rq'),('rr'),('rs'),('rt'),('ru'),('rv'),('rw'),('rx'),('ry'),('rz')) as t1(LetterCombo);
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%s[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%s[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%t[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%t[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%u[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%u[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%v[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%v[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%w[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%w[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%x[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%x[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%y[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%y[a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%z[a-zA-Z]%', Title), 2) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%z[a-zA-Z]%' ORDER BY 1;

       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%a[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%a[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%b[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%b[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%c[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%c[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%d[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%d[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%e[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%e[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%f[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%f[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%g[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%g[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%h[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%h[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%i[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%i[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%j[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%j[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%k[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%k[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%l[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%l[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%m[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%m[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%n[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%n[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%o[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%o[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%p[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%p[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%q[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%q[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%r[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%r[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%s[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%s[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%t[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%t[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%u[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%u[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%v[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%v[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%w[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%w[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%x[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%x[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%y[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%y[a-zA-Z][a-zA-Z]%' ORDER BY 1;
       SELECT DISTINCT SUBSTRING(Title, PATINDEX('%z[a-zA-Z][a-zA-Z]%', Title), 3) AS LetterCombo FROM[Film2].[dbo].[Films] WHERE Title like '%z[a-zA-Z][a-zA-Z]%' ORDER BY 1;`
      );
    return (<string[]>results).map((item) => item["LetterCombo"]);
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
    const wordsRegex = new RegExp(`\\b(\\w{2,})'?(\\w{2,})?\\b(?<!\\d|\\b${veryCommonWords.join('\\b|\\b')}\\b)`, 'g');
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

