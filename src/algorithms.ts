export type Point = [number, number];
export type Maze = string[][];

export function findPos(maze: Maze, symbol: string): Point | null {
    const rows = maze.length;
    const cols = maze[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze[i][j] === symbol) {
                return [i, j];
            }
        }
    }
    return null;
}

export function isValid(maze: Maze, x: number, y: number): boolean {
    const rows = maze.length;
    const cols = maze[0].length;
    return x >= 0 && x < rows && y >= 0 && y < cols && maze[x][y] !== '1';
}

const MOVES: Point[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

export function bfs(maze: Maze): Point[] | null {
    const start = findPos(maze, 'S');
    const goal = findPos(maze, 'G');
    if (!start || !goal) return null;

    const queue: [Point, Point[]][] = [[start, [start]]];
    const visited = new Set<string>();
    visited.add(`${start[0]},${start[1]}`);

    while (queue.length > 0) {
        const [[x, y], path] = queue.shift()!;

        if (x === goal[0] && y === goal[1]) {
            return path;
        }

        for (const [dx, dy] of MOVES) {
            const nx = x + dx;
            const ny = y + dy;
            const key = `${nx},${ny}`;
            if (isValid(maze, nx, ny) && !visited.has(key)) {
                visited.add(key);
                queue.push([[nx, ny], [...path, [nx, ny]]]);
            }
        }
    }
    return null;
}

export function dfs(maze: Maze): Point[] | null {
    const start = findPos(maze, 'S');
    const goal = findPos(maze, 'G');
    if (!start || !goal) return null;

    const stack: [Point, Point[]][] = [[start, [start]]];
    const visited = new Set<string>();

    while (stack.length > 0) {
        const [[x, y], path] = stack.pop()!;

        if (x === goal[0] && y === goal[1]) {
            return path;
        }

        const key = `${x},${y}`;
        if (!visited.has(key)) {
            visited.add(key);
            for (const [dx, dy] of MOVES) {
                const nx = x + dx;
                const ny = y + dy;
                if (isValid(maze, nx, ny)) {
                    stack.push([[nx, ny], [...path, [nx, ny]]]);
                }
            }
        }
    }
    return null;
}

function manhattan(a: Point, b: Point): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function astar(maze: Maze): Point[] | null {
    const start = findPos(maze, 'S');
    const goal = findPos(maze, 'G');
    if (!start || !goal) return null;

    // Simple priority queue implementation using array and sort
    const pq: { f: number; current: Point; path: Point[] }[] = [{ f: 0, current: start, path: [start] }];
    const visited = new Set<string>();

    while (pq.length > 0) {
        pq.sort((a, b) => a.f - b.f);
        const { current, path } = pq.shift()!;
        const [x, y] = current;

        if (x === goal[0] && y === goal[1]) {
            return path;
        }

        const key = `${x},${y}`;
        if (!visited.has(key)) {
            visited.add(key);
            for (const [dx, dy] of MOVES) {
                const nx = x + dx;
                const ny = y + dy;
                if (isValid(maze, nx, ny)) {
                    const newPath: Point[] = [...path, [nx, ny]];
                    const g = newPath.length;
                    const h = manhattan([nx, ny], goal);
                    pq.push({ f: g + h, current: [nx, ny], path: newPath });
                }
            }
        }
    }
    return null;
}
