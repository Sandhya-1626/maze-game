import { Point, Maze } from './algorithms';

export function generateMaze(rows: number, cols: number): Maze {
    // Initialize with walls
    const maze: Maze = Array.from({ length: rows }, () => Array(cols).fill('1'));

    function walk(r: number, c: number) {
        maze[r][c] = '0';

        const directions = [
            [0, 2], [0, -2], [2, 0], [-2, 0]
        ].sort(() => Math.random() - 0.5);

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] === '1') {
                maze[r + dr / 2][c + dc / 2] = '0';
                walk(nr, nc);
            }
        }
    }

    walk(0, 0);

    // Set Start and Goal
    maze[0][0] = 'S';
    let goalR = rows - 1;
    let goalC = cols - 1;

    // Ensure goal is reachable (not a wall)
    if (maze[goalR][goalC] === '1') {
        // Find nearest open space
        outer: for (let r = rows - 1; r >= 0; r--) {
            for (let c = cols - 1; c >= 0; c--) {
                if (maze[r][c] === '0') {
                    goalR = r;
                    goalC = c;
                    break outer;
                }
            }
        }
    }
    maze[goalR][goalC] = 'G';

    return maze;
}
