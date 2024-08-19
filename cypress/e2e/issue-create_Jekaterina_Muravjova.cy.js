
describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });
  
  it.only("Should create a Bug issue and validate it successfully", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");
  
      cy.get('input[name="title"]').type("bug");
      cy.get('input[name="title"]').should("have.value", "bug");
  
      //Open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:bug"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");
  
      // Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
  
      // Select Lord Gaben from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
  
      // Select Highest from Priority dropdown
      cy.get('[data-testid="select:Priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();
    
      // Click on button "Create issue"
      cy.get('button[type="Submit"]').click();
  
      // Assert that modal window is closed and successful message is visible
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");
  
      // Reload the page to be able to see recently created issue
      // Assert that successful message has dissappeared after the reload
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
  
      // Assert than only one list with name Backlog is visible and do steps inside of it
      cy.get('[data-testid="board-list:backlog"]')
        .should("be.visible")
        .and("have.length", "1")
        .within(() => {
          // Assert that this list contains 5 issues and first element with tag p has specified text
          cy.get('[data-testid="list-issue"]')
            .should("have.length", "5")
            .first()
            .find("p")
            .contains("bug")
            .siblings()
            .within(() => {
              //Assert that correct avatar and type icon are visible
              cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
              cy.get('[data-testid="icon:bug"]').should("be.visible");
            });
  
          cy.get('[data-testid="board-list:backlog"]')
            .contains("bug")
            .within(() => {
              // Assert that correct avatar and type icon are visible
              cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
              cy.get('data-testid="icon:bug"]').should("be.visible");
            });
        });
    });
  });
    });

  import IssueModal from "../pages/IssueModal";
  import { faker } from "@faker-js/faker";
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  describe("Issue create", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
          // System will already open issue creating modal in beforeEach block
          cy.visit(url + "/board?modal-issue-create=true");
        });
    });
  
    it("Should create an issue with random data and validate it successfully", () => {
   
      const randomTitle = faker.lorem.sentence();
      const randomDescription = faker.lorem.paragraph();
        cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get(".ql-editor").type(randomDescription);
        cy.get(".ql-editor").should("have.text", randomDescription);
        cy.get('input[name="title"]').type(randomTitle);
        cy.get('input[name="title"]').should("have.value", randomTitle);
        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Low"]')
          .wait(1000)
          .trigger("mouseover")
          .trigger("click");
        cy.get('[data-testid="icon:arrow-down"]').should("be.visible");
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Baby Yoda"]').click();
  
        cy.get('button[type="submit"]').click();
      });
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
      cy.get('[data-testid="board-list:backlog"]')
        .should("be.visible")
        .and("have.length", "1")
        .within(() => {
          cy.get('[data-testid="list-issue"]')
            .should("have.length", "5")
            .first()
            .find("p")
            .contains(randomTitle)
            .siblings()
            .within(() => {
              cy.get('[data-testid="icon:task"]').should("be.visible");
            });
        });
      cy.get('[data-testid="board-list:backlog"]')
        .contains(randomTitle)
        .within(() => {
          cy.get('[data-testid="icon:task"]').should("be.visible");
        });
    });
  });
       
       
     
  
  
    
  

