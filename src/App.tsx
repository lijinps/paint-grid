import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface ICell {
  letter: string;
  color: string;
  isVisited: boolean;
}
export default function App() {
  const words = ["abbac", "caabc", "abacc", "bbcca", "abcac"];
  const usedColors = new Set();
  const [wordCells, setWordCells] = useState<ICell[][]>([]);
  const directions = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // bottom
    [-1, 0], // top
  ];

  const getRandomColor = () => {
    let color;
    do {
      color = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    } while (usedColors.has(color) && usedColors.size < 16777215);

    usedColors.add(color);
    if (usedColors.size > 5000) usedColors.clear();
    return color;
  };
  const tableGrid: ICell[][] = [];
  const noRows = words.length;
  const noCols = words[0].length;
  const createCellGrid = () => {
    words.forEach((word, i) => {
      if (!tableGrid[i]) {
        tableGrid[i] = [];
      }

      Array.from(word).forEach((letter, j) => {
        tableGrid[i][j] = {
          color: "",
          letter,
          isVisited: false,
        };
      });
    });
    for (let i = 0; i < noRows; i++) {
      for (let j = 0; j < noCols; j++) {
        paintAdjecent(i, j, getRandomColor());
      }
    }
    // paintAdjecent(2, 1, getRandomColor());

    setWordCells(tableGrid);
  };

  const paintAdjecent = (
    row: number,
    col: number,
    color: string
    // direction: [number, number]
  ) => {
    tableGrid[row][col].color = color;
    tableGrid[row][col].isVisited = true;
    // if (row < 0 || col < 0 || row > noRows || col > noCols) {
    //   return;
    // }

    for (let i = 0; i < directions.length; i++) {
      const r = row + directions[i][0];
      const c = col + directions[i][1];
      if (
        r < noRows &&
        r > 0 &&
        c < noCols &&
        c > 0 &&
        tableGrid[row][col]?.letter === tableGrid[r][c].letter &&
        !tableGrid[r][c].isVisited
      ) {
        paintAdjecent(r, c, color);
      } else if (
        r < noRows &&
        r > 0 &&
        c < noCols &&
        c > 0 &&
        tableGrid[row][col]?.letter === tableGrid[r][c].letter &&
        tableGrid[r][c].isVisited
      ) {
        tableGrid[row][col].color = tableGrid[r][c].color;
      }
    }
    // if (tableGrid[row][col].color === "") {
    //   tableGrid[row][col].color = getRandomColor();
    // }
  };

  useEffect(() => {
    createCellGrid();
  }, []);

  return (
    <>
      <h1>Hello world</h1>
      <div className="grid-container">
        {wordCells &&
          wordCells.map((rowItem, i) =>
            rowItem.map((colItem, j) => (
              <div
                key={`${i}-${j}`}
                className="grid-item"
                style={{ backgroundColor: colItem.color }}
              >
                {colItem?.letter}
              </div>
            ))
          )}
      </div>
    </>
  );
}
