describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('https://realtime-app2.vercel.app/')
  })

  it('Shall navigate to Dashboard when successfully login', () => {
    cy.get('input[placeholder="Email"]').type('user1@test.com')
    cy.get('input[placeholder="Password"]').type('hyde4212')
    cy.get("[type='submit']").click()
    cy.get('[data-testid="logout"]').should('be.visible')
  })

  it('Shall navigate to Auth when logout clicked', () => {
    cy.get('input[placeholder="Email"]').type('user1@test.com')
    cy.get('input[placeholder="Password"]').type('hyde4212')
    cy.get("[type='submit']").click()
    cy.get('[data-testid="logout"]').should('be.visible')
    cy.get('[data-testid="logout"]').click()
    cy.get('input[placeholder="Email"]').should('be.visible')
    cy.get('input[placeholder="Password"]').should('be.visible')
  })

  it('Shall not navigate to Dashboard with wrong credentials', () => {
    cy.get('input[placeholder="Email"]').type('user1@test.com')
    cy.get('input[placeholder="Password"]').type('hyde421')
    cy.get("[type='submit']").click()
    cy.get('[data-testid="logout"]').should('not.exist')
  })
})
