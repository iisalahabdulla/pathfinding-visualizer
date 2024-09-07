document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const generateMazeBtn = document.getElementById('generateMazeBtn');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const diagonalToggle = document.getElementById('diagonalToggle');

    startBtn.addEventListener('click', startPathfinding);
    resetBtn.addEventListener('click', resetGrid);
    generateMazeBtn.addEventListener('click', generateMaze);
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    diagonalToggle.addEventListener('change', (e) => {
        console.log({e})
        allowDiagonal = diagonalToggle.checked;
    });

    document.getElementById('grid').addEventListener('contextmenu', (e) => e.preventDefault());

    updateAlgorithmInfo();

    window.addEventListener('scroll', restoreGridState);
    window.addEventListener('resize', restoreGridState);
});

let allowDiagonal = false; // Set to false by default

async function startPathfinding() {
    if (!start || !end) {
        alert('Please set both start and end points before starting the algorithm.');
        return;
    }

    console.log('Starting pathfinding');
    console.log('Start:', start);
    console.log('End:', end);
    console.log('Grid size:', GRID_SIZE);

    clearVisualization();

    const algorithm = document.getElementById('algorithmSelect').value;
    let pathFound;
    let startTime, endTime, executionTime;
    let visitedCells = 0;
    let pathLength = 0;

    startTime = performance.now();

    try {
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
            default:
                throw new Error('Invalid algorithm selected');
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
    } catch (error) {
        console.error('An error occurred during pathfinding:', error);
        alert('An error occurred during pathfinding. Please check the console for details.');
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

function clearVisualization() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col];
            cell.element.classList.remove('visited', 'path');
            if (cell.element.dataset.state === 'visited' || cell.element.dataset.state === 'path') {
                cell.element.dataset.state = 'empty';
            }
        }
    }
}