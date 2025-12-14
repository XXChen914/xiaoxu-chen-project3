# Welcome to [Lucy's Sudoku](https://xiaoxu-chen-project3.onrender.com)!
## Walkhthrough Video
See [Video]() here

## Render Link
See my [web in Render](https://xiaoxu-chen-project3.onrender.com)
# Writeup
- **What were some challenges you faced while making this app?**   
One of the main challenges I faced was managing state across multiple components, especially ensuring the Sudoku board, selected cell, incorrect cells, and timer stayed in sync. Handling asynchronous API calls while avoiding unnecessary resets of the board or timer required careful use of useEffect and context. Another challenge was implementing a dynamic, editable Sudoku board that supports different grid sizes (6×6 and 9×9) while preserving immutability for the initial puzzle cells.

---
- **Given more time, what additional features, functional or design changes would you make**. 
Given more time, I would implement additional bonus features such as the ability to delete a game directly from the game page and update all relevant high scores accordingly. I would also add a “Create Custom Game” feature, where users can set up a 9×9 puzzle and submit it for backend verification to ensure it has a unique solution. On the UI side, I would add a hint system, undo/redo functionality, and improved mobile responsiveness for the board and number pad.

---
- **What assumptions did you make while working on this assignment?**  
I assumed users would only input numbers within the valid range of the board (1–6 for easy, 1–9 for normal), and that all API responses would return properly formatted JSON, including the current board, initial puzzle, and game metadata. I also assumed a single-user session per game and that navigating to a new game would be the only time the timer should reset. For bonus features, I assumed the backend would handle game deletion and unique-solution validation reliably.  

---
- **How long did this assignment take to complete?**    
Three days.   

---
- **What bonus points did you accomplish?** Please link to code where relevant and add any required details.  
**Password Encryption - 2 pts.**   
I implemented password encryption for user accounts. See [code](https://github.com/XXChen914/xiaoxu-chen-project3/blob/e3c5d1eeb81cf4b3caea838e3fb7515faa6d644f/backend/controllers/user.controller.js#L87) here.

