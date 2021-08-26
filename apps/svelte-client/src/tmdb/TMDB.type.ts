export interface TMDBMovie {
  account_states: any;
  adult: boolean;
  alternative_titles: any;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  changes: any;
  credits: any;
  genres: any;
  homepage: string;
  id: number;
  images: any;
  imdb_id: string;
  keywords: any;
  lists: any;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: any;
  production_countries: any;
  release_date?: Date;
  release_dates: any;
  releases: any;
  revenue: number;
  reviews: any;
  runtime?: number;
  similar: any;
  recommendations: any;
  spoken_languages: any;
  status: string;
  tagline: string;
  title: string;
  translations: any;
  video: boolean;
  videos: any;
  vote_average: number;
  vote_count: number;
}

export interface TMDBSearchMovieResult {
  poster_path: string;
  adult: boolean,
  overview: string;
  release_date: Date
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number
}

export interface TMDBMovieVideos { 
  id?: number;
  results: TMDBMovieVideo[];
}

export interface TMDBMovieVideo { 
  iso_639_1?: string;
  iso_3166_1?: string;  
  name?: string;  
  key?: string;  
  site?: string;  
  size?: number;  
  type?: string;  
  official?: boolean;  
  published_at?: string;  
  id?: string;
}

