describe("Issue details deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.")
          .should("be.visible")
          .click();
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should delete an issue", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Are you sure you want to delete this issue?").should(
        "be.visible"
      );
      cy.get("button").contains("Delete issue").click();
    });

    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains("This is an issue of type: Task.").should("not.exist");
      cy.get('[data-testid="list-issue"]').should("have.length", "3");
    });
  });

  it("Should cancel an issue deletion successfully", () => {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:trash"]')
        .should("be.visible")
        .trigger("mouseover")
        .trigger("click");
    });

    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .and("contain", "Are you sure you want to delete this issue?");
    cy.get("button").contains("Cancel").click();

    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    getIssueDetailsModal().find('[data-testid="icon:close"]').first().click();
    getIssueDetailsModal().should("not.exist");

    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "4")
          .first()
          .should("have.text", "This is an issue of type: Task.");
      });
  });
});

