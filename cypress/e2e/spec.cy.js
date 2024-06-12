describe('Spotify Dashboard', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/token', { fixture: 'loginResponse.json' }).as('login');
    cy.intercept('GET', '**/v1/me', { fixture: 'userinfo.json' }).as('getUserInfo');

    //base url set in config
    cy.visit('/');
  });

  it('should display the login button on the home page', () => {
    cy.contains('Log in with Spotify').should('be.visible');
  });

  it('should login and redirect to the dashboard', () => {
    cy.contains('Log in with Spotify').click();

    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake_access_token');
      win.localStorage.setItem('refresh_token', 'fake_refresh_token');
      win.localStorage.setItem('expires_at', (Date.now() + 3600 * 1000).toString());
      win.location.href = '/dashboard';
    });

    cy.url().should('include', '/dashboard');
  });

  it('should display and interact with search field, search button, and play/pause button', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake_access_token');
      win.localStorage.setItem('refresh_token', 'fake_refresh_token');
      win.localStorage.setItem('expires_at', (Date.now() + 3600 * 1000).toString());
    });

    cy.visit('/dashboard');
    cy.get('input[placeholder="Search for a track"]').should('be.visible').type('Not Like Us').should('have.value', 'Not Like Us');
    cy.contains('Search').should('be.visible').click();
    cy.contains('Play/Pause').should('be.visible');
  });

  it('should collapse and expand the track list', () => {
    // set up a logged-in state
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake_access_token');
      win.localStorage.setItem('refresh_token', 'fake_refresh_token');
      win.localStorage.setItem('expires_at', (Date.now() + 3600 * 1000).toString());
    });

    cy.visit('/dashboard');

    cy.contains('Collapse List').click();
    cy.get('ul').should('not.exist');
    cy.contains('Expand List').click();
    cy.get('ul').should('exist');
  });

  it('should change color scheme', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'fake_access_token');
      win.localStorage.setItem('refresh_token', 'fake_refresh_token');
      win.localStorage.setItem('expires_at', (Date.now() + 3600 * 1000).toString());
    });

    cy.visit('/dashboard');
    cy.get('select#colorScheme').select('cool');
    cy.get('select#colorScheme').should('have.value', 'cool');
  });
});
