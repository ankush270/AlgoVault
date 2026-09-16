import { TopicItem } from '../types';

/**
 * JavaScript Topic Registry (Namaste JavaScript Master Edition - 25 Episodes)
 * Generated from public/data/javascript.json
 */
export const javascriptTopics: TopicItem[] = [
  {
    "id": "js-execution-context",
    "title": "Episode 1: Execution Context & Thread of Execution",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Easy",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "All JS code executes inside an Execution Context containing a Memory Component (Variable Environment) and Code Component (Thread of Execution). JS is single-threaded and synchronous.",
    "keyConcepts": [
      "Execution Context = Variable Environment (Memory) + Thread of Execution (Code).",
      "JavaScript is single-threaded (executes one command at a time).",
      "JavaScript is synchronous (executes code in sequential top-to-bottom order).",
      "Global Execution Context (GEC) is created automatically when a script runs.",
      "Each function invocation creates a new Function Execution Context (FEC)."
    ],
    "detailedContent": "# Episode 1: Execution Context & Thread of Execution\n\n## Overview\nAn Execution Context is an abstract container created by the JavaScript engine whenever code is executed. It houses the environment, memory space, and sequential code execution pipeline for the currently running script or function.\n\n## Detailed Explanation\nEverything in JavaScript happens inside an **Execution Context**. You can visualize it as a container with two distinct compartments:\n\n1. **Memory Component (Variable Environment)**: A key-value store where variables and function declarations are stored in memory before execution begins (e.g., `a: 10`, `fn: f()`).\n2. **Code Component (Thread of Execution)**: The single-threaded pipeline where code is evaluated and executed line-by-line.\n\nJavaScript is a **synchronous, single-threaded language**. 'Single-threaded' means it can execute only one command at a time. 'Synchronous' means code is executed in a strict, top-to-bottom order.\n\n## Real-World Analogy\n🏢 Single-Counter Kitchen: A chef (Thread of Execution) works at a single kitchen counter with a recipe notebook (Variable Environment). The chef looks up ingredients on the counter and follows recipe steps sequentially line-by-line.\n\n## Key Architectural Concepts\n- Execution Context = Variable Environment (Memory) + Thread of Execution (Code).\n- JavaScript is single-threaded (executes one command at a time).\n- JavaScript is synchronous (executes code in sequential top-to-bottom order).\n- Global Execution Context (GEC) is created automatically when a script runs.\n- Each function invocation creates a new Function Execution Context (FEC).",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// Phase 1: Memory Allocation\n// n: undefined\n// square: function square(num) { ... }\n// square2: undefined\n\nvar n = 2;\nfunction square(num) {\n  var ans = num * num;\n  return ans;\n}\nvar square2 = square(n);\nconsole.log(square2); // 4"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is an Execution Context in JavaScript and what are its two components?",
        "answer": "An Execution Context is an abstract environment container created by the JS engine to manage code execution. Its two components are: 1) Memory Component (Variable Environment), which holds variable and function declarations as key-value pairs, and 2) Code Component (Thread of Execution), which executes statements sequentially line-by-line."
      },
      {
        "question": "Why is JavaScript defined as a single-threaded synchronous language?",
        "answer": "JavaScript is single-threaded because it has only one Call Stack and can execute only one instruction at any given instant. It is synchronous because instructions are evaluated sequentially in a fixed order, moving to the next line only after the current line finishes."
      }
    ]
  },
  {
    "id": "js-call-stack",
    "title": "Episode 2: How JS Code Executes & Call Stack Mechanics",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Easy",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "JS code executes in 2 phases (Memory Creation & Code Execution). The Call Stack manages creation, ordering, and destruction of Execution Contexts.",
    "keyConcepts": [
      "Phase 1 (Memory Allocation): Variables = undefined, Functions = Full body definition.",
      "Phase 2 (Code Execution): Line-by-line evaluation and variable assignment.",
      "Call Stack (LIFO data structure) controls execution context lifecycle.",
      "Call Stack alternate names: Program Stack, Control Stack, Runtime Stack, Machine Stack.",
      "GEC sits at the bottom of the Call Stack until the browser tab or process closes."
    ],
    "detailedContent": "# Episode 2: How JS Code Executes & Call Stack Mechanics\n\n## Overview\nWhen a JS program runs, the engine creates the Global Execution Context (GEC) in two phases: Memory Creation Phase and Code Execution Phase. The engine manages nested function execution using the Call Stack.\n\n## Detailed Explanation\nExecution context creation occurs in two distinct phases:\n\n1. **Phase 1 - Memory Creation Phase**: The engine scans the script, allocating memory for variables (`var` initialized to `undefined`) and functions (storing the entire function body).\n2. **Phase 2 - Code Execution Phase**: The engine runs code line-by-line, assigning values and executing functions.\n\nWhenever a function is called, a new **Function Execution Context (FEC)** is created and pushed onto the **Call Stack**. When the function returns, its execution context is popped off the stack and destroyed.\n\n## Real-World Analogy\n📚 Stack of Plates: The Global Execution Context is the base plate. Calling a function places a new plate on top of the stack. Returning from a function removes the top plate. The Call Stack always processes the plate on top.\n\n## Key Architectural Concepts\n- Phase 1 (Memory Allocation): Variables = undefined, Functions = Full body definition.\n- Phase 2 (Code Execution): Line-by-line evaluation and variable assignment.\n- Call Stack (LIFO data structure) controls execution context lifecycle.\n- Call Stack alternate names: Program Stack, Control Stack, Runtime Stack, Machine Stack.\n- GEC sits at the bottom of the Call Stack until the browser tab or process closes.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var num = 5;\n\nfunction multiplyByTwo(n) {\n  var result = n * 2;\n  return result;\n}\n\nvar output1 = multiplyByTwo(num);\nvar output2 = multiplyByTwo(10);\n\n// 1. GEC pushed to Call Stack.\n// 2. multiplyByTwo(5) creates FEC -> Pushed to stack.\n// 3. returns 10 -> FEC popped and destroyed.\n// 4. multiplyByTwo(10) creates FEC -> Pushed to stack -> returns 20 -> FEC popped."
      }
    ],
    "interviewQuestions": [
      {
        "question": "Walk through what happens during Phase 1 vs Phase 2 of JavaScript code execution.",
        "answer": "In Phase 1 (Memory Creation), JS scans the code and allocates memory space. Variables declared with 'var' are assigned 'undefined', while function declarations store their full body. In Phase 2 (Code Execution), JS executes code line-by-line, updating variable values in memory and executing function calls."
      },
      {
        "question": "What is the Call Stack and what is its role in JS runtime?",
        "answer": "The Call Stack is a LIFO (Last In, First Out) stack data structure that tracks execution contexts. It maintains the order of execution: pushing new function execution contexts when functions are invoked and popping them off when they return."
      }
    ]
  },
  {
    "id": "js-hoisting",
    "title": "Episode 3: Hoisting in JavaScript (Variables & Functions)",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Easy",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Hoisting allocates memory before execution. Function declarations hoist with full implementation; `var` variables hoist initialized to `undefined`.",
    "keyConcepts": [
      "Hoisting is not physical code movement; it is pre-execution memory allocation.",
      "Function declarations are hoisted with their complete function implementation.",
      "Variables declared with 'var' are hoisted and initialized to 'undefined'.",
      "Arrow functions & function expressions assigned to 'var' hoist as 'undefined'.",
      "Accessing undeclared variables throws ReferenceError: x is not defined."
    ],
    "detailedContent": "# Episode 3: Hoisting in JavaScript (Variables & Functions)\n\n## Overview\nHoisting is JavaScript behavior where variable and function declarations are allocated memory during Phase 1 before code execution begins. This allows functions and 'var' variables to be accessed prior to their lines of declaration.\n\n## Detailed Explanation\nBecause the JS engine allocates memory in Phase 1 before executing code in Phase 2:\n\n- **Function Declarations** can be invoked before their definition in code because their full body is loaded into memory during Phase 1.\n- **`var` Variables** accessed before declaration return `undefined` rather than throwing a ReferenceError.\n- **Function Expressions / Arrow Functions** assigned to `var` evaluate to `undefined` during Phase 1. Invoking them early results in `TypeError: fn is not a function`.\n\n## Real-World Analogy\n🏷️ Reserved Name Badges: Name tags are placed on conference tables before attendees arrive. Attendees can see their name tag exists (`var = undefined`), but the attendee isn't seated until code execution reaches their arrival line.\n\n## Key Architectural Concepts\n- Hoisting is not physical code movement; it is pre-execution memory allocation.\n- Function declarations are hoisted with their complete function implementation.\n- Variables declared with 'var' are hoisted and initialized to 'undefined'.\n- Arrow functions & function expressions assigned to 'var' hoist as 'undefined'.\n- Accessing undeclared variables throws ReferenceError: x is not defined.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "greet(); // Output: 'Hello World!'\nconsole.log(x); // Output: undefined\n// sayHi(); // Uncaught TypeError: sayHi is not a function\n\nvar x = 10;\n\nfunction greet() {\n  console.log('Hello World!');\n}\n\nvar sayHi = () => {\n  console.log('Hi!');\n};"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Hoisting in JavaScript and why does it happen?",
        "answer": "Hoisting is the behavior where variable and function declarations are allocated memory in Phase 1 before code execution. It happens because the JS engine scans the file and prepares memory space before executing line-by-line code in Phase 2."
      },
      {
        "question": "What is the difference between hoisting a function declaration vs an arrow function assigned to var?",
        "answer": "A function declaration is hoisted with its full function body, so it can be called before declaration. An arrow function assigned to 'var' is treated as a variable in Phase 1 and initialized to 'undefined'; calling it early throws a TypeError."
      }
    ]
  },
  {
    "id": "js-functions-variable-environments",
    "title": "Episode 4: Functions & Independent Variable Environments",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Easy",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Every function call creates a new Function Execution Context with an isolated Variable Environment. Returning destroys the local context.",
    "keyConcepts": [
      "Each function call instantiates a new Function Execution Context.",
      "Variable Environments are strictly isolated per execution context.",
      "Local variable assignments do not affect outer variables of the same name.",
      "When a function returns, its execution context and local variables are garbage collected."
    ],
    "detailedContent": "# Episode 4: Functions & Independent Variable Environments\n\n## Overview\nEvery function invocation creates a separate Function Execution Context with its own isolated Variable Environment. Local variables inside one function context do not collide with or mutate variables in other scopes.\n\n## Detailed Explanation\nEven if variables in different functions share the exact same name (e.g., `var x = 1` in global, `var x = 10` inside `a()`, and `var x = 100` inside `b()`), each function creates its own isolated memory space.\n\nWhen `a()` executes, it reads and updates `x` in `a()`'s Variable Environment. Once `a()` returns, its context is destroyed, leaving the global `x` untouched.\n\n## Real-World Analogy\n📦 Private Apartments: Each apartment (Function Context) has its own living room table (`var x`). Changing the table in Apartment A does not alter the table in Apartment B or the main lobby (Global Scope).\n\n## Key Architectural Concepts\n- Each function call instantiates a new Function Execution Context.\n- Variable Environments are strictly isolated per execution context.\n- Local variable assignments do not affect outer variables of the same name.\n- When a function returns, its execution context and local variables are garbage collected.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var x = 1;\n\nfunction a() {\n  var x = 10;\n  console.log('Inside a():', x); // 10\n}\n\nfunction b() {\n  var x = 100;\n  console.log('Inside b():', x); // 100\n}\n\na();\nb();\nconsole.log('Global scope:', x); // 1"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does JavaScript isolate variables with identical names across different functions?",
        "answer": "JavaScript creates a new Function Execution Context with an isolated Variable Environment for every function invocation. Variables declared inside a function are scoped to its local Variable Environment, preventing collisions with outer variables."
      }
    ]
  },
  {
    "id": "js-shortest-program-window-this",
    "title": "Episode 5: Shortest JS Program, window Object & this Keyword",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Easy",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "An empty JS file creates a Global Execution Context, `window` object, and binds `this === window` at global scope.",
    "keyConcepts": [
      "An empty `.js` file creates Global Execution Context, `window` object, and `this` reference.",
      "In browsers, Global Object = `window`. In Node.js, Global Object = `global`.",
      "At global scope, `this === window` evaluates to `true`.",
      "Global variables (`var a = 10`) attach directly to `window.a`."
    ],
    "detailedContent": "# Episode 5: Shortest JS Program, window Object & this Keyword\n\n## Overview\nAn empty file is the shortest JavaScript program. Even with zero lines of code, the JS engine creates the Global Execution Context, instantiates the Global Object (`window` in browsers), and binds the global `this` keyword to it.\n\n## Detailed Explanation\nEven when your JavaScript file contains zero code, the engine works under the hood:\n\n1. Creates the Global Execution Context (GEC).\n2. Instantiates the Global Object (`window` in browser environments, `global` in Node.js).\n3. Binds `this` at the global level to the Global Object (`this === window` evaluates to `true`).\n\nAny variable or function declared in the global scope automatically attaches as a property on the global `window` object.\n\n## Real-World Analogy\n🌐 Blank Digital Canvas: Opening a new blank document still initializes document margins, default font settings, and cursor coordinates. An empty JS file initializes GEC, `window`, and `this`.\n\n## Key Architectural Concepts\n- An empty `.js` file creates Global Execution Context, `window` object, and `this` reference.\n- In browsers, Global Object = `window`. In Node.js, Global Object = `global`.\n- At global scope, `this === window` evaluates to `true`.\n- Global variables (`var a = 10`) attach directly to `window.a`.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var a = 10;\nfunction b() {\n  var x = 20;\n}\n\nconsole.log(a); // 10\nconsole.log(window.a); // 10\nconsole.log(this.a); // 10\nconsole.log(this === window); // true"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the shortest JavaScript program and what does the JS engine create for it?",
        "answer": "An empty file is the shortest JS program. The engine creates the Global Execution Context, the Global Object ('window' in browsers), and binds the 'this' keyword to the Global Object."
      }
    ]
  },
  {
    "id": "js-undefined-vs-not-defined",
    "title": "Episode 6: undefined vs not defined in JavaScript",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Easy",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`undefined` is a memory placeholder for declared variables. `not defined` is a ReferenceError for undeclared identifiers.",
    "keyConcepts": [
      "`undefined` is a primitive type value assigned during Memory Allocation Phase.",
      "`not defined` is a ReferenceError thrown at runtime for undeclared variables.",
      "Never manually assign `a = undefined`; use `null` for intentional absence of value."
    ],
    "detailedContent": "# Episode 6: undefined vs not defined in JavaScript\n\n## Overview\n`undefined` is a special primitive value assigned to variables during Phase 1 memory allocation before explicit assignment. `not defined` is a ReferenceError thrown when accessing a variable that was never declared in any scope.\n\n## Detailed Explanation\nUnderstanding the distinction is vital:\n\n- **`undefined`**: The variable has been declared and allocated memory in Phase 1, but has not yet been assigned a value in Phase 2.\n- **`not defined`**: The variable was never declared in any accessible scope. Accessing it throws `Uncaught ReferenceError: x is not defined`.\n\n`undefined` takes up actual memory space in JavaScript and acts as a placeholder value.\n\n## Real-World Analogy\n🏷️ Reserved Seat vs No Ticket: An empty seat with a reservation tag is `undefined` (space reserved, person hasn't arrived). Searching for a seat number that doesn't exist in the theater is `not defined`.\n\n## Key Architectural Concepts\n- `undefined` is a primitive type value assigned during Memory Allocation Phase.\n- `not defined` is a ReferenceError thrown at runtime for undeclared variables.\n- Never manually assign `a = undefined`; use `null` for intentional absence of value.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var a;\nconsole.log(a); // Output: undefined\n\na = 10;\nconsole.log(a); // Output: 10\n\n// console.log(b); // Uncaught ReferenceError: b is not defined"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Explain the difference between undefined and not defined in JavaScript.",
        "answer": "'undefined' is a primitive value assigned to declared variables during the Memory Allocation phase before assignment. 'not defined' is a ReferenceError thrown when attempting to access a variable that was never declared."
      }
    ]
  },
  {
    "id": "js-scope-chain-lexical-environment",
    "title": "Episode 7: Scope Chain, Lexical Environment & Identifier Resolution",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Lexical Environment = Local Memory + Outer Reference. Scope Chain traverses parent lexical environments to resolve variables.",
    "keyConcepts": [
      "Lexical Environment = Local Memory + Outer Lexical Environment Reference.",
      "Scope Chain is the mechanism of searching variables up parent lexical environments.",
      "Inner scopes can access outer scope variables; outer scopes CANNOT access inner scope variables.",
      "Parent lexical reference of Global Execution Context is null."
    ],
    "detailedContent": "# Episode 7: Scope Chain, Lexical Environment & Identifier Resolution\n\n## Overview\nA Lexical Environment consists of local memory space plus a reference to the parent (outer) Lexical Environment. The Scope Chain is the recursive chain of Lexical Environment references used to resolve variable identifiers.\n\n## Detailed Explanation\n'Lexical' means in hierarchy or sequence. Whenever an Execution Context is created, a **Lexical Environment** is created alongside it.\n\n```\nLexical Environment = Local Memory + Reference to Lexical Environment of Parent Scope\n```\n\nWhen a variable is accessed inside a function:\n1. The engine checks local memory.\n2. If not found, it follows the outer reference to the parent's Lexical Environment.\n3. It traverses up the chain until it finds the variable or reaches Global Scope (where parent reference is `null`).\n4. If still not found, it throws `ReferenceError`.\n\n## Real-World Analogy\n🏠 Nested Russian Dolls: An inner doll can look outside into the outer doll's compartment. The outer doll cannot look inside the inner doll. The Scope Chain searches outwards layer by layer.\n\n## Key Architectural Concepts\n- Lexical Environment = Local Memory + Outer Lexical Environment Reference.\n- Scope Chain is the mechanism of searching variables up parent lexical environments.\n- Inner scopes can access outer scope variables; outer scopes CANNOT access inner scope variables.\n- Parent lexical reference of Global Execution Context is null.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function a() {\n  var b = 10;\n  c();\n  function c() {\n    console.log(b); // 10 (Found in parent function a's lexical environment)\n  }\n}\na();\n// console.log(b); // ReferenceError: b is not defined (Global cannot look into a's scope)"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Lexical Environment and how does the Scope Chain work?",
        "answer": "A Lexical Environment is local memory plus a pointer to the outer parent's Lexical Environment. The Scope Chain is the process of resolving variables by searching local memory first, then recursively following outer lexical pointers up to Global Scope."
      }
    ]
  },
  {
    "id": "js-let-const-temporal-dead-zone",
    "title": "Episode 8: let, const & Temporal Dead Zone (TDZ)",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`let` and `const` hoist into Script/Block scope. Accessing them in TDZ throws ReferenceError. `const` prevents reassignment.",
    "keyConcepts": [
      "`let` and `const` ARE hoisted, but stored in Script/Block scope (not `window`).",
      "TDZ is the window between memory allocation and initialization line.",
      "Accessing `let`/`const` in TDZ throws ReferenceError.",
      "Re-declaring `let` or `const` in the same scope throws SyntaxError.",
      "`const` must be initialized immediately; reassignment throws TypeError."
    ],
    "detailedContent": "# Episode 8: let, const & Temporal Dead Zone (TDZ)\n\n## Overview\n`let` and `const` declarations are hoisted into a separate Script/Block memory space (not `window`). The Temporal Dead Zone (TDZ) is the period between when a `let`/`const` variable is hoisted and when it is initialized with a value.\n\n## Detailed Explanation\nUnlike `var` (which attaches to `window`/`global`), `let` and `const` variables are hoisted into a separate memory space called **Script Scope**.\n\n- **Temporal Dead Zone (TDZ)**: The phase from the start of scope execution until the variable's declaration line is evaluated. Accessing a `let` or `const` variable in TDZ throws `ReferenceError: Cannot access 'x' before initialization`.\n- **Re-declaration**: `var` permits duplicate declarations. `let` and `const` throw `SyntaxError: Identifier 'x' has already been declared`.\n- **`const`**: Must be initialized at declaration line; reassignment throws `TypeError: Assignment to constant variable`.\n\n## Real-World Analogy\n🚧 Construction Hazard Zone: A building plot is reserved (`let` hoisted), but cordoned off with warning tape (TDZ). You cannot step inside until construction completes (initialization line).\n\n## Key Architectural Concepts\n- `let` and `const` ARE hoisted, but stored in Script/Block scope (not `window`).\n- TDZ is the window between memory allocation and initialization line.\n- Accessing `let`/`const` in TDZ throws ReferenceError.\n- Re-declaring `let` or `const` in the same scope throws SyntaxError.\n- `const` must be initialized immediately; reassignment throws TypeError.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// console.log(a); // ReferenceError: Cannot access 'a' before initialization (TDZ!)\nlet a = 10;\nconsole.log(a); // 10\n\nconst b = 100;\n// b = 200; // TypeError: Assignment to constant variable.\n// let a = 50; // SyntaxError: Identifier 'a' has already been declared."
      }
    ],
    "interviewQuestions": [
      {
        "question": "Are let and const hoisted in JavaScript? Explain Temporal Dead Zone (TDZ).",
        "answer": "Yes, 'let' and 'const' are hoisted, but allocated in a separate Script/Block scope rather than attached to global object. TDZ is the period from scope entry until the line of declaration is evaluated; accessing the variable during TDZ throws a ReferenceError."
      },
      {
        "question": "Differentiate between SyntaxError, ReferenceError, and TypeError with let/const.",
        "answer": "SyntaxError occurs when re-declaring let/const or omitting const initialization. ReferenceError occurs when accessing let/const during TDZ. TypeError occurs when reassigning a const variable."
      }
    ]
  },
  {
    "id": "js-block-scope-shadowing",
    "title": "Episode 9: Block Scope, Compound Statements & Variable Shadowing",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`let` and `const` are block-scoped. Shadowing overrides outer variables within a block. Illegal shadowing (`let` -> `var`) throws SyntaxError.",
    "keyConcepts": [
      "Block Scope stores `let` and `const` in a dedicated Block memory space.",
      "`var` is function-scoped/global-scoped and ignores block boundaries.",
      "Shadowing overrides access to outer variables within the block.",
      "Illegal Shadowing: `let` outside shadowed by `var` inside a block throws SyntaxError."
    ],
    "detailedContent": "# Episode 9: Block Scope, Compound Statements & Variable Shadowing\n\n## Overview\nA Block (`{}`) groups multiple statements into a single compound statement. `let` and `const` are block-scoped. Variable Shadowing occurs when a variable declared inside a block hides an outer variable of the same name.\n\n## Detailed Explanation\n- **Block**: Defined by `{}`. Used where JS expects a single statement (e.g., `if (true) { ... }`).\n- **Block Scope**: `let` and `const` declared inside `{}` are allocated in a separate **Block Scope** memory container and destroyed when the block finishes.\n- **Variable Shadowing**: Declaring `var a = 10` globally and `var a = 100` inside a block modifies the exact same global variable (because `var` is not block-scoped). For `let` and `const`, inner block variables shadow outer variables in memory without mutating the outer scope.\n- **Illegal Shadowing**: Shadowing a `let` variable with a `var` inside a block throws `SyntaxError` because `var` attempts to leak into the same scope.\n\n## Real-World Analogy\n🕶️ Tinted Sunglasses: Wearing sunglasses (inner block variable) shadows bright sunlight (outer variable). Taking off sunglasses restores the original outer brightness without changing the sun.\n\n## Key Architectural Concepts\n- Block Scope stores `let` and `const` in a dedicated Block memory space.\n- `var` is function-scoped/global-scoped and ignores block boundaries.\n- Shadowing overrides access to outer variables within the block.\n- Illegal Shadowing: `let` outside shadowed by `var` inside a block throws SyntaxError.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var a = 100;\nlet b = 200;\n{\n  var a = 10; // Shadows global 'a' (mutates global memory!)\n  let b = 20; // Shadows outer 'b' in Block Scope memory\n  const c = 30;\n  console.log(a); // 10\n  console.log(b); // 20\n}\nconsole.log(a); // 10 (Global 'a' was mutated by var)\nconsole.log(b); // 200 (Outer 'b' remains 200 in Script scope)\n// console.log(c); // ReferenceError: c is not defined"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Block Scope and how does Variable Shadowing work?",
        "answer": "Block Scope isolates 'let' and 'const' variables inside a '{}' block. Variable Shadowing occurs when an inner block variable shares the same name as an outer variable, overriding access within that block."
      },
      {
        "question": "What is Illegal Shadowing in JavaScript?",
        "answer": "Illegal Shadowing occurs when trying to shadow an outer 'let' variable using a 'var' inside a block. Because 'var' is not block-scoped, it attempts to re-declare the 'let' variable in the outer scope, causing a SyntaxError."
      }
    ]
  },
  {
    "id": "js-closures",
    "title": "Episode 10: Closures in JavaScript & Lexical Memory Retention",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "A Closure is a function bundled with its lexical environment. Inner functions retain access to outer scope variables post-return.",
    "keyConcepts": [
      "Closure = Function + Lexical Environment Reference.",
      "Functions remember variables from their birth scope even after outer functions return.",
      "Closures hold variable references in memory, NOT static copied values.",
      "Overuse of closures without cleanup can lead to memory leaks."
    ],
    "detailedContent": "# Episode 10: Closures in JavaScript & Lexical Memory Retention\n\n## Overview\nA Closure is the combination of a function bundled together (enclosed) with references to its surrounding Lexical Environment. Closures give inner functions access to outer function scopes even after outer functions have returned.\n\n## Detailed Explanation\nWhen a function is returned from another function in JavaScript, it does not return alone. It returns **bundled together with its Lexical Environment**.\n\n```js\nfunction x() {\n  var a = 7;\n  function y() {\n    console.log(a);\n  }\n  return y;\n}\nvar z = x();\nz(); // Logs 7!\n```\n\nEven though `x()` finished executing and its context was popped off the Call Stack, `z()` retains a reference to `a` because `y` formed a **Closure** over the lexical scope of `x`.\n\n## Real-World Analogy\n🎒 Student Backpack: When a student leaves school (outer function returns), they carry their backpack (closure memory) containing their textbooks (`a = 7`). Anywhere they go later (`z()`), they can open their backpack and access their books.\n\n## Key Architectural Concepts\n- Closure = Function + Lexical Environment Reference.\n- Functions remember variables from their birth scope even after outer functions return.\n- Closures hold variable references in memory, NOT static copied values.\n- Overuse of closures without cleanup can lead to memory leaks.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function z() {\n  var b = 900;\n  function x() {\n    var a = 7;\n    function y() {\n      console.log(a, b); // Logs 7, 900\n    }\n    y();\n  }\n  x();\n}\nz();"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Closure in JavaScript and how does it work?",
        "answer": "A Closure is a function combined with references to its outer Lexical Environment. Even after the outer function executes and returns, the inner function retains access to outer variables because it preserves a closure reference to that memory."
      }
    ]
  },
  {
    "id": "js-settimeout-closures-interview",
    "title": "Episode 11: setTimeout, Closures & Loop Binding Pitfalls",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`var` in `for` loop shares a single reference for `setTimeout`. Fix using block-scoped `let` or closure functions.",
    "keyConcepts": [
      "`setTimeout` does not block execution; timer runs asynchronously in Web APIs.",
      "`var` in loop header shares one variable reference across all iterations.",
      "`let` in loop header creates a new block-scoped binding per iteration.",
      "Closures can solve `var` binding issues by creating new function scope bounds."
    ],
    "detailedContent": "# Episode 11: setTimeout, Closures & Loop Binding Pitfalls\n\n## Overview\n`setTimeout` stores a timer in the Web APIs environment and registers a callback. A famous interview problem involves using `var` inside a `for` loop with `setTimeout`, where all callbacks close over the same shared variable reference.\n\n## Detailed Explanation\nConsider this classic question:\n\n```js\nfor (var i = 1; i <= 5; i++) {\n  setTimeout(() => console.log(i), i * 1000);\n}\n```\n\n**Output**: Prints `6` five times after each second!\n\n**Why?**: `var` is function-scoped. All 5 `setTimeout` callbacks close over the **exact same memory reference `i`**. By the time the 1-second timer expires, the loop has completed and `i` has become 6.\n\n**Solutions**:\n1. Use `let i`: `let` is block-scoped, creating a brand new `i` binding for every loop iteration.\n2. Use a Closure / IIFE: Wrap `setTimeout` inside a helper function to pass `i` by value into a distinct parameter scope.\n\n## Real-World Analogy\n🎟️ Shared Token vs Individual Ticket: Passing a shared token (`var i`) means everyone reads the number updated at the end (6). Giving everyone their own ticket (`let i`) preserves their individual number (1 to 5).\n\n## Key Architectural Concepts\n- `setTimeout` does not block execution; timer runs asynchronously in Web APIs.\n- `var` in loop header shares one variable reference across all iterations.\n- `let` in loop header creates a new block-scoped binding per iteration.\n- Closures can solve `var` binding issues by creating new function scope bounds.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// Solution 1: Using block-scoped let\nfor (let i = 1; i <= 5; i++) {\n  setTimeout(() => console.log('let i:', i), i * 1000);\n}\n\n// Solution 2: Using Closure with helper function\nfor (var i = 1; i <= 5; i++) {\n  (function(x) {\n    setTimeout(() => console.log('closure x:', x), x * 1000);\n  })(i);\n}"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why does a for loop with var i and setTimeout print 6 five times, and how do you fix it?",
        "answer": "Because 'var' is function-scoped, all callback functions close over the same memory reference 'i'. When timers expire after 1s, the loop has finished and 'i' is 6. Fix it by 1) replacing 'var' with block-scoped 'let', or 2) wrapping setTimeout in an IIFE/closure passing 'i' as a parameter."
      }
    ]
  },
  {
    "id": "js-closure-interview-questions",
    "title": "Episode 12: Famous Closure Interview Questions & Design Patterns",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Closures enable Data Hiding, Memoization, and Module Patterns. Beware of memory leaks from uncollected closure variables.",
    "keyConcepts": [
      "Encapsulation hides internal implementation variables using closures.",
      "Constructor functions can encapsulate state using `this.increment` closures.",
      "Garbage Collector cannot reclaim variables referenced inside active closures.",
      "V8 Smart Garbage Collection optimizes unreferenced closure variables when possible."
    ],
    "detailedContent": "# Episode 12: Famous Closure Interview Questions & Design Patterns\n\n## Overview\nClosures power core JavaScript design patterns including Data Hiding/Encapsulation, Constructor Functions, Module Patterns, Memoization, and Currying. They are heavily tested in senior technical interviews.\n\n## Detailed Explanation\nKey application patterns enabled by closures:\n\n1. **Data Hiding & Encapsulation**: Restrict access to variables from outside the function scope.\n2. **Constructor Function Closures**: Create stateful objects with private count state.\n3. **Memoization**: Cache expensive function outputs using a closure-scoped cache object.\n4. **Function Currying**: Transform `f(a, b)` into `f(a)(b)` via closures.\n\n**Disadvantages of Closures**:\n- Variables closed over are not garbage collected automatically, leading to higher memory footprint.\n- Unhandled closures in long-lived applications cause memory leaks.\n\n## Real-World Analogy\n🔒 Bank ATM Machine: Customers cannot directly touch money inside the vault (`count` variable). They must interact through private interface buttons (`increment()`, `decrement()`).\n\n## Key Architectural Concepts\n- Encapsulation hides internal implementation variables using closures.\n- Constructor functions can encapsulate state using `this.increment` closures.\n- Garbage Collector cannot reclaim variables referenced inside active closures.\n- V8 Smart Garbage Collection optimizes unreferenced closure variables when possible.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function Counter() {\n  var count = 0; // Private variable hidden from outer scope\n\n  this.incrementCounter = function() {\n    count++;\n    console.log('Count:', count);\n  };\n\n  this.decrementCounter = function() {\n    count--;\n    console.log('Count:', count);\n  };\n}\n\nvar counter1 = new Counter();\ncounter1.incrementCounter(); // Count: 1\ncounter1.incrementCounter(); // Count: 2\n// console.log(counter1.count); // undefined (Data Hiding!)"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do you implement data hiding and encapsulation using Closures in JavaScript?",
        "answer": "Declare variables inside an outer function and return inner functions that access those variables. Outer code cannot access or modify the variables directly, enforcing data privacy."
      },
      {
        "question": "What are the drawbacks of Closures and how can they cause memory leaks?",
        "answer": "Variables retained in closure memory are not garbage collected while inner functions remain active. If closures are attached to long-lived objects or global event listeners without cleanup, memory accumulates, causing memory leaks."
      }
    ]
  },
  {
    "id": "js-first-class-functions",
    "title": "Episode 13: First-Class Functions, Function Statements vs Expressions",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "First-Class Functions can be assigned, passed, and returned. Function Declarations hoist fully; Function Expressions hoist as `undefined`.",
    "keyConcepts": [
      "Function Statement = Function Declaration (fully hoisted).",
      "Function Expression = Variable assigned a function (hoisted as undefined).",
      "First-Class Functions = Ability to pass, return, and assign functions as values.",
      "Parameters are placeholders in function definition; Arguments are actual values passed."
    ],
    "detailedContent": "# Episode 13: First-Class Functions, Function Statements vs Expressions\n\n## Overview\nJavaScript treats Functions as First-Class Citizens (First-Class Functions). This means functions can be stored in variables, passed as arguments to other functions, and returned from functions.\n\n## Detailed Explanation\nCore terminology to master:\n\n- **Function Statement / Declaration**: Defined with `function a() {}`. Fully hoisted.\n- **Function Expression**: Assigning a function to a variable `var b = function() {}`. Hoisted as `undefined`.\n- **Anonymous Function**: A function without a name (`function() {}`). Used as values in expressions.\n- **Named Function Expression**: `var b = function xyz() {}`. Note: `xyz()` is scoped inside `xyz`'s own body, calling `xyz()` in outer scope throws `ReferenceError`.\n- **First-Class Functions (First-Class Citizens)**: The capability to pass functions as arguments, return them from functions, and assign them to variables.\n\n## Real-World Analogy\n🎁 Passable Gift Box: A function is like a gift box. You can label it (declaration), store it on a shelf (variable), hand it to a friend (argument), or receive it as a gift (return value).\n\n## Key Architectural Concepts\n- Function Statement = Function Declaration (fully hoisted).\n- Function Expression = Variable assigned a function (hoisted as undefined).\n- First-Class Functions = Ability to pass, return, and assign functions as values.\n- Parameters are placeholders in function definition; Arguments are actual values passed.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// First-Class Function: Passing function as argument and returning function\nfunction b(param1) {\n  return function inner() {\n    console.log('Returned function executed!');\n  };\n}\n\nfunction sampleArg() {\n  console.log('Sample Argument');\n}\n\nvar res = b(sampleArg);\nres(); // Logs: 'Returned function executed!'"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between Function Statement and Function Expression?",
        "answer": "A Function Statement (Declaration) is fully hoisted with its function body and can be invoked before definition. A Function Expression assigns a function to a variable, so it is hoisted as 'undefined' and throws TypeError if invoked early."
      },
      {
        "question": "What does 'First-Class Functions' mean in JavaScript?",
        "answer": "First-Class Functions means functions are treated as first-class values: they can be assigned to variables, passed as arguments into other functions, and returned from functions."
      }
    ]
  },
  {
    "id": "js-callback-functions-event-listeners",
    "title": "Episode 14: Callback Functions & Event Listener Memory Management",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Callbacks pass functions as arguments for async/event execution. Clean up Event Listeners to prevent memory leaks.",
    "keyConcepts": [
      "Callback function is passed as an argument to execute asynchronously or later.",
      "Blocking the Main Thread occurs when heavy synchronous code runs inside callbacks.",
      "Event Listeners retain closure scope memory until explicitly removed.",
      "Always clean up event listeners to prevent memory bloat in Single Page Applications (SPAs)."
    ],
    "detailedContent": "# Episode 14: Callback Functions & Event Listener Memory Management\n\n## Overview\nA Callback Function is a function passed into another function as an argument, to be executed later. Event Listeners use callbacks with closures to track DOM user interactions.\n\n## Detailed Explanation\nBecause functions are first-class citizens, we can pass function `y` into function `x`:\n\n```js\nfunction x(y) {\n  console.log('x');\n  y();\n}\nx(function y() {\n  console.log('y');\n});\n```\n\n**Event Listeners & Garbage Collection**:\nEvent listeners form closures over their outer variables. If a page has 1,000 DOM buttons with attached event listeners closing over large scope data, that memory **cannot be garbage collected** while the DOM elements exist.\n\nRemoving event listeners (`removeEventListener`) frees up memory when elements are unmounted.\n\n## Real-World Analogy\n📞 Callback Phone Number: Leaving your phone number (callback function) at a desk. When your turn arrives, the receptionist calls you back to take action.\n\n## Key Architectural Concepts\n- Callback function is passed as an argument to execute asynchronously or later.\n- Blocking the Main Thread occurs when heavy synchronous code runs inside callbacks.\n- Event Listeners retain closure scope memory until explicitly removed.\n- Always clean up event listeners to prevent memory bloat in Single Page Applications (SPAs).",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function attachEventListener() {\n  let count = 0;\n  const button = document.getElementById('clickMe');\n  \n  function handleClick() {\n    console.log('Button Clicked', ++count);\n  }\n  \n  button.addEventListener('click', handleClick);\n  \n  // Return cleanup function for memory management\n  return function remove() {\n    button.removeEventListener('click', handleClick);\n  };\n}"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Callback Function in JavaScript?",
        "answer": "A callback function is a function passed as an argument into another function, intended to be executed later after an operation completes or an event occurs."
      },
      {
        "question": "Why should Event Listeners be removed when no longer needed?",
        "answer": "Event listeners form closures over outer variables, preventing those variables from being garbage collected. Unremoved listeners on unmounted elements cause memory leaks."
      }
    ]
  },
  {
    "id": "js-event-loop-microtask-queue",
    "title": "Episode 15: Asynchronous JS, Event Loop & Microtask Queue",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "The Event Loop checks Call Stack emptiness. Drains Microtask Queue (Promises) first, then processes Callback Queue (`setTimeout`).",
    "keyConcepts": [
      "Event Loop continuously checks if Call Stack is empty.",
      "Microtask Queue priority > Callback Queue (Task Queue) priority.",
      "Promises and MutationObserver callbacks go to Microtask Queue.",
      "`setTimeout`, `setInterval`, DOM events go to Callback Queue.",
      "Microtask starvation occurs if microtasks recursively add new microtasks."
    ],
    "detailedContent": "# Episode 15: Asynchronous JS, Event Loop & Microtask Queue\n\n## Overview\nThe Event Loop is an orchestration mechanism that monitors the Call Stack, Microtask Queue, and Callback (Task) Queue. It pushes queued asynchronous callbacks onto the Call Stack when the stack becomes empty.\n\n## Detailed Explanation\nJavaScript runtime environment consists of:\n\n1. **Call Stack**: Executes synchronous code.\n2. **Web APIs**: Browser features (`setTimeout`, `fetch`, DOM events, `console`, `localStorage`).\n3. **Callback Queue (Task Queue)**: Holds callbacks from `setTimeout`, DOM events, `setInterval`.\n4. **Microtask Queue**: Holds high-priority callbacks from **Promises** and **MutationObserver**.\n\n**Event Loop Algorithm**:\n1. Continuously checks if the Call Stack is empty.\n2. When Call Stack is empty, it processes **ALL tasks in the Microtask Queue** first.\n3. Only after the Microtask Queue is completely empty does it take **ONE task from the Callback Queue** and push it to the Call Stack.\n4. **Starvation**: If microtasks continually spawn new microtasks, the Callback Queue is starved of execution.\n\n## Real-World Analogy\n🎟️ VIP vs Regular Queue: Microtask Queue is the VIP airport line (Promises). Callback Queue is the regular line (`setTimeout`). VIP line must be completely cleared before a single regular passenger is processed.\n\n## Key Architectural Concepts\n- Event Loop continuously checks if Call Stack is empty.\n- Microtask Queue priority > Callback Queue (Task Queue) priority.\n- Promises and MutationObserver callbacks go to Microtask Queue.\n- `setTimeout`, `setInterval`, DOM events go to Callback Queue.\n- Microtask starvation occurs if microtasks recursively add new microtasks.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log('Start');\n\nsetTimeout(() => {\n  console.log('setTimeout Callback (Task Queue)');\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log('Promise Microtask (Microtask Queue)');\n});\n\nconsole.log('End');\n\n// Output Order:\n// 1. Start\n// 2. End\n// 3. Promise Microtask (Microtask Queue)\n// 4. setTimeout Callback (Task Queue)"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does the JavaScript Event Loop work?",
        "answer": "The Event Loop continuously checks if the Call Stack is empty. When empty, it drains all tasks in the Microtask Queue (Promises). Once empty, it takes the first task from the Callback Queue (setTimeout) and pushes it to Call Stack."
      },
      {
        "question": "Which queue has higher priority: Microtask Queue or Callback Queue?",
        "answer": "Microtask Queue has higher priority. All microtasks are executed before a single task from the Callback Queue is processed."
      }
    ]
  },
  {
    "id": "js-engine-v8-architecture",
    "title": "Episode 16: Google V8 Engine Architecture: Parser, AST & JIT Compiler",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "V8 Engine parses code to AST, Ignition generates Bytecode, and TurboFan JIT compiles hot code into optimized machine code.",
    "keyConcepts": [
      "JS Engine Architecture = Parser -> AST -> Interpreter (Ignition) -> JIT Compiler (TurboFan).",
      "AST (Abstract Syntax Tree) is a tree representation of source code structure.",
      "JIT (Just-In-Time) compilation compiles code during runtime.",
      "Garbage Collector in V8 is called Orinoco (uses generational Mark-Sweep-Compact)."
    ],
    "detailedContent": "# Episode 16: Google V8 Engine Architecture: Parser, AST & JIT Compiler\n\n## Overview\nThe JavaScript Engine (such as Google V8) parses code into an Abstract Syntax Tree (AST), interprets bytecode via Ignition, and compiles hot code paths into optimized machine code via the TurboFan JIT compiler.\n\n## Detailed Explanation\nCore pipeline of the Google V8 Engine:\n\n1. **Parsing Phase**:\n   - **Lexical Analysis (Tokenizer)**: Breaks raw JS code string into tokens.\n   - **Syntax Analysis (Parser)**: Converts tokens into an **Abstract Syntax Tree (AST)**.\n2. **Interpretation Phase (Ignition)**:\n   - Ignition Interpreter converts AST into portable **Bytecode** and executes it immediately.\n3. **Compilation Phase (TurboFan JIT Compiler)**:\n   - **Just-In-Time (JIT) Compilation**: While bytecode runs, V8 identifies 'Hot Code' (frequently invoked functions).\n   - TurboFan compiles Hot Code directly into **Optimized Machine Code**.\n   - **Deoptimization**: If variable types change dynamically in hot functions, TurboFan de-optimizes back to Bytecode.\n\n## Real-World Analogy\n🏎️ Interpreter & Nitro Boost: Ignition Interpreter is a standard engine getting car moving instantly. TurboFan JIT Compiler is a nitro boost activated for straight paths (hot code), switching back to standard engine if road turns bumpy (type change).\n\n## Key Architectural Concepts\n- JS Engine Architecture = Parser -> AST -> Interpreter (Ignition) -> JIT Compiler (TurboFan).\n- AST (Abstract Syntax Tree) is a tree representation of source code structure.\n- JIT (Just-In-Time) compilation compiles code during runtime.\n- Garbage Collector in V8 is called Orinoco (uses generational Mark-Sweep-Compact).",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// Monomorphic function (V8 TurboFan optimizes aggressively)\nfunction add(a, b) {\n  return a + b;\n}\n\n// Invoked 100,000 times with same types (numbers)\nfor (let i = 0; i < 100000; i++) {\n  add(10, 20); // Hot Code Path -> TurboFan Machine Code\n}\n\n// Deoptimization Trigger:\nadd('hello', 'world'); // Type shape changed! TurboFan deoptimizes to Bytecode."
      }
    ],
    "interviewQuestions": [
      {
        "question": "Explain the major components of Google V8 JavaScript Engine.",
        "answer": "V8 consists of: 1) Parser (breaks code into Abstract Syntax Tree - AST), 2) Ignition Interpreter (converts AST into Bytecode for fast startup), and 3) TurboFan JIT Compiler (compiles hot code paths into optimized machine code)."
      }
    ]
  },
  {
    "id": "js-settimeout-trust-issues",
    "title": "Episode 17: Trust Issues with setTimeout() & Concurrency Delays",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`setTimeout` guarantees minimum delay time. Execution will be delayed if Call Stack is blocked by synchronous code.",
    "keyConcepts": [
      "`setTimeout` delay parameter specifies minimum waiting time, not exact execution time.",
      "Call Stack must be empty before Event Loop pushes timer callbacks.",
      "Synchronous code always blocks timer execution.",
      "`setTimeout(fn, 0)` is used to defer execution after current synchronous call stack clears."
    ],
    "detailedContent": "# Episode 17: Trust Issues with setTimeout() & Concurrency Delays\n\n## Overview\n`setTimeout(fn, delay)` does NOT guarantee execution after exactly `delay` milliseconds. It guarantees a MINIMUM delay of `delay` milliseconds before the callback is placed in the Task Queue.\n\n## Detailed Explanation\nIf you write `setTimeout(cb, 5000)`, the browser starts a 5000ms timer in Web APIs.\n\nHowever, if the Call Stack is currently occupied executing a heavy synchronous 10-second `while` loop, the 5000ms timer callback **must wait in the Task Queue** until the Call Stack becomes completely empty.\n\nAs a result, a 5-second `setTimeout` callback may end up running after 10+ seconds!\n\n## Real-World Analogy\n🚦 Doctor's Appointment Window: Booking an appointment for 5:00 PM means you won't be seen BEFORE 5:00 PM. If a complex surgery runs over, you may wait until 5:30 PM before entering.\n\n## Key Architectural Concepts\n- `setTimeout` delay parameter specifies minimum waiting time, not exact execution time.\n- Call Stack must be empty before Event Loop pushes timer callbacks.\n- Synchronous code always blocks timer execution.\n- `setTimeout(fn, 0)` is used to defer execution after current synchronous call stack clears.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log('Start');\n\nsetTimeout(() => {\n  console.log('Callback executed!');\n}, 1000);\n\n// Simulate 3-second heavy synchronous blocking loop\nconst startDate = Date.now();\nlet endDate = startDate;\nwhile (endDate < startDate + 3000) {\n  endDate = Date.now();\n}\n\nconsole.log('Blocking Loop End');\n\n// Console Output:\n// Start\n// (3 second delay)\n// Blocking Loop End\n// Callback executed! (Ran after 3 seconds instead of 1 second!)"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Is setTimeout guaranteed to execute after the specified delay?",
        "answer": "No. The delay parameter specifies the minimum delay before the callback is placed in the Task Queue. If the Call Stack is blocked by synchronous code, execution will be delayed until the Call Stack is empty."
      }
    ]
  },
  {
    "id": "js-higher-order-functions",
    "title": "Episode 18: Higher-Order Functions & Functional Programming",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Higher-Order Functions take or return functions. Promotes reusability, DRY code, and functional programming.",
    "keyConcepts": [
      "Higher-Order Function = Function accepting/returning another function.",
      "Polymorphism via callbacks: Decouples algorithm iteration from calculation logic.",
      "Custom `Array.prototype.myMap` polyfill implementation using HOF pattern."
    ],
    "detailedContent": "# Episode 18: Higher-Order Functions & Functional Programming\n\n## Overview\nA Higher-Order Function (HOF) is a function that takes one or more functions as arguments, or returns a function as its output. HOFs form the bedrock of Functional Programming in JavaScript.\n\n## Detailed Explanation\nFunctions that accept or return other functions are Higher-Order Functions. The functions passed into them are Callback Functions.\n\n**DRY Principle (Don't Repeat Yourself)**:\nInstead of writing repetitive `for` loops to compute Area, Circumference, and Diameter of circles, write a single reusable Higher-Order Function `calculate(radiusArr, logicFn)` and pass specific logic functions into it.\n\n## Real-World Analogy\n🔌 Universal Power Socket: The socket (Higher-Order Function) accepts various plugs (logic functions: laptop charger, lamp, fan) to perform different tasks without changing socket wiring.\n\n## Key Architectural Concepts\n- Higher-Order Function = Function accepting/returning another function.\n- Polymorphism via callbacks: Decouples algorithm iteration from calculation logic.\n- Custom `Array.prototype.myMap` polyfill implementation using HOF pattern.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const radius = [3, 1, 2, 4];\n\nconst area = (r) => Math.PI * r * r;\nconst circumference = (r) => 2 * Math.PI * r;\n\n// Higher-Order Function\nconst calculate = function(arr, logic) {\n  const output = [];\n  for (let i = 0; i < arr.length; i++) {\n    output.push(logic(arr[i]));\n  }\n  return output;\n};\n\nconsole.log(calculate(radius, area));\nconsole.log(calculate(radius, circumference));"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Higher-Order Function in JavaScript?",
        "answer": "A Higher-Order Function is a function that takes another function as an argument, returns a function, or both. Common examples include map(), filter(), reduce(), and custom utility wrappers."
      }
    ]
  },
  {
    "id": "js-map-filter-reduce",
    "title": "Episode 19: Array Functional Utilities: map, filter & reduce",
    "domain": "javascript",
    "category": "Season 1: Core JS Execution Engine & Fundamentals",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`map` transforms arrays, `filter` extracts matching elements, and `reduce` aggregates elements into a single value.",
    "keyConcepts": [
      "`map()` transforms array 1-to-1.",
      "`filter()` selects elements matching boolean test.",
      "`reduce()` aggregates array into a single accumulator value.",
      "Chaining `map` and `filter` provides clean data transformations."
    ],
    "detailedContent": "# Episode 19: Array Functional Utilities: map, filter & reduce\n\n## Overview\n`map()`, `filter()`, and `reduce()` are Higher-Order Array Methods used for transformation, filtering, and aggregation of array datasets without mutating original array memory.\n\n## Detailed Explanation\n- **`map(fn)`**: Transforms every element in an array by applying a function, returning a new array of equal length.\n- **`filter(fn)`**: Evaluates every element against a boolean test, returning a new array with elements that pass (`true`).\n- **`reduce(fn, initialVal)`**: Iterates through elements, accumulating values into a single output result (number, object, array).\n\n## Real-World Analogy\n🌾 Grain Processing Factory:\n- `map()`: Milling wheat into flour packets (1-to-1 transformation).\n- `filter()`: Sifting out bad grains (selective filtering).\n- `reduce()`: Packing all flour packets into 1 big shipping crate (aggregation).\n\n## Key Architectural Concepts\n- `map()` transforms array 1-to-1.\n- `filter()` selects elements matching boolean test.\n- `reduce()` aggregates array into a single accumulator value.\n- Chaining `map` and `filter` provides clean data transformations.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const users = [\n  { firstName: 'Akshay', lastName: 'Saini', age: 26 },\n  { firstName: 'Donald', lastName: 'Trump', age: 75 },\n  { firstName: 'Elon', lastName: 'Musk', age: 50 },\n  { firstName: 'Deepika', lastName: 'Padukone', age: 26 }\n];\n\n// 1. map: Full names list\nconst fullNames = users.map(u => `${u.firstName} ${u.lastName}`);\n\n// 2. reduce: Age frequency count object\nconst ageCount = users.reduce((acc, curr) => {\n  acc[curr.age] = (acc[curr.age] || 0) + 1;\n  return acc;\n}, {});\n\n// 3. Chaining filter + map: First names of users age < 30\nconst youngUsers = users\n  .filter(u => u.age < 30)\n  .map(u => u.firstName);\n\nconsole.log(youngUsers); // ['Akshay', 'Deepika']"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Explain the difference between map, filter, and reduce.",
        "answer": "'map' transforms each array element into a new array of same length. 'filter' returns a new array with elements matching a boolean predicate. 'reduce' accumulates array elements into a single aggregated output value."
      }
    ]
  },
  {
    "id": "js-callback-hell",
    "title": "Episode 20: Callback Hell, Pyramid of Doom & Inversion of Control",
    "domain": "javascript",
    "category": "Season 2: Asynchronous JavaScript & Advanced Patterns",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Callback Hell causes Pyramid of Doom. Inversion of Control surrenders execution control to external APIs. Promises resolve both.",
    "keyConcepts": [
      "Callback Hell creates nested unmaintainable Pyramid of Doom structure.",
      "Inversion of Control = Surrendering function execution control to external APIs.",
      "Promises resolve IoC by keeping control in caller hands via resolved objects."
    ],
    "detailedContent": "# Episode 20: Callback Hell, Pyramid of Doom & Inversion of Control\n\n## Overview\nCallback Hell is the anti-pattern of deeply nested callbacks creating unreadable 'Pyramid of Doom' code. Inversion of Control occurs when passing a callback to a 3rd-party API forfeits control over when or how many times it executes.\n\n## Detailed Explanation\nTwo major issues with asynchronous callbacks:\n\n1. **Callback Hell (Pyramid of Doom)**:\n   Asynchronous operations growing horizontally instead of vertically:\n   ```js\n   createOrder(cart, function(orderId) {\n     proceedToPayment(orderId, function(paymentInfo) {\n       showOrderSummary(paymentInfo, function() {\n         updateWallet();\n       });\n     });\n   });\n   ```\n2. **Inversion of Control (IoC)**:\n   When you pass a callback function to `createOrder()`, you yield control to `createOrder`'s implementation. If `createOrder` has a bug, it might call your callback **0 times, twice, or with invalid arguments** (e.g. charging credit card twice!).\n\n## Real-World Analogy\n🔑 Blank Check Handout: Inversion of Control is like handing your blank signed check to a store clerk and trusting them to write the correct price. Promises replace this by giving you a receipt token instead.\n\n## Key Architectural Concepts\n- Callback Hell creates nested unmaintainable Pyramid of Doom structure.\n- Inversion of Control = Surrendering function execution control to external APIs.\n- Promises resolve IoC by keeping control in caller hands via resolved objects.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// Anti-Pattern: Inversion of Control & Pyramid of Doom\napi.createOrder(cart, function (orderId) {\n  api.proceedToPayment(orderId, function (paymentStatus) {\n    api.showSummary(paymentStatus, function () {\n      api.updateBalance();\n    });\n  });\n});"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Callback Hell and Inversion of Control?",
        "answer": "Callback Hell is deeply nested callbacks making code unmaintainable. Inversion of Control happens when passing a callback to another function yields control over when or if it gets executed. Promises fix both issues."
      }
    ]
  },
  {
    "id": "js-promises-introduction",
    "title": "Episode 21: Promises Introduction, States & Immutability",
    "domain": "javascript",
    "category": "Season 2: Asynchronous JavaScript & Advanced Patterns",
    "difficulty": "Medium",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Promises represent eventual async completion. States: `pending`, `fulfilled`, `rejected`. Resolves Inversion of Control.",
    "keyConcepts": [
      "Promise is an object representing eventual async completion.",
      "States: pending -> fulfilled OR rejected.",
      "Promise result is immutable once settled.",
      "Attach handlers using `.then(onFulfill)` and `.catch(onReject)`."
    ],
    "detailedContent": "# Episode 21: Promises Introduction, States & Immutability\n\n## Overview\nA Promise is an object representing the eventual completion or failure of an asynchronous operation. Promises solve Inversion of Control by returning a trusted, immutable placeholder object.\n\n## Detailed Explanation\nInstead of passing a callback function into an async API, the async API returns a **Promise object** immediately.\n\nA Promise object has 3 states:\n- **`pending`**: Initial state, operation incomplete.\n- **`fulfilled`**: Operation completed successfully.\n- **`rejected`**: Operation failed.\n\n**Immutability**: Once a Promise settles (`fulfilled` or `rejected`), its data state is **immutable**. You attach listeners using `.then()` and `.catch()`, regaining complete control over execution flow.\n\n## Real-World Analogy\n🎟️ Food Court Token: Ordering food returns a buzzer token (Promise in `pending` state). When food is ready, token buzzes (`fulfilled` state). You walk to counter and collect food at your own command.\n\n## Key Architectural Concepts\n- Promise is an object representing eventual async completion.\n- States: pending -> fulfilled OR rejected.\n- Promise result is immutable once settled.\n- Attach handlers using `.then(onFulfill)` and `.catch(onReject)`.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const GITHUB_API = 'https://api.github.com/users/ankush270';\n\n// Fetch returns a Promise object immediately\nconst userPromise = fetch(GITHUB_API);\n\nconsole.log(userPromise); // Promise { <pending> }\n\nuserPromise.then(function (response) {\n  return response.json();\n}).then(function (data) {\n  console.log('User Data:', data.name);\n});"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Promise in JavaScript and what are its states?",
        "answer": "A Promise is an object representing eventual completion or failure of an async operation. It has 3 states: pending, fulfilled, and rejected. Once settled, its value is immutable."
      }
    ]
  },
  {
    "id": "js-promise-chaining-error-handling",
    "title": "Episode 22: Promise Chaining, Returning Promises & catch() Error Handling",
    "domain": "javascript",
    "category": "Season 2: Asynchronous JavaScript & Advanced Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Chain Promises vertically by returning Promises inside `.then()`. Handle errors centrally using `.catch()`.",
    "keyConcepts": [
      "Always return a Promise inside `.then()` callbacks to continue chain.",
      "`.catch()` catches errors from any preceding `.then()` step.",
      "Placing `.catch()` in middle of chain lets downstream `.then()` steps continue running."
    ],
    "detailedContent": "# Episode 22: Promise Chaining, Returning Promises & catch() Error Handling\n\n## Overview\nPromise Chaining allows sequential asynchronous operations to be piped vertically by returning new Promises from `.then()` callbacks. `.catch()` catches errors thrown anywhere in preceding chain steps.\n\n## Detailed Explanation\nTo prevent Callback Hell, chain Promises vertically:\n\n```js\ncreateOrder(cart)\n  .then(orderId => proceedToPayment(orderId))\n  .then(paymentInfo => showOrderSummary(paymentInfo))\n  .then(summary => updateWallet(summary))\n  .catch(err => console.error(err.message));\n```\n\n**CRITICAL RULE**: Always **`return`** the Promise from inside a `.then()` callback so the data flows down to the next `.then()` step in the chain!\n\n**Error Bubbling**: A single `.catch()` at the end catches errors from any step in the pipeline.\n\n## Real-World Analogy\n🏭 Assembly Line Pipeline: Station 1 passes result to Station 2. If Station 2 fails, an emergency stop alarm (`.catch()`) triggers instantly, halting downstream processing safely.\n\n## Key Architectural Concepts\n- Always return a Promise inside `.then()` callbacks to continue chain.\n- `.catch()` catches errors from any preceding `.then()` step.\n- Placing `.catch()` in middle of chain lets downstream `.then()` steps continue running.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function createOrder(cart) {\n  return new Promise((resolve, reject) => {\n    if (cart.length > 0) {\n      resolve('ORDER_12345');\n    } else {\n      reject(new Error('Cart is empty'));\n    }\n  });\n}\n\ncreateOrder(['laptop', 'phone'])\n  .then(orderId => {\n    console.log('Order Created:', orderId);\n    return orderId; // Return value for next chain step\n  })\n  .then(orderId => {\n    return 'PAYMENT_SUCCESS_' + orderId;\n  })\n  .then(paymentStatus => {\n    console.log('Status:', paymentStatus);\n  })\n  .catch(err => {\n    console.error('Pipeline Error:', err.message);\n  });"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why is returning a Promise inside .then() critical during Promise Chaining?",
        "answer": "Returning a Promise inside .then() ensures the next .then() in the chain waits for that Promise to resolve before executing. If you forget to return, downstream handlers receive undefined immediately."
      }
    ]
  },
  {
    "id": "js-async-await",
    "title": "Episode 23: async & await Deep Dive & Call Stack Suspension",
    "domain": "javascript",
    "category": "Season 2: Asynchronous JavaScript & Advanced Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`async` functions return Promises. `await` suspends function context until Promise resolves without blocking main thread.",
    "keyConcepts": [
      "`async` functions always return a Promise.",
      "`await` pauses function execution until Promise resolves.",
      "`await` suspends function execution context without blocking main thread.",
      "Use `try...catch` blocks for clean error handling with `async/await`."
    ],
    "detailedContent": "# Episode 23: async & await Deep Dive & Call Stack Suspension\n\n## Overview\n`async` and `await` are ES8 syntactic sugar built on top of Promises. `async` functions always return a Promise, and `await` pauses execution of the `async` function until a Promise settles.\n\n## Detailed Explanation\n- **`async` keyword**: Prepended to a function declaration. It automatically wraps returned non-Promise values in a resolved Promise (`Promise.resolve(val)`).\n- **`await` keyword**: Can only be used inside an `async` function. It pauses execution at that line until the Promise resolves.\n\n**Under the Hood (Call Stack Behavior)**:\n`await` does NOT block the main thread! When `await` encounters an unresolved Promise:\n1. The `async` function's execution context is **suspended and removed from Call Stack**.\n2. Main Call Stack thread is freed to handle other user events.\n3. When Promise resolves, the `async` function context is pushed back onto Call Stack and resumes right after `await` line.\n\n## Real-World Analogy\n☕ Coffee Order Step-Aside: Ordering coffee at counter (`await`). Instead of blocking line, you step aside to lounge (Call Stack cleared). When coffee is ready, barista calls your name and you resume your task.\n\n## Key Architectural Concepts\n- `async` functions always return a Promise.\n- `await` pauses function execution until Promise resolves.\n- `await` suspends function execution context without blocking main thread.\n- Use `try...catch` blocks for clean error handling with `async/await`.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const API_URL = 'https://api.github.com/users/ankush270';\n\nasync function fetchUserData() {\n  try {\n    console.log('Fetching user data...');\n    const response = await fetch(API_URL);\n    const data = await response.json();\n    console.log('User Login:', data.login);\n    return data;\n  } catch (err) {\n    console.error('Fetch Error:', err.message);\n  }\n}\n\nfetchUserData();"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does async/await work under the hood with the Call Stack?",
        "answer": "When 'await' hits an unresolved Promise, the async function's execution context is suspended and popped off the Call Stack, keeping the main thread free. Once the Promise resolves, its context is pushed back onto the Call Stack to resume."
      }
    ]
  },
  {
    "id": "js-promise-apis",
    "title": "Episode 24: Promise APIs: Promise.all, allSettled, race & any",
    "domain": "javascript",
    "category": "Season 2: Asynchronous JavaScript & Advanced Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`Promise.all` fails fast. `allSettled` waits for all. `race` returns first settled. `any` returns first fulfilled.",
    "keyConcepts": [
      "`Promise.all`: Fails fast on first rejection.",
      "`Promise.allSettled`: Drains all promises, returning status array.",
      "`Promise.race`: First to settle (resolve or reject) wins.",
      "`Promise.any`: First to fulfill wins; all reject = AggregateError."
    ],
    "detailedContent": "# Episode 24: Promise APIs: Promise.all, allSettled, race & any\n\n## Overview\nPromise APIs (`Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`) are static combinator methods used to handle multiple concurrent asynchronous operations.\n\n## Detailed Explanation\nComparative matrix of the 4 Promise combinators:\n\n1. **`Promise.all([p1, p2, p3])`**:\n   - **Success**: Waits for ALL to resolve. Returns array of results `[r1, r2, r3]`.\n   - **Failure**: Fails FAST. As soon as ANY promise rejects, `Promise.all` immediately rejects with that error.\n2. **`Promise.allSettled([p1, p2, p3])`**:\n   - **Behavior**: Waits for ALL promises to settle (resolve OR reject). Never fails fast. Returns array of status objects `{ status: 'fulfilled'|'rejected', value/reason }`.\n3. **`Promise.race([p1, p2, p3])`**:\n   - **Behavior**: Returns result of the FIRST promise that settles (whether resolved OR rejected).\n4. **`Promise.any([p1, p2, p3])`**:\n   - **Behavior**: Waits for the FIRST FULFILLED promise. Ignores rejections unless ALL reject (throws `AggregateError`).\n\n## Real-World Analogy\n🏎️ Race Track Scenarios:\n- `all`: Team race. All 3 must cross finish line. If 1 crashes, team fails.\n- `allSettled`: Post-race audit. Wait until all cars finish or crash, then record all reports.\n- `race`: Sprint race. Whoever crosses line first (win or crash) decides result.\n- `any`: Gold medal search. First car to win gold takes trophy. Ignore crashes unless all crash.\n\n## Key Architectural Concepts\n- `Promise.all`: Fails fast on first rejection.\n- `Promise.allSettled`: Drains all promises, returning status array.\n- `Promise.race`: First to settle (resolve or reject) wins.\n- `Promise.any`: First to fulfill wins; all reject = AggregateError.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const p1 = new Promise((res) => setTimeout(() => res('P1 Success'), 3000));\nconst p2 = new Promise((_, rej) => setTimeout(() => rej('P2 Failed'), 1000));\nconst p3 = new Promise((res) => setTimeout(() => res('P3 Success'), 2000));\n\n// Promise.all -> Fails fast at 1000ms with 'P2 Failed'\nPromise.all([p1, p3]).then(console.log); // ['P1 Success', 'P3 Success']\n\n// Promise.allSettled -> Drains all 3 promises\nPromise.allSettled([p1, p2, p3]).then(console.log);\n\n// Promise.race -> Wins at 1000ms with rejection 'P2 Failed'\nPromise.race([p1, p2, p3]).catch(console.error);\n\n// Promise.any -> First fulfilled at 2000ms is 'P3 Success'\nPromise.any([p1, p2, p3]).then(console.log);"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Compare Promise.all, Promise.allSettled, Promise.race, and Promise.any.",
        "answer": "'all' waits for all to resolve and fails fast on first rejection. 'allSettled' waits for all to settle regardless of outcome. 'race' returns first settled promise. 'any' returns first fulfilled promise or AggregateError if all reject."
      }
    ]
  },
  {
    "id": "js-this-keyword",
    "title": "Episode 25: `this` Keyword Deep Dive across Scopes & Bindings",
    "domain": "javascript",
    "category": "Season 2: Asynchronous JavaScript & Advanced Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Meta",
      "Netflix",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "`this` depends on invocation context. Arrow functions retain lexical `this`. `call/apply/bind` set context explicitly.",
    "keyConcepts": [
      "`this` in global scope = Global Object (`window`).",
      "`this` in strict mode function = `undefined`.",
      "`this` in object method = calling object.",
      "Explicit binding via `call()`, `apply()`, and `bind()`.",
      "Arrow functions inherit lexical `this` from enclosing parent scope."
    ],
    "detailedContent": "# Episode 25: `this` Keyword Deep Dive across Scopes & Bindings\n\n## Overview\n`this` is a keyword whose evaluation depends strictly on HOW and WHERE a function is called (Execution Context runtime binding).\n\n## Detailed Explanation\n`this` binding behavior rules:\n\n1. **Global Scope**: `this` points to Global Object (`window` in browser, `global` in Node).\n2. **Inside Regular Function**:\n   - Non-strict mode: `this` points to Global Object (`window`).\n   - Strict mode (`'use strict'`): `this` is `undefined` (this substitution mechanism is disabled).\n3. **Inside Method Call (`obj.fn()`)**: `this` points to the object calling the method (`obj`).\n4. **Explicit Binding (`call`, `apply`, `bind`)**:\n   - `fn.call(obj, arg1, arg2)`: Invokes immediately setting `this` to `obj`.\n   - `fn.apply(obj, [arg1, arg2])`: Invokes immediately passing array of args.\n   - `fn.bind(obj)`: Returns a new function with permanent `this` bound to `obj`.\n5. **Inside Arrow Functions**: Arrow functions do NOT have their own `this`. They retain the **lexical `this`** of their enclosing parent scope.\n6. **Inside DOM Event Listeners**: `this` refers to the HTML element that received the event (`e.currentTarget`).\n\n## Real-World Analogy\n🎭 Actor & Character Costume: `this` is like an actor's costume. The actor's role (`this`) changes depending on which stage scene (execution context) they step into.\n\n## Key Architectural Concepts\n- `this` in global scope = Global Object (`window`).\n- `this` in strict mode function = `undefined`.\n- `this` in object method = calling object.\n- Explicit binding via `call()`, `apply()`, and `bind()`.\n- Arrow functions inherit lexical `this` from enclosing parent scope.",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const obj = {\n  a: 10,\n  x: function() {\n    console.log('Method this.a:', this.a); // 10\n    \n    // Lexical Arrow Function inside method\n    const y = () => {\n      console.log('Arrow this.a:', this.a); // 10 (Inherits from x)\n    };\n    y();\n  }\n};\nobj.x();\n\nconst obj2 = { a: 100 };\n// Explicitly bind obj.x to obj2\nobj.x.call(obj2); // Logs Method this.a: 100"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How is the value of 'this' determined in JavaScript?",
        "answer": "'this' is determined by invocation context. Global scope = window. Strict function = undefined. Method (obj.fn()) = obj. Explicit call/apply/bind = target object. Arrow functions = lexical 'this' from outer enclosing scope."
      }
    ]
  }
];
