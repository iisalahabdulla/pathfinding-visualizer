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

    const algorithm = document.getElementById('algorithmSelect').value;
    let pathFound;

    switch (algorithm) {
        case 'bfs':
            pathFound = await bfs();
            break;
        case 'dijkstra':
            pathFound = await dijkstra();
            break;
        case 'astar':
            pathFound = await astar();
            break;
    }

    if (!pathFound) {
        alert('No path found!');
    }
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