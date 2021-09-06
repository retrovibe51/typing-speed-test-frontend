import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { LeaderboardService } from "../leaderboard.service";
import { Leaderboard } from "../leaderboard.model";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  leaderboards: Leaderboard[] = [];
  displayedColumns: string[] = ['playerName', 'score', 'numberOfGames', 'averageScore', 'maxLevel'];

  constructor(public leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.leaderboardService.getLeaderboard()
      .subscribe((leaderboardData) => {
        console.log(leaderboardData);
        this.leaderboards = leaderboardData.scores;
        console.log(this.leaderboards);
      });
  }

}
