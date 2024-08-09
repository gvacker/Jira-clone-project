describe('Issue deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });

        cy.get('[data-testid="modal:issue-details"]').should('be.visible').contains('This is an issue of type: Task.');

    });


    it('Delete last issue successfully', () => {

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('button>i[data-testid="icon:trash"]').click();
        });

        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {

            cy.contains('Are you sure you want to delete this issue?');
            cy.contains('button', 'Delete issue').click();

        });

        cy.get('[data-testid="modal:confirm"]').should('not.exist');

        cy.reload();


        cy.get('[data-testid="board-list:backlog"]')
            .should('be.visible')
            .and('have.length', '1')
            .within(() => {

                cy.get('[data-testid="list-issue"]')
                    .should('have.length', '3')
                    .first()
                    .find('p')
                    .contains('This is an issue of type: Task.').should('not.exist');
            });

    });



    it('Canceling issue deletion process successfully', () => {

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('button>i[data-testid="icon:trash"]').click();
        });

        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {

            cy.contains('Are you sure you want to delete this issue?');
            cy.contains('button', 'Cancel').click();

        });

        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');

        cy.get('button>i[data-testid="icon:close"]').click();

        cy.contains('Kanban board');


        cy.get('[data-testid="board-list:backlog"]')
            .should('be.visible')
            .and('have.length', '1')
            .within(() => {

                cy.get('[data-testid="list-issue"]')
                    .should('have.length', '4')
                    .first()
                    .find('p')
                    .contains('This is an issue of type: Task.').should('exist');
            });


    });


});