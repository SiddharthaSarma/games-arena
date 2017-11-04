import { Observable } from 'rxjs/Observable';
import { GamesService } from './games.service';
import { Component, AfterViewInit } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public games = [];
  public gamesList = [];
  public searchGame = '';
  public sortValue = -1;
  public platformValue = -1;
  public platformList = [];
  public maxLimit = 0;
  public rateCount = 0;
  public loading = false;
  constructor(private _gamesService: GamesService) {}

  ngAfterViewInit() {
    this.fetchGames();
    this.handleRates();
    const input: any = document.getElementById('search');
    const search = Observable.fromEvent(input, 'keyup')
      .do(() => {
        this.searchGame = input.value;
        this.games = [];
      })
      .switchMap(() =>
        this._gamesService.searchGames(this.searchGame, this.gamesList, {
          sortScore: this.sortValue,
          selectedPlatform: this.platformValue
        })
      );

    search.subscribe(games => this.games.push(games));
  }

  // Fetch the list of games.
  fetchGames() {
    this.loading = true;
    this._gamesService.fetchGames().subscribe(data => {
      this.loading = false;
      this.gamesList = data.response;
      const rateLimit = this.gamesList.shift();
      this.maxLimit = rateLimit.api_rate_limit;
      this.games = [...this.gamesList];
      this.platformList = this._gamesService.getPlatforms(this.games);
    });
  }

  // Handle the Api rates.
  handleRates() {
    const rateCount = localStorage.getItem('rateCount');
    if (rateCount) {
      this.rateCount = +rateCount + 1;
    } else {
      this.rateCount++;
    }
    localStorage.setItem('rateCount', this.rateCount.toString());
  }

  // Sort the games based on filters.
  sortGames() {
    this.games = this._gamesService.searchGames(
      this.searchGame,
      this.gamesList,
      {
        sortScore: this.sortValue,
        selectedPlatform: this.platformValue
      }
    );
  }
}
