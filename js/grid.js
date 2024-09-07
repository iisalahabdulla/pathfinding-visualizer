const GRID_SIZE = 20; // Changed back to 50x50 grid
let grid = [];
let start = null;
let end = null;
let isMouseDown = false;
let currentDrawMode = null;

function createGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1.5rem)`; // 1.5rem = 24px
    gridElement.innerHTML = '';
    grid = [];

    for (let row = 0; row < GRID_SIZE; row++) {
        grid[row] = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('mousedown', (e) => handleMouseDown(row, col, e));
            cell.addEventListener('mouseover', () => handleMouseOver(row, col));
            cell.addEventListener('mouseup', handleMouseUp);
            gridElement.appendChild(cell);
            grid[row][col] = { element: cell, weight: 1 };
        }
    }

    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(row, col, event) {
    isMouseDown = true;
    if (event.button === 2) { // Right click
        weightCell(row, col);
    } else {
        handleCellClick(row, col);
    }
}

function handleMouseOver(row, col) {
    if (isMouseDown) {
        handleCellClick(row, col);
    }
}

function handleMouseUp() {
    isMouseDown = false;
    currentDrawMode = null;
}

function handleCellClick(row, col) {
    const cell = grid[row][col];
    if (!start) {
        cell.element.classList.add('start');
        start = { row, col };
    } else if (!end) {
        cell.element.classList.add('end');
        end = { row, col };
    } else {
        if (currentDrawMode === null) {
            currentDrawMode = cell.element.classList.contains('wall') ? 'erase' : 'draw';
        }
        if (currentDrawMode === 'draw') {
            cell.element.classList.add('wall');
            cell.weight = Infinity;
        } else {
            cell.element.classList.remove('wall', 'weighted');
            cell.weight = 1;
        }
    }
}

function weightCell(row, col) {
    const cell = grid[row][col];
    const weight = parseInt(document.getElementById('weightInput').value);
    if (!cell.element.classList.contains('wall') && !cell.element.classList.contains('start') && !cell.element.classList.contains('end')) {
        cell.element.classList.toggle('weighted');
        cell.weight = cell.element.classList.contains('weighted') ? weight : 1;
    }
}

function resetGrid() {
    start = null;
    end = null;
    createGrid();
    updateInfo();
}

function isValidCell(row, col) {
    return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && !grid[row][col].element.classList.contains('wall');
}

function clearVisualization() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col];
            if (!cell.element.classList.contains('start') && 
                !cell.element.classList.contains('end') && 
                !cell.element.classList.contains('wall') &&
                !cell.element.classList.contains('weighted')) {
                cell.element.className = 'cell';
            }
        }
    }
    updateInfo();
}

window.clearVisualization = clearVisualization;

createGrid();