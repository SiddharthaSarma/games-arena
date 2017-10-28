import { GamesArenaPage } from './app.po';

describe('games-arena App', () => {
  let page: GamesArenaPage;

  beforeEach(() => {
    page = new GamesArenaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
