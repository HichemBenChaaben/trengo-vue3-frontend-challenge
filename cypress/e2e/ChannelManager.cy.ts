describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('contains page elements', () => {
    cy.visit('/')
    cy.get('[data-testid="channel-manager-title"]').should('exist')
    cy.get('[data-testid="channel-manager-title"]').contains('Channels')
    cy.get('[data-testid="suggestions-input"]').should('exist')
    cy.get('[data-testid="channels-row"]').should('exist')
  })
  it('can can remove a channel', () => {
    cy.get('[data-testid="remove-button"]').click()
    cy.get('ul').children().should('have.length', 0)
  })
  it('can add a channel', () => {
    cy.get('[data-testid="suggestions-input"]').type('blockchain', { delay: 200, force: true })
    cy.get('[data-testid="suggestions-input"]').blur()
    cy.get('[data-testid="suggestions-list"]').should('exist')
    cy.get('[data-testid="suggestions-list"] li:first').click({ force: true })
    cy.get('[data-testid="apply-button"]').click({ force: true })
    cy.get('ul').children().should('have.length', 2)
  })
  it.skip('change the order of the chanels', () => {
    cy.get('[data-testid="suggestions-input"]').type('blockchain', { delay: 200, force: true })
    cy.get('[data-testid="suggestions-input"]').blur()
    cy.get('[data-testid="suggestions-list"]').should('exist')
    cy.get('[data-testid="suggestions-list"] li:first').click({ force: true })
    cy.get('body').click()

    cy.get('.js-handle').eq(2).move({ deltaX: 0, deltaY: -90, force: true })

    cy.get('ul').children().eq(0).should('contain.text', 'brand ubiquitous synergies')

    cy.get('[data-testid="apply-button"]').click({ force: true })
    cy.reload()
    cy.get('ul').children().should('have.length', 2)
  })
})
