import { NexusManagerPage } from './app.po';

describe('nexus-manager App', function() {
  let page: NexusManagerPage;

  beforeEach(() => {
    page = new NexusManagerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
