import { TopicItem } from '../types';

/**
 * Object-Oriented Programming & Low Level Design Topic Registry
 * Dynamically generated from public/data/oops.json (Single Source of Truth)
 */
export const oopsTopics: TopicItem[] = [
  {
    "id": "oops-classes-objects-fundamentals",
    "title": "Classes, Objects, Instances & Internal State Mechanics",
    "domain": "oops",
    "category": "01 Classes, Objects & Memory Mechanics",
    "difficulty": "Easy",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 3,
    "summary": "Think of a Class as an architectural blueprint of a house. The blueprint itself doesn't shelter anyone. An Object is an actual physical house built from that blueprint. You can build 50 houses (Objects) from 1 blueprint (Class), each having its own interior paint color (Instance variables), but sharing the same municipal water line connection (Static variable).",
    "keyConcepts": [
      "Class vs Object: Blueprint vs Concrete RAM Allocation",
      "Instance Variables: Allocated inside Heap memory per object instantiation",
      "Class/Static Variables: Allocated in Method Area / Metaspace shared across all instances",
      "Instance Methods vs Static Methods: Instance methods receive implicit 'this/self' reference; Static methods operate strictly on class-level data",
      "Constructors & Destructors: Special lifecycle methods executed upon object initialization and garbage collection / memory deallocation"
    ],
    "detailedContent": "### \ud83d\udccc Classes, Objects, Instances & Internal State Mechanics\n\n**What is it?**\nA Class is a user-defined blueprint or template that encapsulates data attributes and behavior methods. An Object (or Instance) is a concrete, dynamically allocated region of memory created according to that blueprint. Instance variables store unique state per object, while Class/Static variables are shared across all instances within a single class loader context.\n\n### \ud83d\udca1 Simple Explanation\nThink of a Class as an architectural blueprint of a house. The blueprint itself doesn't shelter anyone. An Object is an actual physical house built from that blueprint. You can build 50 houses (Objects) from 1 blueprint (Class), each having its own interior paint color (Instance variables), but sharing the same municipal water line connection (Static variable).\n\n> \ud83c\udfe2 Blueprint vs Built Building: The architectural CAD drawing of an apartment complex is the Class. Every physical building constructed in different cities using that blueprint is an Object/Instance. The building's address is stored in instance memory, while the company name on top of every building is a shared static property.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nWithout classes and objects, code would consist of unstructured global variables and procedural functions. Classes provide modularity, namespace isolation, type safety, and state encapsulation, enabling developers to model complex domain entities cleanly.\n\n### \ud83d\udd11 Key Concepts\n- Class vs Object: Blueprint vs Concrete RAM Allocation\n- Instance Variables: Allocated inside Heap memory per object instantiation\n- Class/Static Variables: Allocated in Method Area / Metaspace shared across all instances\n- Instance Methods vs Static Methods: Instance methods receive implicit 'this/self' reference; Static methods operate strictly on class-level data\n- Constructors & Destructors: Special lifecycle methods executed upon object initialization and garbage collection / memory deallocation\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Class Declaration: The compiler parses the class schema and generates bytecode / metadata (VTABLE, field offsets).\n- 2. Instantiation Request: Execution reaches `new BankAccount()` statement.\n- 3. Memory Allocation: The Runtime Memory Manager computes required byte size (header + fields + padding) and allocates memory on the Heap.\n- 4. Zero Initialization: Heap memory fields are wiped to default zero/null values.\n- 5. Constructor Execution: The constructor method runs, initializing instance fields with provided arguments.\n- 6. Reference Binding: The address of the allocated Heap object is stored in a stack variable.\n\n### \ud83d\udcbb Production Code Examples\n#### Classes, Objects, Constructors, Destructors & Static Members in C++ (cpp)\n```cpp\n#include <iostream>\n#include <string>\n\nclass BankAccount {\nprivate:\n    // Instance Variables (allocated in Heap per object instance)\n    std::string accountHolder;\n    double balance;\n\n    // Static Variable (shared across all instances of BankAccount class)\n    static int totalAccounts;\n\npublic:\n    // Constructor\n    BankAccount(const std::string& holder, double initialBalance)\n        : accountHolder(holder), balance(initialBalance) {\n        totalAccounts++;\n        std::cout << \"[CONSTRUCTOR] Account created for \" << accountHolder << \"\\n\";\n    }\n\n    // Destructor\n    ~BankAccount() {\n        std::cout << \"[DESTRUCTOR] Memory freed for account: \" << accountHolder << \"\\n\";\n    }\n\n    // Instance Method\n    void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n            std::cout << \"[\" << accountHolder << \"] Deposited $\" << amount \n                      << \". New Balance: $\" << balance << \"\\n\";\n        }\n    }\n\n    // Const Instance Method (does not modify state)\n    double getBalance() const {\n        return balance;\n    }\n\n    // Static Method\n    static int getTotalAccounts() {\n        return totalAccounts;\n    }\n};\n\n// Initialize Static Member outside class definition\nint BankAccount::totalAccounts = 0;\n\nint main() {\n    // Stack allocation\n    BankAccount acc1(\"Alice\", 1000.0);\n    acc1.deposit(250.0);\n\n    // Dynamic Heap allocation using pointers\n    BankAccount* acc2 = new BankAccount(\"Bob\", 500.0);\n    acc2->deposit(150.0);\n\n    std::cout << \"Total Active Accounts: \" << BankAccount::getTotalAccounts() << \"\\n\";\n\n    // Explicitly free Heap memory to trigger destructor\n    delete acc2;\n    return 0;\n} // acc1 goes out of scope here; automatic stack destructor call\n```\n*Demonstrates C++ Class construction, Heap vs Stack memory allocation, Destructors (`~BankAccount`), Const methods, and Static member initializations.*\n\n#### Classes, Objects, Instance vs Static Variables in Python (python)\n```python\nclass BankAccount:\n    # Class/Static variable shared by all instances\n    bank_name = \"Global Tech Bank\"\n    total_accounts = 0\n\n    def __init__(self, account_holder: str, initial_balance: float):\n        # Instance variables unique to each object\n        self.account_holder = account_holder\n        self._balance = initial_balance\n        BankAccount.total_accounts += 1\n\n    # Instance Method: Operates on instance state\n    def deposit(self, amount: float) -> None:\n        if amount > 0:\n            self._balance += amount\n            print(f\"[{self.account_holder}] Deposited ${amount}. New balance: ${self._balance}\")\n\n    # Static Method: Does not require instance reference\n    @staticmethod\n    def is_valid_account_number(acc_num: str) -> bool:\n        return len(acc_num) == 10 and acc_num.isdigit()\n\n# Object Instantiation\nacc1 = BankAccount(\"Alice\", 1000.0)\nacc2 = BankAccount(\"Bob\", 500.0)\n\nacc1.deposit(250.0)\nprint(\"Total Accounts Created:\", BankAccount.total_accounts)\nprint(\"Is valid:\", BankAccount.is_valid_account_number(\"1234567890\"))\n```\n*Demonstrates Class variable (`bank_name`), Instance variable (`self._balance`), Instance method (`deposit`), and Static utility method (`is_valid_account_number`).*\n",
    "interviewQuestions": [
      {
        "question": "What actually happens when an object is created under the hood?",
        "answer": "1. Class Loading: The JVM/Python/C++ runtime checks if class metadata is loaded into Metaspace/Method Area. If not, it loads it.\n2. Heap Allocation: The allocator reserves contiguous bytes on the Heap for the object (Object Header + Instance Fields + Memory Alignment Padding).\n3. Default Initialization: All instance fields are zeroed out (null, 0, false).\n4. VTABLE Pointer Binding: The Object Header is populated with a pointer to the class's Virtual Method Table (VTABLE) for dynamic dispatch.\n5. Constructor Invocation: Explicit field initializers and constructor body code are executed.\n6. Stack Pointer Assignment: The heap address is assigned to the reference variable on the thread stack."
      }
    ]
  },
  {
    "id": "oops-encapsulation-deep-dive",
    "title": "Encapsulation: State Control, Invariant Protection & Design Rationales",
    "domain": "oops",
    "category": "02 Encapsulation & State Protection Mechanics",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "Do NOT think of Encapsulation merely as 'making variables private'. Encapsulation means an object IS IN COMPLETE CONTROL OF ITS OWN STATE. For example, a `BankAccount` object doesn't let you directly change `balance = -5000`. You MUST call `withdraw(5000)`, where the bank account checks if `balance >= 5000`. If not, it rejects the operation. The object guards its own invariants.",
    "keyConcepts": [
      "Invariant Maintenance: Ensuring object state satisfies business constraints at all times",
      "State Protection vs Data Hiding: Data hiding is a mechanism; controlled state modification is the true goal",
      "Encapsulation vs Abstraction: Encapsulation hides STATE implementation details; Abstraction hides COMPLEXITY/BEHAVIOR details",
      "Achieving Encapsulation without private fields: Functional closures, module scopes, and property getters/setters"
    ],
    "detailedContent": "### \ud83d\udccc Encapsulation: State Control, Invariant Protection & Design Rationales\n\n**What is it?**\nEncapsulation is the bundling of data (attributes) and the methods that operate on that data into a single autonomous unit (class), while restricting direct external access to internal implementation details. It enforces invariant protection so an object's state can never become corrupt or invalid.\n\n### \ud83d\udca1 Simple Explanation\nDo NOT think of Encapsulation merely as 'making variables private'. Encapsulation means an object IS IN COMPLETE CONTROL OF ITS OWN STATE. For example, a `BankAccount` object doesn't let you directly change `balance = -5000`. You MUST call `withdraw(5000)`, where the bank account checks if `balance >= 5000`. If not, it rejects the operation. The object guards its own invariants.\n\n> \ud83c\udfe6 ATM Machine: You cannot open the ATM vault directly and grab cash or modify the balance integer inside the computer. You interact via public buttons/screen (`deposit()`, `withdraw()`). The ATM checks PIN, account limit, and physical bill counts before modifying state.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nDirect public access to fields allows external code to set invalid states (e.g., negative balance, null pointers, out-of-range dates). Encapsulation hides state behind controlled methods, ensuring consistency, validation, and freedom to refactor internal data structures without breaking client code.\n\n### \ud83d\udd11 Key Concepts\n- Invariant Maintenance: Ensuring object state satisfies business constraints at all times\n- State Protection vs Data Hiding: Data hiding is a mechanism; controlled state modification is the true goal\n- Encapsulation vs Abstraction: Encapsulation hides STATE implementation details; Abstraction hides COMPLEXITY/BEHAVIOR details\n- Achieving Encapsulation without private fields: Functional closures, module scopes, and property getters/setters\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Fields are marked as private/protected (`_field` in Python, `#field` in JS, `private:` in C++/TS/Java).\n- 2. Public accessor/mutator methods (or properties) are exposed.\n- 3. Mutators perform strict validation check before state modification.\n- 4. Accessors return immutable copies or defensive copies of mutable objects (e.g., returning const vector reference) to prevent external tampering.\n\n### \ud83d\udcbb Production Code Examples\n#### Encapsulation & Defensive Copying in C++ (cpp)\n```cpp\n#include <iostream>\n#include <vector>\n#include <string>\n#include <stdexcept>\n\nclass BankAccount {\nprivate:\n    // Private member variables (Encapsulated state)\n    std::string accountNumber;\n    double balance;\n    std::vector<std::string> transactionHistory;\n\npublic:\n    BankAccount(const std::string& accNum, double initialBalance) \n        : accountNumber(accNum), balance(initialBalance) {\n        if (initialBalance < 0) {\n            throw std::invalid_argument(\"Initial balance cannot be negative!\");\n        }\n        transactionHistory.push_back(\"Account opened with $\" + std::to_string(initialBalance));\n    }\n\n    // Controlled Mutator with Invariant Validation\n    void withdraw(double amount) {\n        if (amount <= 0) {\n            throw std::invalid_argument(\"Withdrawal amount must be positive!\");\n        }\n        if (amount > balance) {\n            throw std::runtime_error(\"Insufficient funds: Overdraft prohibited!\");\n        }\n        balance -= amount;\n        transactionHistory.push_back(\"Withdrew $\" + std::to_string(amount));\n    }\n\n    // Const Getter (Read-only access)\n    double getBalance() const {\n        return balance;\n    }\n\n    // Defensive Copy / Const Reference Accessor (Prevents external mutation)\n    const std::vector<std::string>& getHistory() const {\n        return transactionHistory;\n    }\n};\n\nint main() {\n    try {\n        BankAccount account(\"ACC-9876\", 1000.0);\n        account.withdraw(300.0);\n        std::cout << \"Current Balance: $\" << account.getBalance() << \"\\n\";\n        // account.balance = -5000.0; // \u274c Compile Error: Field is private!\n    } catch (const std::exception& e) {\n        std::cerr << \"Error: \" << e.what() << \"\\n\";\n    }\n    return 0;\n}\n```\n*Demonstrates private field encapsulation, invariant checks in `withdraw()`, and returning `const std::vector<std::string>&` for defensive read-only access.*\n\n#### Encapsulation with Invariants & Defensive Copying in TypeScript (typescript)\n```typescript\nclass BankAccount {\n  private balance: number;\n  private readonly accountNumber: string;\n  private transactionHistory: string[] = [];\n\n  constructor(accountNumber: string, initialBalance: number) {\n    if (initialBalance < 0) {\n      throw new Error(\"Initial balance cannot be negative\");\n    }\n    this.accountNumber = accountNumber;\n    this.balance = initialBalance;\n    this.transactionHistory.push(`Account opened with $${initialBalance}`);\n  }\n\n  public deposit(amount: number): void {\n    if (amount <= 0) throw new Error(\"Deposit amount must be positive\");\n    this.balance += amount;\n    this.transactionHistory.push(`Deposited $${amount}`);\n  }\n\n  public withdraw(amount: number): void {\n    if (amount <= 0) throw new Error(\"Withdrawal amount must be positive\");\n    if (amount > this.balance) throw new Error(\"Insufficient funds: Overdraft prohibited\");\n    this.balance -= amount;\n    this.transactionHistory.push(`Withdrew $${amount}`);\n  }\n\n  public get Balance(): number {\n    return this.balance;\n  }\n\n  // Defensive Copying: Prevent external mutation of history array\n  public getHistory(): readonly string[] {\n    return [...this.transactionHistory];\n  }\n}\n\nconst account = new BankAccount(\"ACC-9876\", 1000);\naccount.deposit(500);\naccount.withdraw(200);\nconsole.log(\"Current Balance:\", account.Balance);\n```\n*Demonstrates private state protection, validation checks in mutator operations, and returning defensive array copies to prevent external corruption.*\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between Encapsulation and Abstraction?",
        "answer": "\u2022 Encapsulation is about CONTAINMENT and STATE PROTECTION. It hides the internal DATA/STATE of an object behind access controls and ensures invariants cannot be violated.\n\u2022 Abstraction is about SIMPLIFICATION and BEHAVIORAL INTERFACE. It hides the COMPLEXITY of implementation logic so callers interact with a clean, high-level interface (e.g., JDBC `Connection.executeQuery()` hides network packets, database parsing, and IPC)."
      },
      {
        "question": "Can you achieve encapsulation without private variables?",
        "answer": "Yes! In JavaScript/Python before private modifiers existed, encapsulation was achieved using:\n1. Functional Closures: Storing variables in an enclosing function scope accessed only by returned functions.\n2. Properties/Getters & Setters: Overriding attribute access logic to run validation.\n3. Module Scope: Keeping variables local to a file module and exporting only functions."
      }
    ]
  },
  {
    "id": "oops-abstraction-interfaces",
    "title": "Abstraction: Hiding Complexity, Abstract Classes & Interfaces",
    "domain": "oops",
    "category": "03 Abstraction & Contract Interfaces",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "When you drive a car, you press the accelerator pedal to speed up. You do NOT need to know fuel injection timing, spark plug firing sequences, or differential gear ratios. The accelerator pedal is an Abstraction. It exposes a simple `accelerate()` method while hiding the complex engine mechanics underneath.",
    "keyConcepts": [
      "Abstract Class: A partial implementation that can hold state and concrete methods alongside abstract methods",
      "Pure Virtual Function (C++): `virtual void method() = 0;` forcing derived classes to implement it",
      "Interface: A pure contract defining method signatures that conforming classes must implement",
      "Contract-First Design: Programming to an interface rather than a concrete class implementation"
    ],
    "detailedContent": "### \ud83d\udccc Abstraction: Hiding Complexity, Abstract Classes & Interfaces\n\n**What is it?**\nAbstraction is the design practice of hiding low-level implementation details and exposing only essential features to the consumer. It establishes a contract ('WHAT an entity does' vs 'HOW it does it') using Pure Abstract Classes (Pure Interfaces) and Abstract Classes.\n\n### \ud83d\udca1 Simple Explanation\nWhen you drive a car, you press the accelerator pedal to speed up. You do NOT need to know fuel injection timing, spark plug firing sequences, or differential gear ratios. The accelerator pedal is an Abstraction. It exposes a simple `accelerate()` method while hiding the complex engine mechanics underneath.\n\n> \ud83d\ude97 Car Control Interface: Steering wheel, brake, and accelerator pedals are abstract contracts. Whether the car has a V8 gas engine, a electric motor, or a hybrid drivetrain, the driver uses the exact same `start()`, `accelerate()`, `brake()` buttons.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nWithout abstraction, software systems become tightly coupled to specific implementation details. If a database client code directly called low-level socket write operations for MySQL, switching to PostgreSQL or MongoDB would require rewriting the entire codebase. Abstraction provides loose coupling via contracts.\n\n### \ud83d\udd11 Key Concepts\n- Abstract Class: A partial implementation that can hold state and concrete methods alongside abstract methods\n- Pure Virtual Function (C++): `virtual void method() = 0;` forcing derived classes to implement it\n- Interface: A pure contract defining method signatures that conforming classes must implement\n- Contract-First Design: Programming to an interface rather than a concrete class implementation\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Base Contract Definition: Declare an Abstract Class or Interface specifying required methods.\n- 2. Concrete Subclass Implementation: Derived classes provide exact business logic for abstract methods.\n- 3. Polymorphic Consumption: Caller code accepts the abstract type and invokes methods without knowing the concrete class.\n\n### \ud83d\udcbb Production Code Examples\n#### Pure Abstract Classes (Interfaces) in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n\n// Pure Abstract Base Class (Interface Contract in C++)\nclass PaymentProcessor {\npublic:\n    virtual ~PaymentProcessor() = default; // Virtual Destructor mandatory!\n\n    // Pure Virtual Functions (= 0)\n    virtual bool processPayment(double amount) = 0;\n    virtual bool refundPayment(const std::string& txId) = 0;\n};\n\n// Concrete Implementation 1\nclass StripeProcessor : public PaymentProcessor {\npublic:\n    bool processPayment(double amount) override {\n        std::cout << \"[Stripe] Processing credit card payment of $\" << amount << \"\\n\";\n        return true;\n    }\n    bool refundPayment(const std::string& txId) override {\n        std::cout << \"[Stripe] Refunding transaction: \" << txId << \"\\n\";\n        return true;\n    }\n};\n\n// Concrete Implementation 2\nclass PayPalProcessor : public PaymentProcessor {\npublic:\n    bool processPayment(double amount) override {\n        std::cout << \"[PayPal] Redirecting to OAuth... Charged $\" << amount << \"\\n\";\n        return true;\n    }\n    bool refundPayment(const std::string& txId) override {\n        std::cout << \"[PayPal] Refunding PayPal transaction: \" << txId << \"\\n\";\n        return true;\n    }\n};\n\n// Caller depends strictly on Abstraction (Polymorphism via Smart Pointers)\nvoid checkout(std::unique_ptr<PaymentProcessor> processor, double amount) {\n    processor->processPayment(amount);\n}\n\nint main() {\n    checkout(std::make_unique<StripeProcessor>(), 199.99);\n    checkout(std::make_unique<PayPalProcessor>(), 49.50);\n    return 0;\n}\n```\n*Shows C++ pure virtual functions (`= 0`) creating an abstract Interface contract implemented by `StripeProcessor` and `PayPalProcessor`.*\n\n#### Abstract Base Classes (ABC) and Interface Contracts in Python (python)\n```python\nfrom abc import ABC, abstractmethod\n\n# Abstract Class establishing payment contract\nclass PaymentProcessor(ABC):\n    \n    @abstractmethod\n    def process_payment(self, amount: float) -> bool:\n        pass\n\n    @abstractmethod\n    def refund_payment(self, transaction_id: str) -> bool:\n        pass\n\n# Concrete Implementation 1\nclass StripeProcessor(PaymentProcessor):\n    def process_payment(self, amount: float) -> bool:\n        print(f\"Connecting to Stripe API... Charged ${amount}\")\n        return True\n\n    def refund_payment(self, transaction_id: str) -> bool:\n        print(f\"Refunding Stripe transaction {transaction_id}\")\n        return True\n\ndef checkout(processor: PaymentProcessor, cart_total: float):\n    processor.process_payment(cart_total)\n\ncheckout(StripeProcessor(), 199.99)\n```\n*Shows `PaymentProcessor` as an abstract base class. Caller `checkout` depends on the abstraction, allowing dynamic substitution.*\n",
    "interviewQuestions": [
      {
        "question": "What should the user know vs what should the user not need to know in Abstraction?",
        "answer": "The caller should ONLY know:\n1. The method signature (inputs, return type, exceptions thrown).\n2. The behavioral contract (what guarantee the method provides).\nThe caller should NOT need to know:\n1. How data is parsed, stored, or processed internally.\n2. External APIs, network protocols, or caching layers utilized."
      }
    ]
  },
  {
    "id": "oops-inheritance-vs-composition",
    "title": "Inheritance Types & The 'Composition Over Inheritance' Principle",
    "domain": "oops",
    "category": "04 Inheritance & Composition vs Inheritance",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "Never force Inheritance just to reuse code! If you make `Car extends Engine`, you are saying 'A Car IS AN Engine', which is fundamentally wrong. A Car HAS AN Engine. If you use Composition (`Car` contains `Engine` field), you can swap a `V8Engine` for an `ElectricEngine` at runtime without altering the Car class hierarchy.",
    "keyConcepts": [
      "IS-A Relationship (Inheritance): Dog IS-A Animal, SavingsAccount IS-A BankAccount",
      "HAS-A Relationship (Composition): Car HAS-A Engine, House HAS-A Room",
      "Inheritance Types: Single, Multilevel, Hierarchical, Multiple (C++ supports multiple class inheritance, Java/TS via interfaces)",
      "Fragile Base Class Problem: Modifying superclass implementation unintentionally breaks subclass behavior"
    ],
    "detailedContent": "### \ud83d\udccc Inheritance Types & The 'Composition Over Inheritance' Principle\n\n**What is it?**\nInheritance is a mechanism where a derived class (Child) inherits fields and methods from a base class (Parent) establishing an IS-A relationship. Composition is a design practice where a class includes instances of other classes as fields establishing a HAS-A relationship.\n\n### \ud83d\udca1 Simple Explanation\nNever force Inheritance just to reuse code! If you make `Car extends Engine`, you are saying 'A Car IS AN Engine', which is fundamentally wrong. A Car HAS AN Engine. If you use Composition (`Car` contains `Engine` field), you can swap a `V8Engine` for an `ElectricEngine` at runtime without altering the Car class hierarchy.\n\n> \ud83d\ude97 Car & Engine: A Car is NOT an Engine. A Car HAS an Engine. If you inherit (`Car extends Engine`), replacing the engine breaks the entire Car identity. With composition, `Car` holds an `Engine` interface instance, allowing dynamic engine swaps.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nInheritance causes tight coupling, fragile base class problems (modifying parent breaks children), and rigid compile-time hierarchies. Composition promotes loose coupling, dynamic behavioral substitution, and high cohesion.\n\n### \ud83d\udd11 Key Concepts\n- IS-A Relationship (Inheritance): Dog IS-A Animal, SavingsAccount IS-A BankAccount\n- HAS-A Relationship (Composition): Car HAS-A Engine, House HAS-A Room\n- Inheritance Types: Single, Multilevel, Hierarchical, Multiple (C++ supports multiple class inheritance, Java/TS via interfaces)\n- Fragile Base Class Problem: Modifying superclass implementation unintentionally breaks subclass behavior\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Inheritance: Child class inherits parent's memory layout; calls `super()` during constructor initialization.\n- Composition: Container class instantiates or receives component references via Dependency Injection and delegates tasks to them.\n\n### \ud83d\udcbb Production Code Examples\n#### Composition Over Inheritance in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n\n// Abstract Engine Contract\nclass IEngine {\npublic:\n    virtual ~IEngine() = default;\n    virtual void start() = 0;\n};\n\nclass CombustionEngine : public IEngine {\npublic:\n    void start() override {\n        std::cout << \"Combustion V8 Engine roaring to life!\\n\";\n    }\n};\n\nclass ElectricEngine : public IEngine {\npublic:\n    void start() override {\n        std::cout << \"Silent Electric Motor initialized!\\n\";\n    }\n};\n\n// GOOD DESIGN: Car HAS-A Engine (Composition via Smart Pointers)\nclass Car {\nprivate:\n    std::unique_ptr<IEngine> engine; // Composition\n\npublic:\n    Car(std::unique_ptr<IEngine> eng) : engine(std::move(eng)) {}\n\n    void setEngine(std::unique_ptr<IEngine> newEngine) {\n        engine = std::move(newEngine); // Dynamic runtime engine swap!\n    }\n\n    void drive() {\n        engine->start();\n        std::cout << \"Car is cruising on the highway.\\n\";\n    }\n};\n\nint main() {\n    Car tesla(std::make_unique<ElectricEngine>());\n    tesla.drive();\n\n    // Dynamically swap engine behavior at runtime!\n    tesla.setEngine(std::make_unique<CombustionEngine>());\n    tesla.drive();\n    return 0;\n}\n```\n*Shows C++ Composition using `std::unique_ptr<IEngine>` to dynamically inject and swap engine behavior at runtime.*\n\n#### Composition Over Inheritance Comparison in TypeScript (typescript)\n```typescript\ninterface IEngine {\n  start(): void;\n}\n\nclass ElectricEngine implements IEngine {\n  start(): void { console.log(\"Silent Electric Motor initialized!\"); }\n}\n\nclass GoodCar {\n  private engine: IEngine;\n  constructor(engine: IEngine) { this.engine = engine; }\n  public drive(): void {\n    this.engine.start();\n    console.log(\"Car is rolling smoothly on highway.\");\n  }\n}\n\nconst tesla = new GoodCar(new ElectricEngine());\ntesla.drive();\n```\n*Demonstrates why HAS-A composition provides dynamic runtime flexibility while avoiding rigid inheritance coupling.*\n",
    "interviewQuestions": [
      {
        "question": "Why is Composition preferred over Inheritance in LLD interviews?",
        "answer": "1. Dynamic Runtime Flexibility: Composition allows swapping behaviors at runtime (e.g., changing strategy components). Inheritance is fixed at compile-time.\n2. Prevents Fragile Base Class Problem: Changes to component classes don't break the container class as long as the interface contract is maintained.\n3. Avoids Class Explosion: Combining 3 features via inheritance creates 2^3 = 8 subclasses. With composition, you plug 3 independent components together.\n4. Principle of Least Privilege: Inheritance exposes all protected/public parent internals to child classes, violating encapsulation."
      }
    ]
  },
  {
    "id": "oops-polymorphism-dynamic-dispatch",
    "title": "Polymorphism: Overloading vs Overriding & VTABLE Dynamic Dispatch",
    "domain": "oops",
    "category": "05 Polymorphism & Dynamic Dispatch",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "When you have `Animal* a = new Dog(); a->sound();`, compile-time type checking verifies `Animal` has a `sound()` method. But at RUNTIME, the computer looks inside the VPTR pointer inside `a`, resolves its VTABLE, and executes `Dog::sound()` ('Woof!'). This is Runtime Polymorphism.",
    "keyConcepts": [
      "Compile-Time Polymorphism (Method Overloading): Same method name with different parameter lists/signatures within the same class scope",
      "Runtime Polymorphism (Method Overriding): Child class provides a specific implementation for a method declared in superclass",
      "VTABLE (Virtual Method Table): An array of function pointers allocated per class to resolve virtual method calls dynamically",
      "VPTR (Virtual Pointer): A hidden pointer inside every object header pointing to its class's VTABLE"
    ],
    "detailedContent": "### \ud83d\udccc Polymorphism: Overloading vs Overriding & VTABLE Dynamic Dispatch\n\n**What is it?**\nPolymorphism ('many forms') allows objects of different concrete types to be treated as instances of a common base type, while executing type-specific behavior at runtime. Compile-time polymorphism is resolved during compilation (Overloading), while Runtime polymorphism is resolved at execution time (Overriding via Dynamic Dispatch).\n\n### \ud83d\udca1 Simple Explanation\nWhen you have `Animal* a = new Dog(); a->sound();`, compile-time type checking verifies `Animal` has a `sound()` method. But at RUNTIME, the computer looks inside the VPTR pointer inside `a`, resolves its VTABLE, and executes `Dog::sound()` ('Woof!'). This is Runtime Polymorphism.\n\n> \ud83d\udd0a Remote Control Power Button: Pressing 'Power' on a remote control sends a generic signal. If pointed at a TV, it turns on the display. If pointed at an AC unit, it starts the cooling compressor. The same action (`power()`) yields different concrete results based on the receiving object.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nPolymorphism allows writing generic algorithms that operate on abstract contracts (`List`, `Shape`, `Payment`) without knowing concrete implementations, enabling open-ended extensibility.\n\n### \ud83d\udd11 Key Concepts\n- Compile-Time Polymorphism (Method Overloading): Same method name with different parameter lists/signatures within the same class scope\n- Runtime Polymorphism (Method Overriding): Child class provides a specific implementation for a method declared in superclass\n- VTABLE (Virtual Method Table): An array of function pointers allocated per class to resolve virtual method calls dynamically\n- VPTR (Virtual Pointer): A hidden pointer inside every object header pointing to its class's VTABLE\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Compilation Phase: Compiler verifies method signature exists on reference type (`Animal`). Method call compiled as virtual dispatch instruction.\n- 2. Execution Phase: Program dereferences object's VPTR to locate concrete VTABLE in memory.\n- 3. Offset Lookup: The VTABLE index for `sound()` is retrieved.\n- 4. Function Execution: CPU jumps to actual function address stored at that index (`Dog::sound()`).\n\n### \ud83d\udcbb Production Code Examples\n#### VTABLE & Dynamic Dispatch Mechanics in C++ (cpp)\n```cpp\n#include <iostream>\n#include <vector>\n#include <memory>\n\nclass Animal {\npublic:\n    virtual ~Animal() = default; // Virtual Destructor\n    \n    // Virtual method enables VTABLE lookup\n    virtual void sound() const {\n        std::cout << \"Generic animal sound\\n\";\n    }\n};\n\nclass Dog : public Animal {\npublic:\n    void sound() const override {\n        std::cout << \"Woof! Woof!\\n\";\n    }\n};\n\nclass Cat : public Animal {\npublic:\n    void sound() const override {\n        std::cout << \"Meow!\\n\";\n    }\n};\n\nint main() {\n    // Polymorphic pointer vector\n    std::vector<std::unique_ptr<Animal>> zoo;\n    zoo.push_back(std::make_unique<Dog>());\n    zoo.push_back(std::make_unique<Cat>());\n    zoo.push_back(std::make_unique<Animal>());\n\n    for (const auto& animal : zoo) {\n        // Dynamic Dispatch: VPTR -> VTABLE -> concrete sound() method!\n        animal->sound();\n    }\n    return 0;\n}\n```\n*Illustrates C++ virtual methods (`virtual void sound() override`), VTABLE mechanics, and Virtual Destructors.*\n\n#### Runtime Polymorphism & Dynamic Dispatch in Python (python)\n```python\nclass Animal:\n    def sound(self) -> str:\n        return \"Generic animal sound\"\n\nclass Dog(Animal):\n    def sound(self) -> str:\n        return \"Woof! Woof!\"\n\nclass Cat(Animal):\n    def sound(self) -> str:\n        return \"Meow!\"\n\ndef make_animal_speak(animal: Animal):\n    print(f\"[{animal.__class__.__name__}]: {animal.sound()}\")\n\nanimals: list[Animal] = [Dog(), Cat(), Animal()]\nfor a in animals:\n    make_animal_speak(a)\n```\n*Shows `make_animal_speak` taking `Animal` base type while dynamically executing `Dog`, `Cat`, or `Animal` sound implementations at runtime.*\n",
    "interviewQuestions": [
      {
        "question": "Interview Question: Given 'Animal* a = new Dog(); a->sound();', which method executes and why?",
        "answer": "The `Dog::sound()` method executes at runtime. Here is why:\n1. Pointer Type vs Object Type: `a` is a pointer of type `Animal*`, but the actual allocated object in Heap memory is `Dog`.\n2. Dynamic Dispatch: During execution, the runtime engine looks at the VPTR inside the heap header of `Dog`, follows it to the `Dog` VTABLE, and invokes `Dog::sound()`.\n3. Virtual Keyword: In C++, the `virtual` keyword explicitly tells the compiler to generate a VTABLE entry for dynamic late binding."
      }
    ]
  },
  {
    "id": "oops-association-aggregation-composition",
    "title": "Association vs Aggregation vs Composition: Ownership & Lifetimes",
    "domain": "oops",
    "category": "06 Object Relationships & Lifetime Semantics",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "\u2022 Association (Teacher & Student): They know each other, but both exist independently.\n\u2022 Aggregation (Department & Employee): Department contains Employees. If Department is deleted, Employees STILL EXIST in the organization.\n\u2022 Composition (House & Room): House contains Rooms. If the House is demolished, the Rooms ARE DESTROYED along with it.",
    "keyConcepts": [
      "Association: Peer-to-peer relationship (Teacher \u2500\u2500\u2500\u2500\u2500 Student). No ownership.",
      "Aggregation: Weak HAS-A (Department \u25c7\u2500\u2500\u2500\u2500 Employee). Shared lifetime; child can exist independently.",
      "Composition: Strong HAS-A (House \u25c6\u2500\u2500\u2500\u2500 Room). Exclusive ownership; child lifetime bound to parent lifecycle."
    ],
    "detailedContent": "### \ud83d\udccc Association vs Aggregation vs Composition: Ownership & Lifetimes\n\n**What is it?**\nThese three terms define structural relationships between classes. Association is a general peer relationship. Aggregation is a weak HAS-A relationship with independent object lifetimes. Composition is a strong HAS-A relationship where child objects CANNOT exist without the parent container.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 Association (Teacher & Student): They know each other, but both exist independently.\n\u2022 Aggregation (Department & Employee): Department contains Employees. If Department is deleted, Employees STILL EXIST in the organization.\n\u2022 Composition (House & Room): House contains Rooms. If the House is demolished, the Rooms ARE DESTROYED along with it.\n\n> \ud83c\udfe0 House & Rooms (Composition) vs Department & Teachers (Aggregation): Destroying a building destroys its rooms. But dissolving a university department doesn't kill the professors; they simply transfer elsewhere.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nUnderstanding relationship strength is critical for designing database schemas, cascade deletion policies, memory ownership, and lifetime management.\n\n### \ud83d\udd11 Key Concepts\n- Association: Peer-to-peer relationship (Teacher \u2500\u2500\u2500\u2500\u2500 Student). No ownership.\n- Aggregation: Weak HAS-A (Department \u25c7\u2500\u2500\u2500\u2500 Employee). Shared lifetime; child can exist independently.\n- Composition: Strong HAS-A (House \u25c6\u2500\u2500\u2500\u2500 Room). Exclusive ownership; child lifetime bound to parent lifecycle.\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Association: Class A calls methods on Class B passed as method parameter.\n- Aggregation: Class A holds reference/weak_ptr to Class B created outside Class A.\n- Composition: Class A holds `unique_ptr` / instance of Class B created inside constructor. Class B destroyed when Class A deleted.\n\n### \ud83d\udcbb Production Code Examples\n#### Ownership & Smart Pointers in C++ (Aggregation vs Composition) (cpp)\n```cpp\n#include <iostream>\n#include <vector>\n#include <string>\n#include <memory>\n\nclass Room {\npublic:\n    std::string name;\n    Room(const std::string& n) : name(n) {}\n};\n\nclass Employee {\npublic:\n    std::string name;\n    Employee(const std::string& n) : name(n) {}\n};\n\n// Composition: House owns Rooms exclusively via unique_ptr\nclass House {\nprivate:\n    std::vector<std::unique_ptr<Room>> rooms;\npublic:\n    House() {\n        rooms.push_back(std::make_unique<Room>(\"Living Room\"));\n        rooms.push_back(std::make_unique<Room>(\"Master Bedroom\"));\n    }\n    ~House() {\n        std::cout << \"[Composition] House destroyed; all internal Rooms freed!\\n\";\n    }\n};\n\n// Aggregation: Department holds raw pointers/references to external Employees\nclass Department {\nprivate:\n    std::string name;\n    std::vector<Employee*> employees; // Non-owning raw pointers\npublic:\n    Department(const std::string& n, const std::vector<Employee*>& emps)\n        : name(n), employees(emps) {}\n    ~Department() {\n        std::cout << \"[Aggregation] Department destroyed; Employees remain intact!\\n\";\n    }\n};\n\nint main() {\n    Employee e1(\"Alice\");\n    Employee e2(\"Bob\");\n    {\n        Department dept(\"Engineering\", {&e1, &e2});\n    } // dept scope ends\n    std::cout << \"Employee still accessible: \" << e1.name << \"\\n\";\n\n    {\n        House house;\n    } // house scope ends; rooms destroyed automatically\n    return 0;\n}\n```\n*Illustrates C++ `std::unique_ptr` for Composition vs non-owning pointers for Aggregation lifetime semantics.*\n",
    "interviewQuestions": [
      {
        "question": "How do object lifetime semantics differ between Aggregation and Composition?",
        "answer": "In Aggregation, the container holds references/pointers to objects created externally. Destroying the container does NOT destroy the contained objects. In Composition, the container creates and owns the contained objects exclusively (e.g., `std::unique_ptr`). Destroying the container triggers automatic deletion/garbage collection of all child components."
      }
    ]
  },
  {
    "id": "oops-interface-vs-abstract-matrix",
    "title": "Interface vs Abstract Class: Language Differences & Selection Framework",
    "domain": "oops",
    "category": "07 Interface vs Abstract Class Comparison",
    "difficulty": "Easy",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 3,
    "summary": "Use an Abstract Class when classes share identity and common code ('All Animals breathe and have age'). Use an Interface when unrelated classes share capability/role ('CanFly interface can be implemented by Airplane, Bird, and Superhero').",
    "keyConcepts": [
      "Multiple Inheritance: C++ allows multiple class inheritance; Java/TS allow implementing multiple interfaces",
      "State Holding: Abstract classes can declare instance fields; interfaces cannot hold instance state",
      "Role vs Identity: Interfaces model ROLES (CanPlug, Printable, Serializable); Abstract classes model IDENTITY (Animal, Shape, Vehicle)"
    ],
    "detailedContent": "### \ud83d\udccc Interface vs Abstract Class: Language Differences & Selection Framework\n\n**What is it?**\nAn Abstract Class is a blueprint that allows sharing state (fields) and default implementations alongside abstract method contracts. An Interface is a pure architectural contract specifying operations an implementing class must provide without holding instance state.\n\n### \ud83d\udca1 Simple Explanation\nUse an Abstract Class when classes share identity and common code ('All Animals breathe and have age'). Use an Interface when unrelated classes share capability/role ('CanFly interface can be implemented by Airplane, Bird, and Superhero').\n\n> \ud83d\udd0c Electrical Socket (Interface) vs Vehicle Base (Abstract Class): An electrical wall outlet is an Interface\u2014anything with a matching plug can draw power. A Vehicle is an Abstract Class\u2014it provides wheels, chassis frame, and fuel tanks that all sub-vehicles share.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nSelecting between interfaces and abstract classes dictates inheritance flexibility. Since most languages forbid multiple class inheritance, over-using abstract classes restricts future extensions.\n\n### \ud83d\udd11 Key Concepts\n- Multiple Inheritance: C++ allows multiple class inheritance; Java/TS allow implementing multiple interfaces\n- State Holding: Abstract classes can declare instance fields; interfaces cannot hold instance state\n- Role vs Identity: Interfaces model ROLES (CanPlug, Printable, Serializable); Abstract classes model IDENTITY (Animal, Shape, Vehicle)\n\n### \u2699\ufe0f How It Works Step-by-Step\n- C++ uses pure abstract classes (`virtual void method() = 0;`) with no data members to represent pure Interfaces.\n\n### \ud83d\udcbb Production Code Examples\n#### Pure Interface vs Abstract Base Class in C++ (cpp)\n```cpp\n#include <iostream>\n\n// Pure Interface Contract (No member variables, pure virtual methods)\nclass IPrintable {\npublic:\n    virtual ~IPrintable() = default;\n    virtual void print() const = 0;\n};\n\n// Abstract Base Class (Contains shared state & implemented methods)\nclass GraphicObject {\nprotected:\n    int x = 0;\n    int y = 0;\n\npublic:\n    virtual ~GraphicObject() = default;\n    void moveTo(int newX, int newY) {\n        x = newX;\n        y = newY;\n        std::cout << \"Moved object to (\" << x << \", \" << y << \")\\n\";\n    }\n    virtual void draw() const = 0; // Pure virtual method contract\n};\n\n// Concrete Class inheriting state from GraphicObject AND capability from IPrintable\nclass Circle : public GraphicObject, public IPrintable {\nprivate:\n    int radius;\npublic:\n    Circle(int r) : radius(r) {}\n\n    void draw() const override {\n        std::cout << \"Drawing Circle with radius \" << radius << \"\\n\";\n    }\n    void print() const override {\n        std::cout << \"Printing high-resolution Circle vector schematic...\\n\";\n    }\n};\n\nint main() {\n    Circle c(10);\n    c.moveTo(5, 5);\n    c.draw();\n    c.print();\n    return 0;\n}\n```\n*Demonstrates `Circle` inheriting shared state from `GraphicObject` abstract class while implementing capability interface `IPrintable` in C++.*\n",
    "interviewQuestions": [
      {
        "question": "When should you choose an Abstract Class over an Interface?",
        "answer": "Choose an Abstract Class when:\n1. You need to share code (concrete methods) and instance state (fields) across closely related classes.\n2. You expect base class features to evolve over time without breaking all subclasses (via non-abstract method additions).\n3. You are building a framework hierarchy (e.g., Servlet, BaseController).\nChoose an Interface when:\n1. You want to define a contract for unrelated classes (e.g., `Comparable`, `Serializable`).\n2. You need multiple capability inheritance.\n3. You want pure decoupling for mock testing."
      }
    ]
  },
  {
    "id": "oops-access-modifiers-scopes",
    "title": "Access Control Modifiers & Encapsulation Scope Boundaries",
    "domain": "oops",
    "category": "08 Access Modifiers & Encapsulation Boundaries",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "Think of access modifiers as security access badges in an office building:\n\u2022 Public: Front lobby open to everyone.\n\u2022 Protected: Employees & subsidiary staff allowed.\n\u2022 Private: Executive office vault accessible only by the owner.",
    "keyConcepts": [
      "Public: Accessible from anywhere in the application",
      "Protected: Accessible within same package/module and derived child subclasses",
      "Private: Accessible strictly within the declaring class scope",
      "Friend Keyword (C++ Special): Allows designated external classes/functions access to private members"
    ],
    "detailedContent": "### \ud83d\udccc Access Control Modifiers & Encapsulation Scope Boundaries\n\n**What is it?**\nAccess modifiers are keywords (`public`, `private`, `protected`, `default`/package-private) that regulate the visibility and accessibility of classes, fields, constructors, and methods across modules and inheritance boundaries.\n\n### \ud83d\udca1 Simple Explanation\nThink of access modifiers as security access badges in an office building:\n\u2022 Public: Front lobby open to everyone.\n\u2022 Protected: Employees & subsidiary staff allowed.\n\u2022 Private: Executive office vault accessible only by the owner.\n\n> \ud83c\udfe2 Office Building Security: Public = Street entry. Package-Private = Department floor. Protected = Employees + Child companies. Private = Personal locked safe.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nUnrestricted access creates illegal state mutations and exposes private helper methods that callers might wrongfully depend on, preventing internal refactoring.\n\n### \ud83d\udd11 Key Concepts\n- Public: Accessible from anywhere in the application\n- Protected: Accessible within same package/module and derived child subclasses\n- Private: Accessible strictly within the declaring class scope\n- Friend Keyword (C++ Special): Allows designated external classes/functions access to private members\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Compilers check access specifiers during compilation and emit accessibility warnings.\n\n### \ud83d\udcbb Production Code Examples\n#### Access Specifiers & Friend Classes in C++ (cpp)\n```cpp\n#include <iostream>\n#include <string>\n\nclass Person {\npublic:\n    std::string name; // Public access\n\nprotected:\n    int age;          // Accessible in derived subclasses\n\nprivate:\n    std::string ssn;  // Private to Person class\n\n    // Friend Class Granting Explicit Access\n    friend class GovernmentAuditor;\n\npublic:\n    Person(const std::string& n, int a, const std::string& s) \n        : name(n), age(a), ssn(s) {}\n};\n\nclass Student : public Person {\npublic:\n    Student(const std::string& n, int a, const std::string& s)\n        : Person(n, a, s) {}\n\n    void displayInfo() {\n        std::cout << \"Name: \" << name << \", Age: \" << age << \"\\n\";\n        // std::cout << ssn; // \u274c Compile Error! ssn is private to Person.\n    }\n};\n\nclass GovernmentAuditor {\npublic:\n    void auditSSN(const Person& p) {\n        // \u2705 Allowed because GovernmentAuditor is a friend class!\n        std::cout << \"[AUDIT] SSN verified: \" << p.ssn << \"\\n\";\n    }\n};\n```\n*Demonstrates `public:`, `protected:`, `private:` specifiers and C++ `friend class` exception access mechanics.*\n",
    "interviewQuestions": [
      {
        "question": "Are Access Control and Encapsulation the exact same thing?",
        "answer": "No. Access control (private/public keywords) is a LANGUAGE MECHANISM used to enforce access limits. Encapsulation is an ARCHITECTURAL PRINCIPLE of bundling data with logic and guarding invariants. You can use private keywords without achieving good encapsulation if your getters return mutable internal references."
      }
    ]
  },
  {
    "id": "oops-solid-srp-ocp",
    "title": "SOLID: Single Responsibility (SRP) & Open/Closed (OCP) Principles",
    "domain": "oops",
    "category": "09 SOLID Design Principles Deep Dive",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "\u2022 SRP: Don't build a God Class that calculates prices, saves to database, and sends emails.\n\u2022 OCP: If you add a new payment method (Crypto), you should NOT edit existing `switch(type)` statements in core payment code. You should create a new `CryptoPayment` class implementing `PaymentStrategy` interface.",
    "keyConcepts": [
      "SRP: High cohesion by separating business logic, persistence, and notification concerns",
      "OCP: Achieving extensibility via abstraction interfaces and Strategy pattern rather than modification",
      "Refactoring Monolith Classes: Extracting specialized delegate classes"
    ],
    "detailedContent": "### \ud83d\udccc SOLID: Single Responsibility (SRP) & Open/Closed (OCP) Principles\n\n**What is it?**\nSRP dictates that a class should have one, and only one, reason to change. OCP dictates that software entities should be open for extension, but closed for modification.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 SRP: Don't build a God Class that calculates prices, saves to database, and sends emails.\n\u2022 OCP: If you add a new payment method (Crypto), you should NOT edit existing `switch(type)` statements in core payment code. You should create a new `CryptoPayment` class implementing `PaymentStrategy` interface.\n\n> \ud83d\udd2a Swiss Army Knife vs Specialized Tooling (SRP) & Plug-in Architecture (OCP): A single tool trying to be a saw, scissors, knife, and screwdriver breaks easily. Dedicated tools do one job perfectly. VS Code extensions allow adding new language support (OCP) without modifying VS Code's core C++ engine.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nGod classes violate SRP, resulting in high coupling and fragile deployments. Modifying existing code for new features violates OCP, introducing regression bugs.\n\n### \ud83d\udd11 Key Concepts\n- SRP: High cohesion by separating business logic, persistence, and notification concerns\n- OCP: Achieving extensibility via abstraction interfaces and Strategy pattern rather than modification\n- Refactoring Monolith Classes: Extracting specialized delegate classes\n\n### \u2699\ufe0f How It Works Step-by-Step\n- SRP: Split a monolithic class into distinct domain classes.\n- OCP: Use polymorphic interface strategies so new behaviors are added by introducing new concrete classes.\n\n### \ud83d\udcbb Production Code Examples\n#### SRP & OCP Clean Architecture in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n#include <string>\n\n// --- OCP: Strategy Contract ---\nclass DiscountStrategy {\npublic:\n    virtual ~DiscountStrategy() = default;\n    virtual double applyDiscount(double amount) const = 0;\n};\n\nclass VIPDiscount : public DiscountStrategy {\npublic:\n    double applyDiscount(double amount) const override {\n        return amount * 0.80; // 20% discount\n    }\n};\n\nclass RegularDiscount : public DiscountStrategy {\npublic:\n    double applyDiscount(double amount) const override {\n        return amount * 0.95; // 5% discount\n    }\n};\n\n// --- SRP: Single Responsibility Classes ---\nclass OrderRepository {\npublic:\n    void save(const std::string& orderId, double amount) {\n        std::cout << \"[DB] Persisted Order \" << orderId << \" amount $\" << amount << \"\\n\";\n    }\n};\n\nclass NotificationService {\npublic:\n    void notify(const std::string& orderId) {\n        std::cout << \"[Email] Sent order confirmation for \" << orderId << \"\\n\";\n    }\n};\n\nclass OrderProcessor {\nprivate:\n    OrderRepository repo;\n    NotificationService notifier;\n\npublic:\n    void processOrder(const std::string& orderId, double baseAmount, const DiscountStrategy& discount) {\n        double finalAmount = discount.applyDiscount(baseAmount);\n        repo.save(orderId, finalAmount);\n        notifier.notify(orderId);\n    }\n};\n\nint main() {\n    OrderProcessor processor;\n    processor.processOrder(\"ORD-999\", 100.0, VIPDiscount());\n    return 0;\n}\n```\n*Refactors monolithic OrderService into single-responsibility C++ classes and uses strategy interface for OCP extensibility.*\n",
    "interviewQuestions": [
      {
        "question": "How do you identify an SRP violation in code review?",
        "answer": "Look for:\n1. Classes with hundreds/thousands of lines of code.\n2. Multiple unrelated import dependencies.\n3. Frequent merge conflicts caused by developers working on completely different features in the same file.\n4. Class descriptions containing the word 'AND' ('This class calculates taxes AND generates PDFs AND emails users')."
      }
    ]
  },
  {
    "id": "oops-solid-lsp-isp-dip",
    "title": "SOLID: Liskov Substitution (LSP), Interface Segregation (ISP) & Dependency Inversion (DIP)",
    "domain": "oops",
    "category": "09 SOLID Design Principles Deep Dive",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "\u2022 LSP: If `Square extends Rectangle`, setting width = 5 and height = 4 on a Rectangle works, but doing it on a Square violates invariants!\n\u2022 ISP: Don't create a giant `MultiFunctionPrinter` interface. Create separate `IPrinter` and `IScanner` interfaces.\n\u2022 DIP: High-level `CheckoutService` must depend on `PaymentGateway` interface, NOT concrete `PayPalClient` class.",
    "keyConcepts": [
      "LSP: Preserving behavioral pre-conditions and post-conditions in sub-types",
      "ISP: Preferring thin, focused role interfaces over fat monolithic interfaces",
      "DIP: Inverting dependency arrows using interfaces so high-level business logic is decoupled from infrastructure code"
    ],
    "detailedContent": "### \ud83d\udccc SOLID: Liskov Substitution (LSP), Interface Segregation (ISP) & Dependency Inversion (DIP)\n\n**What is it?**\nLSP states that derived classes must be completely substitutable for their base classes without breaking correctness. ISP states that clients should not be forced to depend on interfaces they do not use. DIP states that high-level modules should not depend on low-level modules; both should depend on abstractions.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 LSP: If `Square extends Rectangle`, setting width = 5 and height = 4 on a Rectangle works, but doing it on a Square violates invariants!\n\u2022 ISP: Don't create a giant `MultiFunctionPrinter` interface. Create separate `IPrinter` and `IScanner` interfaces.\n\u2022 DIP: High-level `CheckoutService` must depend on `PaymentGateway` interface, NOT concrete `PayPalClient` class.\n\n> \ud83d\udd0c Wall Power Outlet (DIP) & Specialized Socket Adapters (ISP): Your laptop charger plugs into an abstract wall socket interface (DIP). It doesn't care if power originates from solar, nuclear, or coal generators.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nViolating LSP causes runtime type errors when using polymorphism. Violating ISP forces classes to implement fat useless methods. Violating DIP prevents unit testing with mock objects.\n\n### \ud83d\udd11 Key Concepts\n- LSP: Preserving behavioral pre-conditions and post-conditions in sub-types\n- ISP: Preferring thin, focused role interfaces over fat monolithic interfaces\n- DIP: Inverting dependency arrows using interfaces so high-level business logic is decoupled from infrastructure code\n\n### \u2699\ufe0f How It Works Step-by-Step\n- LSP: Ensure subclasses do not throw unexpected exceptions.\n- ISP: Break fat interfaces into smaller capability interfaces.\n- DIP: Inject interface dependencies via constructors using smart pointers.\n\n### \ud83d\udcbb Production Code Examples\n#### ISP & DIP Architecture in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n#include <string>\n\n// --- ISP: Focused Interfaces ---\nclass IPrinter {\npublic:\n    virtual ~IPrinter() = default;\n    virtual void print(const std::string& doc) = 0;\n};\n\nclass IScanner {\npublic:\n    virtual ~IScanner() = default;\n    virtual std::string scan() = 0;\n};\n\n// --- DIP: High Level Dependency Inversion ---\nclass IMessageSender {\npublic:\n    virtual ~IMessageSender() = default;\n    virtual void sendMessage(const std::string& recipient, const std::string& msg) = 0;\n};\n\nclass TwilioSmsSender : public IMessageSender {\npublic:\n    void sendMessage(const std::string& recipient, const std::string& msg) override {\n        std::cout << \"[Twilio SMS to \" << recipient << \"]: \" << msg << \"\\n\";\n    }\n};\n\nclass NotificationManager {\nprivate:\n    std::shared_ptr<IMessageSender> sender; // DIP: Depends on Abstraction!\n\npublic:\n    NotificationManager(std::shared_ptr<IMessageSender> s) : sender(s) {}\n\n    void notify(const std::string& user, const std::string& msg) {\n        sender->sendMessage(user, msg);\n    }\n};\n\nint main() {\n    auto smsSender = std::make_shared<TwilioSmsSender>();\n    NotificationManager manager(smsSender);\n    manager.notify(\"+123456789\", \"Your verification code is 8842\");\n    return 0;\n}\n```\n*Demonstrates C++ ISP interface separation and DIP using `std::shared_ptr<IMessageSender>` constructor injection.*\n",
    "interviewQuestions": [
      {
        "question": "Explain the Square-Rectangle problem and how it violates LSP.",
        "answer": "In mathematics, a square is a rectangle. But in OOP, if `Square extends Rectangle` with getters/setters for `width` and `height`, altering `square.setWidth(5)` must automatically change `height` to 5 to maintain square invariants. If a client receives a `Rectangle` reference and calls `r.setWidth(5); r.setHeight(4);`, it expects area = 20. But for `Square`, area becomes 16! This violates LSP because `Square` cannot be substituted for `Rectangle` without altering program correctness."
      }
    ]
  },
  {
    "id": "oops-coupling-cohesion-principles",
    "title": "High Cohesion & Low Coupling: Architectural Metrics",
    "domain": "oops",
    "category": "10 Coupling, Cohesion & Modular Architecture",
    "difficulty": "Easy",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 3,
    "summary": "\u2022 High Cohesion: A `UserAuthenticator` class ONLY handles user login, password hashing, and token validation.\n\u2022 Low Coupling: If you switch from MySQL to MongoDB, you only modify the repository layer.",
    "keyConcepts": [
      "Cohesion Levels: Coincidental (Worst) $\\rightarrow$ Functional/High (Best)",
      "Coupling Levels: Content/Tight (Worst) $\\rightarrow$ Loose/Interface-based (Best)",
      "Impact on Testability: Low coupling allows mocking dependencies instantly during unit testing"
    ],
    "detailedContent": "### \ud83d\udccc High Cohesion & Low Coupling: Architectural Metrics\n\n**What is it?**\nCohesion measures how focused and strongly related the responsibilities inside a single module/class are. Coupling measures the degree of direct interdependence between different modules.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 High Cohesion: A `UserAuthenticator` class ONLY handles user login, password hashing, and token validation.\n\u2022 Low Coupling: If you switch from MySQL to MongoDB, you only modify the repository layer.\n\n> \ud83e\udde9 Audio System Components vs Integrated Boombox: A modular stereo (Low Coupling) lets you replace a broken speaker without throwing away the turntable. High Cohesion means the speaker component only handles sound output, not playing CDs.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nLow cohesion produces bloated spaghetti classes where unrelated features leak together. High coupling means changing 1 line in the database module breaks 15 UI screens.\n\n### \ud83d\udd11 Key Concepts\n- Cohesion Levels: Coincidental (Worst) $\\rightarrow$ Functional/High (Best)\n- Coupling Levels: Content/Tight (Worst) $\\rightarrow$ Loose/Interface-based (Best)\n- Impact on Testability: Low coupling allows mocking dependencies instantly during unit testing\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Achieve High Cohesion by grouping tightly related methods in dedicated classes.\n- Achieve Low Coupling by communicating exclusively through interfaces and dependency injection.\n\n### \ud83d\udcbb Production Code Examples\n#### High Cohesion & Low Coupling in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n#include <string>\n\n// High Cohesion: Password hashing responsibility\nclass PasswordHasher {\npublic:\n    std::string hashPassword(const std::string& raw) {\n        return \"HASH_\" + raw + \"_SALT\";\n    }\n};\n\n// Low Coupling: Interface for persistence\nclass IUserRepository {\npublic:\n    virtual ~IUserRepository() = default;\n    virtual void save(const std::string& username, const std::string& hash) = 0;\n};\n\nclass MySQLUserRepository : public IUserRepository {\npublic:\n    void save(const std::string& username, const std::string& hash) override {\n        std::cout << \"[MySQL] Inserted user \" << username << \" with hash \" << hash << \"\\n\";\n    }\n};\n\nclass RegistrationService {\nprivate:\n    PasswordHasher hasher;\n    std::shared_ptr<IUserRepository> repo; // Loose Coupling!\n\npublic:\n    RegistrationService(std::shared_ptr<IUserRepository> r) : repo(r) {}\n\n    void registerUser(const std::string& user, const std::string& pass) {\n        std::string hashed = hasher.hashPassword(pass);\n        repo->save(user, hashed);\n    }\n};\n\nint main() {\n    auto repo = std::make_shared<MySQLUserRepository>();\n    RegistrationService service(repo);\n    service.registerUser(\"john_doe\", \"my_secret_pass\");\n    return 0;\n}\n```\n*Demonstrates high cohesion and low coupling in C++ using interface abstractions and smart pointer dependencies.*\n",
    "interviewQuestions": [
      {
        "question": "Why is 'High Cohesion + Low Coupling' desirable in system design?",
        "answer": "1. Maintainability: Changes to one module remain isolated, minimizing regression risk.\n2. Parallel Development: Multiple developers can work on decoupled modules simultaneously without code conflicts.\n3. Testability: Modules can be tested in isolation using mock dependencies.\n4. Reusability: Highly cohesive components can be reused across different projects without pulling in unnecessary baggage."
      }
    ]
  },
  {
    "id": "oops-dependency-injection-ioc",
    "title": "Dependency Injection (DI) & Inversion of Control (IoC) Frameworks",
    "domain": "oops",
    "category": "11 Dependency Injection & Inversion of Control (IoC)",
    "difficulty": "Medium",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 4,
    "summary": "Instead of a car building its own engine inside its constructor (`this.engine = new V8Engine()`), the car is delivered an engine through its constructor (`constructor(engine: IEngine)`). The caller or IoC container controls which engine is injected.",
    "keyConcepts": [
      "Hardcoded Dependency: `class Service { db = new MySQL(); }` (Tight Coupling)",
      "Constructor Injection: Dependencies supplied via constructor (Recommended)",
      "Setter Injection: Dependencies supplied via setter methods (Optional dependencies)",
      "IoC Container: Framework component that automatically instantiates, wires, and manages object lifecycles"
    ],
    "detailedContent": "### \ud83d\udccc Dependency Injection (DI) & Inversion of Control (IoC) Frameworks\n\n**What is it?**\nInversion of Control (IoC) is a design paradigm where control over object creation and lifecycle is inverted from the class itself to an external framework/container. Dependency Injection (DI) is a concrete pattern implementing IoC, where dependencies are supplied (injected) into a object rather than created internally using `new`.\n\n### \ud83d\udca1 Simple Explanation\nInstead of a car building its own engine inside its constructor (`this.engine = new V8Engine()`), the car is delivered an engine through its constructor (`constructor(engine: IEngine)`). The caller or IoC container controls which engine is injected.\n\n> \ud83d\udd0c Wall Socket Power Supply: Your laptop doesn't build an internal electrical generator. It requests power via a power cable dependency injected into the wall socket.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nHardcoding `new Database()` inside business logic makes unit testing impossible, couples code to specific drivers, and prevents configuration switches.\n\n### \ud83d\udd11 Key Concepts\n- Hardcoded Dependency: `class Service { db = new MySQL(); }` (Tight Coupling)\n- Constructor Injection: Dependencies supplied via constructor (Recommended)\n- Setter Injection: Dependencies supplied via setter methods (Optional dependencies)\n- IoC Container: Framework component that automatically instantiates, wires, and manages object lifecycles\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Registration: Classes register their interface implementation mappings in IoC container.\n- 2. Resolution: IoC container inspects constructor parameters and recursively creates required dependency instances.\n\n### \ud83d\udcbb Production Code Examples\n#### Constructor Dependency Injection & Mock Driver in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n#include <vector>\n#include <string>\n\nclass IDatabaseDriver {\npublic:\n    virtual ~IDatabaseDriver() = default;\n    virtual std::vector<std::string> query(const std::string& sql) = 0;\n};\n\nclass PostgresDriver : public IDatabaseDriver {\npublic:\n    std::vector<std::string> query(const std::string& sql) override {\n        std::cout << \"[PostgreSQL Executing]: \" << sql << \"\\n\";\n        return {\"Alice\", \"Bob\"};\n    }\n};\n\nclass MockDatabaseDriver : public IDatabaseDriver {\npublic:\n    std::vector<std::string> query(const std::string& sql) override {\n        return {\"Mocked_Test_User_1\", \"Mocked_Test_User_2\"};\n    }\n};\n\nclass UserService {\nprivate:\n    std::shared_ptr<IDatabaseDriver> db; // Constructor Dependency Injection!\n\npublic:\n    UserService(std::shared_ptr<IDatabaseDriver> driver) : db(driver) {}\n\n    void printUsers() {\n        auto users = db->query(\"SELECT name FROM users\");\n        for (const auto& u : users) {\n            std::cout << \"User: \" << u << \"\\n\";\n        }\n    }\n};\n\nint main() {\n    // Production Injection\n    auto prodService = UserService(std::make_shared<PostgresDriver>());\n    prodService.printUsers();\n\n    // Test Injection (Zero DB infrastructure required!)\n    auto testService = UserService(std::make_shared<MockDatabaseDriver>());\n    testService.printUsers();\n    return 0;\n}\n```\n*Demonstrates C++ Constructor DI allowing instant switching between real `PostgresDriver` and `MockDatabaseDriver`.*\n",
    "interviewQuestions": [
      {
        "question": "What is the relationship between IoC and Dependency Injection?",
        "answer": "Inversion of Control (IoC) is the overarching ARCHITECTURAL PRINCIPLE of delegating control (e.g., flow of control, object creation, event handling) to an external framework. Dependency Injection (DI) is a specific PATTERN used to realize IoC by passing dependent objects to a client instead of letting the client create them."
      }
    ]
  },
  {
    "id": "oops-creational-patterns",
    "title": "Creational Patterns: Singleton, Factory Method, Abstract Factory & Builder",
    "domain": "oops",
    "category": "12 Gang of Four (GoF) Design Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "\u2022 Singleton: Ensures a class has only ONE global instance (Meyer's Singleton in C++).\n\u2022 Factory Method: Delegating object instantiation to subclasses based on input parameters.\n\u2022 Builder: Constructing complex objects step-by-step with clean fluent syntax.",
    "keyConcepts": [
      "Singleton Pattern: Meyer's Singleton using static local variable (Thread-Safe in C++11)",
      "Factory Pattern: Hiding concrete class instantiations behind a creation factory method",
      "Builder Pattern: Solving telescoping constructor anti-pattern"
    ],
    "detailedContent": "### \ud83d\udccc Creational Patterns: Singleton, Factory Method, Abstract Factory & Builder\n\n**What is it?**\nCreational patterns abstract the object instantiation process, making system creation independent of how objects are composed and initialized.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 Singleton: Ensures a class has only ONE global instance (Meyer's Singleton in C++).\n\u2022 Factory Method: Delegating object instantiation to subclasses based on input parameters.\n\u2022 Builder: Constructing complex objects step-by-step with clean fluent syntax.\n\n> \ud83c\udfed Custom Car Assembly Line (Builder) & Single Government Mint (Singleton): There is only 1 Central Reserve Bank issuing currency (Singleton). A custom car factory builds a vehicle by adding optional sunroof, leather seats, and turbo engine step-by-step (Builder).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nDirect `new` calls scattered throughout code lead to duplication, complex initialization logic leaking everywhere, and difficulty managing shared instance lifecycles.\n\n### \ud83d\udd11 Key Concepts\n- Singleton Pattern: Meyer's Singleton using static local variable (Thread-Safe in C++11)\n- Factory Pattern: Hiding concrete class instantiations behind a creation factory method\n- Builder Pattern: Solving telescoping constructor anti-pattern\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Singleton: C++11 guarantees thread-safe initialization of static local variables.\n\n### \ud83d\udcbb Production Code Examples\n#### Thread-Safe Meyer's Singleton & Builder Pattern in C++ (cpp)\n```cpp\n#include <iostream>\n#include <string>\n#include <memory>\n\n// --- 1. Thread-Safe Meyer's Singleton in C++ ---\nclass DatabaseConnectionPool {\nprivate:\n    DatabaseConnectionPool() {\n        std::cout << \"[Singleton] Initialized expensive DB Pool!\\n\";\n    }\n\npublic:\n    DatabaseConnectionPool(const DatabaseConnectionPool&) = delete;\n    DatabaseConnectionPool& operator=(const DatabaseConnectionPool&) = delete;\n\n    static DatabaseConnectionPool& getInstance() {\n        // C++11 guarantees thread-safe lazy initialization of static local variable!\n        static DatabaseConnectionPool instance;\n        return instance;\n    }\n\n    void query(const std::string& sql) {\n        std::cout << \"Executing: \" << sql << \"\\n\";\n    }\n};\n\n// --- 2. Builder Pattern in C++ ---\nclass HTTPRequest {\npublic:\n    std::string url;\n    std::string method;\n    std::string body;\n\n    class Builder {\n    private:\n        HTTPRequest request;\n    public:\n        Builder(const std::string& u) {\n            request.url = u;\n            request.method = \"GET\";\n        }\n        Builder& setMethod(const std::string& m) {\n            request.method = m;\n            return *this;\n        }\n        Builder& setBody(const std::string& b) {\n            request.body = b;\n            return *this;\n        }\n        HTTPRequest build() {\n            return request;\n        }\n    };\n};\n\nint main() {\n    DatabaseConnectionPool::getInstance().query(\"SELECT 1\");\n\n    HTTPRequest req = HTTPRequest::Builder(\"https://api.tech.com\")\n                        .setMethod(\"POST\")\n                        .setBody(\"{\\\"key\\\": \\\"value\\\"}\")\n                        .build();\n    std::cout << \"Built HTTP \" << req.method << \" request to \" << req.url << \"\\n\";\n    return 0;\n}\n```\n*Demonstrates C++11 thread-safe Meyer's Singleton and chainable Builder pattern.*\n",
    "interviewQuestions": [
      {
        "question": "Why is the Telescoping Constructor considered an anti-pattern and how does Builder fix it?",
        "answer": "Telescoping Constructor occurs when a class has multiple constructors with 2, 3, 4, 5+ parameters where many are optional. The Builder pattern solves this by providing named chainable setter methods, improving readability and safety."
      }
    ]
  },
  {
    "id": "oops-structural-patterns",
    "title": "Structural Patterns: Adapter, Decorator, Facade & Proxy",
    "domain": "oops",
    "category": "12 Gang of Four (GoF) Design Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "\u2022 Adapter: Translates one incompatible interface into another.\n\u2022 Decorator: Dynamically adds new functionality to an object at runtime.\n\u2022 Facade: Provides a simple unified interface to a complex subsystem.\n\u2022 Proxy: Controls access to an object by acting as a placeholder or gatekeeper.",
    "keyConcepts": [
      "Adapter: Wrapping incompatible class inside target interface",
      "Decorator: Wrapping component class inside decorator matching same interface to chain behavior",
      "Facade: Single entry point wrapping complex subsystem dependencies",
      "Proxy: Intercepting calls for authentication, lazy loading, or caching"
    ],
    "detailedContent": "### \ud83d\udccc Structural Patterns: Adapter, Decorator, Facade & Proxy\n\n**What is it?**\nStructural patterns explain how to assemble objects and classes into larger structures while keeping these structures flexible and efficient.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 Adapter: Translates one incompatible interface into another.\n\u2022 Decorator: Dynamically adds new functionality to an object at runtime.\n\u2022 Facade: Provides a simple unified interface to a complex subsystem.\n\u2022 Proxy: Controls access to an object by acting as a placeholder or gatekeeper.\n\n> \ud83d\udd0c Travel Adapter (Adapter), Coffee Toppings (Decorator) & Smart Home Remote (Facade): An adapter lets an iPhone charger plug into a UK socket. Adding milk and syrup decorates a plain espresso.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nIncompatible legacy interfaces, rigid subclassing for extra features, and complex multi-class subsystems create chaos without structural pattern wrappers.\n\n### \ud83d\udd11 Key Concepts\n- Adapter: Wrapping incompatible class inside target interface\n- Decorator: Wrapping component class inside decorator matching same interface to chain behavior\n- Facade: Single entry point wrapping complex subsystem dependencies\n- Proxy: Intercepting calls for authentication, lazy loading, or caching\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Decorator: `BaseCoffee` $\\rightarrow$ `MilkDecorator(coffee)` $\\rightarrow$ `SugarDecorator(milkCoffee)`.\n\n### \ud83d\udcbb Production Code Examples\n#### Decorator Pattern in C++ using Smart Pointers (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n#include <string>\n\nclass IBeverage {\npublic:\n    virtual ~IBeverage() = default;\n    virtual std::string getDescription() const = 0;\n    virtual double getCost() const = 0;\n};\n\nclass Espresso : public IBeverage {\npublic:\n    std::string getDescription() const override { return \"Espresso\"; }\n    double getCost() const override { return 2.00; }\n};\n\n// Abstract Decorator\nclass BeverageDecorator : public IBeverage {\nprotected:\n    std::unique_ptr<IBeverage> beverage;\npublic:\n    BeverageDecorator(std::unique_ptr<IBeverage> b) : beverage(std::move(b)) {}\n};\n\nclass MilkDecorator : public BeverageDecorator {\npublic:\n    MilkDecorator(std::unique_ptr<IBeverage> b) : BeverageDecorator(std::move(b)) {}\n    std::string getDescription() const override {\n        return beverage->getDescription() + \", Milk\";\n    }\n    double getCost() const override {\n        return beverage->getCost() + 0.50;\n    }\n};\n\nint main() {\n    std::unique_ptr<IBeverage> myCoffee = std::make_unique<Espresso>();\n    myCoffee = std::make_unique<MilkDecorator>(std::move(myCoffee));\n\n    std::cout << myCoffee->getDescription() << \" = $\" << myCoffee->getCost() << \"\\n\";\n    return 0;\n}\n```\n*Shows Decorator pattern dynamically layering behaviors using `std::unique_ptr` in C++.*\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between Decorator and Proxy patterns since both wrap an object?",
        "answer": "\u2022 Decorator pattern wraps an object to DYNAMICALLY ADD NEW RESPONSIBILITIES/BEHAVIOR.\n\u2022 Proxy pattern wraps an object to CONTROL ACCESS, perform lazy initialization, check permissions, or manage caching."
      }
    ]
  },
  {
    "id": "oops-behavioral-patterns",
    "title": "Behavioral Patterns: Strategy, Observer, Command & State",
    "domain": "oops",
    "category": "12 Gang of Four (GoF) Design Patterns",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "\u2022 Strategy: Replaces ugly nested `if-else` / `switch` statements by encapsulating interchangeable algorithms into separate classes.\n\u2022 Observer: Defines a 1-to-N subscription mechanism to notify multiple objects whenever a state change occurs.\n\u2022 State: Allows an object to alter its behavior when its internal state changes.",
    "keyConcepts": [
      "Strategy: Replacing conditional algorithms with injected polymorphic strategy classes",
      "Observer: Subject maintains subscriber list and executes `notify()` loop upon event",
      "State Pattern: Encapsulating state-specific behavior into concrete State classes"
    ],
    "detailedContent": "### \ud83d\udccc Behavioral Patterns: Strategy, Observer, Command & State\n\n**What is it?**\nBehavioral patterns focus on algorithms, assignment of responsibilities between objects, and communication patterns.\n\n### \ud83d\udca1 Simple Explanation\n\u2022 Strategy: Replaces ugly nested `if-else` / `switch` statements by encapsulating interchangeable algorithms into separate classes.\n\u2022 Observer: Defines a 1-to-N subscription mechanism to notify multiple objects whenever a state change occurs.\n\u2022 State: Allows an object to alter its behavior when its internal state changes.\n\n> \ud83d\uddfa\ufe0f Google Maps Navigation (Strategy) & YouTube Channel Notifications (Observer): Google Maps lets you choose Walking, Driving, or Transit route algorithms (Strategy). Subscribing to a YouTube channel notifies all subscribers when a new video is published (Observer).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nLarge `switch-case` blocks violate OCP. Polling objects for state changes wastes CPU.\n\n### \ud83d\udd11 Key Concepts\n- Strategy: Replacing conditional algorithms with injected polymorphic strategy classes\n- Observer: Subject maintains subscriber list and executes `notify()` loop upon event\n- State Pattern: Encapsulating state-specific behavior into concrete State classes\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Strategy: Context object holds `Strategy` interface pointer.\n\n### \ud83d\udcbb Production Code Examples\n#### Strategy Pattern Replacing Ugly Conditional Logic in C++ (cpp)\n```cpp\n#include <iostream>\n#include <memory>\n#include <string>\n\nclass RouteStrategy {\npublic:\n    virtual ~RouteStrategy() = default;\n    virtual std::string buildRoute(const std::string& src, const std::string& dest) const = 0;\n};\n\nclass DrivingStrategy : public RouteStrategy {\npublic:\n    std::string buildRoute(const std::string& src, const std::string& dest) const override {\n        return \"Fastest Highway route from \" + src + \" to \" + dest;\n    }\n};\n\nclass WalkingStrategy : public RouteStrategy {\npublic:\n    std::string buildRoute(const std::string& src, const std::string& dest) const override {\n        return \"Pedestrian park walkway route from \" + src + \" to \" + dest;\n    }\n};\n\nclass Navigator {\nprivate:\n    std::unique_ptr<RouteStrategy> strategy;\npublic:\n    Navigator(std::unique_ptr<RouteStrategy> s) : strategy(std::move(s)) {}\n    void setStrategy(std::unique_ptr<RouteStrategy> s) { strategy = std::move(s); }\n    void navigate(const std::string& src, const std::string& dest) {\n        std::cout << strategy->buildRoute(src, dest) << \"\\n\";\n    }\n};\n\nint main() {\n    Navigator nav(std::make_unique<DrivingStrategy>());\n    nav.navigate(\"A\", \"B\");\n    nav.setStrategy(std::make_unique<WalkingStrategy>());\n    nav.navigate(\"A\", \"B\");\n    return 0;\n}\n```\n*Demonstrates C++ Strategy pattern replacing ugly conditional branching with polymorphic strategy objects.*\n",
    "interviewQuestions": [
      {
        "question": "How does the Strategy pattern help replace ugly conditional logic?",
        "answer": "Instead of writing a 500-line method full of `if (type == A) ... else if (type == B) ...`, Strategy extracts each branch into a separate class implementing a common interface. The caller simply injects the appropriate strategy instance."
      }
    ]
  },
  {
    "id": "oops-lld-process-framework",
    "title": "The Repeatable 8-Step LLD Interview Framework",
    "domain": "oops",
    "category": "13 Low-Level Design (LLD) Repeatable Framework & Solutions",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Do NOT jump straight into coding! Follow the 8-step process: 1. Clarify Requirements $\\rightarrow$ 2. Identify Core Entities $\\rightarrow$ 3. Define Responsibilities $\\rightarrow$ 4. Map Relationships (UML) $\\rightarrow$ 5. Design Interfaces $\\rightarrow$ 6. Write Class Diagrams $\\rightarrow$ 7. Apply Design Patterns $\\rightarrow$ 8. Validate against SOLID principles.",
    "keyConcepts": [
      "Step 1: Functional & Non-Functional Requirements Definition",
      "Step 2: Core Domain Noun Extraction (Entities)",
      "Step 3: Verb Extraction (Actions & Responsibilities)",
      "Step 4: Relationship Mapping (1:1, 1:N, M:N, Inheritance vs Composition)",
      "Step 5: Contract & Interface Formulation",
      "Step 6: Class Structure & Enumeration Definitions",
      "Step 7: Design Pattern Integration (Strategy, Factory, Observer, Singleton)",
      "Step 8: SOLID Audit & Code Implementation"
    ],
    "detailedContent": "### \ud83d\udccc The Repeatable 8-Step LLD Interview Framework\n\n**What is it?**\nA structured, battle-tested 8-step methodology to solve any Low-Level System Design (LLD) interview question cleanly within 45 minutes.\n\n### \ud83d\udca1 Simple Explanation\nDo NOT jump straight into coding! Follow the 8-step process: 1. Clarify Requirements $\\rightarrow$ 2. Identify Core Entities $\\rightarrow$ 3. Define Responsibilities $\\rightarrow$ 4. Map Relationships (UML) $\\rightarrow$ 5. Design Interfaces $\\rightarrow$ 6. Write Class Diagrams $\\rightarrow$ 7. Apply Design Patterns $\\rightarrow$ 8. Validate against SOLID principles.\n\n> \ud83c\udfd7\ufe0f Architect Building Blueprint: An architect clarifies client room needs, sketches floor plans, defines electrical/plumbing interfaces, reviews structural building codes, and then hands blueprints to builders.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nJumping straight to code in an interview leads to missed edge cases, monolithic messy classes, poor concurrency handling, and failed interviews.\n\n### \ud83d\udd11 Key Concepts\n- Step 1: Functional & Non-Functional Requirements Definition\n- Step 2: Core Domain Noun Extraction (Entities)\n- Step 3: Verb Extraction (Actions & Responsibilities)\n- Step 4: Relationship Mapping (1:1, 1:N, M:N, Inheritance vs Composition)\n- Step 5: Contract & Interface Formulation\n- Step 6: Class Structure & Enumeration Definitions\n- Step 7: Design Pattern Integration (Strategy, Factory, Observer, Singleton)\n- Step 8: SOLID Audit & Code Implementation\n\n### \u2699\ufe0f How It Works Step-by-Step\n- Systematically progress through all 8 steps during an LLD interview while communicating choices out loud.\n\n### \ud83d\udcbb Production Code Examples\n#### 8-Step LLD Framework Flowchart (cpp)\n```cpp\n/*\n  LLD REPEATABLE INTERVIEW WORKFLOW:\n  ====================================\n  [1. Clarify Requirements] (e.g., Parking Lot: Hourly rates, Vehicles: Car/Bike/Truck, Payment: Cash/Card)\n         \u2193\n  [2. Identify Core Entities] (ParkingLot, ParkingFloor, ParkingSpot, Ticket, Vehicle, Payment)\n         \u2193\n  [3. Map Relationships] (ParkingLot HAS-MANY Floors; Floor HAS-MANY Spots; Spot HAS-A Vehicle)\n         \u2193\n  [4. Design Interfaces] (IParkingStrategy, IPaymentStrategy)\n         \u2193\n  [5. Apply Patterns] (Factory for Vehicles, Strategy for Spot Allocation & Fee Calculation, Singleton for Lot Manager)\n         \u2193\n  [6. Implement Code] (Write clean C++/Java/Python code with thread locks)\n*/\n```\n*Outlines the exact structural sequence to execute during a live 45-minute LLD interview.*\n",
    "interviewQuestions": [
      {
        "question": "What are the common pitfalls candidates face in LLD interviews?",
        "answer": "1. Writing code immediately without clarifying requirements.\n2. Over-engineering (applying 10 design patterns when 1 simple interface suffices).\n3. Neglecting concurrency / thread safety (e.g., two cars booking the same parking spot simultaneously).\n4. Violating SOLID principles."
      }
    ]
  },
  {
    "id": "oops-lld-problem-parking-lot",
    "title": "LLD Case Study 1: Parking Lot System Design",
    "domain": "oops",
    "category": "13 Low-Level Design (LLD) Repeatable Framework & Solutions",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Design a parking lot system that handles Cars, Bikes, and Trucks. Supports multiple floors, assigns nearest available spot using Strategy pattern, issues tickets, and calculates fee based on duration upon exit.",
    "keyConcepts": [
      "Vehicle Hierarchy: Car, Motorcycle, Truck",
      "Spot Allocation Strategy: NearestSpotStrategy, FloorFirstStrategy",
      "Fee Calculation Strategy: HourlyFeeStrategy, VehicleTypeFeeStrategy",
      "Thread Safety: Synchronized spot allocation using std::mutex to prevent race conditions"
    ],
    "detailedContent": "### \ud83d\udccc LLD Case Study 1: Parking Lot System Design\n\n**What is it?**\nComplete Low-Level Design for a multi-floor, multi-vehicle-type Parking Lot system supporting dynamic spot allocation strategies and fee calculations.\n\n### \ud83d\udca1 Simple Explanation\nDesign a parking lot system that handles Cars, Bikes, and Trucks. Supports multiple floors, assigns nearest available spot using Strategy pattern, issues tickets, and calculates fee based on duration upon exit.\n\n> \ud83c\udd7f\ufe0f Airport Multi-Level Parking Garage: Displays real-time spot availability per floor, directs drivers to appropriate spots (Compact, Large, EV), scans ticket at exit gate, charges hourly rate, and opens barrier gate.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nParking Lot is the #1 most frequently asked LLD interview question at Amazon, Google, Uber, and Microsoft. It tests object modeling, enumerations, strategy selection, and concurrency.\n\n### \ud83d\udd11 Key Concepts\n- Vehicle Hierarchy: Car, Motorcycle, Truck\n- Spot Allocation Strategy: NearestSpotStrategy, FloorFirstStrategy\n- Fee Calculation Strategy: HourlyFeeStrategy, VehicleTypeFeeStrategy\n- Thread Safety: Synchronized spot allocation using std::mutex to prevent race conditions\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Vehicle arrives at Entry Gate.\n- 2. `ParkingLotManager` executes `IParkingStrategy.findSpot(vehicleType)`.\n- 3. Spot marked occupied; `Ticket` generated with timestamp.\n- 4. Vehicle exits; `IFeeCalculator.calculate(ticket)` determines total amount.\n- 5. Payment processed; Spot marked free.\n\n### \ud83d\udcbb Production Code Examples\n#### Complete Parking Lot LLD Implementation in C++ (cpp)\n```cpp\n#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_map>\n#include <memory>\n#include <chrono>\n#include <mutex>\n\nenum class VehicleType { MOTORCYCLE, CAR, TRUCK };\n\nclass Vehicle {\npublic:\n    std::string licensePlate;\n    VehicleType type;\n    Vehicle(const std::string& plate, VehicleType t) : licensePlate(plate), type(t) {}\n};\n\nclass ParkingSpot {\npublic:\n    std::string id;\n    VehicleType spotType;\n    bool isFree = true;\n    std::shared_ptr<Vehicle> parkedVehicle;\n\n    ParkingSpot(const std::string& sId, VehicleType t) : id(sId), spotType(t) {}\n\n    void park(std::shared_ptr<Vehicle> v) {\n        parkedVehicle = v;\n        isFree = false;\n    }\n    void unpark() {\n        parkedVehicle = nullptr;\n        isFree = true;\n    }\n};\n\nclass Ticket {\npublic:\n    std::string ticketId;\n    std::shared_ptr<ParkingSpot> spot;\n    std::shared_ptr<Vehicle> vehicle;\n    std::chrono::system_clock::time_point entryTime;\n\n    Ticket(const std::string& id, std::shared_ptr<ParkingSpot> s, std::shared_ptr<Vehicle> v)\n        : ticketId(id), spot(s), vehicle(v), entryTime(std::chrono::system_clock::now()) {}\n};\n\nclass FeeStrategy {\npublic:\n    virtual ~FeeStrategy() = default;\n    virtual double calculateFee(int hours) const = 0;\n};\n\nclass HourlyFeeStrategy : public FeeStrategy {\npublic:\n    double calculateFee(int hours) const override {\n        return std::max(1, hours) * 10.0;\n    }\n};\n\nclass ParkingLot {\nprivate:\n    std::string name;\n    std::vector<std::shared_ptr<ParkingSpot>> spots;\n    std::unordered_map<std::string, std::shared_ptr<Ticket>> activeTickets;\n    std::mutex mtx; // Thread Safety Lock\n\npublic:\n    ParkingLot(const std::string& n) : name(n) {}\n\n    void addSpot(std::shared_ptr<ParkingSpot> spot) {\n        spots.push_back(spot);\n    }\n\n    std::shared_ptr<Ticket> parkVehicle(std::shared_ptr<Vehicle> v) {\n        std::lock_guard<std::mutex> lock(mtx); // Concurrency protection!\n        for (auto& spot : spots) {\n            if (spot->isFree && spot->spotType == v->type) {\n                spot->park(v);\n                auto ticket = std::make_shared<Ticket>(\"TICK-\" + v->licensePlate, spot, v);\n                activeTickets[ticket->ticketId] = ticket;\n                std::cout << \"[PARKED] Vehicle \" << v->licensePlate << \" at spot \" << spot->id << \"\\n\";\n                return ticket;\n            }\n        }\n        throw std::runtime_error(\"No spot available!\");\n    }\n\n    double unparkVehicle(const std::string& ticketId, const FeeStrategy& feeStrategy) {\n        std::lock_guard<std::mutex> lock(mtx);\n        if (activeTickets.find(ticketId) == activeTickets.end()) {\n            throw std::runtime_error(\"Invalid ticket ID!\");\n        }\n        auto ticket = activeTickets[ticketId];\n        activeTickets.erase(ticketId);\n        ticket->spot->unpark();\n        double fee = feeStrategy.calculateFee(1); // 1 hour for test\n        std::cout << \"[UNPARKED] Vehicle \" << ticket->vehicle->licensePlate << \". Total Fee: $\" << fee << \"\\n\";\n        return fee;\n    }\n};\n\nint main() {\n    ParkingLot lot(\"Downtown Garage\");\n    lot.addSpot(std::make_shared<ParkingSpot>(\"S1\", VehicleType::CAR));\n    \n    auto car = std::make_shared<Vehicle>(\"KA-01-AB-1234\", VehicleType::CAR);\n    auto ticket = lot.parkVehicle(car);\n    \n    HourlyFeeStrategy feeStrategy;\n    lot.unparkVehicle(ticket->ticketId, feeStrategy);\n    return 0;\n}\n```\n*Complete thread-safe C++ Parking Lot implementation using `std::mutex`, `std::shared_ptr`, and Strategy pattern.*\n",
    "interviewQuestions": [
      {
        "question": "How would you handle concurrent spot allocation in a multi-threaded Parking Lot system?",
        "answer": "Use `std::lock_guard<std::mutex>` per ParkingFloor or per ParkingLot to prevent race conditions when two vehicles attempt to reserve the same spot simultaneously."
      }
    ]
  },
  {
    "id": "oops-lld-problem-elevator",
    "title": "LLD Case Study 2: Elevator Control System Design",
    "domain": "oops",
    "category": "13 Low-Level Design (LLD) Repeatable Framework & Solutions",
    "difficulty": "Hard",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Uber",
      "Apple"
    ],
    "importanceRating": 5,
    "summary": "Design an elevator system for a 50-story skyscraper with 4 elevator cars. Users press UP/DOWN on floors (External Request) or press floor numbers inside elevator car (Internal Request). The system selects the best elevator to dispatch efficiently.",
    "keyConcepts": [
      "Elevator State Machine: IDLE, MOVING_UP, MOVING_DOWN",
      "Request Types: InternalRequest (inside car), ExternalRequest (hall button)",
      "Dispatching Algorithms: FCFS, Shortest Seek Time First (SSTF), SCAN/LOOK Algorithm"
    ],
    "detailedContent": "### \ud83d\udccc LLD Case Study 2: Elevator Control System Design\n\n**What is it?**\nLow-Level Design for a multi-elevator building control system supporting dispatching algorithms (LOOK / SCAN / Elevator Algorithm) and internal/external button requests.\n\n### \ud83d\udca1 Simple Explanation\nDesign an elevator system for a 50-story skyscraper with 4 elevator cars. Users press UP/DOWN on floors (External Request) or press floor numbers inside elevator car (Internal Request). The system selects the best elevator to dispatch efficiently.\n\n> \ud83d\uded7 High-Rise Elevator Dispatcher: Pressing 'Floor 15' in a skyscraper lobby assigns you to 'Elevator B'. Elevator B optimizes its trip by stopping at floor 8 and 12 along the way before returning down.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\nElevator System tests State Machine design, Strategy pattern for dispatching algorithms, and multi-threaded event loop management.\n\n### \ud83d\udd11 Key Concepts\n- Elevator State Machine: IDLE, MOVING_UP, MOVING_DOWN\n- Request Types: InternalRequest (inside car), ExternalRequest (hall button)\n- Dispatching Algorithms: FCFS, Shortest Seek Time First (SSTF), SCAN/LOOK Algorithm\n\n### \u2699\ufe0f How It Works Step-by-Step\n- 1. Passenger presses external hall button.\n- 2. `ElevatorController` queries `IDispatchStrategy` to choose best elevator car.\n- 3. Selected elevator adds request to its sorted floor queue.\n- 4. Elevator steps through floors, updating state and servicing stops.\n\n### \ud83d\udcbb Production Code Examples\n#### Elevator State Machine & Dispatching in C++ (cpp)\n```cpp\n#include <iostream>\n#include <set>\n#include <vector>\n\nenum class Direction { UP, DOWN, IDLE };\n\nclass ElevatorCar {\npublic:\n    int id;\n    int currentFloor = 0;\n    Direction direction = Direction::IDLE;\n    std::set<int> upQueue;   // Sorted ascending\n    std::set<int> downQueue; // Sorted descending\n\n    ElevatorCar(int carId) : id(carId) {}\n\n    void addRequest(int floor) {\n        if (floor > currentFloor) {\n            upQueue.insert(floor);\n        } else if (floor < currentFloor) {\n            downQueue.insert(floor);\n        }\n        if (direction == Direction::IDLE) {\n            step();\n        }\n    }\n\n    void step() {\n        if (!upQueue.empty()) {\n            direction = Direction::UP;\n            auto it = upQueue.begin();\n            currentFloor = *it;\n            upQueue.erase(it);\n            std::cout << \"[Elevator \" << id << \"] Moved UP to Floor \" << currentFloor << \"\\n\";\n        } else if (!downQueue.empty()) {\n            direction = Direction::DOWN;\n            auto it = downQueue.rbegin();\n            currentFloor = *it;\n            downQueue.erase(std::next(it).base());\n            std::cout << \"[Elevator \" << id << \"] Moved DOWN to Floor \" << currentFloor << \"\\n\";\n        } else {\n            direction = Direction::IDLE;\n            std::cout << \"[Elevator \" << id << \"] IDLE at Floor \" << currentFloor << \"\\n\";\n        }\n    }\n};\n\nint main() {\n    ElevatorCar car1(1);\n    car1.addRequest(5);\n    car1.addRequest(3);\n    car1.step();\n    return 0;\n}\n```\n*C++ Elevator State Machine using `std::set` to maintain sorted destination floors for SCAN algorithm execution.*\n",
    "interviewQuestions": [
      {
        "question": "Which dispatching algorithm is best for Elevator System LLD?",
        "answer": "The SCAN / LOOK algorithm (also known as the Elevator Algorithm) is optimal. The elevator continues moving in one direction (UP), servicing all requests for that direction until no more requests remain, then reverses direction (DOWN)."
      }
    ]
  }
];
