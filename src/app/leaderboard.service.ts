import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Leaderboard } from "./leaderboard.model";
import { environment } from '../environments/environment';

const HTTP_URL = environment.apiUrl + "/leaderboard";

@Injectable({ providedIn: 'root' })
export class LeaderboardService {

  constructor(private http: HttpClient) {}

  getLeaderboard() {
    return this.http.get<{ message: string, scores: Leaderboard[] }>(HTTP_URL);
  }

  submitScore(name: string, score: number, level: number) {
    return this.http.post<{ message: string }>(HTTP_URL, { name, score, level });
  }
}
