async function bfs(updateVisited) {
    if (!start || !end) {
        console.error('Start or end point is not set');
        return false;
    }

    let visited = 0;
    const queue = [grid[start.row][start.col]];
    const visitedSet = new Set();
    const parent = new Map();

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            console.error('Current cell is undefined');
            continue;
        }

        const key = `${current.row},${current.col}`;

        if (current.row === end.row && current.col === end.col) {
            await reconstructPath(parent);
            return true;
        }

        if (!visitedSet.has(key)) {
            visitedSet.add(key);
            visited++;
            updateVisited(visited);
            if (current !== grid[start.row][start.col] && current !== grid[end.row][end.col]) {
                current.element.classList.add('visited');
                current.element.dataset.state = 'visited';
                await sleep(101 - document.getElementById('speedSlider').value);
            }

            const neighbors = getNeighbors(current);
            for (const neighbor of neighbors) {
                if (!neighbor) {
                    console.error('Neighbor is undefined');
                    continue;
                }
                const neighborKey = `${neighbor.row},${neighbor.col}`;
                if (!visitedSet.has(neighborKey)) {
                    queue.push(neighbor);
                    parent.set(neighborKey, current);
                }
            }
        }
    }

    return false;
}

async function dijkstra() {
    const distances = new Map();
    const parent = new Map();
    const unvisited = new Set();

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const key = `${row},${col}`;
            distances.set(key, Infinity);
            unvisited.add(key);
        }
    }

    distances.set(`${start.row},${start.col}`, 0);

    while (unvisited.size > 0) {
        const current = getMinDistanceNode(distances, unvisited);
        const currentKey = `${current.row},${current.col}`;
        unvisited.delete(currentKey);

        if (current.row === end.row && current.col === end.col) {
            await reconstructPath(parent);
            return true;
        }

        updateVisitedCount(distances.size - unvisited.size);
        if (current !== start && current !== end) {
            grid[current.row][current.col].element.classList.add('visited');
            await sleep(101 - document.getElementById('speedSlider').value);
        }

        for (const neighbor of getNeighbors(current)) {
            const neighborKey = `${neighbor.row},${neighbor.col}`;
            if (unvisited.has(neighborKey)) {
                const tentativeDistance = distances.get(currentKey) + grid[neighbor.row][neighbor.col].weight;
                if (tentativeDistance < distances.get(neighborKey)) {
                    distances.set(neighborKey, tentativeDistance);
                    parent.set(neighborKey, current);
                }
            }
        }
    }

    return false;
}

class BinaryHeap {
    constructor(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }

    push(element) {
        this.content.push(element);
        this.bubbleUp(this.content.length - 1);
    }

    pop() {
        const result = this.content[0];
        const end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    }

    remove(node) {
        const len = this.content.length;
        for (let i = 0; i < len; i++) {
            if (this.content[i] !== node) continue;
            const end = this.content.pop();
            if (i === len - 1) break;
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    }

    size() {
        return this.content.length;
    }

    bubbleUp(n) {
        const element = this.content[n];
        const score = this.scoreFunction(element);
        while (n > 0) {
            const parentN = Math.floor((n + 1) / 2) - 1;
            const parent = this.content[parentN];
            if (score >= this.scoreFunction(parent)) break;
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    }

    sinkDown(n) {
        const length = this.content.length;
        const element = this.content[n];
        const elemScore = this.scoreFunction(element);

        while (true) {
            const child2N = (n + 1) * 2;
            const child1N = child2N - 1;
            let swap = null;
            let child1Score;
            if (child1N < length) {
                const child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);
                if (child1Score < elemScore) swap = child1N;
            }
            if (child2N < length) {
                const child2 = this.content[child2N];
                const child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }
            if (swap === null) break;
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    }
}

async function astar() {
    if (!start || !end) {
        console.error('Start or end node is not set');
        return false;
    }

    console.log('Starting A* algorithm');
    console.log('Start:', start);
    console.log('End:', end);

    const openSet = new BinaryHeap(node => fScore.get(`${node.row},${node.col}`));
    const closedSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parent = new Map();

    openSet.push(start);
    gScore.set(`${start.row},${start.col}`, 0);
    fScore.set(`${start.row},${start.col}`, heuristic(start, end));

    let iterations = 0;
    const maxIterations = GRID_SIZE * GRID_SIZE; // Prevent infinite loop

    while (openSet.size() > 0 && iterations < maxIterations) {
        iterations++;
        const current = openSet.pop();
        console.log('Current node:', current);

        if (current.row === end.row && current.col === end.col) {
            console.log('Path found!');
            await reconstructPath(parent);
            return true;
        }

        closedSet.add(`${current.row},${current.col}`);
        updateVisitedCount(closedSet.size);

        if (current !== start && current !== end) {
            grid[current.row][current.col].element.classList.add('visited');
            await sleep(101 - document.getElementById('speedSlider').value);
        }

        for (const neighbor of getNeighbors(current)) {
            const neighborKey = `${neighbor.row},${neighbor.col}`;
            if (closedSet.has(neighborKey)) continue;

            const tentativeGScore = gScore.get(`${current.row},${current.col}`) + grid[neighbor.row][neighbor.col].weight;

            if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                parent.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));

                if (!openSet.content.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    console.log('No path found after', iterations, 'iterations');
    return false;
}

function getNeighbors(cell) {
    if (!cell) {
        console.error('Cell is undefined in getNeighbors');
        return [];
    }

    const neighbors = [];
    const { row, col } = cell;

    // Helper function to safely add neighbors
    const addNeighbor = (r, c) => {
        if (grid[r] && grid[r][c]) {
            neighbors.push(grid[r][c]);
        }
    };

    // Orthogonal neighbors
    addNeighbor(row - 1, col);
    addNeighbor(row + 1, col);
    addNeighbor(row, col - 1);
    addNeighbor(row, col + 1);

    // Diagonal neighbors
    if (allowDiagonal) {
        addNeighbor(row - 1, col - 1);
        addNeighbor(row - 1, col + 1);
        addNeighbor(row + 1, col - 1);
        addNeighbor(row + 1, col + 1);
    }

    return neighbors.filter(neighbor => !neighbor.element.classList.contains('wall'));
}

function heuristic(a, b) {
    const dx = Math.abs(a.row - b.row);
    const dy = Math.abs(a.col - b.col);
    return document.getElementById('diagonalMoves').checked ?
        Math.max(dx, dy) :
        dx + dy;
}

function getMinDistanceNode(distances, unvisited) {
    let minDistance = Infinity;
    let minNode = null;

    for (const key of unvisited) {
        const distance = distances.get(key);
        if (distance < minDistance) {
            minDistance = distance;
            const [row, col] = key.split(',').map(Number);
            minNode = { row, col };
        }
    }

    return minNode;
}

async function reconstructPath(parent) {
    let current = end;
    let pathLength = 0;

    while (current && (current.row !== start.row || current.col !== start.col)) {
        if (current !== end) {
            grid[current.row][current.col].element.classList.add('path');
            grid[current.row][current.col].element.dataset.state = 'path';
            pathLength++;
            await sleep(50);
        }
        const key = `${current.row},${current.col}`;
        current = parent.get(key);
    }

    updatePathLength(pathLength);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}