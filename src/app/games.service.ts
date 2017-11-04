import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GamesService {
  constructor(private http: Http) {}

  // Fetch games list from server.
  fetchGames() {
    return this.http
      .get(`http://starlord.hackerearth.com/gamesarena`)
      .map(response => {
        return {
          response: response.json(),
          headers: response.headers
        };
      });
  }

  // Search games list based on filters.
  searchGames(
    search = '',
    games = [],
    filters = { sortScore: -1, selectedPlatform: -1 }
  ) {
    let sortedGames = games.filter(game => {
      if (filters.selectedPlatform != -1) {
        return (
          game.title.toLowerCase().match(search.toLowerCase()) &&
          game.platform === filters.selectedPlatform
        );
      } else {
        return game.title.toLowerCase().match(search.toLowerCase());
      }
    });
    if (+filters.sortScore !== -1) {
      sortedGames =
        +filters.sortScore === 1
          ? sortedGames.sort(this.ascSort)
          : sortedGames.sort(this.descSort);
    }
    return sortedGames;
  }

  // Get unique platforms from the games.
  getPlatforms(games = []) {
    return Array.from(new Set(games.map(game => game.platform))).sort();
  }

  // Sort in ascending based on score.
  ascSort(a, b) {
    if (a.score > b.score) {
      return 1;
    } else if (a.score < b.score) {
      return -1;
    } else {
      return 0;
    }
  }

  // Sort in descending based on score.
  descSort(a, b) {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      return 0;
    }
  }
}
