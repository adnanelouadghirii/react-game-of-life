import React, { useState, useEffect, useRef } from 'react';
import './GameOfLife.css';

const numRows = 25;
const numCols = 25;

const createEmptyGrid = () => {
  return Array.from({ length: numRows }).map(() => Array.from({ length: numCols }).fill(0));
};

const createRandomGrid = () => {
  return Array.from({ length: numRows }).map(() =>
    Array.from({ length: numCols }).map(() => (Math.random() > 0.7 ? 1 : 0))
  );
};

const GameOfLife = () => {
  const [grid, setGrid] = useState(createRandomGrid);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  const runGame = () => {
    if (!runningRef.current) return;

    setGrid((g) => {
      return g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
            return 0;
          }
          if (cell === 0 && neighbors === 3) {
            return 1;
          }
          return cell;
        })
      );
    });

    setTimeout(runGame, 100);
  };

  useEffect(() => {
    if (running) {
      runGame();
    }
  }, [running]);

  const toggleCell = (i, j) => {
    const newGrid = grid.map((row, x) =>
      row.map((cell, y) => (x === i && y === j ? (cell ? 0 : 1) : cell))
    );
    setGrid(newGrid);
  };

  const cellSize = window.innerWidth <= 480 ? 15 : 20;

  return (
    <div className="game-container">
      <div className="controls">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runGame();
            }
          }}
          className="btn"
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => setGrid(createEmptyGrid())} className="btn">
          Clear
        </button>
        <button onClick={() => setGrid(createRandomGrid())} className="btn">
          Random
        </button>
      </div>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => toggleCell(i, j)}
              className={`cell ${cell ? 'alive' : ''}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameOfLife;
