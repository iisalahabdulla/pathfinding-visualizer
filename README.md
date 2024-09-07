# Pathfinding Visualizer

This project is a web-based visualization tool for various pathfinding algorithms. It allows users to create obstacles, set start and end points, and visualize how different algorithms find paths in a grid.

## Features

- Interactive grid to set start point, end point, and obstacles
- Multiple pathfinding algorithms: Breadth-First Search, Dijkstra's Algorithm, and A* Search
- Maze generation
- Weighted nodes
- Adjustable animation speed
- Toggle for diagonal movements

## How to Use

1. Open `index.html` in a web browser
2. Click on the grid to set a start point (green) and an end point (red)
3. Click and drag to create walls (black cells)
4. Right-click to create weighted nodes (orange cells)
5. Select an algorithm from the dropdown menu
6. Click "Start Pathfinding" to visualize the algorithm
7. Use "Reset Grid" to clear the grid or "Generate Maze" to create a random maze

## Algorithms

- **Breadth-First Search (BFS)**: Explores all neighbor nodes at the present depth before moving to nodes at the next depth level.
- **Dijkstra's Algorithm**: Finds the shortest path between nodes in a graph, accounting for weighted edges.
- **A* Search**: An informed search algorithm that uses a heuristic function to estimate the distance to the goal.

## Development

To modify or extend this project:

1. Clone the repository
2. Make changes to the HTML, CSS, or JavaScript files
3. Refresh `index.html` in your browser to see the changes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).