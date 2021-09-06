import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { Word } from "../word.model";
import { WordRacePlayService } from "../word-race-play.service";
import { LeaderboardService } from "../leaderboard.service";


// const keysLine1Codes = [...Array(10).keys()].map(x => x + 65);
// const keysLine2Codes = [...Array(9).keys()].map(x => x + 75);
// const keysLine3Codes = [...Array(10).keys()].map(x => x + 84);

@Component({
  selector: 'app-word-race-play',
  templateUrl: './word-race-play.component.html',
  styleUrls: ['./word-race-play.component.css']
})
export class WordRacePlayComponent implements OnInit{
  // keysLine1 = Array.from(String.fromCharCode(...keysLine1Codes));
  // keysLine2 = Array.from(String.fromCharCode(...keysLine1Codes));
  // keysLine3 = Array.from(String.fromCharCode(...keysLine1Codes));
  keysLine1 = ["Q","W","E","R","T","Y","U","I","O","P"];
  keysLine2 = ["A","S","D","F","G","H","J","K","L"];
  keysLine3 = ["Z","X","C","V","B","N","M"];

  keyId="";
  wordCollection: Word[] = [];
  stackWords: Word[] = [];
  newWords: Word[] = [];
  wordSet = 1;
  // private wordsSubscription: Subscription;
  stackCount = 0;
  wordsLoaded = 0;
  growthFactor = 0.8;
  loadStackWordTime = 4000;

  score = 0;
  scoreMultiplier = 5;
  top=0;
  startSeconds = 0;
  currentLevel = 1;
  levelFactor = 1;

  constructor(public wordRacePlayService: WordRacePlayService, public leaderboardService: LeaderboardService) {}

  ngOnInit(): void {

    let instructions1 = "Instructions:- \nWords appear at a rate that increases as time progresses. It's Game Over when the stack space fills up after 7 words appear. \nIf a player types a word correctly and hits ENTER, it is removed from the stack."
    let instructions2 = "\nThe score is calculated based on a multiplier and on how fast the player correctly types the word and submits. \nThe multiplier increases with every correctly typed word and resets on any mistype. \nOnce you reach a certain score, the level goes up and you receive an additional bonus.";
    let instructions3 = "\nOnce the game is over, you can submit your score. Also, you can click on the Leaderboard button to view the top 10 scores. \nIf you wish to play again, then click on the Word Race text on the left."
    alert(instructions1 + instructions2 + instructions3);

    this.wordRacePlayService.getWords(this.wordSet)
      .subscribe((wordData) => {
        this.newWords = wordData.words;

        this.wordSet = ++this.wordSet;
        this.wordCollection.push(...this.newWords);
        this.startSeconds = Date.now()/1000;

        this.loadStackWords();
      });;
  }

  displayKeyPress(event: KeyboardEvent) {
    let keyEvent = event;
    // console.log(key);
    document.getElementById(keyEvent.code)?.classList.add('key-pressed');
    this.keyId = keyEvent.code;
  }

  resetKey() {
    //console.log(document.getElementById(this.keyId));
    document.getElementById(this.keyId)?.classList.remove('key-pressed');
  }

  onSubmitWord(form: NgForm) {

    if(form.value.typedWord.toUpperCase() == this.stackWords[0].title.toUpperCase()) {  // correct spelling
      this.stackWords.shift();
      this.stackCount = --this.stackCount;

      let secondsElapsed = (Date.now()/1000) - this.startSeconds;
      this.score = Math.trunc(this.score + ((5 / secondsElapsed) * this.scoreMultiplier));
      this.scoreMultiplier = this.scoreMultiplier * 2;
      this.startSeconds = Date.now()/1000;
      //console.log("Score: " + this.score);

      if(this.score >= 100 * this.levelFactor * this.currentLevel) {   // next level
        this.currentLevel = ++this.currentLevel;
        this.levelFactor = this.levelFactor * 10;
        this.loadStackWordTime = 4000;                // reset time on level-up
        this.score = this.score + this.levelFactor;   // bonus on level-up
        //console.log("Level: " + this.currentLevel);
      }

    }
    else {                        // wrong spelling
      this.scoreMultiplier = 5;
    }

    form.reset();
  }

  loadStackWords() {

    let nextWord = this.wordCollection[this.wordsLoaded];
    this.stackWords.push(nextWord);
    this.stackCount = ++this.stackCount;
    this.wordsLoaded = ++this.wordsLoaded;

    if(this.stackCount === 7) {   // Game Over
      // logic for game over popup
      let submitScoreText = "\nDo you wish to submit your score? If yes, enter your name!"
      let playerName = prompt("Game Over! Your score is " + this.score + submitScoreText, "New Player");

      if (playerName != null && playerName != "") {
        let playerNameText = playerName !== null ? playerName: "";
        this.leaderboardService.submitScore(playerNameText, this.score, this.currentLevel)
          .subscribe((msg) => {
            console.log(msg);
          });
      }
      return;
    }

    if(this.wordsLoaded === this.wordCollection.length - 2) {   // API call to get next batch of words
      this.wordRacePlayService.getWords(this.wordSet)
        .subscribe((wordData) => {
          this.newWords = wordData.words;
          this.wordSet = ++this.wordSet;
          this.wordCollection.push(...this.newWords);
        });
    }
    console.log(this.wordCollection); //remove
    setTimeout(() => {
      this.loadStackWords();
    }, this.loadStackWordTime);
    this.loadStackWordTime = this.loadStackWordTime * this.growthFactor;
  }


}
