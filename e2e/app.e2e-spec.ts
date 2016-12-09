import { EmailservicePage } from './app.po';

describe('emailservice App', function() {
  let page: EmailservicePage;

  beforeEach(() => {
    page = new EmailservicePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
