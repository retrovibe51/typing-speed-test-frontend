import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordRacePlayComponent } from './word-race-play/word-race-play.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

const routes: Routes = [
  { path: "", component: WordRacePlayComponent },
  { path: "leaderboard", component: LeaderboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
