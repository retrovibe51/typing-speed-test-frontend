import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";

import { Word } from "./word.model";
import { environment } from '../environments/environment';

const HTTP_URL = environment.apiUrl + "/words";

@Injectable({ providedIn: 'root' })
export class WordRacePlayService {

  private words: Word[] = [];
  private wordsFetched = new Subject<{ words: Word[] }>();

  constructor(private http: HttpClient) {}

  getWordsFetchedListener() {
    return this.wordsFetched.asObservable();
  }

  getWords(wordSet: number) {
    const queryParams = `?nCount=${wordSet}`;
    return this.http.get<{ message: string, words: Word[] }>(HTTP_URL + queryParams);
      // .subscribe((wordData) => {
      //   this.words = wordData.words;
      //   this.wordsFetched.next({ words: [...this.words] });
      // });
  }
}
