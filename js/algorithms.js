async function bfs() {
    const queue = [start];
    const visited = new Set();
    const parent = new Map();

    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${current.row},${current.col}`;

        if (current.row === end.row && current.col === end.col) {
            await reconstructPath(parent);
            return true;
        }

        if (!visited.has(key)) {
            visited.add(key);
            updateVisitedCount(visited.size);
            if (current !== start && current !== end) {
                grid[current.row][current.col].element.classList.add('visited');
                await sleep(101 - document.getElementById('speedSlider').value);
            }

            for (const neighbor of getNeighbors(current)) {
                const neighborKey = `${neighbor.row},${neighbor.col}`;
                if (!visited.has(neighborKey)) {
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

async function astar() {
    const openSet = new Set([start]);
    const closedSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parent = new Map();

    gScore.set(`${start.row},${start.col}`, 0);
    fScore.set(`${start.row},${start.col}`, heuristic(start, end));

    while (openSet.size > 0) {
        const current = getLowestFScore(openSet, fScore);
        if (current.row === end.row && current.col === end.col) {
            await reconstructPath(parent);
            return true;
        }

        openSet.delete(current);
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

            if (!openSet.has(neighbor) || tentativeGScore < gScore.get(neighborKey)) {
                parent.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));

                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }

    return false;
}

function getNeighbors(cell) {
    const neighbors = [];
    const directions = document.getElementById('diagonalMoves').checked ?
        [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] :
        [[-1, 0], [0, -1], [0, 1], [1, 0]];

    for (const [dx, dy] of directions) {
        const newRow = cell.row + dx;
        const newCol = cell.col + dy;
        if (isValidCell(newRow, newCol)) {
            neighbors.push({ row: newRow, col: newCol });
        }
    }

    return neighbors;
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

function getLowestFScore(openSet, fScore) {
    let lowest = Infinity;
    let lowestNode = null;

    for (const node of openSet) {
        const score = fScore.get(`${node.row},${node.col}`);
        if (score < lowest) {
            lowest = score;
            lowestNode = node;
        }
    }

    return lowestNode;
}

async function reconstructPath(parent) {
    let current = end;
    let pathLength = 0;

    while (current && (current.row !== start.row || current.col !== start.col)) {
        if (current !== end) {
            grid[current.row][current.col].element.classList.add('path');
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