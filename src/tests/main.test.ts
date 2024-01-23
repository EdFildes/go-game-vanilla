import { TestGame } from "../TestGame";


const formatExpected = (expected: string) => expected.replace(/\s{2,}/g, "\n").trim();

describe("game states", () => {
  it("should place a piece", () => {
    const game = new TestGame(8);
  
    game.simulateClick([1, 1]);
  
    const actual = game.printBoard();
    const expected = 
    `
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
  })

  it("should merge groups of same color in to one", () => {
    const game = new TestGame(8);
  
    game.setFixColor(true);
    game.simulateClick([3, 4]);
    game.simulateClick([2, 5]);
    game.simulateClick([3, 6]);
    game.simulateClick([3, 5]);
  
    const actual = game.printGroups();
    const expected = 
    `
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
  })

  it("should remove a piece thats been surrounded", () => {
    const game = new TestGame(8);
  
    game.setCurrentColor("O")
    game.setFixColor(true);
    game.simulateClick([3, 4]);
    game.simulateClick([2, 5]);
    game.simulateClick([3, 6]);
    game.setCurrentColor("X")
    game.simulateClick([3, 5]);
    game.setCurrentColor("O")
    game.simulateClick([4, 5]);
  
    const actual = game.printBoard();
    const expected = 
    `
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
  })
})