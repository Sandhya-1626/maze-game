import { Maze, Point, bfs, dfs, astar } from './algorithms';
import { generateMaze } from './mazeGenerator';

export class GameEngine {
    maze: Maze;
    playerPosition: Point;
    goalPosition: Point;
    path: Point[] = [];
    isSolving: boolean = false;

    constructor(public rows: number, public cols: number) {
        this.maze = generateMaze(rows, cols);
        this.playerPosition = this.findSymbol('S') || [0, 0];
        this.goalPosition = this.findSymbol('G') || [rows - 1, cols - 1];
    }

    private findSymbol(symbol: string): Point | null {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.maze[r][c] === symbol) return [r, c];
            }
        }
        return null;
    }

    reset(rows?: number, cols?: number) {
        if (rows) this.rows = rows;
        if (cols) this.cols = cols;
        this.maze = generateMaze(this.rows, this.cols);
        this.playerPosition = this.findSymbol('S') || [0, 0];
        this.goalPosition = this.findSymbol('G') || [this.rows - 1, this.cols - 1];
        this.path = [];
        this.isSolving = false;
    }

    movePlayer(dr: number, dc: number): boolean {
        if (this.isSolving) return false;
        const [r, c] = this.playerPosition;
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.maze[nr][nc] !== '1') {
            this.playerPosition = [nr, nc];
            return true;
        }
        return false;
    }

    async solve(algo: 'BFS' | 'DFS' | 'A*') {
        this.isSolving = true;
        this.path = [];
        let result: Point[] | null = null;

        // Use user's provided maze for testing if it's the 3x4 layout
        if (algo === 'BFS') result = bfs(this.maze);
        else if (algo === 'DFS') result = dfs(this.maze);
        else if (algo === 'A*') result = astar(this.maze);

        if (result) {
            this.path = result;
        }
        this.isSolving = false;
        return result;
    }
}
