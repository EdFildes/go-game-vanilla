import { TestGame } from "../TestGame";

const formatExpected = (expected: string) =>
  expected.replace(/\s{2,}/g, "\n").trim();

describe("game states", () => {
  it("should place a piece", () => {
    const game = new TestGame(8);

    game.simulateClick([1, 1]);

    const actual = game.printBoard();
    const expected = `
      - - - - - - - -
      - O - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
    `;
    expect(formatExpected(expected)).toEqual(actual);
  });

  it("should merge groups of same color in to one", () => {
    const game = new TestGame(8);

    game.setFixColor(true);
    game.simulateClick([3, 4]);
    game.simulateClick([2, 5]);
    game.simulateClick([3, 6]);
    game.simulateClick([3, 5]);

    const actual = game.printGroups();
    const expected = `
      - - - - - - - -
      - - - - - - - -
      - - - - - 1 - -
      - - - - 1 1 1 -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
    `;
    expect(formatExpected(expected)).toEqual(actual);
  });

  it("should remove a piece thats been surrounded", () => {
    const game = new TestGame(8);

    game.setCurrentColor("O");
    game.setFixColor(true);
    game.simulateClick([3, 4]);
    game.simulateClick([2, 5]);
    game.simulateClick([3, 6]);
    game.setCurrentColor("X");
    game.simulateClick([3, 5]);
    game.setCurrentColor("O");
    game.simulateClick([4, 5]);

    const actual = game.printBoard();
    const expected = `
      - - - - - - - -
      - - - - - - - -
      - - - - - O - -
      - - - - O - O -
      - - - - - O - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
    `;
    expect(formatExpected(expected)).toEqual(actual);
  });

  it("should remove a group thats been surrounded", () => {
    const game = new TestGame(8);

    game.setCurrentColor("O");
    game.setFixColor(true);
    game.simulateClick([3, 3]);
    game.simulateClick([2, 4]);
    game.simulateClick([2, 5]);
    game.simulateClick([3, 6]);

    game.setCurrentColor("X");
    game.simulateClick([3, 4]);
    game.simulateClick([3, 5]);

    game.setCurrentColor("O");
    game.simulateClick([4, 4]);
    game.simulateClick([4, 5]);

    const actual = game.printBoard();
    const expected = `
      - - - - - - - -
      - - - - - - - -
      - - - - O O - -
      - - - O - - O -
      - - - - O O - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
    `;
    expect(formatExpected(expected)).toEqual(actual);
  });

  it("should pay liberties back when a group is removed", () => {
    const game = new TestGame(8);

    game.setFixColor(true);
    game.setCurrentColor("O");
    game.simulateClick([0, 0]);

    game.setCurrentColor("X");
    game.simulateClick([0, 1]);
    game.simulateClick([1, 0]);

    game.setCurrentColor("O");
    game.simulateClick([0, 2]);
    game.simulateClick([1, 1]);
    game.simulateClick([2, 0]);

    const actual = game.printBoard();
    const expected = `
      - X O - - - - -
      X O - - - - - -
      O - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
      - - - - - - - -
    `;
    expect(formatExpected(expected)).toEqual(actual);
  });
});
