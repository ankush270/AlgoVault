import { TopicItem } from '../types';

/**
 * JavaScript Topic Registry with 100% Verbatim Markdown Notes & Assets
 * Dynamically generated from public/data/javascript.json (Season 1 & Season 2 - 25 Episodes)
 */
export const javascriptTopics: TopicItem[] = [
  {
    "id": "js-execution-context",
    "title": "Episode 1 : Execution Context",
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
    "summary": "Complete lecture notes for Episode 1 : Execution Context with full code and visual diagrams.",
    "keyConcepts": [
      "Everything in JS happens inside the execution context. Imagine a sealed-off container inside which JS runs.",
      "In the container the first component is memory component and the 2nd one is code component",
      "Memory component has all the variables and functions in key value pairs. It is also called Variable environment.",
      "Code component is the place where code is executed one line at a time. It is also called the Thread of Execution.",
      "JS is a synchronous, single-threaded language",
      "Synchronous:- In a specific synchronous order.",
      "Single-threaded:- One command at a time."
    ],
    "detailedContent": "# Episode 1 : Execution Context\n\n- Everything in JS happens inside the execution context. Imagine a sealed-off container inside which JS runs.\n  It is an abstract concept that hold info about the env. within the current code is being executed.\n  ![Execution Context](/assets/namaste-js/execution-context.jpg \"Execution Context\")\n\n- In the container the first component is **memory component** and the 2nd one is **code component**\n\n- Memory component has all the variables and functions in key value pairs. It is also called **Variable environment**.\n\n- Code component is the place where code is executed one line at a time. It is also called the **Thread of Execution**.\n\n- JS is a **synchronous**, **single-threaded** language\n  - Synchronous:- In a specific synchronous order.\n  - Single-threaded:- One command at a time.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// Core syntax demonstration for Episode 1 : Execution Context\nconsole.log('Episode 1 : Execution Context active in JS execution context');"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is an Execution Context in JavaScript and what are its components?",
        "answer": "An Execution Context is an abstract container created by the JS engine whenever JS code is executed. It consists of two components: 1) Memory Component (Variable Environment), which stores variables and function declarations as key-value pairs, and 2) Code Component (Thread of Execution), where code is executed line-by-line synchronously."
      },
      {
        "question": "Why is JavaScript called a single-threaded synchronous language?",
        "answer": "JavaScript is single-threaded because it has only one call stack and can execute only one command at a time. It is synchronous because it executes code line-by-line in a specific top-to-bottom sequence."
      }
    ]
  },
  {
    "id": "js-call-stack",
    "title": "Episode 2 : How JS is executed & Call Stack",
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
    "summary": "Complete lecture notes for Episode 2 : How JS is executed & Call Stack with full code and visual diagrams.",
    "keyConcepts": [
      "When a JS program is ran, a global execution context is created.",
      "The execution context is created in two phases.",
      "Memory creation phase - JS will allocate memory to variables and functions.",
      "Code execution phase",
      "Let's consider the below example and its code execution steps:",
      "Javascript manages code execution context creation and deletion with the the help of Call Stack.",
      "Call Stack is a mechanism to keep track of its place in script that calls multiple function.",
      "Call Stack maintains the order of execution of execution contexts. It is also known as Program Stack, Control Stack, Runtime stack, Machine Stack, Execution context stack."
    ],
    "detailedContent": "# Episode 2 : How JS is executed & Call Stack\n\n- When a JS program is ran, a **global execution context** is created.\n\n- The execution context is created in two phases.\n\n  - Memory creation phase - JS will allocate memory to variables and functions.\n  - Code execution phase\n\n- Let's consider the below example and its code execution steps:\n\n```js\nvar n = 2;\nfunction square(num) {\n  var ans = num * num;\n  return ans;\n}\nvar square2 = square(n);\nvar square4 = square(4);\n```\n\nThe very **first** thing which JS does is **memory creation phase**, so it goes to line one of above code snippet, and **allocates a memory space** for variable **'n'** and then goes to line two, and **allocates a memory space** for **function 'square'**. When allocating memory **for n it stores 'undefined'**, a special value for 'n'. **For 'square', it stores the whole code of the function inside its memory space.** Then, as square2 and square4 are variables as well, it allocates memory and stores 'undefined' for them, and this is the end of first phase i.e. memory creation phase.\n\nSo O/P will look something like\n\n![Execution Context Phase 1](/assets/namaste-js/phase1.jpg \"Execution Context\")\n\nNow, in **2nd phase** i.e. code execution phase, it starts going through the whole code line by line. As it encounters var n = 2, it assigns 2 to 'n'. Until now, the value of 'n' was undefined. For function, there is nothing to execute. As these lines were already dealt with in memory creation phase.\n\nComing to line 6 i.e. **var square2 = square(n)**, here **functions are a bit different than any other language. A new execution context is created altogether.** Again in this new execution context, in memory creation phase, we allocate memory to num and ans the two variables. And undefined is placed in them. Now, in code execution phase of this execution context, first 2 is assigned to num. Then var ans = num \\* num will store 4 in ans. After that, return ans returns the control of program back to where this function was invoked from.\n\n![Execution Context Phase 2](/assets/namaste-js/phase2.jpg \"Execution Context\")\n\nWhen **return** keyword is encountered, It returns the control to the called line and also **the function execution context is deleted**.\nSame thing will be repeated for square4 and then after that is finished, the global execution context will be destroyed.\nSo the **final diagram** before deletion would look something like:\n\n![Execution Context Phase 2](/assets/namaste-js/final_execution_context.jpg \"Execution Context\")\n\n- Javascript manages code execution context creation and deletion with the the help of **Call Stack**.\n\n- Call Stack is a mechanism to keep track of its place in script that calls multiple function.\n\n- Call Stack maintains the order of execution of execution contexts. It is also known as Program Stack, Control Stack, Runtime stack, Machine Stack, Execution context stack.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var n = 2;\nfunction square(num) {\n  var ans = num * num;\n  return ans;\n}\nvar square2 = square(n);\nvar square4 = square(4);"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does the JS Call Stack manage function execution?",
        "answer": "The Call Stack is a LIFO (Last In, First Out) data structure that tracks the execution of contexts. The Global Execution Context (GEC) is pushed first. Whenever a function is invoked, a new Function Execution Context (FEC) is created and pushed onto the stack. When the function finishes or returns, its FEC is popped off."
      },
      {
        "question": "What causes a 'Maximum call stack size exceeded' error?",
        "answer": "This error occurs when unbounded or deep recursion pushes function execution contexts continuously onto the Call Stack without returning, exceeding memory limits."
      }
    ]
  },
  {
    "id": "js-hoisting",
    "title": "Episode 3 : Hoisting in JavaScript (variables & functions)",
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
    "summary": "Complete lecture notes for Episode 3 : Hoisting in JavaScript (variables & functions) with full code and visual diagrams.",
    "keyConcepts": [
      "Let's observe the below code and it's explaination:",
      "It should have been an outright error in many other languages, as it is not possible to even access something which is not even created (defined) yet But in JS, We know that in memory creation phase it assigns undefined and puts the content of function to function's memory. And in execution, it then executes whatever is asked. Here, as execution goes line by line and not after compiling, it could only print undefined and nothing else. This phenomenon, is not an error. However, if we remove var x = 7; then it gives error. Uncaught ReferenceError: x is not defined",
      "Hoisting is a concept which enables us to extract values of variables and functions even before initialising/assigning value without getting error and this is happening due to the 1st phase (memory creation phase) of the Execution Context.",
      "So in previous lecture, we learnt that execution context gets created in two phase, so even before code execution, memory is created so in case of variable, it will be initialized as undefined while in case of function the whole function code is placed in the memory. Example:",
      "Now let's observe a different example and try to understand the output."
    ],
    "detailedContent": "# Episode 3 : Hoisting in JavaScript (variables & functions)\n\n- Let's observe the below code and it's explaination:\n\n```js\ngetName(); // Namaste Javascript\nconsole.log(x); // undefined\nvar x = 7;\nfunction getName() {\n  console.log(\"Namaste Javascript\");\n}\n```\n\n- It should have been an outright error in many other languages, as it is not possible to even access something which is not even created (defined) yet But in JS, We know that in memory creation phase it assigns undefined and puts the content of function to function's memory. And in execution, it then executes whatever is asked. Here, as execution goes line by line and not after compiling, it could only print undefined and nothing else. This phenomenon, is not an error. However, if we remove var x = 7; then it gives error. Uncaught ReferenceError: x is not defined\n\n- **Hoisting** is a concept which enables us to extract values of variables and functions even before initialising/assigning value without getting error and this is happening due to the 1st phase (memory creation phase) of the Execution Context.\n\n- So in previous lecture, we learnt that execution context gets created in two phase, so even before code execution, memory is created so in case of variable, it will be initialized as undefined while in case of function the whole function code is placed in the memory. Example:\n\n```js\ngetName(); // Namaste JavaScript\nconsole.log(x); // Uncaught Reference: x is not defined.\nconsole.log(getName); // f getName(){ console.log(\"Namaste JavaScript); }\nfunction getName() {\n  console.log(\"Namaste JavaScript\");\n}\n```\n\n- Now let's observe a different example and try to understand the output.\n\n```js\ngetName(); // Uncaught TypeError: getName is not a function\nconsole.log(getName);\nvar getName = function () {\n  console.log(\"Namaste JavaScript\");\n};\n// The code won't execute as the first line itself throws an TypeError.\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "getName(); // Namaste Javascript\nconsole.log(x); // undefined\nvar x = 7;\nfunction getName() {\n  console.log(\"Namaste Javascript\");\n}"
      },
      {
        "language": "javascript",
        "code": "getName(); // Namaste JavaScript\nconsole.log(x); // Uncaught Reference: x is not defined.\nconsole.log(getName); // f getName(){ console.log(\"Namaste JavaScript); }\nfunction getName() {\n  console.log(\"Namaste JavaScript\");\n}"
      },
      {
        "language": "javascript",
        "code": "getName(); // Uncaught TypeError: getName is not a function\nconsole.log(getName);\nvar getName = function () {\n  console.log(\"Namaste JavaScript\");\n};\n// The code won't execute as the first line itself throws an TypeError."
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Hoisting in JavaScript?",
        "answer": "Hoisting is JS behavior where variable and function declarations are moved to the top of their containing scope during the Memory Allocation Phase before code execution starts. Variables declared with 'var' are initialized to 'undefined', function declarations store their full code, while 'let' and 'const' remain uninitialized in TDZ."
      },
      {
        "question": "How do function declarations differ from function expressions during hoisting?",
        "answer": "Function declarations (`function foo() {}`) are fully hoisted with their implementation stored in memory. Function expressions (`var foo = function() {}`) are treated as variables during hoisting, so 'foo' is initialized to 'undefined' during memory allocation."
      }
    ]
  },
  {
    "id": "js-functions-variable-environments",
    "title": "Episode 4 : Functions and Variable Environments",
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
    "summary": "Complete lecture notes for Episode 4 : Functions and Variable Environments with full code and visual diagrams.",
    "keyConcepts": [
      "The Global Execution Context (GEC) is created (the big box with Memory and Code subparts). Also GEC is pushed into Call Stack",
      "In first phase of GEC (memory phase), variable x:undefined and a and b have their entire function code as value initialized",
      "In second phase of GEC (execution phase), when the function is called, a new local Execution Context is created. After x = 1 assigned to GEC x, a() is called. So local EC for a is made inside code part of GEC.",
      "For local EC, a totally different x variable assigned undefined(x inside a()) in phase 1 , and in phase 2 it is assigned 10 and printed in console log. After printing, no more commands to run, so a() local EC is removed from both GEC and from Call stack",
      "Cursor goes back to b() function call. Same steps repeat.",
      "Finally GEC is deleted and also removed from call stack. Program ends.",
      "reference:"
    ],
    "detailedContent": "# Episode 4 : Functions and Variable Environments\n\n```js\nvar x = 1;\na();\nb(); // we are calling the functions before defining them. This will work properly, as seen in Hoisting.\nconsole.log(x); // 3\n\nfunction a() {\n  var x = 10; // localscope because of separate execution context\n  console.log(x); // 1\n}\n\nfunction b() {\n  var x = 100;\n  console.log(x); // 2\n}\n```\n\nOutputs:\n\n> 10\n\n> 100\n\n> 1\n\n## Code Flow in terms of Execution Context\n\n- The Global Execution Context (GEC) is created (the big box with Memory and Code subparts). Also GEC is pushed into Call Stack\n\n> Call Stack : GEC\n\n- In first phase of GEC (memory phase), variable x:undefined and a and b have their entire function code as value initialized\n\n- In second phase of GEC (execution phase), when the function is called, a new local Execution Context is created. After x = 1 assigned to GEC x, a() is called. So local EC for a is made inside code part of GEC.\n\n> Call Stack: [GEC, a()]\n\n- For local EC, a totally different x variable assigned undefined(x inside a()) in phase 1 , and in phase 2 it is assigned 10 and printed in console log. After printing, no more commands to run, so a() local EC is removed from both GEC and from Call stack\n\n> Call Stack: GEC\n\n- Cursor goes back to b() function call. Same steps repeat.\n\n> Call Stack :[GEC, b()] -> GEC (after printing yet another totally different x value as 100 in console log)\n\n- Finally GEC is deleted and also removed from call stack. Program ends.\n\n- reference:\n\n![Execution Context Phase 1](/assets/namaste-js/function.jpg \"Execution Context\")\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var x = 1;\na();\nb(); // we are calling the functions before defining them. This will work properly, as seen in Hoisting.\nconsole.log(x); // 3\n\nfunction a() {\n  var x = 10; // localscope because of separate execution context\n  console.log(x); // 1\n}\n\nfunction b() {\n  var x = 100;\n  console.log(x); // 2\n}"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What happens when multiple functions with the same variable name execute?",
        "answer": "Each function call creates its own isolated Function Execution Context with its own Variable Environment. Local variables inside one execution context do not overwrite or collide with variables in another execution context."
      }
    ]
  },
  {
    "id": "js-shortest-program-window-this",
    "title": "Episode 5 : Shortest JS Program, window & this keyword",
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
    "summary": "Complete lecture notes for Episode 5 : Shortest JS Program, window & this keyword with full code and visual diagrams.",
    "keyConcepts": [
      "The shortest JS program is empty file. Because even then, JS engine does a lot of things. As always, even in this case, it creates the GEC which has memory space and the execution context.",
      "JS engine creates something known as 'window'. It is an object, which is created in the global space. It contains lots of functions and variables. These functions and variables can be accessed from anywhere in the program. JS engine also creates a this keyword, which points to the window object at the global level. So, in summary, along with GEC, a global object (window) and a this variable are created.",
      "In different engines, the name of global object changes. Window in browsers, but in nodeJS it is called something else. At global level, this === window",
      "If we create any variable in the global scope, then the variables get attached to the global object."
    ],
    "detailedContent": "# Episode 5 : Shortest JS Program, window & this keyword\n\n- The shortest JS program is empty file. Because even then, JS engine does a lot of things. As always, even in this case, it creates the GEC which has memory space and the execution context.\n\n- JS engine creates something known as '**window**'. It is an object, which is created in the global space. It contains lots of functions and variables. These functions and variables can be accessed from anywhere in the program. JS engine also creates a **this** keyword, which points to the **window object** at the global level. So, in summary, along with GEC, a global object (window) and a this variable are created.\n\n- In different engines, the name of global object changes. Window in browsers, but in nodeJS it is called something else. At global level, this === window\n\n- If we create any variable in the global scope, then the variables get attached to the global object.\n\neg:\n\n```js\nvar x = 10;\nconsole.log(x); // 10\nconsole.log(this.x); // 10\nconsole.log(window.x); // 10\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "var x = 10;\nconsole.log(x); // 10\nconsole.log(this.x); // 10\nconsole.log(window.x); // 10"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the shortest JavaScript program and what does it create?",
        "answer": "An empty file is the shortest JS program. Even with zero lines of code, the JS engine creates a Global Execution Context, the global 'window' object (in browsers), and the global 'this' keyword pointing to 'window'."
      }
    ]
  },
  {
    "id": "js-undefined-vs-not-defined",
    "title": "Episode 6 : undefined vs not defined in JS",
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
    "summary": "Complete lecture notes for Episode 6 : undefined vs not defined in JS with full code and visual diagrams.",
    "keyConcepts": [
      "In first phase (memory allocation) JS assigns each variable a placeholder called undefined.",
      "undefined is when memory is allocated for the variable, but no value is assigned yet.",
      "If an object/variable is not even declared/found in memory allocation phase, and tried to access it then it is Not defined",
      "Not Defined !== Undefined",
      "JS is a loosely typed / weakly typed language. It doesn't attach variables to any datatype. We can say var a = 5, and then change the value to boolean a = true or string a = 'hello' later on.",
      "Never assign undefined to a variable manually. Let it happen on it's own accord."
    ],
    "detailedContent": "# Episode 6 : undefined vs not defined in JS\n\n- In first phase (memory allocation) JS assigns each variable a placeholder called **undefined**.\n\n- **undefined** is when memory is allocated for the variable, but no value is assigned yet.\n\n- If an object/variable is not even declared/found in memory allocation phase, and tried to access it then it is **Not defined**\n\n- Not Defined !== Undefined\n\n> When variable is declared but not assigned value, its current value is **undefined**. But when the variable itself is not declared but called in code, then it is **not defined**.\n\n```js\nconsole.log(x); // undefined\nvar x = 25;\nconsole.log(x); // 25\nconsole.log(a); // Uncaught ReferenceError: a is not defined\n```\n\n- JS is a **loosely typed / weakly typed** language. It doesn't attach variables to any datatype. We can say _var a = 5_, and then change the value to boolean _a = true_ or string _a = 'hello'_ later on.\n- **Never** assign _undefined_ to a variable manually. Let it happen on it's own accord.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log(x); // undefined\nvar x = 25;\nconsole.log(x); // 25\nconsole.log(a); // Uncaught ReferenceError: a is not defined"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between 'undefined' and 'not defined' in JavaScript?",
        "answer": "'undefined' is a special primitive value assigned to variables during the Memory Allocation phase before assignment. 'not defined' is a ReferenceError thrown when attempting to access a variable that was never declared in any scope."
      }
    ]
  },
  {
    "id": "js-scope-chain-lexical-environment",
    "title": "Episode 7 : The Scope Chain, Scope & Lexical Environment",
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
    "summary": "Complete lecture notes for Episode 7 : The Scope Chain, Scope & Lexical Environment with full code and visual diagrams.",
    "keyConcepts": [
      "Scope in Javascript is directly related to Lexical Environment.",
      "Let's observe the below examples:",
      "Let's try to understand the output in each of the cases above.",
      "In case 1: function a is able to access variable b from Global scope.",
      "In case 2: 10 is printed. It means that within nested function too, the global scope variable can be accessed.",
      "In case 3: 100 is printed meaning local variable of the same name took precedence over a global variable.",
      "In case 4: A function can access a global variable, but the global execution context can't access any local variable.",
      "So, Lexical Environment = local memory + lexical env of its parent. Hence, Lexical Environement is the local memory along with the lexical environment of its parent",
      "Lexical: In hierarchy, In order",
      "Whenever an Execution Context is created, a Lexical environment(LE) is also created and is referenced in the local Execution Context(in memory space)."
    ],
    "detailedContent": "# Episode 7 : The Scope Chain, Scope & Lexical Environment\n\n- **Scope** in Javascript is directly related to **Lexical Environment**.\n\n- Let's observe the below examples:\n\n```js\n// CASE 1\nfunction a() {\n  console.log(b); // 10\n  // Instead of printing undefined it prints 10, So somehow this a function could access the variable b outside the function scope.\n}\nvar b = 10;\na();\n```\n\n```js\n// CASE 2\nfunction a() {\n  c();\n  function c() {\n    console.log(b); // 10\n  }\n}\nvar b = 10;\na();\n```\n\n```js\n// CASE 3\nfunction a() {\n  c();\n  function c() {\n    var b = 100;\n    console.log(b); // 100\n  }\n}\nvar b = 10;\na();\n```\n\n```js\n// CASE 4\nfunction a() {\n  var b = 10;\n  c();\n  function c() {\n    console.log(b); // 10\n  }\n}\na();\nconsole.log(b); // Error, Not Defined\n```\n\n- Let's try to understand the output in each of the cases above.\n  - In **case 1**: function a is able to access variable b from Global scope.\n  - In **case 2**: 10 is printed. It means that within nested function too, the global scope variable can be accessed.\n  - In **case 3**: 100 is printed meaning local variable of the same name took precedence over a global variable.\n  - In **case 4**: A function can access a global variable, but the global execution context can't access any local variable.\n    ```\n    To summarize the above points in terms of execution context:\n    call_stack = [GEC, a(), c()]\n    Now lets also assign the memory sections of each execution context in call_stack.\n    c() = [[lexical environment pointer pointing to a()]]\n    a() = [b:10, c:{}, [lexical environment pointer pointing to GEC]]\n    GEC =  [a:{},[lexical_environment pointer pointing to null]]\n    ```\n    ![Lexical Scope Explaination](/assets/namaste-js/lexical.jpg \"Lexical Scope\")\n    ![Lexical Scope Explaination](/assets/namaste-js/lexical2.jpg \"Lexical Scope\")\n\n<br>\n\n- So, **Lexical Environment** = local memory + lexical env of its parent. Hence, Lexical Environement is the local memory along with the lexical environment of its parent\n\n- **Lexical**: In hierarchy, In order\n\n- Whenever an Execution Context is created, a Lexical environment(LE) is also created and is referenced in the local Execution Context(in memory space).\n\n- The process of going one by one to parent and checking for values is called scope chain or Lexcial environment chain.\n\n- ```js\n  function a() {\n    function c() {\n      // logic here\n    }\n    c(); // c is lexically inside a\n  } // a is lexically inside global execution\n  ```\n\n- Lexical or Static scope refers to the accessibility of variables, functions and object based on physical location in source code.\n\n  ```js\n  Global {\n      Outer {\n          Inner\n      }\n  }\n  // Inner is surrounded by lexical scope of Outer\n  ```\n\n- **TLDR**; An inner function can access variables which are in outer functions even if inner function is nested deep. In any other case, a function can't access variables not in its scope.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// CASE 1\nfunction a() {\n  console.log(b); // 10\n  // Instead of printing undefined it prints 10, So somehow this a function could access the variable b outside the function scope.\n}\nvar b = 10;\na();"
      },
      {
        "language": "javascript",
        "code": "// CASE 2\nfunction a() {\n  c();\n  function c() {\n    console.log(b); // 10\n  }\n}\nvar b = 10;\na();"
      },
      {
        "language": "javascript",
        "code": "// CASE 3\nfunction a() {\n  c();\n  function c() {\n    var b = 100;\n    console.log(b); // 100\n  }\n}\nvar b = 10;\na();"
      },
      {
        "language": "javascript",
        "code": "// CASE 4\nfunction a() {\n  var b = 10;\n  c();\n  function c() {\n    console.log(b); // 10\n  }\n}\na();\nconsole.log(b); // Error, Not Defined"
      },
      {
        "language": "javascript",
        "code": "To summarize the above points in terms of execution context:\n    call_stack = [GEC, a(), c()]\n    Now lets also assign the memory sections of each execution context in call_stack.\n    c() = [[lexical environment pointer pointing to a()]]\n    a() = [b:10, c:{}, [lexical environment pointer pointing to GEC]]\n    GEC =  [a:{},[lexical_environment pointer pointing to null]]"
      },
      {
        "language": "javascript",
        "code": "function a() {\n    function c() {\n      // logic here\n    }\n    c(); // c is lexically inside a\n  } // a is lexically inside global execution"
      },
      {
        "language": "javascript",
        "code": "Global {\n      Outer {\n          Inner\n      }\n  }\n  // Inner is surrounded by lexical scope of Outer"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Lexical Environment and how does Scope Chain resolution work?",
        "answer": "A Lexical Environment consists of local memory plus a reference to the parent (outer) Lexical Environment. Scope Chain resolution searches for a variable locally first; if not found, it traverses outer Lexical Environments recursively until reaching Global Scope or throwing ReferenceError."
      }
    ]
  },
  {
    "id": "js-let-const-temporal-dead-zone",
    "title": "Episode 8 : let & const in JS, Temporal Dead Zone",
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
    "summary": "Complete lecture notes for Episode 8 : let & const in JS, Temporal Dead Zone with full code and visual diagrams.",
    "keyConcepts": [
      "let and const declarations are hoisted. But its different from var",
      "Both a and b are actually initialized as undefined in hoisting stage. But var b is inside the storage space of GLOBAL, and a is in a separate memory object called script, where it can be accessed only after assigning some value to it first ie. one can access 'a' only if it is assigned. Thus, it throws error.",
      "Temporal Dead Zone : Time since when the let variable was hoisted until it is initialized some value.",
      "So any line till before \"let a = 10\" is the TDZ for a",
      "Since a is not accessible on global, its not accessible in window/this also. window.b or this.b -> 15; But window.a or this.a ->undefined, just like window.x->undefined (x isn't declared anywhere)",
      "Reference Error are thrown when variables are in temporal dead zone.",
      "Syntax Error doesn't even let us run single line of code.",
      "js",
      "Let is a stricter version of var. Now, const is even more stricter than let.",
      "Types of Error: Syntax, Reference, and Type."
    ],
    "detailedContent": "# Episode 8 : let & const in JS, Temporal Dead Zone\n\n- let and const declarations are hoisted. But its different from **var**\n  ```js\n  console.log(a); // ReferenceError: Cannot access 'a' before initialization\n  console.log(b); // prints undefined as expected\n  let a = 10;\n  console.log(a); // 10\n  var b = 15;\n  console.log(window.a); // undefined\n  console.log(window.b); // 15\n  ```\n  It looks like let isn't hoisted, **but it is**, let's understand\n  - Both a and b are actually initialized as _undefined_ in hoisting stage. But var **b** is inside the storage space of GLOBAL, and **a** is in a separate memory object called script, where it can be accessed only after assigning some value to it first ie. one can access 'a' only if it is assigned. Thus, it throws error.\n\n<br>\n\n- **Temporal Dead Zone** : Time since when the let variable was hoisted until it is initialized some value.\n\n  - So any line till before \"let a = 10\" is the TDZ for a\n  - Since a is not accessible on global, its not accessible in _window/this_ also. window.b or this.b -> 15; But window.a or this.a ->undefined, just like window.x->undefined (x isn't declared anywhere)\n\n- **Reference Error** are thrown when variables are in temporal dead zone.\n\n- **Syntax Error** doesn't even let us run single line of code.\n\n  - ```js\n      let a = 10;\n      let a = 100;  //this code is rejected upfront as SyntaxError. (duplicate declaration)\n      ------------------\n      let a = 10;\n      var a = 100; // this code also rejected upfront as SyntaxError. (can't use same name in same scope)\n    ```\n\n- **Let** is a stricter version of **var**. Now, **const** is even more stricter than **let**.\n\n  ```js\n  let a;\n  a = 10;\n  console.log(a) // 10. Note declaration and assigning of a is in different lines.\n  ------------------\n  const b;\n  b = 10;\n  console.log(b); // SyntaxError: Missing initializer in const declaration. (This type of declaration won't work with const. const b = 10 only will work)\n  ------------------\n  const b = 100;\n  b = 1000; //this gives us TypeError: Assignment to constant variable.\n  ```\n\n- Types of **Error**: Syntax, Reference, and Type.\n\n  - Uncaught ReferenceError: x is not defined at ...\n\n    - This Error signifies that x has never been in the scope of the program. This literally means that x was never defined/declared and is being tried to be accesed.\n\n  - Uncaught ReferenceError: cannot access 'a' before initialization\n\n    - This Error signifies that 'a' cannot be accessed because it is declared as 'let' and since it is not assigned a value, it is its Temporal Dead Zone. Thus, this error occurs.\n\n  - Uncaught SyntaxError: Identifier 'a' has already been declared\n\n    - This Error signifies that we are redeclaring a variable that is 'let' declared. No execution will take place.\n\n  - Uncaught SyntaxError: Missing initializer in const declaration\n\n    - This Error signifies that we haven't initialized or assigned value to a const declaration.\n\n  - Uncaught TypeError: Assignment to constant variable\n    - This Error signifies that we are reassigning to a const variable.\n\n### SOME GOOD PRACTICES:\n\n- Try using const wherever possible.\n- If not, use let, Avoid var.\n- Declare and initialize all variables with let to the top to avoid errors to shrink temporal dead zone window to zero.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log(a); // ReferenceError: Cannot access 'a' before initialization\n  console.log(b); // prints undefined as expected\n  let a = 10;\n  console.log(a); // 10\n  var b = 15;\n  console.log(window.a); // undefined\n  console.log(window.b); // 15"
      },
      {
        "language": "javascript",
        "code": "let a = 10;\n      let a = 100;  //this code is rejected upfront as SyntaxError. (duplicate declaration)\n      ------------------\n      let a = 10;\n      var a = 100; // this code also rejected upfront as SyntaxError. (can't use same name in same scope)"
      },
      {
        "language": "javascript",
        "code": "let a;\n  a = 10;\n  console.log(a) // 10. Note declaration and assigning of a is in different lines.\n  ------------------\n  const b;\n  b = 10;\n  console.log(b); // SyntaxError: Missing initializer in const declaration. (This type of declaration won't work with const. const b = 10 only will work)\n  ------------------\n  const b = 100;\n  b = 1000; //this gives us TypeError: Assignment to constant variable."
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the Temporal Dead Zone (TDZ)?",
        "answer": "TDZ is the time period between when a 'let' or 'const' variable is hoisted (allocated memory in Script scope) and when it is initialized with a value. Accessing a variable in TDZ throws a ReferenceError."
      },
      {
        "question": "How do var, let, and const differ in scoping and re-declaration?",
        "answer": "'var' is function-scoped, permits re-declaration, and attaches to global object. 'let' and 'const' are block-scoped, forbid re-declaration within same scope, and stay in TDZ until initialized. 'const' requires immediate assignment and cannot be reassigned."
      }
    ]
  },
  {
    "id": "js-block-scope-shadowing",
    "title": "Episode 9 : Block Scope & Shadowing in JS",
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
    "summary": "Complete lecture notes for Episode 9 : Block Scope & Shadowing in JS with full code and visual diagrams.",
    "keyConcepts": [
      "Block aka compound statement is used to group JS statements together into 1 group. We group them within {...}",
      "Block Scope and its accessibility example",
      "Reason?",
      "In the BLOCK SCOPE; we get b and c inside it initialized as undefined as a part of hoisting (in a seperate memory space called block)",
      "While, a is stored inside a GLOBAL scope.",
      "Thus we say, let and const are BLOCK SCOPED. They are stored in a separate mem space which is reserved for this block. Also, they can't be accessed outside this block. But var a can be accessed anywhere as it is in global scope. Thus, we can't access them outside the Block.",
      "js",
      "So, If one has same named variable outside the block, the variable inside the block shadows the outside variable. This happens only for var",
      "Let's observe the behaviour in case of let and const and understand it's reason.",
      "Same logic is true even for functions"
    ],
    "detailedContent": "# Episode 9 : Block Scope & Shadowing in JS\n\nWhat is a **Block**?\n\n- Block aka _compound statement_ is used to group JS statements together into 1 group. We group them within {...}\n\n  ```js\n  {\n    var a = 10;\n    let b = 20;\n    const c = 30;\n    // Here let and const are hoisted in Block scope,\n    // While, var is hoisted in Global scope.\n  }\n  ```\n\n- Block Scope and its accessibility example\n\n  ```js\n  {\n    var a = 10;\n    let b = 20;\n    const c = 30;\n  }\n  console.log(a); // 10\n  console.log(b); // Uncaught ReferenceError: b is not defined\n  ```\n\n  - Reason?\n\n    - In the BLOCK SCOPE; we get b and c inside it initialized as _undefined_ as a part of hoisting (in a seperate memory space called **block**)\n    - While, a is stored inside a GLOBAL scope.\n\n    - Thus we say, _let_ and _const_ are BLOCK SCOPED. They are stored in a separate mem space which is reserved for this block. Also, they can't be accessed outside this block. But var a can be accessed anywhere as it is in global scope. Thus, we can't access them outside the Block.\n\nWhat is **Shadowing**?\n\n- ```js\n  var a = 100;\n  {\n    var a = 10; // same name as global var\n    let b = 20;\n    const c = 30;\n    console.log(a); // 10\n    console.log(b); // 20\n    console.log(c); // 30\n  }\n  console.log(a); // 10, instead of the 100 we were expecting. So block \"a\" modified val of global \"a\" as well. In console, only b and c are in block space. a initially is in global space(a = 100), and when a = 10 line is run, a is not created in block space, but replaces 100 with 10 in global space itself.\n  ```\n\n- So, If one has same named variable outside the block, the variable inside the block _shadows_ the outside variable. **This happens only for var**\n\n- Let's observe the behaviour in case of let and const and understand it's reason.\n\n  ```js\n  let b = 100;\n  {\n    var a = 10;\n    let b = 20;\n    const c = 30;\n    console.log(b); // 20\n  }\n  console.log(b); // 100, Both b's are in separate spaces (one in Block(20) and one in Script(another arbitrary mem space)(100)). Same is also true for *const* declarations.\n  ```\n\n  ![Block Scope Explaination](/assets/namaste-js/scope.jpg \"Lexical Scope\")\n\n- Same logic is true even for **functions**\n  ```js\n  const c = 100;\n  function x() {\n    const c = 10;\n    console.log(c); // 10\n  }\n  x();\n  console.log(c); // 100\n  ```\n\nWhat is **Illegal Shadowing**?\n\n- ```js\n  let a = 20;\n  {\n    var a = 20;\n  }\n  // Uncaught SyntaxError: Identifier 'a' has already been declared\n  ```\n  - We cannot shadow let with var. But it is **valid** to shadow a let using a let. However, we can shadow var with let.\n  - All scope rules that work in function are same in arrow functions too.\n  - Since var is function scoped, it is not a problem with the code below.\n    ```js\n    let a = 20;\n    function x() {\n      var a = 20;\n    }\n    ```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "{\n    var a = 10;\n    let b = 20;\n    const c = 30;\n    // Here let and const are hoisted in Block scope,\n    // While, var is hoisted in Global scope.\n  }"
      },
      {
        "language": "javascript",
        "code": "{\n    var a = 10;\n    let b = 20;\n    const c = 30;\n  }\n  console.log(a); // 10\n  console.log(b); // Uncaught ReferenceError: b is not defined"
      },
      {
        "language": "javascript",
        "code": "var a = 100;\n  {\n    var a = 10; // same name as global var\n    let b = 20;\n    const c = 30;\n    console.log(a); // 10\n    console.log(b); // 20\n    console.log(c); // 30\n  }\n  console.log(a); // 10, instead of the 100 we were expecting. So block \"a\" modified val of global \"a\" as well. In console, only b and c are in block space. a initially is in global space(a = 100), and when a = 10 line is run, a is not created in block space, but replaces 100 with 10 in global space itself."
      },
      {
        "language": "javascript",
        "code": "let b = 100;\n  {\n    var a = 10;\n    let b = 20;\n    const c = 30;\n    console.log(b); // 20\n  }\n  console.log(b); // 100, Both b's are in separate spaces (one in Block(20) and one in Script(another arbitrary mem space)(100)). Same is also true for *const* declarations."
      },
      {
        "language": "javascript",
        "code": "const c = 100;\n  function x() {\n    const c = 10;\n    console.log(c); // 10\n  }\n  x();\n  console.log(c); // 100"
      },
      {
        "language": "javascript",
        "code": "let a = 20;\n  {\n    var a = 20;\n  }\n  // Uncaught SyntaxError: Identifier 'a' has already been declared"
      },
      {
        "language": "javascript",
        "code": "let a = 20;\n    function x() {\n      var a = 20;\n    }"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Block Scope and Variable Shadowing?",
        "answer": "A block (`{}`) groups statements. 'let' and 'const' are block-scoped. Variable shadowing occurs when an inner variable shares the same name as an outer variable, overriding access to the outer variable within that inner block."
      },
      {
        "question": "What is illegal shadowing in JavaScript?",
        "answer": "Illegal shadowing occurs when trying to shadow a 'let' or 'const' variable using a 'var' variable inside a block, because 'var' leaks out of block scope and attempts to re-declare the 'let' variable in the same scope."
      }
    ]
  },
  {
    "id": "js-closures",
    "title": "Episode 10 : Closures in JS",
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
    "summary": "Complete lecture notes for Episode 10 : Closures in JS with full code and visual diagrams.",
    "keyConcepts": [
      "Function bundled along with it's lexical scope is closure.",
      "JavaScript has a lexcial scope environment. If a function needs to access a variable, it first goes to its local memory. When it does not find it there, it goes to the memory of its lexical parent. See Below code, Over here function y along with its lexical scope i.e. (function x) would be called a closure.",
      "In above code, When y is returned, not only is the function returned but the entire closure (fun y + its lexical scope) is returned and put inside z. So when z is used somewhere else in program, it still remembers var a inside x()",
      "Another Example",
      "Thus In simple words, we can say:",
      "\\A closure is a function that has access to its outer function scope even after the function has returned. Meaning, A closure can remember and access variables and arguments reference of its outer function even after the function has returned.\\",
      "![Closure Explaination](/assets/namaste-js/closure.jpg \"Lexical Scope\")",
      "Advantages of Closure:",
      "The module design pattern allows us to encapsulate related",
      "Example: Suppose we're building a web application, and we want"
    ],
    "detailedContent": "# Episode 10 : Closures in JS\n\n- Function bundled along with it's lexical scope is **closure**.\n\n- JavaScript has a lexcial scope environment. If a function needs to access a variable, it first goes to its local memory. When it does not find it there, it goes to the memory of its lexical parent. See Below code, Over here function **y** along with its lexical scope i.e. (function x) would be called a closure.\n\n  ```js\n  function x() {\n    var a = 7;\n    function y() {\n      console.log(a);\n    }\n    return y;\n  }\n  var z = x();\n  console.log(z); // value of z is entire code of function y.\n  ```\n\n  - In above code, When y is returned, not only is the function returned but the entire closure (fun y + its lexical scope) is returned and put inside z. So when z is used somewhere else in program, it still remembers var a inside x()\n\n- Another Example\n\n```js\nfunction z() {\n  var b = 900;\n  function x() {\n    var a = 7;\n    function y() {\n      console.log(a, b);\n    }\n    y();\n  }\n  x();\n}\nz(); // 7 900\n```\n\n- Thus In simple words, we can say:\n  - **\\*A closure is a function** that has access to its outer function scope even after the function has returned. Meaning, A closure can remember and access variables and arguments reference of its outer function even after the function has returned.\\*\n\n<br>\n\n- ![Closure Explaination](/assets/namaste-js/closure.jpg \"Lexical Scope\")\n\n* Advantages of Closure:\n\n      Certainly! Let's explore examples for each of the advantages you've\n      mentioned:\n\n  1.  **Module Design Pattern**:\n\n      - The module design pattern allows us to encapsulate related\n        functionality into a single module or file. It helps organize\n        code, prevent global namespace pollution, and promotes\n        reusability.\n      - Example: Suppose we're building a web application, and we want\n        to create a module for handling user authentication. We can\n        create a `auth.js` module that exports functions like `login`,\n        `logout`, and `getUserInfo`.\n\n        ```js\n        // auth.js\n        const authModule = (function () {\n          let loggedInUser = null;\n\n          function login(username, password) {\n            // Authenticate user logic...\n            loggedInUser = username;\n          }\n\n          function logout() {\n            loggedInUser = null;\n          }\n\n          function getUserInfo() {\n            return loggedInUser;\n          }\n\n          return {\n            login,\n            logout,\n            getUserInfo,\n          };\n        })();\n\n        // Usage\n        authModule.login(\"john_doe\", \"secret\");\n        console.log(authModule.getUserInfo()); // 'john_doe'\n        ```\n\n  2.  **Currying**:\n\n      - Currying is a technique where a function that takes multiple\n        arguments is transformed into a series of functions that take\n        one argument each. It enables partial function application and\n        enhances code flexibility.\n      - Example: Let's create a curried function to calculate the total\n        price of items with tax.\n\n        ```js\n        const calculateTotalPrice = (taxRate) => (price) =>\n          price + price * (taxRate / 100);\n\n        const calculateSalesTax = calculateTotalPrice(8); // 8% sales tax\n        const totalPrice = calculateSalesTax(100); // Price with tax\n        console.log(totalPrice); // 108\n        ```\n\n  3.  **Memoization**:\n\n      - Memoization optimizes expensive function calls by caching their\n        results. It's useful for recursive or repetitive computations.\n      - Example: Implement a memoized Fibonacci function.\n\n        ```js\n        function fibonacci(n, memo = {}) {\n          if (n in memo) return memo[n];\n          if (n <= 1) return n;\n\n          memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n          return memo[n];\n        }\n\n        console.log(fibonacci(10)); // 55\n        ```\n\n  4.  **Data Hiding and Encapsulation**:\n\n      - Encapsulation hides the internal details of an object and\n        exposes only necessary methods and properties. It improves code\n        maintainability and security.\n      - Example: Create a `Person` class with private properties.\n\n        ```js\n        class Person {\n          #name; // Private field\n\n          constructor(name) {\n            this.#name = name;\n          }\n\n          getName() {\n            return this.#name;\n          }\n        }\n\n        const person = new Person(\"Alice\");\n        console.log(person.getName()); // 'Alice'\n        // console.log(person.#name); // Error: Private field '#name' must be declared in an enclosing class\n        ```\n\n  5.  **setTimeouts**:\n\n      - `setTimeout` allows scheduling a function to run after a\n        specified delay. It's commonly used for asynchronous tasks,\n        animations, and event handling.\n      - Example: Delayed message display.\n\n        ```js\n        function showMessage(message, delay) {\n          setTimeout(() => {\n            console.log(message);\n          }, delay);\n        }\n\n        showMessage(\"Hello, world!\", 2000); // Display after 2 seconds\n        ```\n\n  These examples demonstrate the power and versatility of closures in\n  JavaScript! 🚀\n\n- Disadvantages of Closure:\n  - Over consumption of memory\n  - Memory Leak\n  - Freeze browser\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function x() {\n    var a = 7;\n    function y() {\n      console.log(a);\n    }\n    return y;\n  }\n  var z = x();\n  console.log(z); // value of z is entire code of function y."
      },
      {
        "language": "javascript",
        "code": "function z() {\n  var b = 900;\n  function x() {\n    var a = 7;\n    function y() {\n      console.log(a, b);\n    }\n    y();\n  }\n  x();\n}\nz(); // 7 900"
      },
      {
        "language": "javascript",
        "code": "// auth.js\n        const authModule = (function () {\n          let loggedInUser = null;\n\n          function login(username, password) {\n            // Authenticate user logic...\n            loggedInUser = username;\n          }\n\n          function logout() {\n            loggedInUser = null;\n          }\n\n          function getUserInfo() {\n            return loggedInUser;\n          }\n\n          return {\n            login,\n            logout,\n            getUserInfo,\n          };\n        })();\n\n        // Usage\n        authModule.login(\"john_doe\", \"secret\");\n        console.log(authModule.getUserInfo()); // 'john_doe'"
      },
      {
        "language": "javascript",
        "code": "const calculateTotalPrice = (taxRate) => (price) =>\n          price + price * (taxRate / 100);\n\n        const calculateSalesTax = calculateTotalPrice(8); // 8% sales tax\n        const totalPrice = calculateSalesTax(100); // Price with tax\n        console.log(totalPrice); // 108"
      },
      {
        "language": "javascript",
        "code": "function fibonacci(n, memo = {}) {\n          if (n in memo) return memo[n];\n          if (n <= 1) return n;\n\n          memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n          return memo[n];\n        }\n\n        console.log(fibonacci(10)); // 55"
      },
      {
        "language": "javascript",
        "code": "class Person {\n          #name; // Private field\n\n          constructor(name) {\n            this.#name = name;\n          }\n\n          getName() {\n            return this.#name;\n          }\n        }\n\n        const person = new Person(\"Alice\");\n        console.log(person.getName()); // 'Alice'\n        // console.log(person.#name); // Error: Private field '#name' must be declared in an enclosing class"
      },
      {
        "language": "javascript",
        "code": "function showMessage(message, delay) {\n          setTimeout(() => {\n            console.log(message);\n          }, delay);\n        }\n\n        showMessage(\"Hello, world!\", 2000); // Display after 2 seconds"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Closure in JavaScript?",
        "answer": "A closure is a function bundled together with references to its lexical environment. It grants an inner function access to its outer function's scope even after the outer function has finished executing and returned."
      },
      {
        "question": "What are common use cases and drawbacks of closures?",
        "answer": "Use cases: Data privacy/encapsulation, module patterns, currying, memoization, event listeners. Drawbacks: Increased memory consumption and potential memory leaks if referenced variables are not garbage collected."
      }
    ]
  },
  {
    "id": "js-settimeout-closures-interview",
    "title": "Episode 11 : setTimeout + Closures Interview Question",
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
    "summary": "Complete lecture notes for Episode 11 : setTimeout + Closures Interview Question with full code and visual diagrams.",
    "keyConcepts": [
      "js",
      "We expect JS to wait 3 sec, print 1 and then go down and print the string. But JS prints string immediately, waits 3 sec and then prints 1.",
      "The function inside setTimeout forms a closure (remembers reference to i). So wherever function goes it carries this ref along with it.",
      "setTimeout takes this callback function & attaches timer of 3000ms and stores it. Goes to next line without waiting and prints string.",
      "After 3000ms runs out, JS takes function, puts it into call stack and runs it.",
      "Q: Print 1 after 1 sec, 2 after 2 sec till 5 : Tricky interview question",
      "Reason?",
      "This happens because of closures. When setTimeout stores the function somewhere and attaches timer to it, the function remembers its reference to i, not value of i. All 5 copies of function point to same reference of i. JS stores these 5 functions, prints string and then comes back to the functions. By then the timer has run fully. And due to looping, the i value became 6. And when the callback fun runs the variable i = 6. So same 6 is printed in each log",
      "To avoid this, we can use let instead of var as let has Block scope. For each iteration, the i is a new variable altogether(new copy of i). Everytime setTimeout is run, the inside function forms closure with new variable i",
      "But what if interviewer ask us to implement using var?"
    ],
    "detailedContent": "# Episode 11 : setTimeout + Closures Interview Question\n\n> **Time, tide and Javascript wait for none.**\n\n- ```js\n  function x() {\n    var i = 1;\n    setTimeout(function () {\n      console.log(i);\n    }, 3000);\n    console.log(\"Namaste Javascript\");\n  }\n  x();\n  // Output:\n  // Namaste Javascript\n  // 1 // after waiting 3 seconds\n  ```\n\n  - We expect JS to wait 3 sec, print 1 and then go down and print the string. But JS prints string immediately, waits 3 sec and then prints 1.\n  - The function inside setTimeout forms a closure (remembers reference to i). So wherever function goes it carries this ref along with it.\n  - setTimeout takes this callback function & attaches timer of 3000ms and stores it. Goes to next line without waiting and prints string.\n  - After 3000ms runs out, JS takes function, puts it into call stack and runs it.\n\n- Q: Print 1 after 1 sec, 2 after 2 sec till 5 : Tricky interview question\n\n  We assume this has a simple approach as below\n\n  ```js\n  function x() {\n    for (var i = 1; i <= 5; i++) {\n      setTimeout(function () {\n        console.log(i);\n      }, i * 1000);\n    }\n    console.log(\"Namaste Javascript\");\n  }\n  x();\n  // Output:\n  // Namaste Javascript\n  // 6\n  // 6\n  // 6\n  // 6\n  // 6\n  ```\n\n  - Reason?\n\n    - This happens because of closures. When setTimeout stores the function somewhere and attaches timer to it, the function remembers its reference to i, **not value of i**. All 5 copies of function point to same reference of i. JS stores these 5 functions, prints string and then comes back to the functions. By then the timer has run fully. And due to looping, the i value became 6. And when the callback fun runs the variable i = 6. So same 6 is printed in each log\n\n    - To avoid this, we can use **let** instead of **var** as let has Block scope. For each iteration, the i is a new variable altogether(new copy of i). Everytime setTimeout is run, the inside function forms closure with new variable i\n\n  - But what if interviewer ask us to implement using **var**?\n\n    ```js\n    function x() {\n      for (var i = 1; i <= 5; i++) {\n        function close(i) {\n          setTimeout(function () {\n            console.log(i);\n          }, i * 1000);\n          // put the setT function inside new function close()\n        }\n        close(i); // everytime you call close(i) it creates new copy of i. Only this time, it is with var itself!\n      }\n      console.log(\"Namaste Javascript\");\n    }\n    x();\n    ```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function x() {\n    var i = 1;\n    setTimeout(function () {\n      console.log(i);\n    }, 3000);\n    console.log(\"Namaste Javascript\");\n  }\n  x();\n  // Output:\n  // Namaste Javascript\n  // 1 // after waiting 3 seconds"
      },
      {
        "language": "javascript",
        "code": "function x() {\n    for (var i = 1; i <= 5; i++) {\n      setTimeout(function () {\n        console.log(i);\n      }, i * 1000);\n    }\n    console.log(\"Namaste Javascript\");\n  }\n  x();\n  // Output:\n  // Namaste Javascript\n  // 6\n  // 6\n  // 6\n  // 6\n  // 6"
      },
      {
        "language": "javascript",
        "code": "function x() {\n      for (var i = 1; i <= 5; i++) {\n        function close(i) {\n          setTimeout(function () {\n            console.log(i);\n          }, i * 1000);\n          // put the setT function inside new function close()\n        }\n        close(i); // everytime you call close(i) it creates new copy of i. Only this time, it is with var itself!\n      }\n      console.log(\"Namaste Javascript\");\n    }\n    x();"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why does `for (var i=1; i<=5; i++) { setTimeout(() => console.log(i), 1000); }` print 6 five times?",
        "answer": "Because 'var' is function-scoped. All callbacks close over the exact same variable reference 'i'. By the time callbacks run after 1s, the loop has finished and 'i' evaluates to 6."
      },
      {
        "question": "How do you fix the setTimeout loop issue to print 1 to 5?",
        "answer": "1) Use `let i` in the loop header so each iteration creates a new block-scoped binding. 2) Wrap `setTimeout` inside an IIFE or helper function passing `i` as a argument to create a closure over a distinct copy."
      }
    ]
  },
  {
    "id": "js-closure-interview-questions",
    "title": "Episode 12 : Famous Interview Questions ft. Closures",
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
    "summary": "Complete lecture notes for Episode 12 : Famous Interview Questions ft. Closures with full code and visual diagrams.",
    "keyConcepts": [
      "Module Design Pattern",
      "Currying",
      "Memoize",
      "Data hiding and encapsulation",
      "setTimeouts etc."
    ],
    "detailedContent": "# Episode 12 : Famous Interview Questions ft. Closures\n\n### Q1: What is Closure in Javascript?\n\n**Ans**: A function along with reference to its outer environment together forms a closure. Or in other words, A Closure is a combination of a function and its lexical scope bundled together.\neg:\n\n```js\nfunction outer() {\n  var a = 10;\n  function inner() {\n    console.log(a);\n  } // inner forms a closure with outer\n  return inner;\n}\nouter()(); // 10 // over here first `()` will return inner function and then using second `()` to call inner function\n```\n\n### Q2: Will the below code still forms a closure?\n\n```js\nfunction outer() {\n  function inner() {\n    console.log(a);\n  }\n  var a = 10;\n  return inner;\n}\nouter()(); // 10\n```\n\n**Ans**: Yes, because inner function forms a closure with its outer environment so sequence doesn't matter.\n\n### Q3: Changing var to let, will it make any difference?\n\n```js\nfunction outer() {\n  let a = 10;\n  function inner() {\n    console.log(a);\n  }\n  return inner;\n}\nouter()(); // 10\n```\n\n**Ans**: It will still behave the same way.\n\n### Q4: Will inner function have the access to outer function argument?\n\n```js\nfunction outer(str) {\n  let a = 10;\n  function inner() {\n    console.log(a, str);\n  }\n  return inner;\n}\nouter(\"Hello There\")(); // 10 \"Hello There\"\n```\n\n**Ans**: Inner function will now form closure and will have access to both a and str.\n\n### Q5: In below code, will inner form closure with **outest**?\n\n```js\nfunction outest() {\n  var c = 20;\n  function outer(str) {\n    let a = 10;\n    function inner() {\n      console.log(a, c, str);\n    }\n    return inner;\n  }\n  return outer;\n}\noutest()(\"Hello There\")(); // 10 20 \"Hello There\"\n```\n\n**Ans**: Yes, inner will have access to all its outer environment.\n\n### Q6: Output of below code and explaination?\n\n```js\nfunction outest() {\n  var c = 20;\n  function outer(str) {\n    let a = 10;\n    function inner() {\n      console.log(a, c, str);\n    }\n    return inner;\n  }\n  return outer;\n}\nlet a = 100;\noutest()(\"Hello There\")(); // 10 20 \"Hello There\"\n```\n\n**Ans**: Still the same output, the inner function will have reference to inner a, so conflicting name won't matter here. If it wouldn't have find a inside outer function then it would have went more outer to find a and thus have printed 100. So, it try to resolve variable in scope chain and if a wouldn't have been found it would have given reference error.\n\n### Q7: Advantage of Closure?\n\n- Module Design Pattern\n- Currying\n- Memoize\n- Data hiding and encapsulation\n- setTimeouts etc.\n\n### Q8: Discuss more on Data hiding and encapsulation?\n\n```js\n// without closures\nvar count = 0;\nfunction increment(){\n  count++;\n}\n// in the above code, anyone can access count and change it.\n\n------------------------------------------------------------------\n\n// (with closures) -> put everything into a function\nfunction counter() {\n  var count = 0;\n  function increment(){\n    count++;\n  }\n}\nconsole.log(count); // this will give referenceError as count can't be accessed. So now we are able to achieve hiding of data\n\n------------------------------------------------------------------\n\n//(increment with function using closure) true function\nfunction counter() {\n  var count = 0;\n  return function increment(){\n    count++;\n    console.log(count);\n  }\n}\nvar counter1 = counter(); //counter function has closure with count var.\ncounter1(); // increments counter\n\nvar counter2 = counter();\ncounter2(); // here counter2 is whole new copy of counter function and it wont impack the output of counter1\n\n*************************\n\n// Above code is not good and scalable for say, when you plan to implement decrement counter at a later stage.\n// To address this issue, we use *constructors*\n\n// Adding decrement counter and refactoring code:\nfunction Counter() {\n//constructor function. Good coding would be to capitalize first letter of constructor function.\n  var count = 0;\n  this.incrementCounter = function() { //anonymous function\n    count++;\n    console.log(count);\n  }\n   this.decrementCounter = function() {\n    count--;\n    console.log(count);\n  }\n}\n\nvar counter1 = new Counter();  // new keyword for constructor fun\ncounter1.incrementCounter();\ncounter1.incrementCounter();\ncounter1.decrementCounter();\n// returns 1 2 1\n```\n\n### Q9: Disadvantage of closure?\n\n**Ans**: Overconsumption of memory when using closure as everytime as those closed over variables are not garbage collected till program expires.\nSo when creating many closures, more memory is accumulated and this can create memory leaks if not handled.\n\n**Garbage collector** : Program in JS engine or browser that frees up unused memory. In highlevel languages like C++ or JAVA, garbage collection is left to the programmer, but in JS engine its done implicitly.\n\n```js\nfunction a() {\n  var x = 0;\n  return function b() {\n    console.log(x);\n  };\n}\n\nvar y = a(); // y is a copy of b()\ny();\n\n// Once a() is called, its element x should be garbage collected ideally. But fun b has closure over var x. So mem of x cannot be freed. Like this if more closures formed, it becomes an issue. To tacke this, JS engines like v8 and Chrome have smart garbage collection mechanisms. Say we have var x = 0, z = 10 in above code. When console log happens, x is printed as 0 but z is removed automatically.\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function outer() {\n  var a = 10;\n  function inner() {\n    console.log(a);\n  } // inner forms a closure with outer\n  return inner;\n}\nouter()(); // 10 // over here first `()` will return inner function and then using second `()` to call inner function"
      },
      {
        "language": "javascript",
        "code": "function outer() {\n  function inner() {\n    console.log(a);\n  }\n  var a = 10;\n  return inner;\n}\nouter()(); // 10"
      },
      {
        "language": "javascript",
        "code": "function outer() {\n  let a = 10;\n  function inner() {\n    console.log(a);\n  }\n  return inner;\n}\nouter()(); // 10"
      },
      {
        "language": "javascript",
        "code": "function outer(str) {\n  let a = 10;\n  function inner() {\n    console.log(a, str);\n  }\n  return inner;\n}\nouter(\"Hello There\")(); // 10 \"Hello There\""
      },
      {
        "language": "javascript",
        "code": "function outest() {\n  var c = 20;\n  function outer(str) {\n    let a = 10;\n    function inner() {\n      console.log(a, c, str);\n    }\n    return inner;\n  }\n  return outer;\n}\noutest()(\"Hello There\")(); // 10 20 \"Hello There\""
      },
      {
        "language": "javascript",
        "code": "function outest() {\n  var c = 20;\n  function outer(str) {\n    let a = 10;\n    function inner() {\n      console.log(a, c, str);\n    }\n    return inner;\n  }\n  return outer;\n}\nlet a = 100;\noutest()(\"Hello There\")(); // 10 20 \"Hello There\""
      },
      {
        "language": "javascript",
        "code": "// without closures\nvar count = 0;\nfunction increment(){\n  count++;\n}\n// in the above code, anyone can access count and change it.\n\n------------------------------------------------------------------\n\n// (with closures) -> put everything into a function\nfunction counter() {\n  var count = 0;\n  function increment(){\n    count++;\n  }\n}\nconsole.log(count); // this will give referenceError as count can't be accessed. So now we are able to achieve hiding of data\n\n------------------------------------------------------------------\n\n//(increment with function using closure) true function\nfunction counter() {\n  var count = 0;\n  return function increment(){\n    count++;\n    console.log(count);\n  }\n}\nvar counter1 = counter(); //counter function has closure with count var.\ncounter1(); // increments counter\n\nvar counter2 = counter();\ncounter2(); // here counter2 is whole new copy of counter function and it wont impack the output of counter1\n\n*************************\n\n// Above code is not good and scalable for say, when you plan to implement decrement counter at a later stage.\n// To address this issue, we use *constructors*\n\n// Adding decrement counter and refactoring code:\nfunction Counter() {\n//constructor function. Good coding would be to capitalize first letter of constructor function.\n  var count = 0;\n  this.incrementCounter = function() { //anonymous function\n    count++;\n    console.log(count);\n  }\n   this.decrementCounter = function() {\n    count--;\n    console.log(count);\n  }\n}\n\nvar counter1 = new Counter();  // new keyword for constructor fun\ncounter1.incrementCounter();\ncounter1.incrementCounter();\ncounter1.decrementCounter();\n// returns 1 2 1"
      },
      {
        "language": "javascript",
        "code": "function a() {\n  var x = 0;\n  return function b() {\n    console.log(x);\n  };\n}\n\nvar y = a(); // y is a copy of b()\ny();\n\n// Once a() is called, its element x should be garbage collected ideally. But fun b has closure over var x. So mem of x cannot be freed. Like this if more closures formed, it becomes an issue. To tacke this, JS engines like v8 and Chrome have smart garbage collection mechanisms. Say we have var x = 0, z = 10 in above code. When console log happens, x is printed as 0 but z is removed automatically."
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do you implement a private counter using closures?",
        "answer": "Create an outer function `Counter()` with a private variable `count = 0` and return inner methods `increment()`, `decrement()`, and `getCount()` that form closures over `count`."
      }
    ]
  },
  {
    "id": "js-first-class-functions",
    "title": "Episode 13 : First Class Functions ft. Anonymous Functions",
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
    "summary": "Complete lecture notes for Episode 13 : First Class Functions ft. Anonymous Functions with full code and visual diagrams.",
    "keyConcepts": [
      "They don't have their own identity. So an anonymous function without code inside it results in an error.",
      "Anonymous functions are used when functions are used as values eg. the code sample for function expression above."
    ],
    "detailedContent": "# Episode 13 : First Class Functions ft. Anonymous Functions\n\n> Functions are heart ♥ of Javascript.\n\n### Q: What is Function statement?\n\nBelow way of creating function are function statement.\n\n```js\nfunction a() {\n  console.log(\"Hello\");\n}\na(); // Hello\n```\n\n### Q: What is Function Expression?\n\nAssigning a function to a variable. Function acts like a value.\n\n```js\nvar b = function () {\n  console.log(\"Hello\");\n};\nb();\n```\n\n### Q: Difference between function statement and expression\n\nThe major difference between these two lies in **Hoisting**.\n\n```js\na(); // \"Hello A\"\nb(); // TypeError\nfunction a() {\n  console.log(\"Hello A\");\n}\nvar b = function () {\n  console.log(\"Hello B\");\n};\n// Why? During mem creation phase a is created in memory and function assigned to a. But b is created like a variable (b:undefined) and until code reaches the function()  part, it is still undefined. So it cannot be called.\n```\n\n### Q: What is Function Declaration?\n\nOther name for **function statement**.\n\n### Q: What is Anonymous Function?\n\nA function without a name.\n\n```js\nfunction () {\n\n}// this is going to throw Syntax Error - Function Statement requires function name.\n```\n\n- They don't have their own identity. So an anonymous function without code inside it results in an error.\n- Anonymous functions are used when functions are used as values eg. the code sample for **function expression** above.\n\n### Q: What is Named Function Expression?\n\nSame as Function Expression but function has a name instead of being anonymous.\n\n```js\nvar b = function xyz() {\n  console.log(\"b called\");\n};\nb(); // \"b called\"\nxyz(); // Throws ReferenceError:xyz is not defined.\n// xyz function is not created in global scope. So it can't be called.\n```\n\n### Q: Parameters vs Arguments?\n\n```js\nvar b = function (param1, param2) {\n  // labels/identifiers are parameters\n  console.log(\"b called\");\n};\nb(arg1, arg2); // arguments - values passed inside function call\n```\n\n### Q: What is First Class Function aka First Class Citizens?\n\nWe can pass functions inside a function as arguments and\n/or return a function(HOF). These ability are altogether known as First class function. It is programming concept available in some other languages too.\n\n```js\nvar b = function (param1) {\n  console.log(param1); // prints \" f() {} \"\n};\nb(function () {});\n\n// Other way of doing the same thing:\nvar b = function (param1) {\n  console.log(param1);\n};\nfunction xyz() {}\nb(xyz); // same thing as prev code\n\n// we can return a function from a function:\nvar b = function (param1) {\n  return function () {};\n};\nconsole.log(b()); //we log the entire fun within b.\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function a() {\n  console.log(\"Hello\");\n}\na(); // Hello"
      },
      {
        "language": "javascript",
        "code": "var b = function () {\n  console.log(\"Hello\");\n};\nb();"
      },
      {
        "language": "javascript",
        "code": "a(); // \"Hello A\"\nb(); // TypeError\nfunction a() {\n  console.log(\"Hello A\");\n}\nvar b = function () {\n  console.log(\"Hello B\");\n};\n// Why? During mem creation phase a is created in memory and function assigned to a. But b is created like a variable (b:undefined) and until code reaches the function()  part, it is still undefined. So it cannot be called."
      },
      {
        "language": "javascript",
        "code": "function () {\n\n}// this is going to throw Syntax Error - Function Statement requires function name."
      },
      {
        "language": "javascript",
        "code": "var b = function xyz() {\n  console.log(\"b called\");\n};\nb(); // \"b called\"\nxyz(); // Throws ReferenceError:xyz is not defined.\n// xyz function is not created in global scope. So it can't be called."
      },
      {
        "language": "javascript",
        "code": "var b = function (param1, param2) {\n  // labels/identifiers are parameters\n  console.log(\"b called\");\n};\nb(arg1, arg2); // arguments - values passed inside function call"
      },
      {
        "language": "javascript",
        "code": "var b = function (param1) {\n  console.log(param1); // prints \" f() {} \"\n};\nb(function () {});\n\n// Other way of doing the same thing:\nvar b = function (param1) {\n  console.log(param1);\n};\nfunction xyz() {}\nb(xyz); // same thing as prev code\n\n// we can return a function from a function:\nvar b = function (param1) {\n  return function () {};\n};\nconsole.log(b()); //we log the entire fun within b."
      }
    ],
    "interviewQuestions": [
      {
        "question": "What are First-Class Functions in JavaScript?",
        "answer": "First-class functions mean functions are treated as first-class citizens: they can be stored in variables, passed as arguments to other functions, and returned from other functions."
      },
      {
        "question": "What is the difference between Function Statement and Function Expression?",
        "answer": "A Function Statement (`function a() {}`) is hoisted with full body definition. A Function Expression (`var a = function() {}`) assigns an anonymous function to a variable, so 'a' is hoisted as `undefined`."
      }
    ]
  },
  {
    "id": "js-callback-functions-event-listeners",
    "title": "Episode 14 : Callback Functions in JS ft. Event Listeners",
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
    "summary": "Complete lecture notes for Episode 14 : Callback Functions in JS ft. Event Listeners with full code and visual diagrams.",
    "keyConcepts": [
      "Functions are first class citizens ie. take a function A and pass it to another function B. Here, A is a callback function. So basically I am giving access to function B to call function A. This callback function gives us the access to whole Asynchronous world in Synchronous world.",
      "JS is a synchronous and single threaded language. But due to callbacks, we can do async things in JS.",
      "js",
      "In the call stack, first x and y are present. After code execution, they go away and stack is empty. Then after 5 seconds (from beginning) anonymous suddenly appear up in stack ie. setTimeout",
      "All 3 functions are executed through call stack. If any operation blocks the call stack, its called blocking the main thread.",
      "Say if x() takes 30 sec to run, then JS has to wait for it to finish as it has only 1 call stack/1 main thread. Never block main thread.",
      "Always use async for functions that take time eg. setTimeout",
      "js",
      "We will create a button in html and attach event to it.",
      "Lets implement a increment counter button."
    ],
    "detailedContent": "# Episode 14 : Callback Functions in JS ft. Event Listeners\n\n### Callback Functions\n\n- Functions are first class citizens ie. take a function A and pass it to another function B. Here, A is a callback function. So basically I am giving access to function B to call function A. This callback function gives us the access to whole **Asynchronous** world in **Synchronous** world.\n\n```js\nsetTimeout(function () {\n  console.log(\"Timer\");\n}, 1000); // first argument is callback function and second is timer.\n```\n\n- JS is a synchronous and single threaded language. But due to callbacks, we can do async things in JS.\n\n- ```js\n  setTimeout(function () {\n    console.log(\"timer\");\n  }, 5000);\n  function x(y) {\n    console.log(\"x\");\n    y();\n  }\n  x(function y() {\n    console.log(\"y\");\n  });\n  // x y timer\n  ```\n\n  - In the call stack, first x and y are present. After code execution, they go away and stack is empty. Then after 5 seconds (from beginning) anonymous suddenly appear up in stack ie. setTimeout\n  - All 3 functions are executed through call stack. If any operation blocks the call stack, its called blocking the main thread.\n  - Say if x() takes 30 sec to run, then JS has to wait for it to finish as it has only 1 call stack/1 main thread. Never block main thread.\n  - Always use **async** for functions that take time eg. setTimeout\n\n- ```js\n  // Another Example of callback\n  function printStr(str, cb) {\n    setTimeout(() => {\n      console.log(str);\n      cb();\n    }, Math.floor(Math.random() * 100) + 1);\n  }\n  function printAll() {\n    printStr(\"A\", () => {\n      printStr(\"B\", () => {\n        printStr(\"C\", () => {});\n      });\n    });\n  }\n  printAll(); // A B C // in order\n  ```\n\n### Event Listener\n\n- We will create a button in html and attach event to it.\n\n  ```js\n  // index.html\n  <button id=\"clickMe\">Click Me!</button>;\n\n  // in index.js\n  document.getElementById(\"clickMe\").addEventListener(\"click\", function xyz() {\n    //when event click occurs, this callback function (xyz) is called into callstack\n    console.log(\"Button clicked\");\n  });\n  ```\n\n- Lets implement a increment counter button.\n  - Using global variable (not good as anyone can change it)\n    ```js\n    let count = 0;\n    document\n      .getElementById(\"clickMe\")\n      .addEventListener(\"click\", function xyz() {\n        console.log(\"Button clicked\", ++count);\n      });\n    ```\n  - Use closures for data abstraction\n    ```js\n    function attachEventList() {\n      //creating new function for closure\n      let count = 0;\n      document\n        .getElementById(\"clickMe\")\n        .addEventListener(\"click\", function xyz() {\n          console.log(\"Button clicked\", ++count); //now callback function forms closure with outer scope(count)\n        });\n    }\n    attachEventList();\n    ```\n    ![Event Listerner Demo](/assets/namaste-js/event.jpg)\n\n### Garbage Collection and removeEventListeners\n\n- Event listeners are heavy as they form closures. So even when call stack is empty, EventListener won't free up memory allocated to count as it doesn't know when it may need count again. So we remove event listeners when we don't need them (garbage collected) onClick, onHover, onScroll all in a page can slow it down heavily.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "setTimeout(function () {\n  console.log(\"Timer\");\n}, 1000); // first argument is callback function and second is timer."
      },
      {
        "language": "javascript",
        "code": "setTimeout(function () {\n    console.log(\"timer\");\n  }, 5000);\n  function x(y) {\n    console.log(\"x\");\n    y();\n  }\n  x(function y() {\n    console.log(\"y\");\n  });\n  // x y timer"
      },
      {
        "language": "javascript",
        "code": "// Another Example of callback\n  function printStr(str, cb) {\n    setTimeout(() => {\n      console.log(str);\n      cb();\n    }, Math.floor(Math.random() * 100) + 1);\n  }\n  function printAll() {\n    printStr(\"A\", () => {\n      printStr(\"B\", () => {\n        printStr(\"C\", () => {});\n      });\n    });\n  }\n  printAll(); // A B C // in order"
      },
      {
        "language": "javascript",
        "code": "// index.html\n  <button id=\"clickMe\">Click Me!</button>;\n\n  // in index.js\n  document.getElementById(\"clickMe\").addEventListener(\"click\", function xyz() {\n    //when event click occurs, this callback function (xyz) is called into callstack\n    console.log(\"Button clicked\");\n  });"
      },
      {
        "language": "javascript",
        "code": "let count = 0;\n    document\n      .getElementById(\"clickMe\")\n      .addEventListener(\"click\", function xyz() {\n        console.log(\"Button clicked\", ++count);\n      });"
      },
      {
        "language": "javascript",
        "code": "function attachEventList() {\n      //creating new function for closure\n      let count = 0;\n      document\n        .getElementById(\"clickMe\")\n        .addEventListener(\"click\", function xyz() {\n          console.log(\"Button clicked\", ++count); //now callback function forms closure with outer scope(count)\n        });\n    }\n    attachEventList();"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Callback Function and why are event listeners dangerous if not cleaned up?",
        "answer": "A callback function is passed into another function to be executed later. Event listeners create closures that hold memory references; failing to remove them when elements unmount causes memory leaks."
      }
    ]
  },
  {
    "id": "js-event-loop-microtask-queue",
    "title": "Episode 15 : Asynchronous JavaScript & EVENT LOOP from scratch",
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
    "summary": "Complete lecture notes for Episode 15 : Asynchronous JavaScript & EVENT LOOP from scratch with full code and visual diagrams.",
    "keyConcepts": [
      "Browser has JS Engine which has Call Stack which has Global execution context, local execution context etc.",
      "But browser has many other superpowers - Local storage space, Timer, place to enter URL, Bluetooth access, Geolocation access and so on.",
      "Now JS needs some way to connect the callstack with all these superpowers. This is done using Web APIs.",
      "setTimeout(), DOM APIs, fetch(), localstorage, console (yes, even console.log is not JS!!), location and so many more.",
      "setTimeout() : Timer function",
      "DOM APIs : eg.Document.xxxx ; Used to access HTML DOM tree. (Document Object Manipulation)",
      "fetch() : Used to make connection with external servers eg. Netflix servers etc.",
      "We get all these inside call stack through global object ie. window",
      "Use window keyword like : window.setTimeout(), window.localstorage, window.console.log() to log something inside console.",
      "As window is global obj, and all the above functions are present in global object, we don't explicity write window but it is implied."
    ],
    "detailedContent": "# Episode 15 : Asynchronous JavaScript & EVENT LOOP from scratch\n\n> Note: Call stack will execeute any execeution context which enters it. Time, tide and JS waits for none. TLDR; Call stack has no timer.\n\n- Browser has JS Engine which has Call Stack which has Global execution context, local execution context etc.\n  - But browser has many other superpowers - Local storage space, Timer, place to enter URL, Bluetooth access, Geolocation access and so on.\n  - Now JS needs some way to connect the callstack with all these superpowers. This is done using Web APIs.\n    ![Event Loop 1 Demo](/assets/namaste-js/eventloop1.jpg)\n\n### WebAPIs\n\nNone of the below are part of Javascript! These are extra superpowers that browser has. Browser gives access to JS callstack to use these powers.\n![Event Loop 2 Demo](/assets/namaste-js/eventloop2.jpg)\n\n- setTimeout(), DOM APIs, fetch(), localstorage, console (yes, even console.log is not JS!!), location and so many more.\n\n  - setTimeout() : Timer function\n  - DOM APIs : eg.Document.xxxx ; Used to access HTML DOM tree. (Document Object Manipulation)\n  - fetch() : Used to make connection with external servers eg. Netflix servers etc.\n\n- We get all these inside call stack through global object ie. window\n\n  - Use window keyword like : window.setTimeout(), window.localstorage, window.console.log() to log something inside console.\n  - As window is global obj, and all the above functions are present in global object, we don't explicity write window but it is implied.\n\n- Let's undertand the below code image and its explaination:\n  ![Event Loop 3 Demo](/assets/namaste-js/eventloop3.jpg)\n  - ```js\n    console.log(\"start\");\n    setTimeout(function cb() {\n      console.log(\"timer\");\n    }, 5000);\n    console.log(\"end\");\n    // start end timer\n    ```\n  - First a GEC is created and put inside call stack.\n  - console.log(\"Start\"); // this calls the console web api (through window) which in turn actually modifies values in console.\n  - setTimeout(function cb() { //this calls the setTimeout web api which gives access to timer feature. It stores the callback cb() and starts timer. console.log(\"Callback\");}, 5000);\n  - console.log(\"End\"); // calls console api and logs in console window. After this GEC pops from call stack.\n  - While all this is happening, the timer is constantly ticking. After it becomes 0, the callback cb() has to run.\n  - Now we need this cb to go into call stack. Only then will it be executed. For this we need **event loop** and **Callback queue**\n\n### Event Loops and Callback Queue\n\nQ: How after 5 secs timer is console?\n\n- cb() cannot simply directly go to callstack to be execeuted. It goes through the callback queue when timer expires.\n- Event loop keep checking the callback queue, and see if it has any element to puts it into call stack. It is like a gate keeper.\n- Once cb() is in callback queue, eventloop pushes it to callstack to run. Console API is used and log printed\n- ![Event Loop 4 Demo](/assets/namaste-js/eventloop4.jpg)\n\nQ: Another example to understand Eventloop & Callback Queue.\n\nSee the below Image and code and try to understand the reason:\n![Event Loop 5 Demo](/assets/namaste-js/eventloop5.jpg)\nExplaination?\n\n- ```js\n  console.log(\"Start\");\n  document.getElementById(\"btn\").addEventListener(\"click\", function cb() {\n    // cb() registered inside webapi environment and event(click) attached to it. i.e. REGISTERING CALLBACK AND ATTACHING EVENT TO IT.\n    console.log(\"Callback\");\n  });\n  console.log(\"End\"); // calls console api and logs in console window. After this GEC get removed from call stack.\n  // In above code, even after console prints \"Start\" and \"End\" and pops GEC out, the eventListener stays in webapi env(with hope that user may click it some day) until explicitly removed, or the browser is closed.\n  ```\n\n- Eventloop has just one job to keep checking callback queue and if found something push it to call stack and delete from callback queue.\n\nQ: Need of callback queue?\n\n**Ans**: Suppose user clciks button x6 times. So 6 cb() are put inside callback queue. Event loop sees if call stack is empty/has space and whether callback queue is not empty(6 elements here). Elements of callback queue popped off, put in callstack, executed and then popped off from call stack.\n\n<br>\n\n### Behaviour of fetch (**Microtask Queue?**)\n\nLet's observe the code below and try to understand\n\n```js\nconsole.log(\"Start\"); // this calls the console web api (through window) which in turn actually modifies values in console.\nsetTimeout(function cbT() {\n  console.log(\"CB Timeout\");\n}, 5000);\nfetch(\"https://api.netflix.com\").then(function cbF() {\n    console.log(\"CB Netflix\");\n}); // take 2 seconds to bring response\n// millions lines of code\nconsole.log(\"End\");\n\nCode Explaination:\n* Same steps for everything before fetch() in above code.\n* fetch registers cbF into webapi environment along with existing cbT.\n* cbT is waiting for 5000ms to end so that it can be put inside callback queue. cbF is waiting for data to be returned from Netflix servers gonna take 2 seconds.\n* After this millions of lines of code is running, by the time millions line of code will execute, 5 seconds has finished and now the timer has expired and response from Netflix server is ready.\n* Data back from cbF ready to be executed gets stored into something called a Microtask Queue.\n* Also after expiration of timer, cbT is ready to execute in Callback Queue.\n* Microtask Queue is exactly same as Callback Queue, but it has higher priority. Functions in Microtask Queue are executed earlier than Callback Queue.\n* In console, first Start and End are printed in console. First cbF goes in callstack and \"CB Netflix\" is printed. cbF popped from callstack. Next cbT is removed from callback Queue, put in Call Stack, \"CB Timeout\" is printed, and cbT removed from callstack.\n* See below Image for more understanding\n```\n\n![Event Loop 6 Demo](/assets/namaste-js/eventloop6.jpg)\nMicrotask Priority Visualization\n![Event Loop 7 Demo](/assets/namaste-js/microtask.gif)\n\n#### What enters the Microtask Queue ?\n\n- All the callback functions that come through promises go in microtask Queue.\n- **Mutation Observer** : Keeps on checking whether there is mutation in DOM tree or not, and if there, then it execeutes some callback function.\n- Callback functions that come through promises and mutation observer go inside **Microtask Queue**.\n- All the rest goes inside **Callback Queue aka. Task Queue**.\n- If the task in microtask Queue keeps creating new tasks in the queue, element in callback queue never gets chance to be run. This is called **starvation**\n\n### Some Important Questions\n\n1. **When does the event loop actually start ? -** Event loop, as the name suggests, is a single-thread, loop that is _almost infinite_. It's always running and doing its job.\n\n2. **Are only asynchronous web api callbacks are registered in web api environment? -** YES, the synchronous callback functions like what we pass inside map, filter and reduce aren't registered in the Web API environment. It's just those async callback functions which go through all this.\n\n3. **Does the web API environment stores only the callback function and pushes the same callback to queue/microtask queue? -** Yes, the callback functions are stored, and a reference is scheduled in the queues. Moreover, in the case of event listeners(for example click handlers), the original callbacks stay in the web API environment forever, that's why it's adviced to explicitly remove the listeners when not in use so that the garbage collector does its job.\n\n4. **How does it matter if we delay for setTimeout would be 0ms. Then callback will move to queue without any wait ? -** No, there are trust issues with setTimeout() 😅. The callback function needs to wait until the Call Stack is empty. So the 0 ms callback might have to wait for 100ms also if the stack is busy.\n\n<br>\n\n### Observation of Eventloop, Callback Queue & Microtask Queue [**GiF**]\n\n![microtask 1 Demo](/assets/namaste-js/microtask1.gif)\n![microtask 2 Demo](/assets/namaste-js/microtask2.gif)\n![microtask 3 Demo](/assets/namaste-js/microtask3.gif)\n![microtask 4 Demo](/assets/namaste-js/microtask4.gif)\n![microtask 5 Demo](/assets/namaste-js/microtask5.gif)\n![microtask 6 Demo](/assets/namaste-js/microtask6.gif)\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log(\"start\");\n    setTimeout(function cb() {\n      console.log(\"timer\");\n    }, 5000);\n    console.log(\"end\");\n    // start end timer"
      },
      {
        "language": "javascript",
        "code": "console.log(\"Start\");\n  document.getElementById(\"btn\").addEventListener(\"click\", function cb() {\n    // cb() registered inside webapi environment and event(click) attached to it. i.e. REGISTERING CALLBACK AND ATTACHING EVENT TO IT.\n    console.log(\"Callback\");\n  });\n  console.log(\"End\"); // calls console api and logs in console window. After this GEC get removed from call stack.\n  // In above code, even after console prints \"Start\" and \"End\" and pops GEC out, the eventListener stays in webapi env(with hope that user may click it some day) until explicitly removed, or the browser is closed."
      },
      {
        "language": "javascript",
        "code": "console.log(\"Start\"); // this calls the console web api (through window) which in turn actually modifies values in console.\nsetTimeout(function cbT() {\n  console.log(\"CB Timeout\");\n}, 5000);\nfetch(\"https://api.netflix.com\").then(function cbF() {\n    console.log(\"CB Netflix\");\n}); // take 2 seconds to bring response\n// millions lines of code\nconsole.log(\"End\");\n\nCode Explaination:\n* Same steps for everything before fetch() in above code.\n* fetch registers cbF into webapi environment along with existing cbT.\n* cbT is waiting for 5000ms to end so that it can be put inside callback queue. cbF is waiting for data to be returned from Netflix servers gonna take 2 seconds.\n* After this millions of lines of code is running, by the time millions line of code will execute, 5 seconds has finished and now the timer has expired and response from Netflix server is ready.\n* Data back from cbF ready to be executed gets stored into something called a Microtask Queue.\n* Also after expiration of timer, cbT is ready to execute in Callback Queue.\n* Microtask Queue is exactly same as Callback Queue, but it has higher priority. Functions in Microtask Queue are executed earlier than Callback Queue.\n* In console, first Start and End are printed in console. First cbF goes in callstack and \"CB Netflix\" is printed. cbF popped from callstack. Next cbT is removed from callback Queue, put in Call Stack, \"CB Timeout\" is printed, and cbT removed from callstack.\n* See below Image for more understanding"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does the JavaScript Event Loop work?",
        "answer": "The Event Loop continuously checks if the Call Stack is empty. When empty, it checks the Microtask Queue first and processes all microtasks (Promises, MutationObserver). Then it takes the top task from Callback/Task Queue (setTimeout, DOM events) and pushes it to Call Stack."
      },
      {
        "question": "Which has higher priority: Microtask Queue or Callback Queue?",
        "answer": "Microtask Queue has higher priority. All microtasks are processed completely before the Event Loop executes a single task from the Callback Queue."
      }
    ]
  },
  {
    "id": "js-engine-v8-architecture",
    "title": "Episode 16 : JS Engine Exposed, Google's V8 Architecture",
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
    "summary": "Complete lecture notes for Episode 16 : JS Engine Exposed, Google's V8 Architecture with full code and visual diagrams.",
    "keyConcepts": [
      "JS runs literally everywhere from smart watch to robots to browsers because of Javascript Runtime Environment (JRE).",
      "JRE is like a big container which has everything which are required to run Javascript code.",
      "JRE consists of a JS Engine (❤️ of JRE), set of APIs to connect with outside environment, event loop, Callback queue, Microtask queue etc.",
      "Browser can execute javascript code because it has the Javascript Runtime Environment.",
      "ECMAScript is a governing body of JS. It has set of rules which are followed by all JS engines like Chakra(Internet Explorer), V8 Engine (Edge) Spidermonkey(Firefox)(first javascript engine created by JS creator himself), v8(Chrome)",
      "Javascript Engine is not a machine. Its software written in low level languages (eg. C++) that takes in hi-level code in JS and spits out low level machine code.",
      "Code inside Javascript Engine passes through 3 steps : Parsing, Compilation and Execution",
      "Companies use different JS engines and each try to make theirs the best.",
      "v8 of Google has Interpreter called Ignition, a compiler called Turbo Fan and garbage collector called Orinoco",
      "v8 architecture:"
    ],
    "detailedContent": "# Episode 16 : JS Engine Exposed, Google's V8 Architecture\n\n- JS runs literally everywhere from smart watch to robots to browsers because of Javascript Runtime Environment (JRE).\n\n- JRE is like a big container which has everything which are required to run Javascript code.\n\n- JRE consists of a JS Engine (❤️ of JRE), set of APIs to connect with outside environment, event loop, Callback queue, Microtask queue etc.\n\n- Browser can execute javascript code because it has the Javascript Runtime Environment.\n\n- ECMAScript is a governing body of JS. It has set of rules which are followed by all JS engines like Chakra(Internet Explorer), V8 Engine (Edge) Spidermonkey(Firefox)(first javascript engine created by JS creator himself), v8(Chrome)\n\n- Javascript Engine is not a machine. Its software written in low level languages (eg. C++) that takes in hi-level code in JS and spits out low level machine code.\n\n- Code inside Javascript Engine passes through 3 steps : **Parsing**, **Compilation** and **Execution**\n\n  1. **Parsing** - Code is broken down into tokens. In \"let a = 7\" -> let, a, =, 7 are all tokens. Also we have a syntax parser that takes code and converts it into an AST (Abstract Syntax Tree) which is a JSON with all key values like type, start, end, body etc (looks like package.json but for a line of code in JS. Kinda unimportant)(Check out astexplorer.net -> converts line of code into AST).\n  2. **Compilation** - JS has something called Just-in-time(JIT) Compilation - uses both interpreter & compiler. Also compilation and execution both go hand in hand. The AST from previous step goes to interpreter which converts hi-level code to byte code and moves to execeution. While interpreting, compiler also works hand in hand to compile and form optimized code during runtime. **Does JavaScript really Compiles?** The answer is a loud **YES**. More info at: [Link 1](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch1.md#whats-in-an-interpretation), [Link 2](https://web.stanford.edu/class/cs98si/slides/overview.html), [Link 3](https://blog.greenroots.info/javascript-interpreted-or-compiled-the-debate-is-over-ckb092cv302mtl6s17t14hq1j). JS used to be only interpreter in old times, but now has both to compile and interpreter code and this make JS a JIT compiled language, its like best of both world.\n  3. **Execution** - Needs 2 components ie. Memory heap(place where all memory is stored) and Call Stack(same call stack from prev episodes). There is also a garbage collector. It uses an algo called **Mark and Sweep**.\n     ![JS Engine Demo](/assets/namaste-js/jsengine.jpg)\n     GiF Demo\n     ![JS Engine Demo](/assets/namaste-js/jsenginegif.gif)\n\n- Companies use different JS engines and each try to make theirs the best.\n  - v8 of Google has Interpreter called Ignition, a compiler called Turbo Fan and garbage collector called Orinoco\n  - v8 architecture:\n    ![JS Engine Demo](/assets/namaste-js/jsengine.png)\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// Core syntax demonstration for Episode 16 : JS Engine Exposed, Google's V8 Architecture\nconsole.log('Episode 16 : JS Engine Exposed, Google's V8 Architecture active in JS execution context');"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What are the main components of Google's V8 Engine?",
        "answer": "1) Parser (Generates AST - Abstract Syntax Tree). 2) Ignition Interpreter (Converts AST to Bytecode). 3) TurboFan JIT Compiler (Compiles hot code paths into optimized machine code)."
      }
    ]
  },
  {
    "id": "js-settimeout-trust-issues",
    "title": "Episode 17 : Trust issues with setTimeout()",
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
    "summary": "Complete lecture notes for Episode 17 : Trust issues with setTimeout() with full code and visual diagrams.",
    "keyConcepts": [
      "setTimeout with timer of 5 secs sometimes does not exactly guarantees that the callback function will execute exactly after 5s.",
      "Let's observe the below code and it's explaination",
      "First GEC is created and pushed in callstack.",
      "Start is printed in console",
      "When setTimeout is seen, callback function is registered into webapi's env. And timer is attached to it and started. callback waits for its turn to be execeuted once timer expires. But JS waits for none. Goes to next line.",
      "End is printed in console.",
      "After \"End\", we have 1 million lines of code that takes 10 sec(say) to finish execution. So GEC won't pop out of stack. It runs all the code for 10 sec.",
      "But in the background, the timer runs for 5s. While callstack runs the 1M line of code, this timer has already expired and callback fun has been pushed to Callback queue and waiting to pushed to callstack to get executed.",
      "Event loop keeps checking if callstack is empty or not. But here GEC is still in stack so cb can't be popped from callback Queue and pushed to CallStack. Though setTimeout is only for 5s, it waits for 10s until callstack is empty before it can execute (When GEC popped after 10sec, callstack() is pushed into call stack and immediately executed (Whatever is pushed to callstack is executed instantly).",
      "This is called as the [Concurrency model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) of JS. This is the logic behind setTimeout's trust issues."
    ],
    "detailedContent": "# Episode 17 : Trust issues with setTimeout()\n\n- setTimeout with timer of 5 secs sometimes does not exactly guarantees that the callback function will execute exactly after 5s.\n\n- Let's observe the below code and it's explaination\n\n  ```js\n  console.log(\"Start\");\n  setTimeout(function cb() {\n    console.log(\"Callback\");\n  }, 5000);\n  console.log(\"End\");\n  // Millions of lines of code to execute\n\n  // o/p: Over here setTimeout exactly doesn't guarantee that the callback function will be called exactly after 5s. Maybe 6,7 or even 10! It all depends on callstack. Why?\n  ```\n\n  Reason?\n\n  - First GEC is created and pushed in callstack.\n  - Start is printed in console\n  - When setTimeout is seen, callback function is registered into webapi's env. And timer is attached to it and started. callback waits for its turn to be execeuted once timer expires. But JS waits for none. Goes to next line.\n  - End is printed in console.\n  - After \"End\", we have 1 million lines of code that takes 10 sec(say) to finish execution. So GEC won't pop out of stack. It runs all the code for 10 sec.\n  - But in the background, the timer runs for 5s. While callstack runs the 1M line of code, this timer has already expired and callback fun has been pushed to Callback queue and waiting to pushed to callstack to get executed.\n  - Event loop keeps checking if callstack is empty or not. But here GEC is still in stack so cb can't be popped from callback Queue and pushed to CallStack. **Though setTimeout is only for 5s, it waits for 10s until callstack is empty before it can execute** (When GEC popped after 10sec, callstack() is pushed into call stack and immediately executed (Whatever is pushed to callstack is executed instantly).\n  - This is called as the **[Concurrency model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)** of JS. This is the logic behind setTimeout's trust issues.\n\n- The First rule of JavaScript: Do not **block the main thread** (as JS is a single threaded(only 1 callstack) language).\n\n- In below example, we are blocking the main thread. Observe Questiona and Output.\n  ![setTimeout Demo](/assets/namaste-js/settimeout1.jpg)\n\n- setTimeout guarantees that it will take at least the given timer to execute the code.\n\n- JS is a synchronous single threaded language. With just 1 thread it runs all pieces of code. It becomes kind of an interpreter language, and runs code very fast inside browser (no need to wait for code to be compiled) (JIT - Just in time compilation). And there are still ways to do async operations as well.\n\n- What if **timeout = 0sec**?\n  ```js\n  console.log(\"Start\");\n  setTimeout(function cb() {\n    console.log(\"Callback\");\n  }, 0);\n  console.log(\"End\");\n  // Even though timer = 0s, the cb() has to go through the queue. Registers calback in webapi's env , moves to callback queue, and execute once callstack is empty.\n  // O/p - Start End Callback\n  // This method of putting timer = 0, can be used to defer a less imp function by a little so the more important function(here printing \"End\") can take place\n  ```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log(\"Start\");\n  setTimeout(function cb() {\n    console.log(\"Callback\");\n  }, 5000);\n  console.log(\"End\");\n  // Millions of lines of code to execute\n\n  // o/p: Over here setTimeout exactly doesn't guarantee that the callback function will be called exactly after 5s. Maybe 6,7 or even 10! It all depends on callstack. Why?"
      },
      {
        "language": "javascript",
        "code": "console.log(\"Start\");\n  setTimeout(function cb() {\n    console.log(\"Callback\");\n  }, 0);\n  console.log(\"End\");\n  // Even though timer = 0s, the cb() has to go through the queue. Registers calback in webapi's env , moves to callback queue, and execute once callstack is empty.\n  // O/p - Start End Callback\n  // This method of putting timer = 0, can be used to defer a less imp function by a little so the more important function(here printing \"End\") can take place"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why is `setTimeout(fn, 5000)` not guaranteed to run after exactly 5000ms?",
        "answer": "The timer guarantees a MINIMUM delay of 5000ms. If the Call Stack is blocked by long-running synchronous execution, the callback must wait in the queue until the Call Stack becomes completely free."
      }
    ]
  },
  {
    "id": "js-higher-order-functions",
    "title": "Episode 18 : Higher-Order Functions ft. Functional Programming",
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
    "summary": "Complete lecture notes for Episode 18 : Higher-Order Functions ft. Functional Programming with full code and visual diagrams.",
    "keyConcepts": [
      "Complete breakdown and execution steps for Episode 18 : Higher-Order Functions ft. Functional Programming."
    ],
    "detailedContent": "# Episode 18 : Higher-Order Functions ft. Functional Programming\n\n### Q: What is Higher Order Function?\n\n**Ans**: Higher-order functions are regular functions that take one or more functions as arguments and/or return functions as a value from it. Eg:\n\n```js\nfunction x() {\n  console.log(\"Hi\");\n}\nfunction y(x) {\n  x();\n}\ny(x); // Hi\n// y is a higher order function\n// x is a callback function\n```\n\nLet's try to understand how we should approach solution in interview.\nI have an array of radius and I have to calculate area using these radius and store in an array.\n\nFirst Approach:\n\n```js\nconst radius = [1, 2, 3, 4];\nconst calculateArea = function (radius) {\n  const output = [];\n  for (let i = 0; i < radius.length; i++) {\n    output.push(Math.PI * radius[i] * radius[i]);\n  }\n  return output;\n};\nconsole.log(calculateArea(radius));\n```\n\nThe above solution works perfectly fine but what if we have now requirement to calculate array of circumference. Code now be like\n\n```js\nconst radius = [1, 2, 3, 4];\nconst calculateCircumference = function (radius) {\n  const output = [];\n  for (let i = 0; i < radius.length; i++) {\n    output.push(2 * Math.PI * radius[i]);\n  }\n  return output;\n};\nconsole.log(calculateCircumference(radius));\n```\n\nBut over here we are violating some principle like DRY Principle, now lets observe the better approach.\n\n```js\nconst radiusArr = [1, 2, 3, 4];\n\n// logic to calculate area\nconst area = function (radius) {\n    return Math.PI * radius * radius;\n}\n\n// logic to calculate circumference\nconst circumference = function (radius) {\n    return 2 * Math.PI * radius;\n}\n\nconst calculate = function(radiusArr, operation) {\n    const output = [];\n    for (let i = 0; i < radiusArr.length; i++) {\n        output.push(operation(radiusArr[i]));\n    }\n    return output;\n}\nconsole.log(calculate(radiusArr, area));\nconsole.log(calculate(radiusArr, circumference));\n// Over here calculate is HOF\n// Over here we have extracted logic into separate functions. This is the beauty of functional programming.\n\nPolyfill of map\n// Over here calculate is nothing but polyfill of map function\n// console.log(radiusArr.map(area)) == console.log(calculate(radiusArr, area));\n\n***************************************************\nLets convert above calculate function as map function and try to use. So,\n\nArray.prototype.calculate = function(operation) {\n    const output = [];\n    for (let i = 0; i < this.length; i++) {\n        output.push(operation(this[i]));\n    }\n    return output;\n}\nconsole.log(radiusArr.calculate(area))\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "function x() {\n  console.log(\"Hi\");\n}\nfunction y(x) {\n  x();\n}\ny(x); // Hi\n// y is a higher order function\n// x is a callback function"
      },
      {
        "language": "javascript",
        "code": "const radius = [1, 2, 3, 4];\nconst calculateArea = function (radius) {\n  const output = [];\n  for (let i = 0; i < radius.length; i++) {\n    output.push(Math.PI * radius[i] * radius[i]);\n  }\n  return output;\n};\nconsole.log(calculateArea(radius));"
      },
      {
        "language": "javascript",
        "code": "const radius = [1, 2, 3, 4];\nconst calculateCircumference = function (radius) {\n  const output = [];\n  for (let i = 0; i < radius.length; i++) {\n    output.push(2 * Math.PI * radius[i]);\n  }\n  return output;\n};\nconsole.log(calculateCircumference(radius));"
      },
      {
        "language": "javascript",
        "code": "const radiusArr = [1, 2, 3, 4];\n\n// logic to calculate area\nconst area = function (radius) {\n    return Math.PI * radius * radius;\n}\n\n// logic to calculate circumference\nconst circumference = function (radius) {\n    return 2 * Math.PI * radius;\n}\n\nconst calculate = function(radiusArr, operation) {\n    const output = [];\n    for (let i = 0; i < radiusArr.length; i++) {\n        output.push(operation(radiusArr[i]));\n    }\n    return output;\n}\nconsole.log(calculate(radiusArr, area));\nconsole.log(calculate(radiusArr, circumference));\n// Over here calculate is HOF\n// Over here we have extracted logic into separate functions. This is the beauty of functional programming.\n\nPolyfill of map\n// Over here calculate is nothing but polyfill of map function\n// console.log(radiusArr.map(area)) == console.log(calculate(radiusArr, area));\n\n***************************************************\nLets convert above calculate function as map function and try to use. So,\n\nArray.prototype.calculate = function(operation) {\n    const output = [];\n    for (let i = 0; i < this.length; i++) {\n        output.push(operation(this[i]));\n    }\n    return output;\n}\nconsole.log(radiusArr.calculate(area))"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Higher-Order Function (HOF)?",
        "answer": "A Higher-Order Function is a function that takes one or more functions as arguments or returns a function. Examples: `map()`, `filter()`, `reduce()`, `calculate(radiusArray, logicFunction)`."
      }
    ]
  },
  {
    "id": "js-map-filter-reduce",
    "title": "Episode 19 : map, filter & reduce",
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
    "summary": "Complete lecture notes for Episode 19 : map, filter & reduce with full code and visual diagrams.",
    "keyConcepts": [
      "Complete breakdown and execution steps for Episode 19 : map, filter & reduce."
    ],
    "detailedContent": "# Episode 19 : map, filter & reduce\n\n> map, filter & reducer are Higher Order Functions.\n\n## Map function\n\nIt is basically used to transform a array. The map() method creates a new array with the results of calling a function for every array element.\n\nconst output = arr.map(_function_) // this _function_ tells map that what transformation I want on each element of array\n\n```js\nconst arr = [5, 1, 3, 2, 6];\n// Task 1: Double the array element: [10, 2, 6, 4, 12]\nfunction double(x) {\n  return x * 2;\n}\nconst doubleArr = arr.map(double); // Internally map will run double function for each element of array and create a new array and returns it.\nconsole.log(doubleArr); // [10, 2, 6, 4, 12]\n```\n\n```js\n// Task 2: Triple the array element\nconst arr = [5, 1, 3, 2, 6];\n// Transformation logic\nfunction triple(x) {\n  return x * 3;\n}\nconst tripleArr = arr.map(triple);\nconsole.log(tripleArr); // [15, 3, 9, 6, 18]\n```\n\n```js\n// Task 3: Convert array elements to binary\nconst arr = [5, 1, 3, 2, 6];\n// Transformation logic:\nfunction binary(x) {\n\treturn x.toString(2);\n}\nconst binaryArr = arr.map(binary);\n\n// The above code can be rewritten as :\nconst binaryArr = arr.map(function binary(x) {\n\treturn x.toString(2);\n}\n\n// OR -> Arrow function\nconst binaryArr = arr.map((x) => x.toString(2));\n```\n\nSo basically map function is mapping each and every value and transforming it based on given condition.\n\n## Filter function\n\nFilter function is basically used to filter the value inside an array. The arr.filter() method is used to create a new array from a given array consisting of only those elements from the given array which satisfy a condition set by the argument method.\n\n```js\nconst array = [5, 1, 3, 2, 6];\n// filter odd values\nfunction isOdd(x) {\n  return x % 2;\n}\nconst oddArr = array.filter(isOdd); // [5,1,3]\n\n// Other way of writing the above:\nconst oddArr = arr.filter((x) => x % 2);\n```\n\nFilter function creates an array and store only those values which evaluates to true.\n\n## Reduce function\n\nIt is a function which take all the values of array and gives a single output of it. It reduces the array to give a single output.\n\n```js\nconst array = [5, 1, 3, 2, 6];\n// Calculate sum of elements of array - Non functional programming way\nfunction findSum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum = sum + arr[i];\n  }\n  return sum;\n}\nconsole.log(findSum(array)); // 17\n\n// reduce function way\nconst sumOfElem = arr.reduce(function (accumulator, current) {\n  // current represent the value of array\n  // accumulator is used the result from element of array.\n  // In comparison to previous code snippet, *sum* variable is *accumulator* and *arr[i]* is *current*\n  accumulator = accumulator + current;\n  return accumulator;\n}, 0); //In above example sum was initialized with 0, so over here accumulator also needs to be initialized, so the second argument to reduce function represent the initialization value.\nconsole.log(sumOfElem); // 17\n```\n\n```js\n// find max inside array: Non functional programming way:\nconst array = [5, 1, 3, 2, 6];\nfunction findMax(arr) {\n    let max = 0;\n    for(let i = 0; i < arr.length; i++ {\n        if (arr[i] > max) {\n            max = arr[i]\n        }\n    }\n    return max;\n}\nconsole.log(findMax(array)); // 6\n\n// using reduce\nconst output = arr.reduce((acc, current) => {\n\tif (current > acc ) {\n\t\tacc = current;\n\t}\n\treturn acc;\n}, 0);\nconsole.log(output); // 6\n\n// acc is just a label which represent the accumulated value till now,\n// so we can also label it as max in this case\nconst output = arr.reduce((max, current) => {\n\tif (current > max) {\n\t\tmax= current;\n\t}\n\treturn max;\n}, 0);\nconsole.log(output); // 6\n```\n\n## Tricky MAP\n\n```js\nconst users = [\n\t{ firstName: \"Alok\", lastName: \"Raj\", age: 23 },\n\t{ firstName: \"Ashish\", lastName: \"Kumar\", age: 29 },\n\t{ firstName: \"Ankit\", lastName: \"Roy\", age: 29 },\n\t{ firstName: \"Pranav\", lastName: \"Mukherjee\", age: 50 },\n];\n// Get array of full name : [\"Alok Raj\", \"Ashish Kumar\", ...]\nconst fullNameArr = users.map((user) => user.firstName + \" \" + user.lastName);\nconsole.log(fullNameArr); // [\"Alok Raj\", \"Ashish Kumar\", ...]\n\n----------------------------------------------------------\n\n// Get the count/report of how many unique people with unique age are there\n// like: {29 : 2, 75 : 1, 50 : 1}\n// We should use reduce, why? we want to deduce some information from the array. Basically we want to get a single object as output\nconst report = users.reduce((acc, curr) => {\n\tif(acc[curr.age]) {\n\t\tacc[curr.age] = ++ acc[curr.age] ;\n\t} else {\n\t\tacc[curr.age] = 1;\n\t}\n\n\treturn acc;  //to every time return update object\n}, {})\nconsole.log(report) // {29 : 2, 75 : 1, 50 : 1}\n```\n\n## Function Chaining\n\n```js\n// First name of all people whose age is less than 30\nconst users = [\n  { firstName: \"Alok\", lastName: \"Raj\", age: 23 },\n  { firstName: \"Ashish\", lastName: \"Kumar\", age: 29 },\n  { firstName: \"Ankit\", lastName: \"Roy\", age: 29 },\n  { firstName: \"Pranav\", lastName: \"Mukherjee\", age: 50 },\n];\n\n// function chaining\nconst output = users\n  .filter((user) => user.age < 30)\n  .map((user) => user.firstName);\nconsole.log(output); // [\"Alok\", \"Ashish\", \"Ankit\"]\n\n// Homework challenge: Implement the same logic using reduce\nconst output = users.reduce((acc, curr) => {\n  if (curr.age < 30) {\n    acc.push(curr.firstName);\n  }\n  return acc;\n}, []);\nconsole.log(output); // [\"Alok\", \"Ashish\", \"Ankit\"]\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const arr = [5, 1, 3, 2, 6];\n// Task 1: Double the array element: [10, 2, 6, 4, 12]\nfunction double(x) {\n  return x * 2;\n}\nconst doubleArr = arr.map(double); // Internally map will run double function for each element of array and create a new array and returns it.\nconsole.log(doubleArr); // [10, 2, 6, 4, 12]"
      },
      {
        "language": "javascript",
        "code": "// Task 2: Triple the array element\nconst arr = [5, 1, 3, 2, 6];\n// Transformation logic\nfunction triple(x) {\n  return x * 3;\n}\nconst tripleArr = arr.map(triple);\nconsole.log(tripleArr); // [15, 3, 9, 6, 18]"
      },
      {
        "language": "javascript",
        "code": "// Task 3: Convert array elements to binary\nconst arr = [5, 1, 3, 2, 6];\n// Transformation logic:\nfunction binary(x) {\n\treturn x.toString(2);\n}\nconst binaryArr = arr.map(binary);\n\n// The above code can be rewritten as :\nconst binaryArr = arr.map(function binary(x) {\n\treturn x.toString(2);\n}\n\n// OR -> Arrow function\nconst binaryArr = arr.map((x) => x.toString(2));"
      },
      {
        "language": "javascript",
        "code": "const array = [5, 1, 3, 2, 6];\n// filter odd values\nfunction isOdd(x) {\n  return x % 2;\n}\nconst oddArr = array.filter(isOdd); // [5,1,3]\n\n// Other way of writing the above:\nconst oddArr = arr.filter((x) => x % 2);"
      },
      {
        "language": "javascript",
        "code": "const array = [5, 1, 3, 2, 6];\n// Calculate sum of elements of array - Non functional programming way\nfunction findSum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum = sum + arr[i];\n  }\n  return sum;\n}\nconsole.log(findSum(array)); // 17\n\n// reduce function way\nconst sumOfElem = arr.reduce(function (accumulator, current) {\n  // current represent the value of array\n  // accumulator is used the result from element of array.\n  // In comparison to previous code snippet, *sum* variable is *accumulator* and *arr[i]* is *current*\n  accumulator = accumulator + current;\n  return accumulator;\n}, 0); //In above example sum was initialized with 0, so over here accumulator also needs to be initialized, so the second argument to reduce function represent the initialization value.\nconsole.log(sumOfElem); // 17"
      },
      {
        "language": "javascript",
        "code": "// find max inside array: Non functional programming way:\nconst array = [5, 1, 3, 2, 6];\nfunction findMax(arr) {\n    let max = 0;\n    for(let i = 0; i < arr.length; i++ {\n        if (arr[i] > max) {\n            max = arr[i]\n        }\n    }\n    return max;\n}\nconsole.log(findMax(array)); // 6\n\n// using reduce\nconst output = arr.reduce((acc, current) => {\n\tif (current > acc ) {\n\t\tacc = current;\n\t}\n\treturn acc;\n}, 0);\nconsole.log(output); // 6\n\n// acc is just a label which represent the accumulated value till now,\n// so we can also label it as max in this case\nconst output = arr.reduce((max, current) => {\n\tif (current > max) {\n\t\tmax= current;\n\t}\n\treturn max;\n}, 0);\nconsole.log(output); // 6"
      },
      {
        "language": "javascript",
        "code": "const users = [\n\t{ firstName: \"Alok\", lastName: \"Raj\", age: 23 },\n\t{ firstName: \"Ashish\", lastName: \"Kumar\", age: 29 },\n\t{ firstName: \"Ankit\", lastName: \"Roy\", age: 29 },\n\t{ firstName: \"Pranav\", lastName: \"Mukherjee\", age: 50 },\n];\n// Get array of full name : [\"Alok Raj\", \"Ashish Kumar\", ...]\nconst fullNameArr = users.map((user) => user.firstName + \" \" + user.lastName);\nconsole.log(fullNameArr); // [\"Alok Raj\", \"Ashish Kumar\", ...]\n\n----------------------------------------------------------\n\n// Get the count/report of how many unique people with unique age are there\n// like: {29 : 2, 75 : 1, 50 : 1}\n// We should use reduce, why? we want to deduce some information from the array. Basically we want to get a single object as output\nconst report = users.reduce((acc, curr) => {\n\tif(acc[curr.age]) {\n\t\tacc[curr.age] = ++ acc[curr.age] ;\n\t} else {\n\t\tacc[curr.age] = 1;\n\t}\n\n\treturn acc;  //to every time return update object\n}, {})\nconsole.log(report) // {29 : 2, 75 : 1, 50 : 1}"
      },
      {
        "language": "javascript",
        "code": "// First name of all people whose age is less than 30\nconst users = [\n  { firstName: \"Alok\", lastName: \"Raj\", age: 23 },\n  { firstName: \"Ashish\", lastName: \"Kumar\", age: 29 },\n  { firstName: \"Ankit\", lastName: \"Roy\", age: 29 },\n  { firstName: \"Pranav\", lastName: \"Mukherjee\", age: 50 },\n];\n\n// function chaining\nconst output = users\n  .filter((user) => user.age < 30)\n  .map((user) => user.firstName);\nconsole.log(output); // [\"Alok\", \"Ashish\", \"Ankit\"]\n\n// Homework challenge: Implement the same logic using reduce\nconst output = users.reduce((acc, curr) => {\n  if (curr.age < 30) {\n    acc.push(curr.firstName);\n  }\n  return acc;\n}, []);\nconsole.log(output); // [\"Alok\", \"Ashish\", \"Ankit\"]"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do map, filter, and reduce differ?",
        "answer": "`map()` creates a new array by transforming every element. `filter()` creates a new array with elements that pass a test condition. `reduce()` executes a reducer function to accumulate array elements into a single value."
      }
    ]
  },
  {
    "id": "js-callback-hell",
    "title": "Episode 20 : Callback",
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
    "summary": "Complete lecture notes for Episode 20 : Callback with full code and visual diagrams.",
    "keyConcepts": [
      "There are 2 Parts of Callback:",
      "Callback Hell",
      "Inversion of control",
      "Understanding of Bad part of callback is super important to learn Promise in next lecture."
    ],
    "detailedContent": "# Episode 20 : Callback\n\n- There are 2 Parts of Callback:\n\n  1. Good Part of callback - Callback are super important while writing asynchronous code in JS\n  2. Bad Part of Callback - Using callback we can face issue:\n     - Callback Hell\n     - Inversion of control\n\n- Understanding of Bad part of callback is super important to learn Promise in next lecture.\n\n> 💡 JavaScript is synchronous, single threaded language. It can Just do one thing at a time, it has just one call-stack and it can execute one thing at a time. Whatever code we give to Javascript will be quickly executed by Javascript engine, it does not wait.\n\n```js\nconsole.log(\"Namaste\");\nconsole.log(\"JavaScript\");\nconsole.log(\"Season 2\");\n// Namaste\n// JavaScript\n// Season 2\n\n// 💡 It is quickly printing because `Time, tide & Javascript waits for none.`\n```\n\n_But what if we have to delay execution of any line, we could utilize callback, How?_\n\n```js\nconsole.log(\"Namaste\");\nsetTimeout(function () {\n  console.log(\"JavaScript\");\n}, 5000);\nconsole.log(\"Season 2\");\n// Namaste\n// Season 2\n// JavaScript\n\n// 💡 Here we are delaying the execution using callback approach of setTimeout.\n```\n\n### 🛒 e-Commerce web app situation\n\nAssume a scenario of e-Commerce web, where one user is placing order, he has added items like, shoes, pants and kurta in cart and now he is placing order. So in backend the situation could look something like this.\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n// Two steps to place a order\n// 1. Create a Order\n// 2. Proceed to Payment\n\n// It could look something like this:\napi.createOrder();\napi.proceedToPayment();\n```\n\nAssumption, once order is created then only we can proceed to payment, so there is a dependency. So How to manage this dependency.\nCallback can come as rescue, How?\n\n```js\napi.createOrder(cart, function () {\n  api.proceedToPayment();\n});\n// 💡 Over here `createOrder` api is first creating a order then it is responsible to call `api.proceedToPayment()` as part of callback approach.\n```\n\nTo make it a bit complicated, what if after payment is done, you have to show Order summary by calling `api.showOrderSummary()` and now it has dependency on `api.proceedToPayment()`\nNow my code should look something like this:\n\n```js\napi.createOrder(cart, function () {\n  api.proceedToPayment(function () {\n    api.showOrderSummary();\n  });\n});\n```\n\nNow what if we have to update the wallet, now this will have a dependency over `showOrderSummary`\n\n```js\napi.createOrder(cart, function () {\n  api.proceedToPayment(function () {\n    api.showOrderSummary(function () {\n      api.updateWallet();\n    });\n  });\n});\n// 💡 Callback Hell\n```\n\nWhen we have a large codebase and multiple apis and have dependency on each other, then we fall into callback hell.\nThese codes are tough to maintain.\nThese callback hell structure is also known as **Pyramid of Doom**.\n\nTill this point we are comfortable with concept of callback hell but now lets discuss about `Inversion of Control`. It is very important to understand in order to get comfortable around the concept of promise.\n\n> 💡 Inversion of control is like that you lose the control of code when we are using callback.\n\nLet's understand with the help of example code and comments:\n\n```js\napi.createOrder(cart, function () {\n  api.proceedToPayment();\n});\n\n// 💡 So over here, we are creating a order and then we are blindly trusting `createOrder` to call `proceedToPayment`.\n\n// 💡 It is risky, as `proceedToPayment` is important part of code and we are blindly trusting `createOrder` to call it and handle it.\n\n// 💡 When we pass a function as a callback, basically we are dependant on our parent function that it is his responsibility to run that function. This is called `inversion of control` because we are dependant on that function. What if parent function stopped working, what if it was developed by another programmer or callback runs two times or never run at all.\n\n// 💡 In next session, we will see how we can fix such problems.\n```\n\n> 💡 Async programming in JavaScript exists because callback exits.\n\nmore at `http://callbackhell.com/`\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log(\"Namaste\");\nconsole.log(\"JavaScript\");\nconsole.log(\"Season 2\");\n// Namaste\n// JavaScript\n// Season 2\n\n// 💡 It is quickly printing because `Time, tide & Javascript waits for none.`"
      },
      {
        "language": "javascript",
        "code": "console.log(\"Namaste\");\nsetTimeout(function () {\n  console.log(\"JavaScript\");\n}, 5000);\nconsole.log(\"Season 2\");\n// Namaste\n// Season 2\n// JavaScript\n\n// 💡 Here we are delaying the execution using callback approach of setTimeout."
      },
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n// Two steps to place a order\n// 1. Create a Order\n// 2. Proceed to Payment\n\n// It could look something like this:\napi.createOrder();\napi.proceedToPayment();"
      },
      {
        "language": "javascript",
        "code": "api.createOrder(cart, function () {\n  api.proceedToPayment();\n});\n// 💡 Over here `createOrder` api is first creating a order then it is responsible to call `api.proceedToPayment()` as part of callback approach."
      },
      {
        "language": "javascript",
        "code": "api.createOrder(cart, function () {\n  api.proceedToPayment(function () {\n    api.showOrderSummary();\n  });\n});"
      },
      {
        "language": "javascript",
        "code": "api.createOrder(cart, function () {\n  api.proceedToPayment(function () {\n    api.showOrderSummary(function () {\n      api.updateWallet();\n    });\n  });\n});\n// 💡 Callback Hell"
      },
      {
        "language": "javascript",
        "code": "api.createOrder(cart, function () {\n  api.proceedToPayment();\n});\n\n// 💡 So over here, we are creating a order and then we are blindly trusting `createOrder` to call `proceedToPayment`.\n\n// 💡 It is risky, as `proceedToPayment` is important part of code and we are blindly trusting `createOrder` to call it and handle it.\n\n// 💡 When we pass a function as a callback, basically we are dependant on our parent function that it is his responsibility to run that function. This is called `inversion of control` because we are dependant on that function. What if parent function stopped working, what if it was developed by another programmer or callback runs two times or never run at all.\n\n// 💡 In next session, we will see how we can fix such problems."
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Callback Hell and Inversion of Control?",
        "answer": "Callback Hell is deeply nested callbacks resulting in unreadable 'Pyramid of Doom' code. Inversion of Control happens when passing a callback to another API, giving up control over when, how many times, or if the callback is invoked."
      }
    ]
  },
  {
    "id": "js-promises-introduction",
    "title": "Episode 21 : Promises",
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
    "summary": "Complete lecture notes for Episode 21 : Promises with full code and visual diagrams.",
    "keyConcepts": [
      "If we will deep dive and see, this promise object has 3 things",
      "prototype, promiseState & promiseResult",
      "& this promiseResult is the same data which we talked earlier as data",
      "& initially promiseResult is undefined",
      "promiseResult will store data returned from API call",
      "promiseState will tell in which state the promise is currently, initially it will be in pending state and later it will become fulfilled",
      "When above line is executed, fetch makes API call and return a promise instantly which is in Pending state and Javascript doesn't wait to get it fulfilled",
      "And in next line it console out the pending promise.",
      "NOTE: chrome browser has some in-consistency, the moment console happens it shows in pending state but if you will expand that it will show fulfilled because chrome updated the log when promise get fulfilled.",
      "Once fulfilled data is there in promiseResult and it is inside body in ReadableStream format and there is a way to extract data."
    ],
    "detailedContent": "# Episode 21 : Promises\n\n> Promises are used to handle async operations in JavaScript.\n\nWe will discuss with code example that how things used to work before `Promises` and then how it works after `Promises`\n\nSuppose, taking an example of E-Commerce\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n\n// Below two functions are asynchronous and dependent on each other\nconst orderId = createOrder(cart);\nproceedToPayment(orderId);\n\n// with Callback (Before Promise)\n// Below here, it is the responsibility of createOrder function to first create the order then call the callback function\ncreateOrder(cart, function () {\n  proceedToPayment(orderId);\n});\n// Above there is the issue of `Inversion of Control`\n```\n\nQ: How to fix the above issue?  \n_A: Using Promise._\n\nNow, we will make `createOrder` function return a promise and we will capture that `promise` into a `variable`\n\nPromise is nothing but we can assume it to be empty object with some data value in it, and this data value will hold whatever this `createOrder` function will return.\n\nSince `createOrder` function is an async function and we don't know how much time will it take to finish execution.\n\nSo the moment `createOrder` will get executed, it will return you a `undefined` value. Let's say after 5 secs execution finished so now `orderId` is ready so, it will fill the `undefined` value with the `orderId`.\n\nIn short, When `createOrder` get executed, it immediately returns a `promise object` with `undefined` value. then javascript will continue to execute with other lines of code. After sometime when `createOrder` has finished execution and `orderId` is ready then that will `automatically` be assigned to our returned `promise` which was earlier `undefined`.\n\nQ: Question is how we will get to know `response` is ready?  \n_A: So, we will attach a `callback` function to the `promise object` using `then` to get triggered automatically when `result` is ready._\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n\nconst promiseRef = createOrder(cart);\n// this promiseRef has access to `then`\n\n// {data: undefined}\n// Initially it will be undefined so below code won't trigger\n// After some time, when execution has finished and promiseRef has the data then automatically the below line will get triggered.\n\npromiseRef.then(function () {\n  proceedToPayment(orderId);\n});\n```\n\nQ: How it is better than callback approach?\n\nIn Earlier solution we used to pass the function and then used to trust the function to execute the callback.\n\nBut with promise, we are attaching a callback function to a promiseObject.\n\nThere is difference between these words, passing a function and attaching a function.\n\nPromise guarantee, it will callback the attached function once it has the fulfilled data. And it will call it only once. Just once.\n\nEarlier we talked about promise are object with empty data but that's not entirely true, `Promise` are much more than that.\n\nNow let's understand and see a real promise object.\n\nfetch is a web-api which is utilized to make api call and it returns a promise.\n\nWe will be calling public github api to fetch data\nhttps://api.github.com/users/alok722\n\n```js\n// We will be calling public github api to fetch data\nconst URL = \"https://api.github.com/users/alok722\";\nconst user = fetch(URL);\n// User above will be a promise.\nconsole.log(user); // Promise {<Pending>}\n\n/** OBSERVATIONS:\n * If we will deep dive and see, this `promise` object has 3 things\n * `prototype`, `promiseState` & `promiseResult`\n * & this `promiseResult` is the same data which we talked earlier as data\n * & initially `promiseResult` is `undefined`\n *\n * `promiseResult` will store data returned from API call\n * `promiseState` will tell in which state the promise is currently, initially it will be in `pending` state and later it will become `fulfilled`\n */\n\n/**\n * When above line is executed, `fetch` makes API call and return a `promise` instantly which is in `Pending` state and Javascript doesn't wait to get it `fulfilled`\n * And in next line it console out the `pending promise`.\n * NOTE: chrome browser has some in-consistency, the moment console happens it shows in pending state but if you will expand that it will show fulfilled because chrome updated the log when promise get fulfilled.\n * Once fulfilled data is there in promiseResult and it is inside body in ReadableStream format and there is a way to extract data.\n */\n```\n\nNow we can attach callback to above response?\n\nUsing `.then`\n\n```js\nconst URL = \"https://api.github.com/users/alok722\";\nconst user = fetch(URL);\n\nuser.then(function (data) {\n  console.log(data);\n});\n// And this is how Promise is used.\n// It guarantees that it could be resolved only once, either it could be `success` or `failure`\n/**\n    A Promise is in one of these states:\n\n    pending: initial state, neither fulfilled nor rejected.\n    fulfilled: meaning that the operation was completed successfully.\n    rejected: meaning that the operation failed.\n */\n```\n\n💡Promise Object are immutable.  \n-> Once promise is fulfilled and we have data we can pass here and there and we don't have to worry that someone can mutate that data. So over above we can't directly mutate `user` promise object, we will have to use `.then`\n\n### Interview Guide\n\n💡What is Promise?  \n-> Promise object is a placeholder for certain period of time until we receive value from asynchronous operation.\n\n-> A container for a future value.\n\n-> **A Promise is an object representing the eventual completion or failure of an asynchronous operation.**\n\nWe are now done solving one issue of callback i.e. Inversion of Control\n\nBut there is one more issue, callback hell...\n\n```js\n// Callback Hell Example\ncreateOrder(cart, function (orderId) {\n  proceedToPayment(orderId, function (paymentInf) {\n    showOrderSummary(paymentInf, function (balance) {\n      updateWalletBalance(balance);\n    });\n  });\n});\n// And now above code is expanding horizontally and this is called pyramid of doom.\n// Callback hell is ugly and hard to maintain.\n\n// 💡 Promise fixes this issue too using `Promise Chaining`\n// Example Below is a Promise Chaining\ncreateOrder(cart)\n  .then(function (orderId) {\n    proceedToPayment(orderId);\n  })\n  .then(function (paymentInf) {\n    showOrderSummary(paymentInf);\n  })\n  .then(function (balance) {\n    updateWalletBalance(balance);\n  });\n\n// ⚠️ Common PitFall\n// We forget to return promise in Promise Chaining\n// The idea is promise/data returned from one .then become data for next .then\n// So,\ncreateOrder(cart)\n  .then(function (orderId) {\n    return proceedToPayment(orderId);\n  })\n  .then(function (paymentInf) {\n    return showOrderSummary(paymentInf);\n  })\n  .then(function (balance) {\n    return updateWalletBalance(balance);\n  });\n\n// To improve readability you can use arrow function instead of regular function\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n\n// Below two functions are asynchronous and dependent on each other\nconst orderId = createOrder(cart);\nproceedToPayment(orderId);\n\n// with Callback (Before Promise)\n// Below here, it is the responsibility of createOrder function to first create the order then call the callback function\ncreateOrder(cart, function () {\n  proceedToPayment(orderId);\n});\n// Above there is the issue of `Inversion of Control`"
      },
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n\nconst promiseRef = createOrder(cart);\n// this promiseRef has access to `then`\n\n// {data: undefined}\n// Initially it will be undefined so below code won't trigger\n// After some time, when execution has finished and promiseRef has the data then automatically the below line will get triggered.\n\npromiseRef.then(function () {\n  proceedToPayment(orderId);\n});"
      },
      {
        "language": "javascript",
        "code": "// We will be calling public github api to fetch data\nconst URL = \"https://api.github.com/users/alok722\";\nconst user = fetch(URL);\n// User above will be a promise.\nconsole.log(user); // Promise {<Pending>}\n\n/** OBSERVATIONS:\n * If we will deep dive and see, this `promise` object has 3 things\n * `prototype`, `promiseState` & `promiseResult`\n * & this `promiseResult` is the same data which we talked earlier as data\n * & initially `promiseResult` is `undefined`\n *\n * `promiseResult` will store data returned from API call\n * `promiseState` will tell in which state the promise is currently, initially it will be in `pending` state and later it will become `fulfilled`\n */\n\n/**\n * When above line is executed, `fetch` makes API call and return a `promise` instantly which is in `Pending` state and Javascript doesn't wait to get it `fulfilled`\n * And in next line it console out the `pending promise`.\n * NOTE: chrome browser has some in-consistency, the moment console happens it shows in pending state but if you will expand that it will show fulfilled because chrome updated the log when promise get fulfilled.\n * Once fulfilled data is there in promiseResult and it is inside body in ReadableStream format and there is a way to extract data.\n */"
      },
      {
        "language": "javascript",
        "code": "const URL = \"https://api.github.com/users/alok722\";\nconst user = fetch(URL);\n\nuser.then(function (data) {\n  console.log(data);\n});\n// And this is how Promise is used.\n// It guarantees that it could be resolved only once, either it could be `success` or `failure`\n/**\n    A Promise is in one of these states:\n\n    pending: initial state, neither fulfilled nor rejected.\n    fulfilled: meaning that the operation was completed successfully.\n    rejected: meaning that the operation failed.\n */"
      },
      {
        "language": "javascript",
        "code": "// Callback Hell Example\ncreateOrder(cart, function (orderId) {\n  proceedToPayment(orderId, function (paymentInf) {\n    showOrderSummary(paymentInf, function (balance) {\n      updateWalletBalance(balance);\n    });\n  });\n});\n// And now above code is expanding horizontally and this is called pyramid of doom.\n// Callback hell is ugly and hard to maintain.\n\n// 💡 Promise fixes this issue too using `Promise Chaining`\n// Example Below is a Promise Chaining\ncreateOrder(cart)\n  .then(function (orderId) {\n    proceedToPayment(orderId);\n  })\n  .then(function (paymentInf) {\n    showOrderSummary(paymentInf);\n  })\n  .then(function (balance) {\n    updateWalletBalance(balance);\n  });\n\n// ⚠️ Common PitFall\n// We forget to return promise in Promise Chaining\n// The idea is promise/data returned from one .then become data for next .then\n// So,\ncreateOrder(cart)\n  .then(function (orderId) {\n    return proceedToPayment(orderId);\n  })\n  .then(function (paymentInf) {\n    return showOrderSummary(paymentInf);\n  })\n  .then(function (balance) {\n    return updateWalletBalance(balance);\n  });\n\n// To improve readability you can use arrow function instead of regular function"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a Promise and what are its states?",
        "answer": "A Promise is an object representing eventual completion/failure of an async operation. States: `pending` (initial state), `fulfilled` (operation succeeded), `rejected` (operation failed). Once settled, a Promise's state and value are immutable."
      }
    ]
  },
  {
    "id": "js-promise-chaining-error-handling",
    "title": "Episode 22 : Creating a Promise, Chaining & Error Handling",
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
    "summary": "Complete lecture notes for Episode 22 : Creating a Promise, Chaining & Error Handling with full code and visual diagrams.",
    "keyConcepts": [
      "1. validateCart",
      "2. Insert in DB and get an orderId"
    ],
    "detailedContent": "# Episode 22 : Creating a Promise, Chaining & Error Handling\n\n###\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n\n// Consumer part of promise\nconst promise = createOrder(cart); // orderId\n// Our expectation is above function is going to return me a promise.\n\npromise.then(function (orderId) {\n  proceedToPayment(orderId);\n});\n\n// Above snippet we have observed in our previous lecture itself.\n// Now we will see, how createOrder is implemented so that it is returning a promise\n// In short we will see, \"How we can create Promise\" and then return it.\n\n// Producer part of Promise\nfunction createOrder(cart) {\n  // JS provides a Promise constructor through which we can create promise\n  // It accepts a callback function with two parameter `resolve` & `reject`\n  const promise = new Promise(function (resolve, reject) {\n    // What is this `resolve` and `reject`?\n    // These are function which are passed by javascript to us in order to handle success and failure of function call.\n    // Now we will write logic to `createOrder`\n    /** Mock logic steps\n     * 1. validateCart\n     * 2. Insert in DB and get an orderId\n     */\n    // We are assuming in real world scenario, validateCart would be defined\n    if (!validateCart(cart)) {\n      // If cart not valid, reject the promise\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\"; // We got this id by calling to db (Assumption)\n    if (orderId) {\n      // Success scenario\n      resolve(orderId);\n    }\n  });\n  return promise;\n}\n```\n\nOver above, if your validateCart is returning true, so the above promise will be resolved (success),\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n\nconst promise = createOrder(cart); // orderId\n// ❓ What will be printed in below line?\n// It prints Promise {<pending>}, but why?\n// Because above createOrder is going to take sometime to get resolved, so pending state. But once the promise is resolved, `.then` would be executed for callback.\nconsole.log(promise);\n\npromise.then(function (orderId) {\n  proceedToPayment(orderId);\n});\n\nfunction createOrder(cart) {\n  const promise = new Promise(function (resolve, reject) {\n    if (!validateCart(cart)) {\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\";\n    if (orderId) {\n      resolve(orderId);\n    }\n  });\n  return promise;\n}\n```\n\nNow let's see if there was some error and we are rejecting the promise, how we could catch that?  \n-> Using `.catch`\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n\nconst promise = createOrder(cart); // orderId\n\n// Here we are consuming Promise and will try to catch promise error\npromise\n  .then(function (orderId) {\n    // ✅ success aka resolved promise handling\n    proceedToPayment(orderId);\n  })\n  .catch(function (err) {\n    // ⚠️ failure aka reject handling\n    console.log(err);\n  });\n\n// Here we are creating Promise\nfunction createOrder(cart) {\n  const promise = new Promise(function (resolve, reject) {\n    // Assume below `validateCart` return false then the promise will be rejected\n    // And then our browser is going to throw the error.\n    if (!validateCart(cart)) {\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\";\n    if (orderId) {\n      resolve(orderId);\n    }\n  });\n  return promise;\n}\n```\n\nNow, Let's understand the concept of Promise Chaining  \n-> for this we will assume after `createOrder` we have to invoke `proceedToPayment`  \n-> In promise chaining, whatever is returned from first `.then` become data for next `.then` and so on...  \n-> At any point of promise chaining, if promise is rejected, the execution will fallback to `.catch` and others promise won't run.\n\n```js\nconst cart = [\"shoes\", \"pants\", \"kurta\"];\n\ncreateOrder(cart)\n  .then(function (orderId) {\n    // ✅ success aka resolved promise handling\n    // 💡 we have return data or promise so that we can keep chaining the promises, here we are returning data\n    console.log(orderId);\n    return orderId;\n  })\n  .then(function (orderId) {\n    // Promise chaining\n    // 💡 we will make sure that `proceedToPayment` returns a promise too\n    return proceedToPayment(orderId);\n  })\n  .then(function (paymentInfo) {\n    // from above, `proceedToPayment` is returning a promise so we can consume using `.then`\n    console.log(paymentInfo);\n  })\n  .catch(function (err) {\n    // ⚠️ failure aka reject handling\n    console.log(err);\n  });\n\n// Here we are creating Promise\nfunction createOrder(cart) {\n  const promise = new Promise(function (resolve, reject) {\n    // Assume below `validateCart` return false then the promise will be rejected\n    // And then our browser is going to throw the error.\n    if (!validateCart(cart)) {\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\";\n    if (orderId) {\n      resolve(orderId);\n    }\n  });\n  return promise;\n}\n\nfunction proceedToPayment(cart) {\n  return new Promise(function (resolve, reject) {\n    // For time being, we are simply `resolving` promise\n    resolve(\"Payment Successful\");\n  });\n}\n```\n\nQ: What if we want to continue execution even if any of my promise is failing, how to achieve this?  \n-> By placing the `.catch` block at some level after which we are not concerned with failure.  \n-> There could be multiple `.catch` too.\nEg:\n\n```js\ncreateOrder(cart)\n  .then(function (orderId) {\n    // ✅ success aka resolved promise handling\n    // 💡 we have return data or promise so that we can keep chaining the promises, here we are returning data\n    console.log(orderId);\n    return orderId;\n  })\n    .catch(function (err) {\n    // ⚠️ Whatever fails below it, catch wont care\n    // this block is responsible for code block above it.\n    console.log(err);\n  });\n  .then(function (orderId) {\n    // Promise chaining\n    // 💡 we will make sure that `proceedToPayment` returns a promise too\n    return proceedToPayment(orderId);\n  })\n  .then(function (paymentInfo) {\n    // from above, `proceedToPayment` is returning a promise so we can consume using `.then`\n    console.log(paymentInfo);\n  })\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n\n// Consumer part of promise\nconst promise = createOrder(cart); // orderId\n// Our expectation is above function is going to return me a promise.\n\npromise.then(function (orderId) {\n  proceedToPayment(orderId);\n});\n\n// Above snippet we have observed in our previous lecture itself.\n// Now we will see, how createOrder is implemented so that it is returning a promise\n// In short we will see, \"How we can create Promise\" and then return it.\n\n// Producer part of Promise\nfunction createOrder(cart) {\n  // JS provides a Promise constructor through which we can create promise\n  // It accepts a callback function with two parameter `resolve` & `reject`\n  const promise = new Promise(function (resolve, reject) {\n    // What is this `resolve` and `reject`?\n    // These are function which are passed by javascript to us in order to handle success and failure of function call.\n    // Now we will write logic to `createOrder`\n    /** Mock logic steps\n     * 1. validateCart\n     * 2. Insert in DB and get an orderId\n     */\n    // We are assuming in real world scenario, validateCart would be defined\n    if (!validateCart(cart)) {\n      // If cart not valid, reject the promise\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\"; // We got this id by calling to db (Assumption)\n    if (orderId) {\n      // Success scenario\n      resolve(orderId);\n    }\n  });\n  return promise;\n}"
      },
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n\nconst promise = createOrder(cart); // orderId\n// ❓ What will be printed in below line?\n// It prints Promise {<pending>}, but why?\n// Because above createOrder is going to take sometime to get resolved, so pending state. But once the promise is resolved, `.then` would be executed for callback.\nconsole.log(promise);\n\npromise.then(function (orderId) {\n  proceedToPayment(orderId);\n});\n\nfunction createOrder(cart) {\n  const promise = new Promise(function (resolve, reject) {\n    if (!validateCart(cart)) {\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\";\n    if (orderId) {\n      resolve(orderId);\n    }\n  });\n  return promise;\n}"
      },
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n\nconst promise = createOrder(cart); // orderId\n\n// Here we are consuming Promise and will try to catch promise error\npromise\n  .then(function (orderId) {\n    // ✅ success aka resolved promise handling\n    proceedToPayment(orderId);\n  })\n  .catch(function (err) {\n    // ⚠️ failure aka reject handling\n    console.log(err);\n  });\n\n// Here we are creating Promise\nfunction createOrder(cart) {\n  const promise = new Promise(function (resolve, reject) {\n    // Assume below `validateCart` return false then the promise will be rejected\n    // And then our browser is going to throw the error.\n    if (!validateCart(cart)) {\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\";\n    if (orderId) {\n      resolve(orderId);\n    }\n  });\n  return promise;\n}"
      },
      {
        "language": "javascript",
        "code": "const cart = [\"shoes\", \"pants\", \"kurta\"];\n\ncreateOrder(cart)\n  .then(function (orderId) {\n    // ✅ success aka resolved promise handling\n    // 💡 we have return data or promise so that we can keep chaining the promises, here we are returning data\n    console.log(orderId);\n    return orderId;\n  })\n  .then(function (orderId) {\n    // Promise chaining\n    // 💡 we will make sure that `proceedToPayment` returns a promise too\n    return proceedToPayment(orderId);\n  })\n  .then(function (paymentInfo) {\n    // from above, `proceedToPayment` is returning a promise so we can consume using `.then`\n    console.log(paymentInfo);\n  })\n  .catch(function (err) {\n    // ⚠️ failure aka reject handling\n    console.log(err);\n  });\n\n// Here we are creating Promise\nfunction createOrder(cart) {\n  const promise = new Promise(function (resolve, reject) {\n    // Assume below `validateCart` return false then the promise will be rejected\n    // And then our browser is going to throw the error.\n    if (!validateCart(cart)) {\n      const err = new Error(\"Cart is not Valid\");\n      reject(err);\n    }\n    const orderId = \"12345\";\n    if (orderId) {\n      resolve(orderId);\n    }\n  });\n  return promise;\n}\n\nfunction proceedToPayment(cart) {\n  return new Promise(function (resolve, reject) {\n    // For time being, we are simply `resolving` promise\n    resolve(\"Payment Successful\");\n  });\n}"
      },
      {
        "language": "javascript",
        "code": "createOrder(cart)\n  .then(function (orderId) {\n    // ✅ success aka resolved promise handling\n    // 💡 we have return data or promise so that we can keep chaining the promises, here we are returning data\n    console.log(orderId);\n    return orderId;\n  })\n    .catch(function (err) {\n    // ⚠️ Whatever fails below it, catch wont care\n    // this block is responsible for code block above it.\n    console.log(err);\n  });\n  .then(function (orderId) {\n    // Promise chaining\n    // 💡 we will make sure that `proceedToPayment` returns a promise too\n    return proceedToPayment(orderId);\n  })\n  .then(function (paymentInfo) {\n    // from above, `proceedToPayment` is returning a promise so we can consume using `.then`\n    console.log(paymentInfo);\n  })"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does Promise Chaining and Error Handling with `.catch()` work?",
        "answer": "Promise chaining passes returned values down a `.then()` pipeline. A `.catch()` block catches errors thrown anywhere in preceding `.then()` steps. Returning a new Promise from `.then()` defers downstream execution until that Promise resolves."
      }
    ]
  },
  {
    "id": "js-async-await",
    "title": "Episode 23 : async await",
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
    "summary": "Complete lecture notes for Episode 23 : async await with full code and visual diagrams.",
    "keyConcepts": [
      "What is async?",
      "What is await?",
      "How async await works behind the scenes?",
      "Example of using async/await",
      "Error Handling",
      "Interviews",
      "Async await vs Promise.then/.catch"
    ],
    "detailedContent": "# Episode 23 : async await\n\n###\n\nTopics Covered\n\n- What is async?\n- What is await?\n- How async await works behind the scenes?\n- Example of using async/await\n- Error Handling\n- Interviews\n- Async await vs Promise.then/.catch\n\nQ: What is async?  \nA: Async is a keyword that is used before a function to create a async function.\n\nQ: What is async function and how it is different from normal function?\n\n```js\n// 💡 async function always returns a promise, even if I return a simple string from below function, async keyword will wrap it under Promise and then return.\nasync function getData() {\n  return \"Namaste JavaScript\";\n}\nconst dataPromise = getData();\nconsole.log(dataPromise); // Promise {<fulfilled>: 'Namaste JavaScript'}\n\n//❓How to extract data from above promise? One way is using promise .then\ndataPromise.then((res) => console.log(res)); // Namaste JavaScript\n```\n\nAnother example where `async` function is returning a Promise\n\n```js\nconst p = new Promise((resolve, reject) => {\n  resolve(\"Promise resolved value!!\");\n});\n\nasync function getData() {\n  return p;\n}\n// In above case, since we are already returning a promise async function would simply return that instead of wrapping with a new Promise.\nconst dataPromise = getData();\nconsole.log(dataPromise); // Promise {<fulfilled>: 'Promise resolved value!!'}\ndataPromise.then((res) => console.log(res)); // Promise resolved value!!\n```\n\nQ: How we can use `await` along with async function?  \nA: `async` and `await` combo is used to handle promises.\n\nBut Question is how we used to handle promises earlier and why we even need async/await?\n\n```js\nconst p = new Promise((resolve, reject) => {\n  resolve(\"Promise resolved value!!\");\n});\n\nfunction getData() {\n  p.then((res) => console.log(res));\n}\n\ngetData(); // Promise resolved value!!\n\n//📌 Till now we have been using Promise.then/.catch to handle promise.\n// Now let's see how async await can help us and how it is different\n\n// The rule is we have to use keyword await in front of promise.\nasync function handlePromise() {\n  const val = await p;\n  console.log(val);\n}\nhandlePromise(); // Promise resolved value!!\n```\n\n📌 `await` is a keyword that can only be used inside a `async` function.\n\n```js\nawait function () {}; // Syntax error: await is only valid under async function.\n```\n\nQ: What makes `async`-`await` special?  \nA: Let's understand with one example where we will compare async-await way of resolving promise with older .then/.catch fashion. For that we will modify our promise `p`.\n\n```js\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value!!\");\n  }, 3000);\n});\n\n// Let's now compare with some modification:\n\n// 📌 Promise.then/.catch way\nfunction getData() {\n  // JS engine will not wait for promise to be resolved\n  p.then((res) => console.log(res));\n  console.log(\"Hello There!\");\n}\n\ngetData(); // First `Hello There!` would be printed and then after 3 secs 'Promise resolved value!!' will be printed.\n// Above happened as Javascript wait for none, so it will register this promise and take this callback function and register separately then js will move on and execute the following console and later once promise is resolved, following console will be printed.\n\n//❓ Problem: Normally one used to get confused that JS will wait for promise to be resolved before executing following lines.\n\n// 📌 async-wait way:\nasync function handlePromise() {\n  // JS Engine will waiting for promise to resolve.\n  const val = await p;\n  console.log(\"Hello There!\");\n  console.log(val);\n}\nhandlePromise(); // This time `Hello There!` won't be printed immediately instead after 3 secs `Hello There!` will be printed followed by 'Promise resolved value!!'\n// 💡 So basically code was waiting at `await` line to get the promise resolve before moving on to next line.\n\n// Above is the major difference between Promise.then/.catch vs async-await\n\n//🤓 Let's brainstorm more around async-await\nasync function handlePromise() {\n  console.log(\"Hi\");\n  const val = await p;\n  console.log(\"Hello There!\");\n  console.log(val);\n\n  const val2 = await p;\n  console.log(\"Hello There! 2\");\n  console.log(val2);\n}\nhandlePromise();\n// In above code example, will our program wait for 2 time or will it execute parallely.\n//📌 `Hi` printed instantly -> now code will wait for 3 secs -> After 3 secs both promises will be resolved so ('Hello There!' 'Promise resolved value!!' 'Hello There! 2' 'Promise resolved value!!') will get printed immediately.\n\n// Let's create one promise and then resolve two different promise.\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p2!!\");\n  }, 2000);\n});\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n  const val = await p;\n  console.log(\"Hello There!\");\n  console.log(val);\n\n  const val2 = await p2;\n  console.log(\"Hello There! 2\");\n  console.log(val2);\n}\nhandlePromise();\n// 📌 `Hi` printed instantly -> now code will wait for 3 secs -> After 3 secs both promises will be resolved so ('Hello There!' 'Promise resolved value!!' 'Hello There! 2' 'Promise resolved value by p2!!') will get printed immediately. So even though `p2` was resolved after 2 secs it had to wait for `p` to get resolved\n\n// Now let's reverse the order execution of promise and observe response.\nasync function handlePromise() {\n  console.log(\"Hi\");\n  const val = await p2;\n  console.log(\"Hello There!\");\n  console.log(val);\n\n  const val2 = await p;\n  console.log(\"Hello There! 2\");\n  console.log(val2);\n}\nhandlePromise();\n// 📌 `Hi` printed instantly -> now code will wait for 2 secs -> After 2 secs ('Hello There!' 'Promise resolved value by p2!!') will get printed and in the subsequent second i.e. after 3 secs ('Hello There! 2' 'Promise resolved value!!') will get printed\n```\n\nQ: Question is Is program actually waiting or what is happening behind the scene?  \nA: As we know, Time, Tide and JS wait for none. And it's true. Over here it appears that JS engine is waiting but JS engine is not waiting over here. It has not occupied the call stack if that would have been the case our page may have got frozen. So JS engine is not waiting. So if it is not waiting then what it is doing behind the scene? Let's understand with below code snippet.\n\n```js\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p1!!\");\n  }, 5000);\n});\n\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p2!!\");\n  }, 10000);\n});\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n  debugger;\n  const val = await p1;\n  console.log(\"Hello There!\");\n  debugger;\n  console.log(val);\n\n  const val2 = await p2;\n  console.log(\"Hello There! 2\");\n  debugger;\n  console.log(val2);\n}\nhandlePromise();\n// When this function is executed, it will go line by line as JS is synchronous single threaded language. Lets observe what is happening under call-stack. Above you can see we have set the break-points.\n\n// call stack flow -> handlePromise() is pushed -> It will log `Hi` to console -> Next it sees we have await where promise is suppose to be resolved -> So will it wait for promise to resolve and block call stack? No -> thus handlePromise() execution get suspended and moved out of call stack -> So when JS sees await keyword it suspend the execution of function till promise is resolved -> So `p1` will get resolved after 5 secs so handlePromise() will be pushed to call-stack again after 5 secs. -> But this time it will start executing from where it had left. -> Now it will log 'Hello There!' and 'Promise resolved value by p1!!' -> then it will check whether `p2` is resolved or not -> It will find since `p2` will take 10 secs to resolve so the same above process will repeat -> execution will be suspended until promise is resolved.\n\n// 📌 Thus JS is not waiting, call stack is not getting blocked.\n\n// Moreover in above scenario what if p1 would be taking 10 secs and p2 5 secs -> even though p2 got resolved earlier but JS is synchronous single threaded language so it will first wait for p1 to be resolved and then will immediately execute all.\n```\n\nQ: Explain code output and it's reason\n\n```js\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p1!!\");\n  }, 10000);\n});\n\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p2!!\");\n  }, 5000);\n});\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n  debugger;\n  const val = await p1;\n  console.log(\"Hello There!\");\n  debugger;\n  console.log(val);\n\n  const val2 = await p2;\n  console.log(\"Hello There! 2\");\n  debugger;\n  console.log(val2);\n}\nhandlePromise();\n\n// Hi will be printed then because of p1 await, it will for 10seconds and print `Promise resolved value by p1!!` followed by `Hello There!` and then instantly `Promise resolved value by p2!!` followed by `Hello There! 2`\n\n// ❓ Why p2 invoked instanly without waiting another 5 seconds?\n```\n\nA: 👉 Promises start executing immediately when they are created, not when they are awaited.\np1’s setTimeout(10s) starts right away\np2’s setTimeout(5s) also starts right away\nBoth timers begin ticking as soon as the file is executed, before handlePromise() even hits the first await.\n\nawait does NOT start a promise\nIt only waits for an already-running promise\n\nQ: How to make p2 wait after p1\nA:\n\n```js\nfunction createP1() {\n  return new Promise((resolve) =>\n    setTimeout(() => resolve(\"p1 resolved\"), 10000),\n  );\n}\n\nfunction createP2() {\n  return new Promise((resolve) =>\n    setTimeout(() => resolve(\"p2 resolved\"), 5000),\n  );\n}\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n\n  const val1 = await createP1();\n  console.log(val1);\n\n  const val2 = await createP2();\n  console.log(val2);\n}\n```\n\n### Real World example of async/await\n\n```js\nasync function handlePromise() {\n  // fetch() => Response Object which as body as Readable stream => Response.json() is also a promise which when resolved => value\n  const data = await fetch(\"https://api.github.com/users/alok722\");\n  const res = await data.json();\n  console.log(res);\n}\nhandlePromise();\n```\n\n### Error Handling\n\nWhile we were using normal Promise we were using .catch to handle error, now in `async-await` we would be using `try-catch` block to handle error.\n\n```js\nasync function handlePromise() {\n  try {\n    const data = await fetch(\"https://api.github.com/users/alok722\");\n    const res = await data.json();\n    console.log(res);\n  } catch (err) {\n    console.log(err);\n  }\n}\nhandlePromise();\n\n// In above whenever any error will occur the execution will move to catch block. One could try above with bad url which will result in error.\n\n// Other way of handling error:\nhandlePromise().catch((err) => console.log(err)); // this will work as handlePromise will return error promise in case of failure.\n```\n\n### Async await vs Promise.then/.catch\n\nWhat one should use? `async-await` is just a syntactic sugar around promise. Behind the scene `async-await` is just promise. So both are same, it's just `async-await` is new way of writing code. `async-await` solves few of the short-coming of Promise like `Promise Chaining`. `async-await` also increases the readability. So sort of it is always advisable to use `async-await.`\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// 💡 async function always returns a promise, even if I return a simple string from below function, async keyword will wrap it under Promise and then return.\nasync function getData() {\n  return \"Namaste JavaScript\";\n}\nconst dataPromise = getData();\nconsole.log(dataPromise); // Promise {<fulfilled>: 'Namaste JavaScript'}\n\n//❓How to extract data from above promise? One way is using promise .then\ndataPromise.then((res) => console.log(res)); // Namaste JavaScript"
      },
      {
        "language": "javascript",
        "code": "const p = new Promise((resolve, reject) => {\n  resolve(\"Promise resolved value!!\");\n});\n\nasync function getData() {\n  return p;\n}\n// In above case, since we are already returning a promise async function would simply return that instead of wrapping with a new Promise.\nconst dataPromise = getData();\nconsole.log(dataPromise); // Promise {<fulfilled>: 'Promise resolved value!!'}\ndataPromise.then((res) => console.log(res)); // Promise resolved value!!"
      },
      {
        "language": "javascript",
        "code": "const p = new Promise((resolve, reject) => {\n  resolve(\"Promise resolved value!!\");\n});\n\nfunction getData() {\n  p.then((res) => console.log(res));\n}\n\ngetData(); // Promise resolved value!!\n\n//📌 Till now we have been using Promise.then/.catch to handle promise.\n// Now let's see how async await can help us and how it is different\n\n// The rule is we have to use keyword await in front of promise.\nasync function handlePromise() {\n  const val = await p;\n  console.log(val);\n}\nhandlePromise(); // Promise resolved value!!"
      },
      {
        "language": "javascript",
        "code": "await function () {}; // Syntax error: await is only valid under async function."
      },
      {
        "language": "javascript",
        "code": "const p = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value!!\");\n  }, 3000);\n});\n\n// Let's now compare with some modification:\n\n// 📌 Promise.then/.catch way\nfunction getData() {\n  // JS engine will not wait for promise to be resolved\n  p.then((res) => console.log(res));\n  console.log(\"Hello There!\");\n}\n\ngetData(); // First `Hello There!` would be printed and then after 3 secs 'Promise resolved value!!' will be printed.\n// Above happened as Javascript wait for none, so it will register this promise and take this callback function and register separately then js will move on and execute the following console and later once promise is resolved, following console will be printed.\n\n//❓ Problem: Normally one used to get confused that JS will wait for promise to be resolved before executing following lines.\n\n// 📌 async-wait way:\nasync function handlePromise() {\n  // JS Engine will waiting for promise to resolve.\n  const val = await p;\n  console.log(\"Hello There!\");\n  console.log(val);\n}\nhandlePromise(); // This time `Hello There!` won't be printed immediately instead after 3 secs `Hello There!` will be printed followed by 'Promise resolved value!!'\n// 💡 So basically code was waiting at `await` line to get the promise resolve before moving on to next line.\n\n// Above is the major difference between Promise.then/.catch vs async-await\n\n//🤓 Let's brainstorm more around async-await\nasync function handlePromise() {\n  console.log(\"Hi\");\n  const val = await p;\n  console.log(\"Hello There!\");\n  console.log(val);\n\n  const val2 = await p;\n  console.log(\"Hello There! 2\");\n  console.log(val2);\n}\nhandlePromise();\n// In above code example, will our program wait for 2 time or will it execute parallely.\n//📌 `Hi` printed instantly -> now code will wait for 3 secs -> After 3 secs both promises will be resolved so ('Hello There!' 'Promise resolved value!!' 'Hello There! 2' 'Promise resolved value!!') will get printed immediately.\n\n// Let's create one promise and then resolve two different promise.\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p2!!\");\n  }, 2000);\n});\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n  const val = await p;\n  console.log(\"Hello There!\");\n  console.log(val);\n\n  const val2 = await p2;\n  console.log(\"Hello There! 2\");\n  console.log(val2);\n}\nhandlePromise();\n// 📌 `Hi` printed instantly -> now code will wait for 3 secs -> After 3 secs both promises will be resolved so ('Hello There!' 'Promise resolved value!!' 'Hello There! 2' 'Promise resolved value by p2!!') will get printed immediately. So even though `p2` was resolved after 2 secs it had to wait for `p` to get resolved\n\n// Now let's reverse the order execution of promise and observe response.\nasync function handlePromise() {\n  console.log(\"Hi\");\n  const val = await p2;\n  console.log(\"Hello There!\");\n  console.log(val);\n\n  const val2 = await p;\n  console.log(\"Hello There! 2\");\n  console.log(val2);\n}\nhandlePromise();\n// 📌 `Hi` printed instantly -> now code will wait for 2 secs -> After 2 secs ('Hello There!' 'Promise resolved value by p2!!') will get printed and in the subsequent second i.e. after 3 secs ('Hello There! 2' 'Promise resolved value!!') will get printed"
      },
      {
        "language": "javascript",
        "code": "const p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p1!!\");\n  }, 5000);\n});\n\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p2!!\");\n  }, 10000);\n});\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n  debugger;\n  const val = await p1;\n  console.log(\"Hello There!\");\n  debugger;\n  console.log(val);\n\n  const val2 = await p2;\n  console.log(\"Hello There! 2\");\n  debugger;\n  console.log(val2);\n}\nhandlePromise();\n// When this function is executed, it will go line by line as JS is synchronous single threaded language. Lets observe what is happening under call-stack. Above you can see we have set the break-points.\n\n// call stack flow -> handlePromise() is pushed -> It will log `Hi` to console -> Next it sees we have await where promise is suppose to be resolved -> So will it wait for promise to resolve and block call stack? No -> thus handlePromise() execution get suspended and moved out of call stack -> So when JS sees await keyword it suspend the execution of function till promise is resolved -> So `p1` will get resolved after 5 secs so handlePromise() will be pushed to call-stack again after 5 secs. -> But this time it will start executing from where it had left. -> Now it will log 'Hello There!' and 'Promise resolved value by p1!!' -> then it will check whether `p2` is resolved or not -> It will find since `p2` will take 10 secs to resolve so the same above process will repeat -> execution will be suspended until promise is resolved.\n\n// 📌 Thus JS is not waiting, call stack is not getting blocked.\n\n// Moreover in above scenario what if p1 would be taking 10 secs and p2 5 secs -> even though p2 got resolved earlier but JS is synchronous single threaded language so it will first wait for p1 to be resolved and then will immediately execute all."
      },
      {
        "language": "javascript",
        "code": "const p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p1!!\");\n  }, 10000);\n});\n\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"Promise resolved value by p2!!\");\n  }, 5000);\n});\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n  debugger;\n  const val = await p1;\n  console.log(\"Hello There!\");\n  debugger;\n  console.log(val);\n\n  const val2 = await p2;\n  console.log(\"Hello There! 2\");\n  debugger;\n  console.log(val2);\n}\nhandlePromise();\n\n// Hi will be printed then because of p1 await, it will for 10seconds and print `Promise resolved value by p1!!` followed by `Hello There!` and then instantly `Promise resolved value by p2!!` followed by `Hello There! 2`\n\n// ❓ Why p2 invoked instanly without waiting another 5 seconds?"
      },
      {
        "language": "javascript",
        "code": "function createP1() {\n  return new Promise((resolve) =>\n    setTimeout(() => resolve(\"p1 resolved\"), 10000),\n  );\n}\n\nfunction createP2() {\n  return new Promise((resolve) =>\n    setTimeout(() => resolve(\"p2 resolved\"), 5000),\n  );\n}\n\nasync function handlePromise() {\n  console.log(\"Hi\");\n\n  const val1 = await createP1();\n  console.log(val1);\n\n  const val2 = await createP2();\n  console.log(val2);\n}"
      },
      {
        "language": "javascript",
        "code": "async function handlePromise() {\n  // fetch() => Response Object which as body as Readable stream => Response.json() is also a promise which when resolved => value\n  const data = await fetch(\"https://api.github.com/users/alok722\");\n  const res = await data.json();\n  console.log(res);\n}\nhandlePromise();"
      },
      {
        "language": "javascript",
        "code": "async function handlePromise() {\n  try {\n    const data = await fetch(\"https://api.github.com/users/alok722\");\n    const res = await data.json();\n    console.log(res);\n  } catch (err) {\n    console.log(err);\n  }\n}\nhandlePromise();\n\n// In above whenever any error will occur the execution will move to catch block. One could try above with bad url which will result in error.\n\n// Other way of handling error:\nhandlePromise().catch((err) => console.log(err)); // this will work as handlePromise will return error promise in case of failure."
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does async/await work under the hood with Call Stack?",
        "answer": "`async` functions return a Promise. When `await` is encountered on an unresolved promise, the function execution pauses, its execution context is suspended and removed from Call Stack, allowing thread to run other tasks. When promise resolves, execution resumes."
      }
    ]
  },
  {
    "id": "js-promise-apis",
    "title": "Episode 24 : Promise APIs (all, allSettled, race, any) + Interview Questions 🔥",
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
    "summary": "Complete lecture notes for Episode 24 : Promise APIs (all, allSettled, race, any) + Interview Questions 🔥 with full code and visual diagrams.",
    "keyConcepts": [
      "Promise.all()",
      "Promise.allSettled()",
      "Promise.race()",
      "Promise.any()",
      "Once promise is settled, it means -> got the result. Moreover, settled is broadly divided into two categories:"
    ],
    "detailedContent": "# Episode 24 : Promise APIs (all, allSettled, race, any) + Interview Questions 🔥\n\n###\n\n4 Promise APIs which are majorly used:\n\n- Promise.all()\n- Promise.allSettled()\n- Promise.race()\n- Promise.any()\n\n💡 One simply doesn't use async/await without knowing promises!\n\n### Promise.all()\n\n> A promise is a placeholder for a value that's going to be available sometime later. The promise helps handle asynchronous operations. JavaScript provides a helper function Promise.all(promisesArrayOrIterable) to handle multiple promises at once, in parallel, and get the results in a single aggregate array.\n\nQ: In what situation one could use above api?  \nA: Suppose, you have to make parallel API call and get the result, how one can do? This is where Promise.all can be utilized. It is used to handle multiple promises together.\n\nPromise.all([p1, p2, p3]) -> Lets assume we are making 3 API call to fetch data. Also assume **p1** takes **3 seconds**, **p2** takes **1 second**, **p3** takes **2 seconds**.\n\nIn first scenario let's assume all 3 promises are successful. So Promise.all will take **3secs** and will give promise value of result like [val1, val2, val3]. It will wait for all of them to finish then it will collect the results and give array as output.\n\nWhat if any of the promise gets rejected, for eg: Promise.all([p1, p2, p3]). But this time, p2 get rejected after 1 sec. Thus Promise.all will throw same error as p2 immediately as soon as error happened. It will not wait for other promise to either become success or failure. Moreover, p1 and p2 wont get cancelled as they are already triggered so it may result in success or failure depending upon their fate but Promise.all wont care. So its a situation of or/null.\n\n💡 To conclude, the Promise.all() waits for all the input promises to resolve and returns a new promise that resolves to an array containing the results of the input promises. If one of the input promises is rejected, the Promise.all() method immediately returns a promise that is rejected with an error of the first rejected promise.\n\n### Promise.allSettled()\n\n> Promise.allSettled() method that accepts a list of Promises and returns a new promise that resolves after all the input promises have settled, either resolved or rejected.\n\nPromise.allSettled([p1, p2, p3]) -> Lets assume we are making 3 API call to fetch data. Also assume **p1** takes **3 seconds**, **p2** takes **1 second**, **p3** takes **2 seconds**.\n\nIn first scenario let's assume all 3 promises are successful. So Promise.allSettled will take **3secs** and will give promise value of result like [val1, val2, val3]. It will wait for all of them to finish then it will collect the results and give array as output.\n\nWhat if any of the promise gets rejected, for eg: Promise.all([p1, p2, p3]). But this time, p2 get rejected after 1 sec. Thus Promise.allSettled will still wait for all promises to get settled. So After 3 secs, it will be [val1, err, val3]\n\n💡 Promise.all() -> Fail Fast  \n💡 Promise.allSettled() -> Will wait and provide accumulative result\n\n### Promise.race()\n\n> The Promise.race() static method accepts a list of promises as an iterable object and returns a new promise that fulfills or rejects as soon as there is one promise that fulfills or rejects, with the value or reason from that promise. The name of Promise.race() implies that all the promises race against each other with a single winner, either resolved or rejected.\n\nPromise.race([p1, p2, p3]) -> Lets assume we are making 3 API call to fetch data. Also assume **p1** takes **3 seconds**, **p2** takes **1 second**, **p3** takes **2 seconds**. So as soon as first promise will resolve or reject, it will give the output.\n\nSo in Happy scenario, Promise.race will give (val2) as output after 1sec as p2 got resolved at the earliest. Whereas if it would have been failed Promise.race would have still given output after 1 sec but this time with error.\n\n### Promise.any()\n\n> The Promise.any() method accepts a list of Promise objects as an iterable object. If one of the promises in the iterable object is fulfilled, the Promise.any() returns a single promise that resolves to a value which is the result of the fulfilled promise.\n\nPromise.any([p1, p2, p3]) -> Lets assume we are making 3 API call to fetch data. Also assume **p1** takes **3 seconds**, **p2** takes **1 second**, **p3** takes **2 seconds**. So as soon as first promise will be successful, it will give the output.\n\nIf in above situation what if p2 got rejected, nothing will happen as Promise.any seek for success, so the moment first success will happen that will become the result.\n\n❓ But what if all promises got failed, so the returned result will be aggregated error i.e. [err1, err2, err3].\n\n## Code Examples:\n\n### Promise.all()\n\n```js\n// 📌 First Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P3 Success\");\n  }, 2000);\n});\n\nPromise.all([p1, p2, p3]).then((results) => {\n  console.log(results); // ['P1 Success', 'P2 Success', 'P3 Success'] -> took 3 secs\n});\n```\n\n```js\n// 📌 Second Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P2 Fail\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P3 Success\");\n  }, 2000);\n});\n\nPromise.all([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err)); // throws error after 1 sec i.e. 'P2 Fails'\n```\n\n### Promise.allSettled()\n\n💡This is safest among all Promises API.\n\n```js\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.allSettled([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// Over here, it will wait for all promises to be either settled or rejected and then return,\n/*\n    [\n      {status: 'fulfilled', value: 'P1 Success'},\n      {status: 'fulfilled', value: 'P2 Success'},\n      {status: 'rejected', reason: 'P3 Fail'}\n    ]\n  */\n```\n\n### Promise.race()\n\n```js\n// 📌 First Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.race([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// It will return as soon as first promise is resolved or rejected.\n// In above example O/P: \"P2 Success\"\n```\n\n```js\n// 📌 Second Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.race([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n//After 2 secs O/P: \"P3 Fail\"\n```\n\nNotes:\n\n- Once promise is settled, it means -> got the result. Moreover, settled is broadly divided into two categories:\n\n1. resolve, success, fulfilled\n2. reject, failure, rejected\n\n### Promise.any()\n\n```js\n// 📌 First Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.any([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// It will wait for first settled **success**\n// In above, p3 will settled first, but since it is rejected, so it will wait further so at 3rd second it will print \"P1 Success\"\n```\n\n```js\n// 📌 Second Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P1 Fail\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.any([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// After 5 secs: 'P2 Success'\n```\n\n```js\n// 📌 Third Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P1 Fail\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P2 Fail\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.any([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => {\n    console.error(err);\n    console.error(err.errors); // ['P1 Fail', 'P2 Fail', 'P3 Fail']\n  });\n\n// Since all are rejected, so it will give \"aggregate error\" as output\n// AggregateError: All promises were rejected\n// To get AggregateError array you need to write \"err.errors\"\n```\n\n### Summary\n\nThere are 6 static methods of Promise class:\n\n> Promise.all(promises) – waits for all promises to resolve and returns an array of their results. If any of the given promises rejects, it becomes the error of Promise.all, and all other results are ignored.\n\n> Promise.allSettled(promises) (recently added method) – waits for all promises to settle and returns their results as an array of objects with:\n> status: \"fulfilled\" or \"rejected\"\n> value (if fulfilled) or reason (if rejected).\n\n> Promise.race(promises) – waits for the first promise to settle, and its result/error becomes the outcome.\n\n> Promise.any(promises) (recently added method) – waits for the first promise to fulfill, and its result becomes the outcome. If all of the given promises are rejected, AggregateError becomes the error of Promise.any.\n\n> Promise.resolve(value) – makes a resolved promise with the given value.\n\n> Promise.reject(error) – makes a rejected promise with the given error.\n> Of all these, Promise.all is probably the most common in practice.\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "// 📌 First Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P3 Success\");\n  }, 2000);\n});\n\nPromise.all([p1, p2, p3]).then((results) => {\n  console.log(results); // ['P1 Success', 'P2 Success', 'P3 Success'] -> took 3 secs\n});"
      },
      {
        "language": "javascript",
        "code": "// 📌 Second Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P2 Fail\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P3 Success\");\n  }, 2000);\n});\n\nPromise.all([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err)); // throws error after 1 sec i.e. 'P2 Fails'"
      },
      {
        "language": "javascript",
        "code": "const p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.allSettled([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// Over here, it will wait for all promises to be either settled or rejected and then return,\n/*\n    [\n      {status: 'fulfilled', value: 'P1 Success'},\n      {status: 'fulfilled', value: 'P2 Success'},\n      {status: 'rejected', reason: 'P3 Fail'}\n    ]\n  */"
      },
      {
        "language": "javascript",
        "code": "// 📌 First Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 1000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.race([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// It will return as soon as first promise is resolved or rejected.\n// In above example O/P: \"P2 Success\""
      },
      {
        "language": "javascript",
        "code": "// 📌 Second Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.race([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n//After 2 secs O/P: \"P3 Fail\""
      },
      {
        "language": "javascript",
        "code": "// 📌 First Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P1 Success\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.any([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// It will wait for first settled **success**\n// In above, p3 will settled first, but since it is rejected, so it will wait further so at 3rd second it will print \"P1 Success\""
      },
      {
        "language": "javascript",
        "code": "// 📌 Second Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P1 Fail\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve(\"P2 Success\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.any([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => console.error(err));\n\n// After 5 secs: 'P2 Success'"
      },
      {
        "language": "javascript",
        "code": "// 📌 Third Scenario\n\nconst p1 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P1 Fail\");\n  }, 3000);\n});\nconst p2 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P2 Fail\");\n  }, 5000);\n});\nconst p3 = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    reject(\"P3 Fail\");\n  }, 2000);\n});\n\nPromise.any([p1, p2, p3])\n  .then((results) => console.log(results))\n  .catch((err) => {\n    console.error(err);\n    console.error(err.errors); // ['P1 Fail', 'P2 Fail', 'P3 Fail']\n  });\n\n// Since all are rejected, so it will give \"aggregate error\" as output\n// AggregateError: All promises were rejected\n// To get AggregateError array you need to write \"err.errors\""
      }
    ],
    "interviewQuestions": [
      {
        "question": "What are the differences between Promise.all, Promise.allSettled, Promise.race, and Promise.any?",
        "answer": "- `Promise.all`: Waits for ALL to resolve; fails fast on FIRST rejection.\n- `Promise.allSettled`: Waits for ALL to settle (resolve/reject) and returns status objects.\n- `Promise.race`: Settles with first promise to settle (resolve or reject).\n- `Promise.any`: Returns first FULFILLED promise; rejects with AggregateError if ALL reject."
      }
    ]
  },
  {
    "id": "js-this-keyword",
    "title": "Episode 25 : `this` keyword in JavaScript",
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
    "summary": "Complete lecture notes for Episode 25 : `this` keyword in JavaScript with full code and visual diagrams.",
    "keyConcepts": [
      "Complete breakdown and execution steps for Episode 25 : `this` keyword in JavaScript."
    ],
    "detailedContent": "# Episode 25 : `this` keyword in JavaScript\n\n###\n\n> In JavaScript, the this keyword refers to an object, which object depends on how this is being invoked (used or called).\n\n## `this` in global space\n\nAnything defined globally is said to be in a global space.\n\n```js\nconsole.log(this); // refers to global object i.e. window in case of browser\n// 💡 global object differs based on runtime environment,\n```\n\n## `this` inside a function\n\n```js\nfunction x() {\n  // the below value depends on strict/non-strict mode\n  console.log(this);\n  // in strict mode - undefined\n  // in non-strict mode - refers to global window object\n}\nx();\n// 💡 Notes:\n\n// On the first go feels like `this` keyword in global space and inside function behaves same but in reality it's different.\n\n// The moment you make JS run in strict mode by using: \"use strict\" at the top, `this` keyword inside function returns `undefined` whereas global space will still refers to global window object\n```\n\n`this substitution` -> According to `this` substitution, if the value of `this` keyword is `null/undefined`, it will be replaced by globalObject only in non-strict mode. This is the reason why `this` refers to global window object inside function in non-strict mode.\n\n💡 So to summarize, the value of `this` keyword inside function is `undefined`, but because of `this substitution` in non-strict mode `this` keyword refers to `globalWindowObject` and in strict mode it will still be `undefined`\n\n`this` keyword value depends on how the `function` is called. For eg:  \nIn strict mode:\n\n```js\nx(); // undefined\nwindow.x(); // global window object\n```\n\n## `this` inside a object's method\n\n```js\n// `x` key below is a method as per terminology\nconst obj = {\n  a: 10,\n  x: function () {\n    console.log(this); // {a: 10, x: f()}\n    console.log(this.a); // 10\n  },\n};\nobj.x(); // value of `this` is referring to current object i.e. `obj`\n```\n\n## `call`, `apply` & `bind` methods\n\n> For detail around call, apply and bind method. Refer [here](https://www.youtube.com/watch?v=75W8UPQ5l7k&ab_channel=AkshaySaini).\n\n```js\nconst student = {\n  name: \"Alok\",\n  printName: function () {\n    console.log(this.name);\n  },\n};\nstudent.printName(); // Alok\n\nconst student2 = {\n  name: \"Kajal\",\n};\nstudent2.printName(); // throw error\n\n// ❓ how to re-use printName method from `student` object\nstudent.printName.call(student2); // Kajal\n// Above `call` method is taking the value of `this` keyword\n// So, Inside `printName` method value of `this` is now `student2` object\n\n// So, call, bind and apply is used to set the value of this keyword.\n```\n\n## `this` inside arrow function\n\nArrow function doesn't have their own `this` value, they take the value from enclosing lexical context.\n\n```js\nconst obj = {\n  a: 10,\n  x: () => {\n    console.log(this); // window object\n    // Above the value of `this` won't be obj anymore instead it will be enclosing lexical context i.e. window object in current scenario.\n  },\n};\nobj.x();\n\nconst obj2 = {\n  a: 10,\n  x: function () {\n    const y = () => {\n      console.log(this);\n      // Above the value of `this` will be obj2 as function y's enclosing lexical context is function `x`.\n    };\n    y();\n  },\n};\nobj2.x();\n```\n\n## `this` inside DOM\n\n> It refers to HTML element.\n\n```html\n<button onclick=\"alert(this)\">Click Me</button>\n<!-- [object HTMLButtonElement] Button element -->\n```\n\n\n\nWatch Live On Youtube below:",
    "codeTemplates": [
      {
        "language": "javascript",
        "code": "console.log(this); // refers to global object i.e. window in case of browser\n// 💡 global object differs based on runtime environment,"
      },
      {
        "language": "javascript",
        "code": "function x() {\n  // the below value depends on strict/non-strict mode\n  console.log(this);\n  // in strict mode - undefined\n  // in non-strict mode - refers to global window object\n}\nx();\n// 💡 Notes:\n\n// On the first go feels like `this` keyword in global space and inside function behaves same but in reality it's different.\n\n// The moment you make JS run in strict mode by using: \"use strict\" at the top, `this` keyword inside function returns `undefined` whereas global space will still refers to global window object"
      },
      {
        "language": "javascript",
        "code": "x(); // undefined\nwindow.x(); // global window object"
      },
      {
        "language": "javascript",
        "code": "// `x` key below is a method as per terminology\nconst obj = {\n  a: 10,\n  x: function () {\n    console.log(this); // {a: 10, x: f()}\n    console.log(this.a); // 10\n  },\n};\nobj.x(); // value of `this` is referring to current object i.e. `obj`"
      },
      {
        "language": "javascript",
        "code": "const student = {\n  name: \"Alok\",\n  printName: function () {\n    console.log(this.name);\n  },\n};\nstudent.printName(); // Alok\n\nconst student2 = {\n  name: \"Kajal\",\n};\nstudent2.printName(); // throw error\n\n// ❓ how to re-use printName method from `student` object\nstudent.printName.call(student2); // Kajal\n// Above `call` method is taking the value of `this` keyword\n// So, Inside `printName` method value of `this` is now `student2` object\n\n// So, call, bind and apply is used to set the value of this keyword."
      },
      {
        "language": "javascript",
        "code": "const obj = {\n  a: 10,\n  x: () => {\n    console.log(this); // window object\n    // Above the value of `this` won't be obj anymore instead it will be enclosing lexical context i.e. window object in current scenario.\n  },\n};\nobj.x();\n\nconst obj2 = {\n  a: 10,\n  x: function () {\n    const y = () => {\n      console.log(this);\n      // Above the value of `this` will be obj2 as function y's enclosing lexical context is function `x`.\n    };\n    y();\n  },\n};\nobj2.x();"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How is the value of 'this' determined in JavaScript?",
        "answer": "1) Global scope: `window` (browser) or `global` (Node). 2) Inside function: `window` (strict mode `undefined`). 3) Method call (`obj.fn()`): `obj`. 4) `call`/`apply`/`bind`: explicitly set object. 5) Arrow functions: lexical `this` inherited from enclosing scope."
      }
    ]
  }
];
