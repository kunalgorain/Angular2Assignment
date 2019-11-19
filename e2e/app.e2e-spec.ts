import { FilteringAPage } from './app.po';

describe('filtering-a App', function() {
  let page: FilteringAPage;

  beforeEach(() => {
    page = new FilteringAPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
