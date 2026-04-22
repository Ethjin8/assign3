import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}


export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [moves, setMoves] = useState(0);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [selected, setSelected] = useState(-1);

  function swap(nextSquares, i) {
    let temp = nextSquares[i];
    nextSquares[i] = nextSquares[selected];
    nextSquares[selected] = temp;
    setSelected(-1);
  }

  function move(nextSquares, turn, selected, i) {
    if (selected != -1 && !nextSquares[i] && validMove(selected, i)) {
      if (nextSquares[4] == turn && selected != 4) {
        const simulated = nextSquares.slice();
        simulated[i] = simulated[selected];
        simulated[selected] = null;
        if (calculateWinner(simulated) != turn) return;
      }
      swap(nextSquares, i);
      setXIsNext(!xIsNext);
    }
    else if (i == selected) {
      setSelected(-1);
    }
    else {
      if (nextSquares[i] == turn) {
        setSelected(i);
      }
      return;
    }
  }

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      if (moves < 3) {
        if (nextSquares[i]) return;
        nextSquares[i] = "X";
        setXIsNext(!xIsNext);
      }
      else {
        move(nextSquares, "X", selected, i);
      }
    }
    else {
      if (moves < 3) {
        if (nextSquares[i]) return;
        nextSquares[i] = "O";
        setMoves(moves + 1);
        setXIsNext(!xIsNext);
      }
      else {
        move(nextSquares, "O", selected, i);
      }
    }

    setSquares(nextSquares);
  }

  // Check for winner, set status
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <> 
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
</>
  );
}

// Helper functions
function validMove(from, to) {
  const rowFrom = Math.floor(from / 3);
  const colFrom = from % 3;
  
  const rowTo = Math.floor(to / 3);
  const colTo = to % 3;

  return (Math.abs(rowTo - rowFrom) <= 1 && Math.abs(colTo - colFrom) <= 1);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}