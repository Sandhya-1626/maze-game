import { GameEngine } from './engine';
import { Point } from './algorithms';

const ROWS = 21;
const COLS = 21;

const engine = new GameEngine(ROWS, COLS);
const gridElement = document.getElementById('maze-grid')!;
const solveBtn = document.getElementById('solve-btn')! as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn')! as HTMLButtonElement;
const algoSelect = document.getElementById('algo-select')! as HTMLSelectElement;
const statusText = document.getElementById('game-status')!;

function render() {
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${engine.cols}, 25px)`;

    for (let r = 0; r < engine.rows; r++) {
        for (let c = 0; c < engine.cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            const val = engine.maze[r][c];
            if (val === '1') cell.classList.add('wall');
            else if (val === 'S') cell.classList.add('start');
            else if (val === 'G') cell.classList.add('goal');
            else cell.classList.add('space');

            // Draw path
            if (engine.path.some(p => p[0] === r && p[1] === c)) {
                cell.classList.add('path');
            }

            // Draw player
            if (engine.playerPosition[0] === r && engine.playerPosition[1] === c) {
                cell.classList.add('player');
            }

            gridElement.appendChild(cell);
        }
    }
}

async function solve() {
    const algo = algoSelect.value as 'BFS' | 'DFS' | 'A*';
    statusText.textContent = `Solving with ${algo}...`;
    solveBtn.disabled = true;

    const result = await engine.solve(algo);

    if (result) {
        statusText.textContent = `Goal reached in ${result.length} steps!`;
    } else {
        statusText.textContent = 'No path found.';
    }

    render();
    solveBtn.disabled = false;
}

function reset() {
    engine.reset(ROWS, COLS);
    statusText.textContent = 'Ready';
    render();
}

window.addEventListener('keydown', (e) => {
    let moved = false;
    if (e.key === 'ArrowUp') moved = engine.movePlayer(-1, 0);
    else if (e.key === 'ArrowDown') moved = engine.movePlayer(1, 0);
    else if (e.key === 'ArrowLeft') moved = engine.movePlayer(0, -1);
    else if (e.key === 'ArrowRight') moved = engine.movePlayer(0, 1);

    if (moved) {
        if (engine.playerPosition[0] === engine.goalPosition[0] &&
            engine.playerPosition[1] === engine.goalPosition[1]) {
            statusText.textContent = '🎉 You won!';
        }
        render();
    }
});

solveBtn.addEventListener('click', solve);
resetBtn.addEventListener('click', reset);

// Initial render
render();
