function updateAlgorithmInfo() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const infoElement = document.getElementById('algorithmInfo');

    switch (algorithm) {
        case 'bfs':
            infoElement.innerHTML = `
                <h3>Breadth-First Search (BFS)</h3>
                <p>BFS explores all neighbor nodes at the present depth before moving to nodes at the next depth level. It guarantees the shortest path in unweighted graphs.</p>
            `;
            break;
        case 'dijkstra':
            infoElement.innerHTML = `
                <h3>Dijkstra's Algorithm</h3>
                <p>Dijkstra's algorithm finds the shortest path between nodes in a graph, which may represent, for example, road networks. It can handle weighted edges and is guaranteed to find the shortest path.</p>
            `;
            break;
        case 'astar':
            infoElement.innerHTML = `
                <h3>A* Search</h3>
                <p>A* is an informed search algorithm that uses a heuristic function to estimate the distance to the goal. It's often faster than Dijkstra's algorithm and guarantees the shortest path if the heuristic is admissible.</p>
            `;
            break;
    }
}

function updateVisitedCount(count) {
    document.getElementById('visitedCount').textContent = count;
}

function updatePathLength(length) {
    document.getElementById('pathLength').textContent = length;
}

function updateInfo() {
    updateVisitedCount(0);
    updatePathLength(0);
}

async function generateMaze() {
    resetGrid();
    
    // Fill the grid with walls
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            grid[row][col].element.classList.add('wall');
            grid[row][col].weight = Infinity;
        }
    }

    const stack = [];
    const startRow = 0;
    const startCol = 0;
    stack.push({ row: startRow, col: startCol });

    while (stack.length > 0) {
        const current = stack.pop();
        grid[current.row][current.col].element.classList.remove('wall');
        grid[current.row][current.col].weight = 1;

        const neighbors = getUnvisitedMazeNeighbors(current.row, current.col);
        if (neighbors.length > 0) {
            stack.push(current);
            const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            const midRow = Math.floor((current.row + chosen.row) / 2);
            const midCol = Math.floor((current.col + chosen.col) / 2);
            grid[midRow][midCol].element.classList.remove('wall');
            grid[midRow][midCol].weight = 1;
            stack.push(chosen);
        }

        await sleep(10);
    }

    start = null;
    end = null;
}

function getUnvisitedMazeNeighbors(row, col) {
    const neighbors = [];
    const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && 
            grid[newRow][newCol].element.classList.contains('wall')) {
            neighbors.push({ row: newRow, col: newCol });
        }
    }

    return neighbors;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}