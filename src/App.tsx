import React, { useEffect, useRef, useState } from "react";
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
  const [distColors, setDistColors] = useState<string[]>([]);
  const [wordCells, setWordCells] = useState<ICell[][]>([]);
  const directions = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // bottom
    [-1, 0], // top
  ];
  const isInitialized = useRef(false);
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
        if (!tableGrid[i][j].isVisited) {
          paintAdjacent(i, j, getRandomColor());
        }
      }
    }
    // paintAdjacent(0, 1, getRandomColor());
    // console.log("distColors", distColors);
    setWordCells(tableGrid);
  };

  const paintAdjacent = (row: number, col: number, color: string) => {
    if (!tableGrid[row][col].isVisited) {
      tableGrid[row][col].color = color;
      tableGrid[row][col].isVisited = true;
      setDistColors((prev) => (prev.includes(color) ? prev : [...prev, color]));
    }

    for (const [dx, dy] of directions) {
      const r = row + dx;
      const c = col + dy;

      if (
        isIndexWithinSize(r, c) &&
        tableGrid[r][c].letter === tableGrid[row][col].letter &&
        !tableGrid[r][c].isVisited
      ) {
        paintAdjacent(r, c, color);
      }
    }
  };
  const isIndexWithinSize = (row: number, col: number) => {
    return row >= 0 && col >= 0 && row < noRows && col < noCols;
  };

  useEffect(() => {
    if (!isInitialized.current) {
      createCellGrid();
      isInitialized.current = true;
    }
  }, []);

  return (
    <>
      <h1 key={wordCells.length}>No Paints Used: {distColors.length}</h1>
      <div className="grid-container">
        {wordCells?.map((rowItem, i) =>
          rowItem.map((colItem, j) => (
            <div
              key={`${i}-${j}`}
              className="grid-item"
              style={{ backgroundColor: colItem.color }}
            >
              {colItem?.letter}
              <div>{colItem.color}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
