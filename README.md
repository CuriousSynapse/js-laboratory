
# JavaScript Laboratory

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

Welcome to my **JavaScript Laboratory**. 

While I use React/Next.js for large-scale projects, this repository is dedicated to mastering **Vanilla JavaScript (ES6+)**. Here, I experiment with DOM manipulation, asynchronous programming (Promises/Async-Await), and algorithmic problem-solving in the browser environment.

> 🌐 **[View Live Demos](https://curioussynapse.github.io/js-laboratory/)** *(Hosted on GitHub Pages)*

## Project Catalog

### 1. DOM Manipulation (Browser Interactivity)
| Project | Description | Key Concepts |
| :--- | :--- | :--- |
| **[Color Flipper](./1-vanilla-dom/color-flipper)** | Changes the background to a random Hex color. | `document.getElementById`, `Math.random()`, Event Listeners. |
| **[Interactive Counter](./1-vanilla-dom/counter)** | A counter that changes color based on positive/negative values. | `classList`, conditional logic, state management. |
| **[To-Do List](./1-vanilla-dom/todo-list)** | A task manager where items can be added and deleted. | `createElement`, `appendChild`, Event Delegation. |

### 2. Async & APIs (Data Fetching)
| Project | Description | Key Concepts |
| :--- | :--- | :--- |
| **[Random Joke Gen](./2-async-apis/joke-gen)** | Fetches a random joke from a public API. | `fetch()`, `async/await`, JSON parsing, Error Handling. |

### 3. Algorithms & Logic (Node.js)
| Project | Description | Key Concepts |
| :--- | :--- | :--- |
| **[Palindrome Checker](./3-algorithms/palindrome.js)** | Checks if a string reads the same backward. | String methods (`split`, `reverse`, `join`), Regex. |
| **[Array Filter](./3-algorithms/filter-map.js)** | Custom implementations of array manipulation. | Higher-Order Functions (`map`, `filter`, `reduce`). |

---

## How to Run

### Browser Projects (DOM & APIs)
Simply open the `index.html` file of the respective project in any web browser, or visit the [Live Demo Page](https://CuriousSynapse.github.io/synaptic-js/).

### Algorithm Scripts (Node.js)
Ensure you have [Node.js](https://nodejs.org/) installed.
```bash
cd 3-algorithms
node palindrome.js
