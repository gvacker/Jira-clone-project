const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

const openIssue = () => cy.contains("Bug").click();

const originalEstimateHours = 10;

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
      });
  });

  it("Add, update and remove time estimation", () => {
    addTimeEstimation();

    updateTimeEstimation();

    removeTimeEstimation();
  });

  it.only("Log and remove logged time", () => {
    const timeSpent = 2;
    const timeRemaining = 5;

    addTimeEstimation();

    openIssue();

    logTime(timeSpent, timeRemaining);

    removeLoggedTime(timeSpent, timeRemaining);
  });
});

function createIssue() {
  cy.get('[data-testid="icon:plus"]').click();

  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get(".ql-editor").type("My bug description");
    cy.get(".ql-editor").should("have.text", "My bug description");

    cy.get('input[name="title"]').type("Bug");
    cy.get('input[name="title"]').should("have.value", "Bug");

    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");
    cy.get('[data-testid="icon:bug"]').should("be.visible");

    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Pickle Rick"]').click();

    cy.get('[data-testid="form-field:userIds"]').click();
    cy.get('[data-testid="select-option:Lord Gaben"]').click();

    cy.get('[data-testid="select:priority"]').click();
    cy.get('[data-testid="select-option:Highest"]').click();

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
        .contains("Bug")
        .siblings()
        .within(() => {
          cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
          cy.get('[data-testid="icon:bug"]').should("be.visible");
        });
    });
}

function changeOriginalEstimateHours(number) {
  getIssueDetailsModal().within(() => {
    cy.get('input[placeholder="Number"]').click().clear().type(number);

    cy.get('[data-testid="icon:close"]').first().click();
  });

  getIssueDetailsModal().should("not.exist");
}

function checkOriginalEstimateHours(number) {
  getIssueDetailsModal().within(() => {
    cy.get('input[placeholder="Number"]').should("have.value", number);

    cy.contains("Time Tracking")
      .siblings()
      .eq(10)
      .children()
      .should("contain", `${number}h estimated`);

    cy.get('[data-testid="icon:close"]').first().click();
  });

  getIssueDetailsModal().should("not.exist");
}

function addTimeEstimation() {
  createIssue();

  openIssue();

  getIssueDetailsModal().within(() => {
    cy.contains("No time logged").should("be.visible");
  });

  changeOriginalEstimateHours(originalEstimateHours);

  openIssue();

  checkOriginalEstimateHours(originalEstimateHours);
}

function updateTimeEstimation() {
  openIssue();

  changeOriginalEstimateHours(20);

  openIssue();

  checkOriginalEstimateHours(20);
}

function removeTimeEstimation() {
  openIssue();

  getIssueDetailsModal().within(() => {
    cy.get('input[placeholder="Number"]').click().clear();

    cy.get('[data-testid="icon:close"]').first().click();
  });

  getIssueDetailsModal().should("not.exist");

  openIssue();

  getIssueDetailsModal().within(() => {
    cy.get('input[placeholder="Number"]').should("be.visible");

    cy.contains("Time Tracking")
      .siblings()
      .eq(10)
      .children()
      .should("not.contain", `${originalEstimateHours}h estimated`);
  });
}

function logTime(timeSpent, timeRemaining) {
  cy.get('[data-testid="icon:stopwatch"]').siblings().click();

  cy.get('[data-testid="modal:tracking"]').within(() => {
    cy.contains("Time tracking").should("be.visible");

    cy.get('input[placeholder="Number"]').first().click().type(timeSpent);
    cy.get('input[placeholder="Number"]').last().click().type(timeRemaining);

    cy.contains("button", "Done").click();
  });

  cy.get('[data-testid="modal:tracking"]').should("not.exist");

  getIssueDetailsModal().within(() => {
    cy.contains("No time logged").should("not.exist");

    cy.get('[data-testid="icon:stopwatch"]')
      .siblings()
      .should("contain", `${timeSpent}h logged`)
      .and("contain", `${timeRemaining}h remaining`);
  });
}

function removeLoggedTime(timeSpent, timeRemaining) {
  cy.get('[data-testid="icon:stopwatch"]').siblings().click();

  cy.get('[data-testid="modal:tracking"]').within(() => {
    cy.contains("Time tracking").should("be.visible");

    cy.get('input[placeholder="Number"]').first().click().clear();
    cy.get('input[placeholder="Number"]').last().click().clear();

    cy.contains("button", "Done").click();
  });

  cy.get('[data-testid="modal:tracking"]').should("not.exist");

  getIssueDetailsModal().within(() => {
    cy.get('[data-testid="icon:stopwatch"]')
      .siblings()
      .should("not.contain", `${timeSpent}h logged`)
      .and("not.contain", `${timeRemaining}h remaining`)
      .and("contain", `${originalEstimateHours}h estimated`);
  });
}
