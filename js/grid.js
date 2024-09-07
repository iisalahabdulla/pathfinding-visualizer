const MAX_GRID_SIZE = 20; // Reduced from 50 to 30 for better visibility
let GRID_SIZE = 20;
let grid = [];
let start = null;
let end = null;
let isMouseDown = false;
let currentDrawMode = null;

function createGrid() {
    const gridElement = document.getElementById('grid');
    const gridContainer = document.getElementById('grid-container');
    const containerWidth = gridContainer.clientWidth;
    const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint
    const cellSize = isMobile ? 20 : 25; // Slightly larger cells
    GRID_SIZE = Math.min(Math.floor(containerWidth / cellSize), MAX_GRID_SIZE);

    gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${cellSize}px)`;
    gridElement.style.gridTemplateRows = `repeat(${GRID_SIZE}, ${cellSize}px)`;
    gridElement.innerHTML = '';
    grid = [];

    for (let row = 0; row < GRID_SIZE; row++) {
        grid[row] = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.state = 'empty'; // Add this line
            cell.addEventListener('mousedown', (e) => handleMouseDown(row, col, e));
            cell.addEventListener('mouseover', () => handleMouseOver(row, col));
            cell.addEventListener('mouseup', handleMouseUp);
            cell.addEventListener('touchstart', (e) => handleTouchStart(row, col, e), { passive: false });
            cell.addEventListener('touchmove', (e) => handleTouchMove(row, col, e), { passive: false });
            cell.addEventListener('touchend', handleTouchEnd);
            gridElement.appendChild(cell);
            grid[row][col] = { element: cell, row: row, col: col, weight: 1 };
        }
    }
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    console.log('Grid created:', grid);
}

// Add touch event handlers
function handleTouchStart(row, col, event) {
    event.preventDefault();
    isMouseDown = true;
    handleCellClick(row, col);
}

function handleTouchMove(row, col, event) {
    event.preventDefault();
    if (isMouseDown && currentDrawMode !== null) {
        const touch = event.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('cell')) {
            const cellRow = parseInt(element.dataset.row);
            const cellCol = parseInt(element.dataset.col);
            handleCellClick(cellRow, cellCol);
        }
    }
}

function handleTouchEnd() {
    isMouseDown = false;
    currentDrawMode = null;
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
    if (!cell) {
        console.error(`Invalid cell at row ${row}, col ${col}`);
        return;
    }

    if (cell.element.classList.contains('start')) {
        cell.element.classList.remove('start');
        cell.element.dataset.state = 'empty';
        start = null;
    } else if (cell.element.classList.contains('end')) {
        cell.element.classList.remove('end');
        cell.element.dataset.state = 'empty';
        end = null;
    } else if (!start) {
        cell.element.classList.add('start');
        cell.element.dataset.state = 'start';
        start = { row, col };
    } else if (!end) {
        cell.element.classList.add('end');
        cell.element.dataset.state = 'end';
        end = { row, col };
    } else {
        if (currentDrawMode === null) {
            currentDrawMode = cell.element.classList.contains('wall') ? 'erase' : 'draw';
        }
        if (currentDrawMode === 'draw') {
            cell.element.classList.add('wall');
            cell.element.dataset.state = 'wall';
            cell.weight = Infinity;
        } else {
            cell.element.classList.remove('wall', 'weighted');
            cell.element.dataset.state = 'empty';
            cell.weight = 1;
        }
    }

    console.log('Start:', start);
    console.log('End:', end);
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
window.addEventListener('resize', createGrid);

function restoreGridState() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col];
            const state = cell.element.dataset.state;
            cell.element.className = 'cell'; // Reset classes
            if (state === 'start') {
                cell.element.classList.add('start');
            } else if (state === 'end') {
                cell.element.classList.add('end');
            } else if (state === 'wall') {
                cell.element.classList.add('wall');
            } else if (state === 'visited') {
                cell.element.classList.add('visited');
            } else if (state === 'path') {
                cell.element.classList.add('path');
            }
        }
    }
}