document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const generateMazeBtn = document.getElementById('generateMazeBtn');
    const algorithmSelect = document.getElementById('algorithmSelect');

    startBtn.addEventListener('click', startPathfinding);
    resetBtn.addEventListener('click', resetGrid);
    generateMazeBtn.addEventListener('click', generateMaze);
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);

    document.getElementById('grid').addEventListener('contextmenu', (e) => e.preventDefault());

    updateAlgorithmInfo();
});

async function startPathfinding() {
    if (!start || !end) {
        alert('Please set both start and end points before starting the algorithm.');
        return;
    }

    clearVisualization();

    const algorithm = document.getElementById('algorithmSelect').value;
    let pathFound;
    let startTime, endTime, executionTime;
    let visitedCells = 0;
    let pathLength = 0;

    startTime = performance.now();

    switch (algorithm) {
        case 'bfs':
            pathFound = await bfs((visited) => visitedCells = visited);
            break;
        case 'dijkstra':
            pathFound = await dijkstra((visited) => visitedCells = visited);
            break;
        case 'astar':
            pathFound = await astar((visited) => visitedCells = visited);
            break;
    }

    endTime = performance.now();
    executionTime = endTime - startTime;

    if (pathFound) {
        pathLength = calculatePathLength();
    }

    displayAnalytics(algorithm, executionTime, visitedCells, pathLength, pathFound);

    if (!pathFound) {
        alert('No path found!');
    }
}

function calculatePathLength() {
    let length = 0;
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col].element.classList.contains('path')) {
                length++;
            }
        }
    }
    return length;
}

function displayAnalytics(algorithm, executionTime, visitedCells, pathLength, pathFound) {
    const analyticsDiv = document.getElementById('analytics');
    analyticsDiv.innerHTML = `
        <h3>Analytics</h3>
        <table>
            <tr><td><strong>Algorithm:</strong></td><td>${algorithm.toUpperCase()}</td></tr>
            <tr><td><strong>Execution Time:</strong></td><td>${executionTime.toFixed(2)} ms</td></tr>
            <tr><td><strong>Cells Visited:</strong></td><td>${visitedCells}</td></tr>
            <tr><td><strong>Path Found:</strong></td><td>${pathFound ? 'Yes' : 'No'}</td></tr>
            ${pathFound ? `<tr><td><strong>Path Length:</strong></td><td>${pathLength}</td></tr>` : ''}
        </table>
    `;
}

// This function resets the visual state of the grid without recreating it
function clearGrid() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            grid[row][col].element.className = 'cell';
            grid[row][col].weight = 1;
        }
    }
    start = null;
    end = null;
    updateInfo();
}

// Override the resetGrid function to use clearGrid instead of recreating the entire grid
function resetGrid() {
    clearGrid();
}