import { TopicItem } from '../types';

/**
 * Computer Networks Topic Registry
 * Dynamically populated from public/data/Computer_network.json
 */
export const networksTopics: TopicItem[] = [
  {
    "id": "cn-computer-network-basics",
    "title": "What is a Computer Network? LAN, WAN, MAN & Client-Server vs P2P",
    "domain": "computer-networks",
    "category": "Module 1: Networking Fundamentals, Metrics & OSI / TCP-IP Models",
    "difficulty": "Easy",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 3,
    "summary": "Computer networks span different geographical scales:\n- **LAN (Local Area Network)**: Connects devices in a close physical proximity (home, office building, or school). High bandwidth, low latency,...",
    "keyConcepts": [
      "LAN = Local (Home/Office); WAN = Global (Internet); MAN = Metropolitan City.",
      "Client-Server: Centralized server responds to client requests.",
      "Peer-to-Peer (P2P): Decentralized nodes serve and request data directly.",
      "Star Topology: Most common LAN design using a central Switch.",
      "Mesh Topology: Highest fault tolerance with multiple redundant links.",
      "Enable high-speed communication and resource sharing across local and global distances.",
      "Establish scalable client-server and distributed network architectures."
    ],
    "detailedContent": "### \ud83d\udccc What is a Computer Network? LAN, WAN, MAN & Client-Server vs P2P\n\n**What is it?**  \nA Computer Network is an interconnected system of computing devices that share data, resources, and communication channels using standardized communication protocols.\n\n### \ud83d\udca1 Simple Explanation\nComputer networks span different geographical scales:\n- **LAN (Local Area Network)**: Connects devices in a close physical proximity (home, office building, or school). High bandwidth, low latency, owned by a single organization.\n- **WAN (Wide Area Network)**: Spans cities, countries, or continents (e.g. The Internet). Managed by multiple ISPs.\n- **MAN (Metropolitan Area Network)**: Spans a city or university campus.\n- **Internet & ISP**: The Internet is a global 'network of networks'. Internet Service Providers (ISPs) provide Tier-1, Tier-2, and Tier-3 routing access.\n- **Client-Server Architecture**: Dedicated server hosts services; clients request data (e.g., Web Browsers querying Nginx).\n- **Peer-to-Peer (P2P)**: Nodes act as both clients and servers sharing resources directly (e.g. BitTorrent).\n- **Network Topologies**: Physical layout \u2014 **Star** (connected to central switch), **Mesh** (full redundant interconnectivity for fault tolerance), **Bus**, and **Ring**.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> A LAN is like an internal office intercom. A WAN is the global telephone network. Client-Server is like ordering food at a restaurant (Waiter/Server brings food to Customer/Client). Peer-to-Peer is like a potluck dinner where everyone brings and shares food directly with each other.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Enable high-speed communication and resource sharing across local and global distances.\n- Establish scalable client-server and distributed network architectures.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- AWS Virtual Private Clouds (VPC) logically isolate cloud resources into LAN subnets spanning global WAN regions.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- LAN = Local (Home/Office); WAN = Global (Internet); MAN = Metropolitan City.\n- Client-Server: Centralized server responds to client requests.\n- Peer-to-Peer (P2P): Decentralized nodes serve and request data directly.\n- Star Topology: Most common LAN design using a central Switch.\n- Mesh Topology: Highest fault tolerance with multiple redundant links.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nNetwork Topologies:\nStar:    [Node] -- [Switch] -- [Node]\nMesh:    [Node] <===> [Node] <===> [Node] (All interconnected redundant links)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the structural difference between Client-Server and Peer-to-Peer architectures?\n- Why is Mesh topology preferred for high-availability core data center backbones?\n\n### \u26a1 Topicid\n1.1\n\n### \u26a1 Quickrevisionnotes\n- LAN = Local; WAN = Global Internet.\n- Star topology relies on a central switch; Mesh provides redundant paths.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between Client-Server and Peer-to-Peer (P2P) network architectures?",
        "answer": "In Client-Server architecture, central servers maintain resources and process client requests (asymmetric roles). In P2P architecture, every node (peer) acts as both a client and a server, downloading and uploading data chunks concurrently without a central bottleneck."
      }
    ]
  },
  {
    "id": "cn-data-units-metrics",
    "title": "Network Data Units (Packet, Frame, Segment, Datagram) & Metrics",
    "domain": "computer-networks",
    "category": "Module 1: Networking Fundamentals, Metrics & OSI / TCP-IP Models",
    "difficulty": "Easy",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 3,
    "summary": "As data travels down the network stack, each layer wraps it in its own header (Encapsulation):\n- **Segment**: Transport Layer TCP data unit (contains Source/Destination Ports).\n- **Datagram**: Tran...",
    "keyConcepts": [
      "Segment = TCP (Transport Layer); Datagram = UDP / IP.",
      "Packet = IP (Network Layer); Frame = Ethernet (Data Link Layer).",
      "RTT = Time to destination + return ACK time.",
      "Jitter = Latency variance (critical for VoIP & Gaming).",
      "Throughput is always <= Bandwidth.",
      "Standardize data encapsulation layers so protocols remain independent.",
      "Quantify network Service Level Agreements (SLAs) for latency and packet delivery."
    ],
    "detailedContent": "### \ud83d\udccc Network Data Units (Packet, Frame, Segment, Datagram) & Metrics\n\n**What is it?**  \nNetwork Data Units define data encapsulation formats across protocol layers, while Performance Metrics evaluate throughput, delay, and loss.\n\n### \ud83d\udca1 Simple Explanation\nAs data travels down the network stack, each layer wraps it in its own header (Encapsulation):\n- **Segment**: Transport Layer TCP data unit (contains Source/Destination Ports).\n- **Datagram**: Transport Layer UDP data unit or Network Layer connectionless packet.\n- **Packet**: Network Layer IP data unit (contains Source/Destination IP Addresses).\n- **Frame**: Data Link Layer Ethernet data unit (contains Source/Destination MAC Addresses).\n- **Bits**: Physical Layer electrical pulses or light signals.\n\n**Performance Metrics**:\n- **Bandwidth**: Theoretical maximum capacity of a network link per second (e.g. 1 Gbps).\n- **Throughput**: Actual rate of successful data delivery over a channel.\n- **Latency**: One-way delay for a packet to travel from source to destination.\n- **RTT (Round Trip Time)**: Total time for a packet to travel to destination AND return an ACK.\n- **Jitter**: Fluctuation or variability in packet arrival latency (causes stutter in video calls).\n- **Packet Loss**: Percentage of transmitted packets dropped by congested routers.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Bandwidth is a 6-lane highway width. Throughput is the actual number of cars passing per minute. Latency is the travel time to a destination city. RTT is driving there and returning home. Jitter is erratic traffic stop-and-go delays. Packet loss is a box falling off a delivery truck.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Standardize data encapsulation layers so protocols remain independent.\n- Quantify network Service Level Agreements (SLAs) for latency and packet delivery.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Monitoring tools (Datadog, New Relic) measure RTT and Jitter to detect network bottlenecks affecting microservices.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Segment = TCP (Transport Layer); Datagram = UDP / IP.\n- Packet = IP (Network Layer); Frame = Ethernet (Data Link Layer).\n- RTT = Time to destination + return ACK time.\n- Jitter = Latency variance (critical for VoIP & Gaming).\n- Throughput is always <= Bandwidth.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nEncapsulation Flow:\n[ Application Data ]\n  --> [ TCP Header | Data ]           (Segment - Layer 4)\n  --> [ IP Header | TCP | Data ]       (Packet - Layer 3)\n  --> [ MAC Header | IP | TCP | Data ] (Frame - Layer 2)\n  --> 10110100101...                   (Bits - Layer 1)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Explain the difference between Bandwidth, Throughput, and Latency.\n- What is RTT and why does high RTT slow down TCP throughput?\n\n### \u26a1 Topicid\n1.2\n\n### \u26a1 Quickrevisionnotes\n- Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).\n- RTT includes return ACK transit time.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between Latency, RTT, and Jitter?",
        "answer": "Latency is one-way transit time. RTT (Round Trip Time) is the total time for a packet to reach the destination and return an ACK. Jitter is the variance or fluctuation in latency between consecutive packets."
      }
    ]
  },
  {
    "id": "cn-osi-vs-tcpip-model",
    "title": "The OSI 7-Layer Model vs TCP/IP Model",
    "domain": "computer-networks",
    "category": "Module 1: Networking Fundamentals, Metrics & OSI / TCP-IP Models",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Network communication is divided into modular abstraction layers:\n\n**OSI 7-Layer Model**:\n1. **Application (Layer 7)**: User interaction protocols (HTTP, HTTPS, DNS, SSH, FTP).\n2. **Presentation (L...",
    "keyConcepts": [
      "OSI Layers: Application, Presentation, Session, Transport, Network, Data Link, Physical.",
      "TCP/IP Layers: Application, Transport, Internet, Network Access.",
      "Ports = Layer 4 (Transport); IP Addresses = Layer 3 (Network); MAC = Layer 2 (Data Link).",
      "Modularize network software so changing Layer 2 (Wi-Fi to Ethernet) doesn't break Layer 7 (Browser/HTTP).",
      "Establish global protocol standards for multi-vendor hardware interoperability."
    ],
    "detailedContent": "### \ud83d\udccc The OSI 7-Layer Model vs TCP/IP Model\n\n**What is it?**  \nThe OSI (Open Systems Interconnection) 7-Layer Model and TCP/IP 4-Layer Model provide conceptual frameworks for network protocol communication.\n\n### \ud83d\udca1 Simple Explanation\nNetwork communication is divided into modular abstraction layers:\n\n**OSI 7-Layer Model**:\n1. **Application (Layer 7)**: User interaction protocols (HTTP, HTTPS, DNS, SSH, FTP).\n2. **Presentation (Layer 6)**: Data formatting, compression, and encryption (TLS/SSL, JPEG, JSON).\n3. **Session (Layer 5)**: Session establishment and management (RPC, NetBIOS).\n4. **Transport (Layer 4)**: End-to-end process communication, ports, error recovery (TCP, UDP).\n5. **Network (Layer 3)**: Logical host addressing and internet routing (IP, ICMP, Routers).\n6. **Data Link (Layer 2)**: Node-to-node frame delivery on physical medium (Ethernet, MAC, Switches, ARP).\n7. **Physical (Layer 1)**: Transmission of raw binary bits over cables/radio (Cables, Wi-Fi, Voltage).\n\n**TCP/IP 4-Layer Model (Practical Standard)**:\n- **Application Layer** (Combines OSI 7, 6, 5)\n- **Transport Layer** (OSI 4)\n- **Internet Layer** (OSI 3)\n- **Network Access / Link Layer** (Combines OSI 2, 1).\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Sending a letter: Application = Writing letter text. Presentation = Translating to English. Session = Writing formal letter structure. Transport = Choosing Express Tracked Mail. Network = Writing Recipient Address (IP). Data Link = Loading letter into delivery van (MAC). Physical = Driving the van on asphalt roads.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Modularize network software so changing Layer 2 (Wi-Fi to Ethernet) doesn't break Layer 7 (Browser/HTTP).\n- Establish global protocol standards for multi-vendor hardware interoperability.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Network firewalls are categorized by layer: Layer 3/4 Firewalls (filter IP/Ports) vs Layer 7 Web Application Firewalls (WAF filter HTTP payloads).\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- OSI Layers: Application, Presentation, Session, Transport, Network, Data Link, Physical.\n- TCP/IP Layers: Application, Transport, Internet, Network Access.\n- Ports = Layer 4 (Transport); IP Addresses = Layer 3 (Network); MAC = Layer 2 (Data Link).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nOSI vs TCP/IP Mapping:\nOSI 7-Layer                     TCP/IP 4-Layer\n[ 7. Application  ] \\\n[ 6. Presentation ]  ===> [ Application Layer ] (HTTP, DNS, TLS)\n[ 5. Session      ] /\n[ 4. Transport    ]  ===> [ Transport Layer   ] (TCP, UDP)\n[ 3. Network      ]  ===> [ Internet Layer    ] (IP, ICMP)\n[ 2. Data Link    ] \\\n[ 1. Physical     ]  ===> [ Network Access    ] (Ethernet, MAC)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Compare the OSI 7-layer model with the TCP/IP 4-layer model.\n- At which OSI layers do Switches, Routers, and Web Application Firewalls operate?\n\n### \u26a1 Topicid\n1.3\n\n### \u26a1 Quickrevisionnotes\n- OSI has 7 layers; TCP/IP has 4 practical layers.\n- Routers operate at Layer 3; Switches operate at Layer 2.\n",
    "interviewQuestions": [
      {
        "question": "At which OSI layers do Hubs, Switches, Routers, and Web Application Firewalls (WAF) operate?",
        "answer": "Hubs operate at Layer 1 (Physical). Switches operate at Layer 2 (Data Link - MAC Addresses). Routers operate at Layer 3 (Network - IP Addresses). WAFs operate at Layer 7 (Application - HTTP payloads)."
      }
    ]
  },
  {
    "id": "cn-opening-google-com-osi-walkthrough",
    "title": "Master Walkthrough: 'When I open google.com, what happens at each layer?'",
    "domain": "computer-networks",
    "category": "Module 1: Networking Fundamentals, Metrics & OSI / TCP-IP Models",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "This classic master interview question connects every major networking concept:\n\n1. **User Types `google.com` & Presses Enter**:\n   - Browser parses URL and checks **Browser Cache** -> **OS Cache**...",
    "keyConcepts": [
      "Step 1: URL Parsing & DNS Resolution (Layer 7).",
      "Step 2: ARP Lookup for Gateway MAC (Layer 2).",
      "Step 3: TCP 3-Way Handshake SYN, SYN-ACK, ACK (Layer 4).",
      "Step 4: TLS 1.3 Handshake Key Exchange (Layer 6).",
      "Step 5: HTTP GET Request & 200 OK Response (Layer 7).",
      "Step 6: DOM/CSSOM Parsing & Screen Rendering.",
      "Demonstrates complete end-to-end understanding of web protocols, hardware, and client-server architectures."
    ],
    "detailedContent": "### \ud83d\udccc Master Walkthrough: 'When I open google.com, what happens at each layer?'\n\n**What is it?**  \nThe definitive SDE interview walkthrough detailing every step from typing `google.com` in a browser to rendering the HTML page across the OSI/TCP-IP stack.\n\n### \ud83d\udca1 Simple Explanation\nThis classic master interview question connects every major networking concept:\n\n1. **User Types `google.com` & Presses Enter**:\n   - Browser parses URL and checks **Browser Cache** -> **OS Cache** -> **`/etc/hosts`** for IP address.\n2. **DNS Resolution Pipeline (Layer 7 Application)**:\n   - If cache miss, OS sends DNS request to **Recursive Resolver** (ISP / 1.1.1.1).\n   - Resolver queries **Root Server (`.`)** -> **TLD Server (`.com`)** -> **Authoritative Server (`google.com`)** to get IP `142.250.190.46`.\n3. **ARP Resolution (Layer 2 Data Link)**:\n   - OS checks local ARP cache for Default Gateway Router MAC. If missing, sends **ARP Request Broadcast** (`FF:FF:FF:FF:FF:FF`) to get Router MAC.\n4. **TCP 3-Way Handshake (Layer 4 Transport)**:\n   - Browser initiates TCP connection to `142.250.190.46:443`. Sends `SYN` -> Receives `SYN+ACK` -> Sends `ACK` (`ESTABLISHED` state).\n5. **TLS 1.3 Handshake (Layer 6 Presentation)**:\n   - Browser sends `ClientHello` key share. Server verifies SSL Certificate, returns `ServerHello`, and establishes symmetric AES encryption keys.\n6. **HTTP GET Request & Server Response (Layer 7 Application)**:\n   - Browser sends encrypted `GET / HTTP/1.1` request. Google Nginx/Envoy web server processes request and returns `200 OK` with HTML/JS payload.\n7. **Browser Rendering**:\n   - Browser receives HTML bytes, parses DOM tree, CSSOM tree, executes JavaScript, and renders page!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Opening `google.com` is like ordering a book online: 1. Look up book ID in catalog (DNS). 2. Find local post office address (ARP). 3. Establish formal shipping contract with courier (TCP Handshake). 4. Lock package in tamper-proof container (TLS Encryption). 5. Ship package and receive book (HTTP Request/Response). 6. Unbox and read book (Browser Rendering).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Demonstrates complete end-to-end understanding of web protocols, hardware, and client-server architectures.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Senior SDE and System Design interviewers evaluate candidates based on the depth of detail in this walkthrough.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Step 1: URL Parsing & DNS Resolution (Layer 7).\n- Step 2: ARP Lookup for Gateway MAC (Layer 2).\n- Step 3: TCP 3-Way Handshake SYN, SYN-ACK, ACK (Layer 4).\n- Step 4: TLS 1.3 Handshake Key Exchange (Layer 6).\n- Step 5: HTTP GET Request & 200 OK Response (Layer 7).\n- Step 6: DOM/CSSOM Parsing & Screen Rendering.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nExecution Pipeline Flow:\n[ Type google.com ] \n  --> [ DNS Lookup (Get IP) ] \n  --> [ ARP Lookup (Get Router MAC) ] \n  --> [ TCP 3-Way Handshake (Port 443) ] \n  --> [ TLS 1.3 Handshake (Encrypt) ] \n  --> [ HTTP GET Request ] \n  --> [ HTTP 200 OK Response ] \n  --> [ DOM Rendering ]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Walk through every step of typing google.com and pressing Enter in a browser.\n- What happens if DNS fails? What happens if TCP Handshake times out?\n\n### \u26a1 Topicid\n1.4\n\n### \u26a1 Quickrevisionnotes\n- Flow: DNS -> ARP -> TCP Handshake -> TLS Handshake -> HTTP GET -> 200 OK -> Render.\n- DNS converts domain to IP; ARP converts IP to Gateway MAC.\n",
    "interviewQuestions": [
      {
        "question": "What happens if the ARP cache doesn't contain the MAC address of the default gateway router when opening google.com?",
        "answer": "The operating system pauses IP packet transmission and broadcasts an ARP Request (`FF:FF:FF:FF:FF:FF`) asking 'Who has Default Gateway IP?'. The gateway router responds with an ARP Reply unicast containing its physical MAC address. The OS caches the MAC address and resumes sending the TCP SYN frame."
      }
    ]
  },
  {
    "id": "cn-web-request-lifecycle",
    "title": "Complete Web Request Lifecycle (Browser -> DNS -> TCP -> TLS -> HTTP -> Server)",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Every web interaction executes across 6 distinct stages:\n1. **Browser**: User clicks link or submits form.\n2. **DNS**: Translates hostname to IP address.\n3. **TCP**: Establishes reliable 3-way hand...",
    "keyConcepts": [
      "Browser -> DNS -> TCP -> TLS -> HTTP -> Server.",
      "Port 80 = HTTP (Unencrypted); Port 443 = HTTPS (TLS Encrypted).",
      "Chrome DevTools Network Tab visualizes exact timing per phase.",
      "Ensure structured, secure, and reliable communication across global web clients and backend servers."
    ],
    "detailedContent": "### \ud83d\udccc Complete Web Request Lifecycle (Browser -> DNS -> TCP -> TLS -> HTTP -> Server)\n\n**What is it?**  \nThe Web Request Lifecycle is the sequential protocol chain executed by web clients to retrieve resources from web servers.\n\n### \ud83d\udca1 Simple Explanation\nEvery web interaction executes across 6 distinct stages:\n1. **Browser**: User clicks link or submits form.\n2. **DNS**: Translates hostname to IP address.\n3. **TCP**: Establishes reliable 3-way handshake on Port 80/443.\n4. **TLS**: Negotiates cryptographic session keys for HTTPS.\n5. **HTTP**: Sends formatted HTTP request headers and payload.\n6. **Server**: Web server (Nginx/Node.js) handles request, executes DB queries, and returns HTTP response.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Like calling a business: Look up phone number in directory (DNS), dial phone number and wait for answer (TCP Handshake), verify you reached correct company (TLS Certificate), ask your question (HTTP Request), listen to customer service answer (HTTP Response).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Ensure structured, secure, and reliable communication across global web clients and backend servers.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Web Performance Engineers analyze Network waterfall charts in Chrome DevTools to optimize each phase of this lifecycle.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Browser -> DNS -> TCP -> TLS -> HTTP -> Server.\n- Port 80 = HTTP (Unencrypted); Port 443 = HTTPS (TLS Encrypted).\n- Chrome DevTools Network Tab visualizes exact timing per phase.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nProtocol Dependency Chain:\n[ Application: HTTP/HTTPS ]\n       |\n[ Security: TLS 1.3 ]\n       |\n[ Transport: TCP / UDP ]\n       |\n[ Network: IP ]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Explain the sequential order of protocol execution in a web request lifecycle.\n\n### \u26a1 Topicid\n2.1\n\n### \u26a1 Quickrevisionnotes\n- TCP Handshake occurs BEFORE TLS Handshake.\n- HTTP runs on top of TLS on Port 443.\n",
    "interviewQuestions": [
      {
        "question": "Does TLS Handshake happen before or after TCP 3-Way Handshake?",
        "answer": "TLS Handshake happens AFTER the TCP 3-Way Handshake is completed (`ESTABLISHED` state), because TLS requires a reliable transport channel to exchange security keys."
      }
    ]
  },
  {
    "id": "cn-http-methods-idempotency",
    "title": "HTTP Request Methods & Idempotency (GET, POST, PUT, PATCH, DELETE)",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "REST APIs rely on standardized HTTP method verbs:\n- **`GET`**: Retrieves resource data. Must be **Safe** (does not modify server state) and **Idempotent**.\n- **`POST`**: Creates a new resource. **N...",
    "keyConcepts": [
      "Safe Methods: GET, HEAD, OPTIONS (read-only).",
      "Idempotent Methods: GET, PUT, DELETE, HEAD, OPTIONS.",
      "Non-Idempotent Methods: POST, PATCH.",
      "PUT = Full replacement; PATCH = Partial update.",
      "Provide uniform RESTful API conventions.",
      "Allow web proxies and browsers to safely retry failed idempotent requests (`GET`, `PUT`, `DELETE`)."
    ],
    "detailedContent": "### \ud83d\udccc HTTP Request Methods & Idempotency (GET, POST, PUT, PATCH, DELETE)\n\n**What is it?**  \nHTTP Methods define the desired action to be performed on a resource, categorized by Safety and Idempotency properties.\n\n### \ud83d\udca1 Simple Explanation\nREST APIs rely on standardized HTTP method verbs:\n- **`GET`**: Retrieves resource data. Must be **Safe** (does not modify server state) and **Idempotent**.\n- **`POST`**: Creates a new resource. **Non-idempotent** (repeating POST creates multiple records).\n- **`PUT`**: Replaces an entire resource completely. **Idempotent** (repeating full replacement yields same server state).\n- **`PATCH`**: Applies partial modifications to a resource. **Non-idempotent**.\n- **`DELETE`**: Removes a resource. **Idempotent** (deleting once or 10 times results in resource being gone).\n\n**Idempotency Definition**: An HTTP method is idempotent if executing it 1 time or 100 times produces the exact same server state result.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> GET is reading a poster on a wall. POST is sticking a new poster on the wall. PUT is tearing down the old poster and putting up a brand-new full replacement poster. PATCH is sticking a small correction sticker over one misspelled word. DELETE is tearing down the poster. Tearing down a poster 5 times leaves 0 posters on the wall (Idempotent!).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Provide uniform RESTful API conventions.\n- Allow web proxies and browsers to safely retry failed idempotent requests (`GET`, `PUT`, `DELETE`).\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Payment gateways must ensure payment endpoints are idempotent (using Idempotency Keys) so network retry glitches don't charge customers twice.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Safe Methods: GET, HEAD, OPTIONS (read-only).\n- Idempotent Methods: GET, PUT, DELETE, HEAD, OPTIONS.\n- Non-Idempotent Methods: POST, PATCH.\n- PUT = Full replacement; PATCH = Partial update.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nHTTP Method Properties:\nMethod  | Safe? | Idempotent? | Typical Use Case\nGET     | YES   | YES         | Read resource\nPOST    | NO    | NO          | Create new resource\nPUT     | NO    | YES         | Replace full resource\nPATCH   | NO    | NO          | Partial update\nDELETE  | NO    | YES         | Delete resource\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is Idempotency in HTTP methods and why is it important?\n- What is the difference between PUT and PATCH?\n\n### \u26a1 Topicid\n2.2\n\n### \u26a1 Quickrevisionnotes\n- Idempotent: GET, PUT, DELETE. Non-idempotent: POST, PATCH.\n- Safe methods do not alter server state.\n",
    "interviewQuestions": [
      {
        "question": "Why is POST non-idempotent whereas PUT is idempotent?",
        "answer": "Executing `POST /orders` 5 times creates 5 separate order records in the database ($O(N)$ side effects). Executing `PUT /users/10` with a full user payload replaces user 10's record; re-running it 5 times leaves user 10 in the exact same state."
      }
    ]
  },
  {
    "id": "cn-http-status-codes-headers",
    "title": "HTTP Status Codes (1xx to 5xx) & Essential Request/Response Headers",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Status codes inform clients about request outcomes:\n- **`1xx` Informational**: Protocol operations (`101 Switching Protocols` to WebSockets).\n- **`2xx` Success**: Request processed (`200 OK`, `201 ...",
    "keyConcepts": [
      "200 OK, 201 Created, 204 No Content.",
      "301 Permanent Redirect vs 302 Temporary Redirect.",
      "401 Unauthorized (Unauthenticated) vs 403 Forbidden (Unauthorised access).",
      "502 Bad Gateway (Upstream app crashed) vs 504 Gateway Timeout (Upstream timed out).",
      "Communicate precise execution status to browsers, API clients, and monitoring systems."
    ],
    "detailedContent": "### \ud83d\udccc HTTP Status Codes (1xx to 5xx) & Essential Request/Response Headers\n\n**What is it?**  \nHTTP Status Codes indicate whether a specific HTTP request completed successfully or encountered an error, organized into 5 standardized numerical classes.\n\n### \ud83d\udca1 Simple Explanation\nStatus codes inform clients about request outcomes:\n- **`1xx` Informational**: Protocol operations (`101 Switching Protocols` to WebSockets).\n- **`2xx` Success**: Request processed (`200 OK`, `201 Created`, `204 No Content`).\n- **`3xx` Redirection**: Further action required (`301 Moved Permanently`, `302 Found`, `304 Not Modified`).\n- **`4xx` Client Error**: Invalid client request (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`).\n- **`5xx` Server Error**: Server failure (`500 Internal Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`).\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> 200 is receiving your package. 301 is mail forwarded to a new home address. 401 is trying to enter a VIP club without a ticket. 403 is having a ticket but being banned by security. 404 is asking for a non-existent item. 502 is the store clerk telling you the stock room computer crashed.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Communicate precise execution status to browsers, API clients, and monitoring systems.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- API Gateways use 429 Too Many Requests to enforce rate-limiting quotas on microservice clients.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- 200 OK, 201 Created, 204 No Content.\n- 301 Permanent Redirect vs 302 Temporary Redirect.\n- 401 Unauthorized (Unauthenticated) vs 403 Forbidden (Unauthorised access).\n- 502 Bad Gateway (Upstream app crashed) vs 504 Gateway Timeout (Upstream timed out).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nStatus Code Classes:\n1xx: Informational (101 Switching Protocols)\n2xx: Success       (200 OK, 201 Created, 204 No Content)\n3xx: Redirection   (301 Moved Permanently, 304 Not Modified)\n4xx: Client Error  (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)\n5xx: Server Error  (500 Internal Error, 502 Bad Gateway, 504 Gateway Timeout)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between 401 Unauthorized and 403 Forbidden?\n- What is the difference between 502 Bad Gateway and 504 Gateway Timeout?\n\n### \u26a1 Topicid\n2.3\n\n### \u26a1 Quickrevisionnotes\n- 401 = Not logged in; 403 = Logged in but not allowed.\n- 502 = App crashed; 504 = App timed out.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between 502 Bad Gateway and 504 Gateway Timeout?",
        "answer": "`502 Bad Gateway` means a reverse proxy (like Nginx) received an invalid or crashed response from the upstream application server (Node.js/Django). `504 Gateway Timeout` means the upstream server failed to send a response within the configured timeout period."
      }
    ]
  },
  {
    "id": "cn-cookies-vs-sessions",
    "title": "State Management: Cookies vs Sessions & Security Flags",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "HTTP is stateless. Cookies and Sessions preserve user identity:\n- **Cookies**: Max 4KB files stored in browser. Sent automatically in `Cookie:` header with matching domain requests. Security Flags:...",
    "keyConcepts": [
      "Cookie: Stored in Browser (4KB size limit).",
      "Session: Stored on Server RAM/Redis.",
      "HttpOnly: Blocks JavaScript `document.cookie` access (prevents XSS).",
      "SameSite: Mitigates Cross-Site Request Forgery (CSRF).",
      "Provide user authentication across stateless HTTP requests."
    ],
    "detailedContent": "### \ud83d\udccc State Management: Cookies vs Sessions & Security Flags\n\n**What is it?**  \nCookies store small key-value strings in client browsers, while Sessions maintain state data in server memory/Redis indexed by a Session ID cookie.\n\n### \ud83d\udca1 Simple Explanation\nHTTP is stateless. Cookies and Sessions preserve user identity:\n- **Cookies**: Max 4KB files stored in browser. Sent automatically in `Cookie:` header with matching domain requests. Security Flags: `HttpOnly` (blocks JS access, preventing XSS token theft), `Secure` (sent only over HTTPS), `SameSite=Strict/Lax` (prevents CSRF attacks).\n- **Sessions**: Session state data lives on server (RAM / Redis). Only a lightweight `Session_ID` string is sent to client browser as a cookie.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> A Session ID cookie is like a coat-check ticket at a nightclub. You carry a tiny slip of paper (Cookie with Session ID). The nightclub cloakroom holds your heavy winter coat (Server Session State).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Provide user authentication across stateless HTTP requests.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Scalable web clusters store session state in centralized Redis caches so any application node can authenticate incoming requests.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Cookie: Stored in Browser (4KB size limit).\n- Session: Stored on Server RAM/Redis.\n- HttpOnly: Blocks JavaScript `document.cookie` access (prevents XSS).\n- SameSite: Mitigates Cross-Site Request Forgery (CSRF).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nSet-Cookie: session_id=xyz123; Secure; HttpOnly; SameSite=Strict; Max-Age=86400\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between Cookies and Sessions?\n- How do HttpOnly and SameSite flags secure cookies?\n\n### \u26a1 Topicid\n2.4\n\n### \u26a1 Quickrevisionnotes\n- HttpOnly prevents XSS theft; SameSite prevents CSRF attacks.\n- Sessions store state on server; Cookies store state in browser.\n",
    "interviewQuestions": [
      {
        "question": "How does setting the `HttpOnly` flag on a cookie improve security?",
        "answer": "The `HttpOnly` flag instructs the browser that the cookie cannot be accessed via client-side JavaScript (`document.cookie`). If an attacker executes a Cross-Site Scripting (XSS) vulnerability, they cannot read or steal the session cookie."
      }
    ]
  },
  {
    "id": "cn-http-caching-headers",
    "title": "HTTP Caching Mechanics: Cache-Control, ETags & 304 Not Modified",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "1. **`Cache-Control` Directives**:\n   - `max-age=3600`: Cache response for 3600 seconds.\n   - `no-cache`: Browser can cache response, but MUST revalidate with server before serving it.\n   - `no-sto...",
    "keyConcepts": [
      "no-cache: Revalidate with server before serving cached copy.",
      "no-store: Never cache sensitive data on disk/RAM.",
      "ETag: Hash fingerprint of resource payload.",
      "304 Not Modified: Tells browser to use local cache.",
      "Minimize server CPU load, database queries, and bandwidth latency."
    ],
    "detailedContent": "### \ud83d\udccc HTTP Caching Mechanics: Cache-Control, ETags & 304 Not Modified\n\n**What is it?**  \nHTTP Caching optimizes performance by storing response copies in local browser caches or CDNs to reduce server load and bandwidth usage.\n\n### \ud83d\udca1 Simple Explanation\n1. **`Cache-Control` Directives**:\n   - `max-age=3600`: Cache response for 3600 seconds.\n   - `no-cache`: Browser can cache response, but MUST revalidate with server before serving it.\n   - `no-store`: Do NOT cache anywhere (used for sensitive financial data).\n   - `public` / `private`: `public` allows CDNs/proxies to cache; `private` restricts caching to end-user browser.\n2. **Validation Headers (`ETag` & `304 Not Modified`)**:\n   - Server includes `ETag: \"hash123\"` (fingerprint of content).\n   - On next request, browser sends `If-None-Match: \"hash123\"`.\n   - If unchanged, server returns `304 Not Modified` with zero body bytes!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> ETag caching is like calling a restaurant to check if the menu changed before driving over. If unchanged, the manager says 'Same menu!' (304 Not Modified), saving a trip.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Minimize server CPU load, database queries, and bandwidth latency.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- CDNs (Cloudflare, Akamai) rely on `Cache-Control` headers to serve static assets from edge locations globally.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- no-cache: Revalidate with server before serving cached copy.\n- no-store: Never cache sensitive data on disk/RAM.\n- ETag: Hash fingerprint of resource payload.\n- 304 Not Modified: Tells browser to use local cache.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nHTTP Response: HTTP/1.1 200 OK\nCache-Control: public, max-age=31536000\nETag: \"w/686897696a\"\n\nSubsequent Request:\nGET /logo.png HTTP/1.1\nIf-None-Match: \"w/686897696a\"\nResponse: HTTP/1.1 304 Not Modified (0 bytes body!)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between `no-cache` and `no-store` in Cache-Control?\n- How does ETag validation work in HTTP caching?\n\n### \u26a1 Topicid\n2.5\n\n### \u26a1 Quickrevisionnotes\n- no-cache = Revalidate first; no-store = Do not save anywhere.\n- 304 Not Modified avoids re-downloading identical files.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between `Cache-Control: no-cache` and `Cache-Control: no-store`?",
        "answer": "`no-cache` allows the browser to store a cached copy, but requires it to revalidate with the origin server (using `ETag`) before serving it to the user. `no-store` completely prohibits storing the response in any browser cache or intermediate proxy disk/memory."
      }
    ]
  },
  {
    "id": "cn-http-evolution-1-to-3",
    "title": "HTTP Protocol Evolution: HTTP/1.0 vs HTTP/1.1 vs HTTP/2 vs HTTP/3",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "1. **HTTP/1.0**: Opened a NEW TCP connection for every asset, causing massive handshake latency.\n2. **HTTP/1.1**: Introduced **Keep-Alive (Connection Reuse)**. But suffers from **Application Head-o...",
    "keyConcepts": [
      "HTTP/1.1: Persistent Keep-Alive, but Application HoL blocking.",
      "HTTP/2: Multiplexing, Binary Framing, HPACK, Single TCP connection.",
      "HTTP/3: QUIC over UDP, 0 Transport HoL blocking, Connection Migration.",
      "Eliminate connection setup overhead and Head-of-Line blocking."
    ],
    "detailedContent": "### \ud83d\udccc HTTP Protocol Evolution: HTTP/1.0 vs HTTP/1.1 vs HTTP/2 vs HTTP/3\n\n**What is it?**  \nHTTP evolution addresses network bottlenecks: HTTP/1.1 introduced Keep-Alive, HTTP/2 introduced Multiplexing over single TCP connection, and HTTP/3 introduced QUIC over UDP to eliminate Transport Head-of-Line Blocking.\n\n### \ud83d\udca1 Simple Explanation\n1. **HTTP/1.0**: Opened a NEW TCP connection for every asset, causing massive handshake latency.\n2. **HTTP/1.1**: Introduced **Keep-Alive (Connection Reuse)**. But suffers from **Application Head-of-Line (HoL) Blocking** (requests must complete in strict sequential order).\n3. **HTTP/2**: Introduced **Binary Framing** and **Multiplexing** (concurrent streams over 1 TCP connection) + **HPACK Header Compression** + **Server Push**. Flaw: **Transport HoL Blocking** (1 lost TCP packet pauses ALL streams).\n4. **HTTP/3**: Runs **QUIC over UDP**. Provides per-stream loss recovery (0 Transport HoL Blocking), 0-RTT/1-RTT TLS 1.3 setup, and Connection Migration.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> HTTP/1.0 is buying 1 item at checkout, leaving, re-entering line. HTTP/1.1 is staying at the register (Keep-Alive) but scanning items 1-by-1. HTTP/2 is 10 scanner belts feeding 1 cashier. HTTP/3 gives every item its own independent automated conveyor belt over UDP!\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Eliminate connection setup overhead and Head-of-Line blocking.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Google, Meta, and Cloudflare serve >70% of global web traffic using HTTP/3 over QUIC.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- HTTP/1.1: Persistent Keep-Alive, but Application HoL blocking.\n- HTTP/2: Multiplexing, Binary Framing, HPACK, Single TCP connection.\n- HTTP/3: QUIC over UDP, 0 Transport HoL blocking, Connection Migration.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nProtocol Stack Comparison:\nHTTP/1.1: [ HTTP Text ] ---> [ TCP ] ---> [ IP ]\nHTTP/2:   [ Binary Frames / Multiplexing ] ---> [ TCP ] ---> [ IP ]\nHTTP/3:   [ HTTP/3 Frames ] ---> [ QUIC (TLS 1.3) ] ---> [ UDP ] ---> [ IP ]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Explain Head-of-Line (HoL) Blocking in HTTP/1.1 vs HTTP/2 vs HTTP/3.\n- Why does HTTP/3 run over UDP instead of TCP?\n\n### \u26a1 Topicid\n2.6\n\n### \u26a1 Quickrevisionnotes\n- HTTP/2 multiplexes over single TCP; HTTP/3 uses QUIC over UDP.\n- QUIC eliminates Transport Head-of-Line blocking.\n",
    "interviewQuestions": [
      {
        "question": "Why does HTTP/2 still suffer from Transport Head-of-Line (HoL) Blocking, and how does HTTP/3 solve it?",
        "answer": "HTTP/2 multiplexes streams over a single TCP connection. Because TCP guarantees ordered byte delivery, 1 lost packet forces TCP to buffer ALL streams until retransmitted. HTTP/3 runs QUIC over UDP, implementing independent per-stream loss recovery so 1 lost packet on Stream 1 does not pause Stream 2."
      }
    ]
  },
  {
    "id": "cn-http-vs-https-connection-reuse",
    "title": "HTTP vs HTTPS, Keep-Alive & Connection Reuse",
    "domain": "computer-networks",
    "category": "Module 2: Application Layer, HTTP/1.1, HTTP/2, HTTP/3 & Web Security",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "1. **HTTP vs HTTPS**:\n   - **HTTP (Port 80)**: Transmits plaintext data. Anyone eavesdropping on Wi-Fi can read passwords, cookies, and credit cards.\n   - **HTTPS (Port 443)**: Encrypts data using ...",
    "keyConcepts": [
      "HTTP = Port 80 (Plaintext); HTTPS = Port 443 (TLS Encrypted).",
      "Keep-Alive: Reuses persistent TCP connection for multiple HTTP requests.",
      "Connection Reuse saves 1 RTT (TCP) + 1-2 RTT (TLS) per web request.",
      "Protect web user data privacy and eliminate repeated TCP/TLS handshake latency."
    ],
    "detailedContent": "### \ud83d\udccc HTTP vs HTTPS, Keep-Alive & Connection Reuse\n\n**What is it?**  \nHTTPS is HTTP running inside an encrypted TLS channel (Port 443), while Keep-Alive maintains persistent TCP connections to reuse sockets across multiple requests.\n\n### \ud83d\udca1 Simple Explanation\n1. **HTTP vs HTTPS**:\n   - **HTTP (Port 80)**: Transmits plaintext data. Anyone eavesdropping on Wi-Fi can read passwords, cookies, and credit cards.\n   - **HTTPS (Port 443)**: Encrypts data using TLS (Transport Layer Security). Guarantees **Confidentiality** (encryption), **Integrity** (anti-tampering checksums), and **Authentication** (SSL certificates).\n2. **Keep-Alive & Connection Reuse**:\n   - Header `Connection: keep-alive` instructs client and server to keep the underlying TCP socket open after completing an HTTP request. Bypasses repeated TCP 3-way handshakes and TLS key exchanges for subsequent requests!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> HTTP is sending postcards through the mail where anyone can read the text. HTTPS is locking the letter in an armored steel box. Keep-Alive is leaving a phone call open on speakerphone so you don't have to redial the number every time you want to ask a question.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Protect web user data privacy and eliminate repeated TCP/TLS handshake latency.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Browsers enforce HSTS (HTTP Strict Transport Security) to automatically upgrade HTTP links to HTTPS.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- HTTP = Port 80 (Plaintext); HTTPS = Port 443 (TLS Encrypted).\n- Keep-Alive: Reuses persistent TCP connection for multiple HTTP requests.\n- Connection Reuse saves 1 RTT (TCP) + 1-2 RTT (TLS) per web request.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nRequest Header:\nConnection: keep-alive\nKeep-Alive: timeout=5, max=1000\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What performance benefit does HTTP Keep-Alive provide?\n- What security guarantees does HTTPS provide?\n\n### \u26a1 Topicid\n2.7\n\n### \u26a1 Quickrevisionnotes\n- HTTPS encrypts HTTP via TLS on Port 443.\n- Keep-Alive eliminates repeated TCP/TLS handshake round-trips.\n",
    "interviewQuestions": [
      {
        "question": "What is the performance advantage of HTTP Keep-Alive?",
        "answer": "Keep-Alive reuses an established TCP connection for multiple sequential HTTP requests, saving 1 RTT for TCP 3-way handshake and 1-2 RTTs for TLS handshake on every asset download."
      }
    ]
  },
  {
    "id": "cn-dns-resolution-pipeline",
    "title": "DNS Complete Resolution Pipeline & 8-Step Resolution Flow",
    "domain": "computer-networks",
    "category": "Module 3: Domain Name System (DNS) Architecture & Resolution Pipeline",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "DNS operates as an 8-step resolution pipeline:\n1. **Browser Cache**: Browser checks its internal memory cache.\n2. **OS Cache / Hosts File**: Checks OS local DNS cache and `/etc/hosts` file.\n3. **Re...",
    "keyConcepts": [
      "Order: Browser Cache -> OS Cache -> Resolver -> Root -> TLD -> Authoritative.",
      "Root (.) -> TLD (.com) -> Authoritative (google.com).",
      "Decouple human domain names from dynamic server IP addresses."
    ],
    "detailedContent": "### \ud83d\udccc DNS Complete Resolution Pipeline & 8-Step Resolution Flow\n\n**What is it?**  \nDNS (Domain Name System) is the hierarchical distributed database system that translates human-readable domain names (`google.com`) into machine-routable IP addresses (`142.250.190.46`).\n\n### \ud83d\udca1 Simple Explanation\nDNS operates as an 8-step resolution pipeline:\n1. **Browser Cache**: Browser checks its internal memory cache.\n2. **OS Cache / Hosts File**: Checks OS local DNS cache and `/etc/hosts` file.\n3. **Recursive Resolver (ISP / 1.1.1.1)**: OS queries Local Recursive Resolver.\n4. **Root Name Server (`.`)**: Resolver queries Root Server. Returns `.com` TLD IP.\n5. **TLD Name Server (`.com`)**: Resolver queries `.com` TLD Server. Returns `google.com` Authoritative IP.\n6. **Authoritative Name Server**: Resolver queries Authoritative Server. Returns IP `142.250.190.46`.\n7. **Caching**: Resolver caches IP with TTL.\n8. **OS & Browser**: OS returns IP to browser, which initiates TCP connection!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> DNS is like calling directory assistance: Check phone contacts (Browser cache) -> Check home phonebook (OS cache) -> Call Directory Operator (Recursive Resolver) -> Operator asks National Directory (Root), State Directory (TLD), and City Directory (Authoritative) to get final phone number!\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Decouple human domain names from dynamic server IP addresses.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- CDNs (Cloudflare, AWS Route53) use Geo-DNS to return IP of nearest edge server.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Order: Browser Cache -> OS Cache -> Resolver -> Root -> TLD -> Authoritative.\n- Root (.) -> TLD (.com) -> Authoritative (google.com).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nPipeline: Browser Cache -> OS Cache -> Recursive Resolver -> Root Server -> TLD Server -> Authoritative Server -> IP Returned!\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Trace the full DNS resolution pipeline for google.com.\n\n### \u26a1 Topicid\n3.1\n\n### \u26a1 Quickrevisionnotes\n- DNS converts domain names to IP addresses via an 8-step resolution tree.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between a Recursive Resolver and an Authoritative DNS Server?",
        "answer": "A **Recursive Resolver** (ISP / 1.1.1.1) acts as a agent for the client, executing all queries to Root, TLD, and Authoritative servers. An **Authoritative DNS Server** holds the actual master DNS records (A, CNAME) for a specific domain."
      }
    ]
  },
  {
    "id": "cn-dns-record-types",
    "title": "DNS Record Types (A, AAAA, CNAME, MX, NS, TXT)",
    "domain": "computer-networks",
    "category": "Module 3: Domain Name System (DNS) Architecture & Resolution Pipeline",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Common DNS Record Types:\n- **`A` Record**: Maps domain name to IPv4 address (`1.2.3.4`).\n- **`AAAA` Record**: Maps domain name to 128-bit IPv6 address (`2001:db8::1`).\n- **`CNAME` Record**: Canonic...",
    "keyConcepts": [
      "A = IPv4, AAAA = IPv6.",
      "CNAME = Alias pointing to another domain.",
      "MX = Mail server routing.",
      "TXT = Domain verification (SPF/DKIM).",
      "Support diverse internet protocols (Web IPv4/v6, Email, Domain Ownership) under unified DNS system."
    ],
    "detailedContent": "### \ud83d\udccc DNS Record Types (A, AAAA, CNAME, MX, NS, TXT)\n\n**What is it?**  \nDNS Records are text mapping instructions stored in Authoritative DNS servers defining how requests for a domain should be routed.\n\n### \ud83d\udca1 Simple Explanation\nCommon DNS Record Types:\n- **`A` Record**: Maps domain name to IPv4 address (`1.2.3.4`).\n- **`AAAA` Record**: Maps domain name to 128-bit IPv6 address (`2001:db8::1`).\n- **`CNAME` Record**: Canonical Name alias mapping one domain to another (`app.example.com -> example.com`).\n- **`MX` Record**: Mail Exchange record routing domain emails to mail servers.\n- **`NS` Record**: Name Server record specifying authoritative servers for domain.\n- **`TXT` Record**: Text record for domain ownership verification (SPF, DKIM).\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> A Record is a home address. CNAME is a nickname alias pointing to a person. MX Record is a PO Box address for mail delivery. TXT Record is an ID card proof of ownership.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Support diverse internet protocols (Web IPv4/v6, Email, Domain Ownership) under unified DNS system.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Email services (Google Workspace) require configuring `MX`, `SPF`, and `DKIM` TXT records to prevent email spam marking.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- A = IPv4, AAAA = IPv6.\n- CNAME = Alias pointing to another domain.\n- MX = Mail server routing.\n- TXT = Domain verification (SPF/DKIM).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nDNS Records:\nexample.com.      IN A     93.184.216.34\nexample.com.      IN AAAA  2606:2800:220:1:248:1893:25c8:1946\napp.example.com.  IN CNAME example.com.\nexample.com.      IN MX 10 mail.example.com.\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between an A Record and a CNAME Record?\n\n### \u26a1 Topicid\n3.2\n\n### \u26a1 Quickrevisionnotes\n- A = IPv4; AAAA = IPv6; CNAME = Alias to another domain.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between an A Record and a CNAME Record?",
        "answer": "An `A` Record maps a domain name directly to an IP address (`example.com -> 1.2.3.4`). A `CNAME` Record maps a domain alias to another domain name (`blog.example.com -> example.com`), requiring a second DNS lookup to resolve the final IP."
      }
    ]
  },
  {
    "id": "cn-dns-caching-ttl-queries",
    "title": "DNS Caching, TTL & Recursive vs Iterative Queries",
    "domain": "computer-networks",
    "category": "Module 3: Domain Name System (DNS) Architecture & Resolution Pipeline",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "1. **TTL (Time To Live)**: Expiration timer (in seconds) set by domain owner specifying how long DNS resolvers can cache a record before re-querying authoritative servers.\n2. **Recursive Query**: C...",
    "keyConcepts": [
      "TTL = Cache expiration duration in seconds.",
      "Recursive Query = Resolver finds final answer for client.",
      "Iterative Query = Server returns referral pointer.",
      "Reduce global DNS traffic load on Root and TLD servers."
    ],
    "detailedContent": "### \ud83d\udccc DNS Caching, TTL & Recursive vs Iterative Queries\n\n**What is it?**  \nDNS Caching stores record responses for a Time-To-Live (TTL) duration. Queries are categorized as Recursive or Iterative.\n\n### \ud83d\udca1 Simple Explanation\n1. **TTL (Time To Live)**: Expiration timer (in seconds) set by domain owner specifying how long DNS resolvers can cache a record before re-querying authoritative servers.\n2. **Recursive Query**: Client asks Recursive Resolver to find answer; Resolver executes all queries until it returns final IP to client.\n3. **Iterative Query**: Resolver asks Name Servers; Name Servers reply with referral pointers ('I don't know, ask .com TLD at IP X').\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Recursive query is delegating a task to an assistant who does all work and returns finished result. Iterative query is getting directed from one department clerk to another until you find the right office.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Reduce global DNS traffic load on Root and TLD servers.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- When migrating web servers, DBAs lower TTL to 60 seconds a day in advance so IP changes propagate rapidly.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- TTL = Cache expiration duration in seconds.\n- Recursive Query = Resolver finds final answer for client.\n- Iterative Query = Server returns referral pointer.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nRecursive Query: Client ---> Resolver (Returns final IP!)\nIterative Query: Resolver ---> Root Server (Returns TLD Referral IP)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between Recursive and Iterative DNS Queries?\n\n### \u26a1 Topicid\n3.3\n\n### \u26a1 Quickrevisionnotes\n- TTL determines cache expiration time.\n- Recursive = Resolver does work; Iterative = Referral pointers returned.\n",
    "interviewQuestions": [
      {
        "question": "What is the difference between Recursive and Iterative DNS Queries?",
        "answer": "In a Recursive Query, the client asks the resolver to deliver the final answer, placing full responsibility on the resolver. In an Iterative Query, the queried server returns the best referral answer it has (pointing to Root, TLD, or Authoritative server)."
      }
    ]
  },
  {
    "id": "cn-what-happens-when-you-type-google-com",
    "title": "Interview Question: 'What happens when you type google.com into a browser and press Enter?'",
    "domain": "computer-networks",
    "category": "Module 3: Domain Name System (DNS) Architecture & Resolution Pipeline",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Model 10-Step Answer:\n1. URL Parsing & HSTS check.\n2. DNS Lookup (Browser -> OS -> Resolver -> Root -> TLD -> Authoritative -> IP `142.250.190.46`).\n3. ARP Lookup for Gateway Router MAC.\n4. TCP 3-W...",
    "keyConcepts": [
      "DNS -> ARP -> TCP 3-Way -> TLS 1.3 -> HTTP GET -> 200 OK -> DOM Paint.",
      "Standard benchmark question for evaluating full-stack software engineer systems knowledge."
    ],
    "detailedContent": "### \ud83d\udccc Interview Question: 'What happens when you type google.com into a browser and press Enter?'\n\n**What is it?**  \nComprehensive 10-step master interview answer covering DNS, ARP, TCP Handshake, TLS Handshake, HTTP Request, Server Processing, and DOM Rendering.\n\n### \ud83d\udca1 Simple Explanation\nModel 10-Step Answer:\n1. URL Parsing & HSTS check.\n2. DNS Lookup (Browser -> OS -> Resolver -> Root -> TLD -> Authoritative -> IP `142.250.190.46`).\n3. ARP Lookup for Gateway Router MAC.\n4. TCP 3-Way Handshake (SYN, SYN-ACK, ACK on Port 443).\n5. TLS 1.3 Handshake (ClientHello, Certificate Validation, AES Key Exchange).\n6. HTTP GET Request sent over encrypted TLS stream.\n7. Web Server (Nginx) processes request, executes application logic/DB query.\n8. Server returns HTTP 200 OK response with HTML/CSS/JS payload.\n9. Browser parses DOM tree, CSSOM tree, executes JavaScript.\n10. Browser paints rendered pixels on screen!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Complete journey of ordering goods from an overseas supplier: Lookup address -> Get delivery route -> Establish transport contract -> Encrypt package -> Ship request -> Process order -> Deliver goods -> Unbox & Display.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Standard benchmark question for evaluating full-stack software engineer systems knowledge.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Interviewers use this question to branch into TCP mechanics, TLS handshakes, or browser rendering performance.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- DNS -> ARP -> TCP 3-Way -> TLS 1.3 -> HTTP GET -> 200 OK -> DOM Paint.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nFull Sequence:\n[Type URL] -> [DNS Resolution] -> [ARP Lookup] -> [TCP Handshake] -> [TLS 1.3 Handshake] -> [HTTP GET] -> [200 OK] -> [DOM Render]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Provide an end-to-end technical explanation of opening google.com.\n\n### \u26a1 Topicid\n3.4\n\n### \u26a1 Quickrevisionnotes\n- Master sequence: DNS -> ARP -> TCP -> TLS -> HTTP -> Render.\n",
    "interviewQuestions": [
      {
        "question": "What happens if the server's SSL certificate is expired when you type google.com?",
        "answer": "During the TLS Handshake step, the browser inspects the server's SSL Certificate digital signature against trusted Certificate Authorities (CAs). If expired, the browser aborts the TLS handshake and displays an untrusted security warning ('NET::ERR_CERT_DATE_INVALID')."
      }
    ]
  },
  {
    "id": "cn-tcp-header-connection-oriented",
    "title": "TCP Segment Header & Connection-Oriented Mechanics",
    "domain": "computer-networks",
    "category": "Module 4: Transport Layer & TCP Deep Dive",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "TCP Header Fields:\n- **Source & Destination Ports** (16 bits each): Identifies sending and receiving process endpoints.\n- **Sequence Number** (32 bits): Byte offset of first data byte in segment.\n-...",
    "keyConcepts": [
      "TCP Header Size: 20 to 60 Bytes.",
      "Sequence Number: Tracks byte stream order.",
      "ACK Number: Next expected byte sequence number.",
      "Flags: SYN, ACK, FIN, RST, PSH, URG.",
      "Provide reliable, in-order byte stream execution over unreliable IP networks."
    ],
    "detailedContent": "### \ud83d\udccc TCP Segment Header & Connection-Oriented Mechanics\n\n**What is it?**  \nTCP is a connection-oriented, reliable transport protocol providing ordered byte stream delivery with a 20-60 byte header containing Sequence/ACK numbers and Window sizes.\n\n### \ud83d\udca1 Simple Explanation\nTCP Header Fields:\n- **Source & Destination Ports** (16 bits each): Identifies sending and receiving process endpoints.\n- **Sequence Number** (32 bits): Byte offset of first data byte in segment.\n- **Acknowledgment Number** (32 bits): Next expected byte sequence number from sender.\n- **Header Length (Data Offset)**: Specifies header size (20-60 bytes).\n- **Flags**: `SYN` (Synchronize), `ACK` (Acknowledge), `FIN` (Finish), `RST` (Reset), `PSH` (Push), `URG` (Urgent).\n- **Window Size** (16 bits): Advertised Receive Window (`rwnd`) for flow control.\n- **Checksum**: Error detection for header and payload.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> TCP Header is like a registered shipping label containing sender/receiver room numbers, package sequence ID #5 of 10, return receipt signature block, and return box capacity limit.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Provide reliable, in-order byte stream execution over unreliable IP networks.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Wireshark parses TCP headers to display sequence numbers, window scaling factors, and retransmission flags.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- TCP Header Size: 20 to 60 Bytes.\n- Sequence Number: Tracks byte stream order.\n- ACK Number: Next expected byte sequence number.\n- Flags: SYN, ACK, FIN, RST, PSH, URG.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nTCP Header Format:\n 0                   16                   31\n+--------------------+--------------------+\n| Source Port (16)   | Dest Port (16)     |\n+--------------------+--------------------+\n|           Sequence Number (32)          |\n+-----------------------------------------+\n|        Acknowledgment Number (32)       |\n+----+------+--------+--------------------+\n|HLen|Rsvd  | Flags  | Window Size (16)   |\n+----+------+--------+--------------------+\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What fields are present in a TCP Header?\n- What is the difference between Sequence Number and Acknowledgment Number?\n\n### \u26a1 Topicid\n4.1\n\n### \u26a1 Quickrevisionnotes\n- TCP Header = 20-60 bytes; contains Ports, Seq #, ACK #, Flags, Window Size.\n",
    "interviewQuestions": [
      {
        "question": "If a sender transmits a TCP segment with `Sequence Number = 1000` and payload length = 500 bytes, what will the receiver's `ACK Number` be?",
        "answer": "The receiver's `ACK Number` will be `1500` ($1000 + 500$), indicating it successfully received bytes 1000-1499 and expects byte 1500 next."
      }
    ]
  },
  {
    "id": "cn-tcp-three-way-handshake-failures",
    "title": "TCP 3-Way Handshake & Lost Packet Scenarios (Lost SYN, SYN-ACK, ACK)",
    "domain": "computer-networks",
    "category": "Module 4: Transport Layer & TCP Deep Dive",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "1. **3-Way Handshake Steps**:\n   - **Step 1: `SYN` (Client -> Server)**: Client picks $ISN_C$, sends `SYN`.\n   - **Step 2: `SYN+ACK` (Server -> Client)**: Server picks $ISN_S$, acknowledges $ISN_C ...",
    "keyConcepts": [
      "Handshake: SYN -> SYN+ACK -> ACK.",
      "Why 3-Way: Synchronize ISN in BOTH directions.",
      "Lost SYN: Client retransmits SYN.",
      "Lost SYN+ACK: Server retransmits SYN+ACK.",
      "Lost ACK: Data packet carries implied ACK to establish server side.",
      "Synchronize initial sequence numbers in both directions before transmitting data."
    ],
    "detailedContent": "### \ud83d\udccc TCP 3-Way Handshake & Lost Packet Scenarios (Lost SYN, SYN-ACK, ACK)\n\n**What is it?**  \nThe TCP 3-Way Handshake (`SYN`, `SYN+ACK`, `ACK`) establishes bidirectional sequence synchronization, while loss handling rules dictate retransmission behavior.\n\n### \ud83d\udca1 Simple Explanation\n1. **3-Way Handshake Steps**:\n   - **Step 1: `SYN` (Client -> Server)**: Client picks $ISN_C$, sends `SYN`.\n   - **Step 2: `SYN+ACK` (Server -> Client)**: Server picks $ISN_S$, acknowledges $ISN_C + 1$, sends `SYN+ACK`.\n   - **Step 3: `ACK` (Client -> Server)**: Client acknowledges $ISN_S + 1$, sends `ACK` (`ESTABLISHED` state).\n\n2. **Lost Packet Failure Scenarios**:\n   - **Why 3-Way and not 2-Way?**: 2-Way only confirms Client -> Server reachability. 3-Way is required to synchronize sequence numbers in BOTH directions and confirm bidirectional reachability.\n   - **If `SYN` (Step 1) is Lost**: Client receives no response, times out, and retransmits `SYN` after RTO timer (Retransmission Timeout).\n   - **If `SYN+ACK` (Step 2) is Lost**: Client retransmits `SYN`; Server retransmits `SYN+ACK` after timeout.\n   - **If `ACK` (Step 3) is Lost**: Client considers connection `ESTABLISHED` and sends data payload. Server remains in `SYN_RCVD` state and retransmits `SYN+ACK`. When server receives data payload containing implied ACK, server transitions to `ESTABLISHED`.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Phone call: 1. 'Hello, can you hear me?' (SYN). 2. 'Yes I hear you, can you hear me?' (SYN+ACK). 3. 'Yes I hear you too!' (ACK). If 3rd ACK is lost, caller starts speaking their message; receiver hears message and realizes connection is working.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Synchronize initial sequence numbers in both directions before transmitting data.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- SYN Flood DDoS attacks flood servers with fake Step 1 `SYN` packets to exhaust `SYN_RCVD` server buffers (mitigated by SYN Cookies).\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Handshake: SYN -> SYN+ACK -> ACK.\n- Why 3-Way: Synchronize ISN in BOTH directions.\n- Lost SYN: Client retransmits SYN.\n- Lost SYN+ACK: Server retransmits SYN+ACK.\n- Lost ACK: Data packet carries implied ACK to establish server side.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nClient                               Server\n  | --- SYN (seq=ISN_C) -------------> | (SYN_SENT -> SYN_RCVD)\n  | <--- SYN+ACK (ack=ISN_C+1) ------- |\n  | --- ACK (ack=ISN_S+1) -----------> | (ESTABLISHED!)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Why 3-way handshake and not 2-way?\n- What happens if SYN, SYN-ACK, or ACK packets are lost?\n\n### \u26a1 Topicid\n4.2\n\n### \u26a1 Quickrevisionnotes\n- 3-Way handshake synchronizes ISN in both directions.\n- Lost Step 3 ACK is resolved when client sends first data payload.\n",
    "interviewQuestions": [
      {
        "question": "What happens if the 3rd ACK packet in the TCP 3-Way Handshake is lost?",
        "answer": "The client transitions to `ESTABLISHED` and immediately transmits data payload containing an implicit ACK number. The server (in `SYN_RCVD`) receives the data payload, validates the ACK number, transitions to `ESTABLISHED`, and processes the data."
      }
    ]
  },
  {
    "id": "cn-tcp-retransmission-seq-ack-rto",
    "title": "TCP Sequence Numbers, ACKs, Retransmission & RTO Timers",
    "domain": "computer-networks",
    "category": "Module 4: Transport Layer & TCP Deep Dive",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "1. **Sequence & ACK Numbers**: Sequence numbers track byte positions in the stream. TCP uses **Cumulative ACKs**: `ACK 1500` means 'I have received all bytes up to 1499, send byte 1500 next'.\n2. **...",
    "keyConcepts": [
      "Cumulative ACK: Confirms receipt of all bytes up to ACK-1.",
      "RTO Timer: Dynamic timeout for packet retransmission.",
      "Fast Retransmit: Triggered by 3 Duplicate ACKs.",
      "Guarantee 100% loss recovery and correct byte stream ordering over lossy IP networks."
    ],
    "detailedContent": "### \ud83d\udccc TCP Sequence Numbers, ACKs, Retransmission & RTO Timers\n\n**What is it?**  \nTCP guarantees reliable delivery using Sequence Numbers, Cumulative ACKs, Retransmission Timeouts (RTO), and Retransmission timers.\n\n### \ud83d\udca1 Simple Explanation\n1. **Sequence & ACK Numbers**: Sequence numbers track byte positions in the stream. TCP uses **Cumulative ACKs**: `ACK 1500` means 'I have received all bytes up to 1499, send byte 1500 next'.\n2. **Retransmission Timeout (RTO)**: Dynamic timer based on estimated Round Trip Time (RTT). If no ACK is received before RTO expires, sender retransmits segment.\n3. **Fast Retransmit**: If sender receives **3 Duplicate ACKs** for the same segment, it assumes packet loss occurred and retransmits immediately without waiting for RTO timer to expire!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Cumulative ACK is like a page count check: 'I read pages 1 to 50, give me page 51 next'. Fast Retransmit is a teacher hearing 3 students shout 'Where is page 51?' and immediately reprinting page 51 without waiting for the class bell.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Guarantee 100% loss recovery and correct byte stream ordering over lossy IP networks.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Linux kernel continuously computes smoothed RTT (SRTT) to adjust RTO dynamically.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Cumulative ACK: Confirms receipt of all bytes up to ACK-1.\n- RTO Timer: Dynamic timeout for packet retransmission.\n- Fast Retransmit: Triggered by 3 Duplicate ACKs.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nCumulative ACK Example:\nSender sends Seg 1 (1-500), Seg 2 (501-1000), Seg 3 (1001-1500)\nReceiver gets Seg 1 -> Sends ACK 501\nReceiver gets Seg 3 (Seg 2 lost!) -> Sends ACK 501 (Dup ACK 1)\nReceiver gets Seg 4 -> Sends ACK 501 (Dup ACK 2)\nReceiver gets Seg 5 -> Sends ACK 501 (Dup ACK 3 -> Fast Retransmit Seg 2!)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is Cumulative ACK in TCP?\n- What triggers Fast Retransmit?\n\n### \u26a1 Topicid\n4.3\n\n### \u26a1 Quickrevisionnotes\n- Cumulative ACK indicates next expected byte.\n- 3 Duplicate ACKs trigger Fast Retransmit.\n",
    "interviewQuestions": [
      {
        "question": "What triggers TCP Fast Retransmit?",
        "answer": "Fast Retransmit is triggered when the sender receives 3 Duplicate ACKs for the same sequence number. It immediately retransmits the missing segment without waiting for the RTO timer to expire."
      }
    ]
  },
  {
    "id": "cn-tcp-four-way-termination-time-wait",
    "title": "TCP 4-Way Connection Termination, TIME_WAIT & RST Resets",
    "domain": "computer-networks",
    "category": "Module 4: Transport Layer & TCP Deep Dive",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "1. **4-Way Termination Steps**:\n   - Client sends `FIN` (`FIN_WAIT_1`).\n   - Server sends `ACK` (`CLOSE_WAIT`).\n   - Server sends `FIN` (`LAST_ACK`).\n   - Client sends `ACK` and enters **`TIME_WAIT...",
    "keyConcepts": [
      "4-Way Teardown: FIN -> ACK -> FIN -> ACK.",
      "TIME_WAIT Duration: 2 * MSL (60-120s).",
      "TIME_WAIT Purpose: Reliable final ACK delivery & old packet drain.",
      "RST Flag: Abrupt connection termination.",
      "Ensure clean teardown and prevent lingering delayed packets from corrupting new connections."
    ],
    "detailedContent": "### \ud83d\udccc TCP 4-Way Connection Termination, TIME_WAIT & RST Resets\n\n**What is it?**  \nTCP connection teardown uses a 4-Way Handshake (`FIN`/`ACK`), enters `TIME_WAIT` state for $2 \times \text{MSL}$, or aborts instantly via `RST` resets.\n\n### \ud83d\udca1 Simple Explanation\n1. **4-Way Termination Steps**:\n   - Client sends `FIN` (`FIN_WAIT_1`).\n   - Server sends `ACK` (`CLOSE_WAIT`).\n   - Server sends `FIN` (`LAST_ACK`).\n   - Client sends `ACK` and enters **`TIME_WAIT` state**.\n2. **TIME_WAIT State & $2 \times \text{MSL}$**:\n   - Client stays in `TIME_WAIT` for 2 times Maximum Segment Lifetime (60-120 seconds).\n   - **Why Necessary?**: 1) Ensures final `ACK` reaches server (if lost, client can re-ACK). 2) Allows old delayed in-flight packets to die out so they don't corrupt a new connection reusing the same Port!\n3. **RST (Reset) Flag**: Abruptly terminates connection instantly without 4-way teardown (used during closed port connections or crashes).\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> TIME_WAIT is standing at the front door for 2 minutes after saying goodbye to ensure the guest didn't drop their car keys before locking the door. RST is hanging up the phone abruptly.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Ensure clean teardown and prevent lingering delayed packets from corrupting new connections.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- High-throughput servers use `SO_REUSEADDR` and `tcp_tw_reuse` kernel flags to manage TIME_WAIT socket exhaustion.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- 4-Way Teardown: FIN -> ACK -> FIN -> ACK.\n- TIME_WAIT Duration: 2 * MSL (60-120s).\n- TIME_WAIT Purpose: Reliable final ACK delivery & old packet drain.\n- RST Flag: Abrupt connection termination.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nTermination Sequence:\nClient                       Server\n  | --- FIN -----------------> | (FIN_WAIT_1 -> CLOSE_WAIT)\n  | <--- ACK ----------------- |\n  | <--- FIN ----------------- | (LAST_ACK)\n  | --- ACK -----------------> | (TIME_WAIT 2*MSL -> CLOSED)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Why does TCP require a 4-Way termination instead of 3-Way?\n- What is the TIME_WAIT state and why is it necessary?\n\n### \u26a1 Topicid\n4.4\n\n### \u26a1 Quickrevisionnotes\n- 4-Way teardown: FIN -> ACK -> FIN -> ACK.\n- TIME_WAIT lasts 2*MSL to drain lingering packets.\n",
    "interviewQuestions": [
      {
        "question": "Why is TCP termination 4-way, and what is the purpose of TIME_WAIT state?",
        "answer": "TCP is full-duplex, so each direction must close independently with a `FIN` and `ACK` (4 steps total). `TIME_WAIT` holds the client socket for $2 \times \text{MSL}$ to ensure the server receives the final `ACK` and to drain lingering packets from the network before reusing the port."
      }
    ]
  },
  {
    "id": "cn-tcp-flow-control-sliding-window",
    "title": "TCP Flow Control & Sliding Window Protocol",
    "domain": "computer-networks",
    "category": "Module 5: TCP Flow Control vs Congestion Control",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Flow Control guarantees a fast sender does not overflow a slow receiver's RAM buffer:\n- **Receive Window (`rwnd`)**: The receiver advertises its available buffer space in every TCP Header (`rwnd`)....",
    "keyConcepts": [
      "Flow Control: Protects RECEIVER.",
      "Advertised Window: `rwnd` in TCP header.",
      "Zero Window: Sent when receiver buffer is 100% full.",
      "Window Probes: Sent by sender to check if `rwnd` opened.",
      "Prevent receiver buffer overflow and dropped data packets."
    ],
    "detailedContent": "### \ud83d\udccc TCP Flow Control & Sliding Window Protocol\n\n**What is it?**  \nTCP Flow Control protects the RECEIVER buffer from being overwhelmed by a fast sender using the Sliding Window protocol and advertised Receive Window (`rwnd`).\n\n### \ud83d\udca1 Simple Explanation\nFlow Control guarantees a fast sender does not overflow a slow receiver's RAM buffer:\n- **Receive Window (`rwnd`)**: The receiver advertises its available buffer space in every TCP Header (`rwnd`).\n- **Sliding Window**: The sender transmits data up to `rwnd` unacknowledged bytes. As ACKs return, the window slides forward.\n- **Zero Window**: If `rwnd = 0`, the receiver buffer is full! The sender pauses data transmission and periodically sends 1-byte **Window Probe** packets until receiver advertises `rwnd > 0`.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Flow Control is a factory worker holding up a red 'STOP' sign when their inbox tray is full of boxes, then holding up a green 'GO' sign once they clear the tray.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Prevent receiver buffer overflow and dropped data packets.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Window Scaling (RFC 1323) allows TCP headers to scale window sizes beyond 64KB for high-speed fiber links.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Flow Control: Protects RECEIVER.\n- Advertised Window: `rwnd` in TCP header.\n- Zero Window: Sent when receiver buffer is 100% full.\n- Window Probes: Sent by sender to check if `rwnd` opened.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nSliding Window:\n[ Sent & ACKed ] [ Sent Not ACKed | Can Send ] [ Cannot Send Yet ]\n                 <------- rwnd Window ------->\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- How does TCP Flow Control protect the receiver?\n- What happens when the receiver advertises a Zero Window?\n\n### \u26a1 Topicid\n5.1\n\n### \u26a1 Quickrevisionnotes\n- Flow control protects receiver via rwnd window in TCP header.\n",
    "interviewQuestions": [
      {
        "question": "What is Zero Window in TCP Flow Control?",
        "answer": "When the receiver's application buffer is completely full, it advertises `rwnd = 0`. The sender stops transmitting data and sends periodic 1-byte Window Probe packets to check when the receiver buffer has space available."
      }
    ]
  },
  {
    "id": "cn-tcp-congestion-control-algorithms",
    "title": "TCP Congestion Control Algorithms (Slow Start, Congestion Avoidance, Fast Recovery)",
    "domain": "computer-networks",
    "category": "Module 5: TCP Flow Control vs Congestion Control",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Sender Limit = $\\text{MIN}(rwnd, cwnd)$. Congestion control operates in 4 phases:\n1. **Slow Start**: Starts with small `cwnd` (e.g. 10 MSS). Doubles `cwnd` exponentially ($1 \\rightarrow 2 \\rightarr...",
    "keyConcepts": [
      "Congestion Control: Protects NETWORK (`cwnd`).",
      "Slow Start: Exponential growth up to `ssthresh`.",
      "Congestion Avoidance: Linear $+1$ MSS per RTT (AIMD).",
      "Fast Retransmit: Triggered by 3 Duplicate ACKs.",
      "Prevent global Internet congestion collapse caused by aggressive concurrent senders."
    ],
    "detailedContent": "### \ud83d\udccc TCP Congestion Control Algorithms (Slow Start, Congestion Avoidance, Fast Recovery)\n\n**What is it?**  \nTCP Congestion Control protects intermediate NETWORK routers from traffic overload by dynamically adjusting the Congestion Window (`cwnd`).\n\n### \ud83d\udca1 Simple Explanation\nSender Limit = $\\text{MIN}(rwnd, cwnd)$. Congestion control operates in 4 phases:\n1. **Slow Start**: Starts with small `cwnd` (e.g. 10 MSS). Doubles `cwnd` exponentially ($1 \\rightarrow 2 \\rightarrow 4 \\rightarrow 8$) per RTT until reaching `ssthresh`.\n2. **Congestion Avoidance**: Increases `cwnd` linearly ($+1$ MSS per RTT) to probe network capacity (AIMD).\n3. **Fast Retransmit**: Retransmits missing packet immediately upon receiving **3 Duplicate ACKs**.\n4. **Fast Recovery**: Cuts `ssthresh = cwnd / 2`, sets `cwnd = ssthresh`, and resumes linear growth without dropping to Slow Start.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Congestion Control is traffic metering merging onto a highway. Slow Start is accelerating. Congestion Avoidance is cruising at speed limit. Fast Retransmit is swerving around a stalled car when 3 drivers honk.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Prevent global Internet congestion collapse caused by aggressive concurrent senders.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Linux uses TCP BBR (Bottleneck Bandwidth and RTT) algorithm developed by Google.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Congestion Control: Protects NETWORK (`cwnd`).\n- Slow Start: Exponential growth up to `ssthresh`.\n- Congestion Avoidance: Linear $+1$ MSS per RTT (AIMD).\n- Fast Retransmit: Triggered by 3 Duplicate ACKs.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\ncwnd Phases:\nSlow Start (Exponential) -> ssthresh -> Congestion Avoidance (Linear +1) -> Loss -> Cut cwnd by 50%\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Difference between Flow Control and Congestion Control.\n- Explain AIMD (Additive Increase Multiplicative Decrease).\n\n### \u26a1 Topicid\n5.2\n\n### \u26a1 Quickrevisionnotes\n- Congestion Control protects network using cwnd window.\n- Effective window = MIN(rwnd, cwnd).\n",
    "interviewQuestions": [
      {
        "question": "What is AIMD in TCP Congestion Control?",
        "answer": "AIMD (Additive Increase Multiplicative Decrease) increases `cwnd` linearly (+1 MSS per RTT) during normal operation, but cuts `cwnd` in half multiplicatively when packet loss occurs."
      }
    ]
  },
  {
    "id": "cn-udp-protocol-mechanics",
    "title": "UDP Protocol Mechanics & Datagram Architecture",
    "domain": "computer-networks",
    "category": "Module 6: User Datagram Protocol (UDP) & TCP vs UDP Trade-Offs",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "UDP provides minimal protocol overhead with a fixed **8-byte header** (Source Port, Destination Port, Length, Checksum).\n- **Connectionless**: No 3-way handshake.\n- **Unreliable**: No ACKs, no retr...",
    "keyConcepts": [
      "UDP Header: 8 Bytes.",
      "No Handshake, No ACKs, No Retransmissions.",
      "Datagram-oriented.",
      "Provide zero-latency communication for real-time applications."
    ],
    "detailedContent": "### \ud83d\udccc UDP Protocol Mechanics & Datagram Architecture\n\n**What is it?**  \nUDP (User Datagram Protocol) is a lightweight, connectionless Transport Layer protocol that transmits datagrams without handshake, sequence ordering, or retransmission.\n\n### \ud83d\udca1 Simple Explanation\nUDP provides minimal protocol overhead with a fixed **8-byte header** (Source Port, Destination Port, Length, Checksum).\n- **Connectionless**: No 3-way handshake.\n- **Unreliable**: No ACKs, no retransmission.\n- **Unordered**: Datagrams may arrive out of order.\n- **Datagram Boundaries**: Preserves message boundaries.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> UDP is throwing paper airplanes across a room. They travel instantly without waiting for a handshake, but if one falls on the floor, no one resends it.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Provide zero-latency communication for real-time applications.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- DNS, DHCP, SNMP, WebRTC, and QUIC run over UDP.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- UDP Header: 8 Bytes.\n- No Handshake, No ACKs, No Retransmissions.\n- Datagram-oriented.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nUDP Header (8 Bytes):\n[ Source Port (2B) | Dest Port (2B) | Length (2B) | Checksum (2B) ]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What fields make up the 8-byte UDP header?\n\n### \u26a1 Topicid\n6.1\n\n### \u26a1 Quickrevisionnotes\n- UDP header is only 8 bytes; connectionless with no handshake.\n",
    "interviewQuestions": [
      {
        "question": "What are the 4 fields in a UDP header?",
        "answer": "Source Port (16 bits), Destination Port (16 bits), Length (16 bits), and Checksum (16 bits) \u2014 total 8 bytes."
      }
    ]
  },
  {
    "id": "cn-tcp-vs-udp-tradeoff-matrix",
    "title": "TCP vs UDP In-Depth Trade-off Matrix & Protocol Selection",
    "domain": "computer-networks",
    "category": "Module 6: User Datagram Protocol (UDP) & TCP vs UDP Trade-Offs",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Trade-Off Selection Rules:\n- **Choose TCP**: Web Browsing (HTTP/HTTPS), File Transfer (FTP), Email (SMTP), Databases (SQL), Remote Shell (SSH). 100% data integrity required.\n- **Choose UDP**: DNS Q...",
    "keyConcepts": [
      "TCP: 20-60B header, 100% reliable, ordered, slower.",
      "UDP: 8B header, unreliable, unordered, sub-millisecond fast.",
      "Guide software architects on transport protocol selection."
    ],
    "detailedContent": "### \ud83d\udccc TCP vs UDP In-Depth Trade-off Matrix & Protocol Selection\n\n**What is it?**  \nComprehensive decision matrix evaluating when applications should choose TCP (Accuracy over speed) vs UDP (Speed over accuracy).\n\n### \ud83d\udca1 Simple Explanation\nTrade-Off Selection Rules:\n- **Choose TCP**: Web Browsing (HTTP/HTTPS), File Transfer (FTP), Email (SMTP), Databases (SQL), Remote Shell (SSH). 100% data integrity required.\n- **Choose UDP**: DNS Queries, Live Video (WebRTC), Voice (VoIP), Online Gaming (Valorant), QUIC (HTTP/3). Ultra-low latency required.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> TCP is registered mail requiring signed receipt. UDP is live radio broadcast where missing 1 second of audio is better than pausing the live show.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Guide software architects on transport protocol selection.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Multiplayer games send position updates every 16ms over UDP.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- TCP: 20-60B header, 100% reliable, ordered, slower.\n- UDP: 8B header, unreliable, unordered, sub-millisecond fast.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nMatrix:\nTCP: HTTP, HTTPS, SSH, SQL (100% Reliable)\nUDP: DNS, VoIP, Gaming, QUIC (Low Latency)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Why do online multiplayer games use UDP instead of TCP?\n\n### \u26a1 Topicid\n6.2\n\n### \u26a1 Quickrevisionnotes\n- Choose TCP for data accuracy; choose UDP for real-time speed.\n",
    "interviewQuestions": [
      {
        "question": "Why do online games use UDP instead of TCP?",
        "answer": "Gaming requires sub-50ms latency. If a packet drops in TCP, execution pauses while waiting for retransmission (Head-of-Line blocking). In gaming, an old position packet is useless by the time it is retransmitted. UDP delivers fresh packets instantly."
      }
    ]
  },
  {
    "id": "cn-quic-protocol-http3-architecture",
    "title": "QUIC Protocol Architecture & HTTP/3 Advantages",
    "domain": "computer-networks",
    "category": "Module 7: Modern Web Transport: QUIC & HTTP/3 Architecture",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "QUIC features:\n1. **Zero Transport HoL Blocking**: Loss on Stream 1 does NOT pause Stream 2.\n2. **Fast Connection Setup**: 1-RTT or 0-RTT combined Transport+TLS 1.3 handshake.\n3. **Connection Migra...",
    "keyConcepts": [
      "HTTP/3 runs on QUIC over UDP.",
      "0 Transport HoL Blocking.",
      "Connection Migration via 64-bit CID.",
      "Eliminate legacy TCP kernel limitations and transport HoL blocking."
    ],
    "detailedContent": "### \ud83d\udccc QUIC Protocol Architecture & HTTP/3 Advantages\n\n**What is it?**  \nQUIC is an advanced Transport Layer protocol developed by Google running over UDP that integrates TLS 1.3 encryption, eliminates Transport Head-of-Line blocking, and supports Connection Migration.\n\n### \ud83d\udca1 Simple Explanation\nQUIC features:\n1. **Zero Transport HoL Blocking**: Loss on Stream 1 does NOT pause Stream 2.\n2. **Fast Connection Setup**: 1-RTT or 0-RTT combined Transport+TLS 1.3 handshake.\n3. **Connection Migration**: Uses 64-bit Connection ID (CID) allowing mobile users to switch from Wi-Fi to 5G without dropping connections!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> QUIC is a 10-lane highway where a breakdown in lane 1 doesn't stop cars in lanes 2-10.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Eliminate legacy TCP kernel limitations and transport HoL blocking.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Google and Cloudflare serve >70% of web traffic over HTTP/3.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- HTTP/3 runs on QUIC over UDP.\n- 0 Transport HoL Blocking.\n- Connection Migration via 64-bit CID.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nStack: [ HTTP/3 ] ---> [ QUIC (TLS 1.3 Built-in) ] ---> [ UDP ] ---> [ IP ]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- How does QUIC Connection Migration work?\n\n### \u26a1 Topicid\n7.1\n\n### \u26a1 Quickrevisionnotes\n- QUIC runs over UDP; eliminates Transport HoL blocking and supports Connection Migration.\n",
    "interviewQuestions": [
      {
        "question": "How does QUIC Connection Migration work when switching networks?",
        "answer": "TCP binds connections to IP:Port tuples; changing IP breaks TCP. QUIC uses a 64-bit Connection ID (CID) independent of IP. When a device switches from Wi-Fi to 5G, the server recognizes the CID and continues the session seamlessly."
      }
    ]
  },
  {
    "id": "cn-ip-addressing-ipv4-ipv6",
    "title": "IPv4 vs IPv6 Architecture & Address Structure",
    "domain": "computer-networks",
    "category": "Module 8: Network Layer, IP Architecture & Addressing",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "- **IPv4**: 32-bit address (`192.168.1.10`), 4.3 billion addresses.\n- **IPv6**: 128-bit hex address (`2001:db8::1`), $3.4 \\times 10^{38}$ addresses.",
    "keyConcepts": [
      "IPv4 = 32-bit; IPv6 = 128-bit.",
      "Provide unique logical addressing for global internet routing."
    ],
    "detailedContent": "### \ud83d\udccc IPv4 vs IPv6 Architecture & Address Structure\n\n**What is it?**  \nThe Network Layer handles logical end-to-end packet delivery using 32-bit IPv4 or 128-bit IPv6 addresses.\n\n### \ud83d\udca1 Simple Explanation\n- **IPv4**: 32-bit address (`192.168.1.10`), 4.3 billion addresses.\n- **IPv6**: 128-bit hex address (`2001:db8::1`), $3.4 \\times 10^{38}$ addresses.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> IPv4 is a 7-digit phone number that ran out. IPv6 is a 20-digit number that will never run out.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Provide unique logical addressing for global internet routing.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- IPv6 is widely deployed across mobile carriers (4G/5G networks).\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- IPv4 = 32-bit; IPv6 = 128-bit.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nIPv4: 192.168.1.10 (32 bits)\nIPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (128 bits)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Compare IPv4 vs IPv6 header and address size.\n\n### \u26a1 Topicid\n8.1\n\n### \u26a1 Quickrevisionnotes\n- IPv4 = 32 bits; IPv6 = 128 bits.\n",
    "interviewQuestions": [
      {
        "question": "What is the size difference between IPv4 and IPv6 addresses?",
        "answer": "IPv4 uses 32-bit addresses (4 bytes). IPv6 uses 128-bit addresses (16 bytes)."
      }
    ]
  },
  {
    "id": "cn-subnet-mask-cidr-default-gateway",
    "title": "Subnet Mask, Default Gateway & CIDR Notation",
    "domain": "computer-networks",
    "category": "Module 8: Network Layer, IP Architecture & Addressing",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "In `192.168.1.10/24`, `/24` specifies 24 Network Bits (`255.255.255.0`) and 8 Host Bits. Default Gateway (`192.168.1.1`) routes packets destined outside the local subnet.",
    "keyConcepts": [
      "CIDR /24 = 255.255.255.0 subnet mask.",
      "Default Gateway = Router interface IP for external traffic.",
      "Enable hierarchical IP routing and local subnet traffic isolation."
    ],
    "detailedContent": "### \ud83d\udccc Subnet Mask, Default Gateway & CIDR Notation\n\n**What is it?**  \nCIDR notation specifies Network vs Host bit partitioning using subnet masks, while Default Gateways route non-local traffic.\n\n### \ud83d\udca1 Simple Explanation\nIn `192.168.1.10/24`, `/24` specifies 24 Network Bits (`255.255.255.0`) and 8 Host Bits. Default Gateway (`192.168.1.1`) routes packets destined outside the local subnet.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Subnet mask is the street boundary; Default Gateway is the mail truck leaving the post office.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Enable hierarchical IP routing and local subnet traffic isolation.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Cloud subnets specify CIDR blocks like `/24` to assign server IPs.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- CIDR /24 = 255.255.255.0 subnet mask.\n- Default Gateway = Router interface IP for external traffic.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\n192.168.1.10/24 -> Network: 192.168.1.0, Gateway: 192.168.1.1\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What does /24 mean in CIDR notation?\n\n### \u26a1 Topicid\n8.2\n\n### \u26a1 Quickrevisionnotes\n- CIDR slash indicates count of network bits.\n",
    "interviewQuestions": [
      {
        "question": "What is the purpose of a Default Gateway?",
        "answer": "A Default Gateway is the router IP address on a local subnet that host devices forward traffic to when the destination IP address lies outside the local subnet."
      }
    ]
  },
  {
    "id": "cn-subnetting-math-cidr-practice",
    "title": "Subnetting Math & Practice (/24, /25, /26, /27, /30 CIDR Blocks)",
    "domain": "computer-networks",
    "category": "Module 9: Subnetting Masterclass & CIDR Calculations",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Subnetting Table for `192.168.1.0`:\n- **/24**: Mask `255.255.255.0`, Total IPs = 256, Usable = **254**.\n- **/25**: Mask `255.255.255.128`, Total IPs = 128, Usable = **126**.\n- **/26**: Mask `255.25...",
    "keyConcepts": [
      "/24 = 254 usable; /25 = 126 usable; /26 = 62 usable; /27 = 30 usable.",
      "Reduce network broadcast storms and isolate subnet security zones."
    ],
    "detailedContent": "### \ud83d\udccc Subnetting Math & Practice (/24, /25, /26, /27, /30 CIDR Blocks)\n\n**What is it?**  \nSubnetting divides physical IP networks into smaller, isolated logical sub-networks.\n\n### \ud83d\udca1 Simple Explanation\nSubnetting Table for `192.168.1.0`:\n- **/24**: Mask `255.255.255.0`, Total IPs = 256, Usable = **254**.\n- **/25**: Mask `255.255.255.128`, Total IPs = 128, Usable = **126**.\n- **/26**: Mask `255.255.255.192`, Total IPs = 64, Usable = **62**.\n- **/27**: Mask `255.255.255.224`, Total IPs = 32, Usable = **30**.\n- **/30**: Mask `255.255.255.252`, Total IPs = 4, Usable = **2** (Point-to-point links).\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Dividing 1 floor into 4 separate locked security suites.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Reduce network broadcast storms and isolate subnet security zones.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- AWS VPC design uses `/24` public subnets and `/26` private DB subnets.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- /24 = 254 usable; /25 = 126 usable; /26 = 62 usable; /27 = 30 usable.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nSubnet Table:\n/24 -> 254 IPs (255.255.255.0)\n/25 -> 126 IPs (255.255.255.128)\n/26 -> 62 IPs  (255.255.255.192)\n/27 -> 30 IPs  (255.255.255.224)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Solve CIDR subnetting problems for /25, /26, and /27.\n\n### \u26a1 Topicid\n9.1\n\n### \u26a1 Quickrevisionnotes\n- Each extra subnet bit doubles subnets and halves host capacity.\n",
    "interviewQuestions": [
      {
        "question": "How many subnets and usable host IPs per subnet do you get by splitting a /24 network into /26 subnets?",
        "answer": "Borrowing 2 bits ($26 - 24 = 2$) creates $2^2 = 4$ subnets. Each /26 subnet has $32 - 26 = 6$ host bits, yielding $2^6 - 2 = 62$ usable host IPs per subnet."
      }
    ]
  },
  {
    "id": "cn-subnetting-usable-ips-calculation",
    "title": "Network Bits vs Host Bits & Usable IP Address Calculation ($2^H - 2$)",
    "domain": "computer-networks",
    "category": "Module 9: Subnetting Masterclass & CIDR Calculations",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Host Bits $H = 32 - \\text{CIDR}$. Total IPs = $2^H$. Usable IPs = $2^H - 2$.\n- **First IP (All host bits 0)** = Network Address.\n- **Last IP (All host bits 1)** = Broadcast Address.",
    "keyConcepts": [
      "Usable IPs = $2^H - 2$.",
      "Network ID = All host bits 0; Broadcast ID = All host bits 1.",
      "Reserve Network and Broadcast IDs for IP routing mechanisms."
    ],
    "detailedContent": "### \ud83d\udccc Network Bits vs Host Bits & Usable IP Address Calculation ($2^H - 2$)\n\n**What is it?**  \nFormula $2^H - 2$ calculates usable host IP addresses by subtracting Network ID and Broadcast ID.\n\n### \ud83d\udca1 Simple Explanation\nHost Bits $H = 32 - \\text{CIDR}$. Total IPs = $2^H$. Usable IPs = $2^H - 2$.\n- **First IP (All host bits 0)** = Network Address.\n- **Last IP (All host bits 1)** = Broadcast Address.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> In a 100-room hotel, room 0 is the reception desk (Network ID) and room 99 is the emergency alarm PA system (Broadcast ID), leaving 98 rooms for guests.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Reserve Network and Broadcast IDs for IP routing mechanisms.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- AWS reserves 5 IP addresses per VPC subnet for gateway, DNS, and network management.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Usable IPs = $2^H - 2$.\n- Network ID = All host bits 0; Broadcast ID = All host bits 1.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nUsable Host IP Formula:\nUsable Hosts = 2^(32 - CIDR) - 2\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Why must you subtract 2 from total IP addresses when calculating usable host IPs?\n\n### \u26a1 Topicid\n9.2\n\n### \u26a1 Quickrevisionnotes\n- Usable IPs = 2^H - 2 (Subtract Network ID and Broadcast ID).\n",
    "interviewQuestions": [
      {
        "question": "Why can't you assign the first or last IP address of a subnet to a host machine?",
        "answer": "The first IP (all host bits 0) is reserved as the Network ID to identify the subnet in routing tables. The last IP (all host bits 1) is reserved as the Subnet Broadcast Address to send packets to all hosts on that subnet."
      }
    ]
  },
  {
    "id": "cn-routing-table-static-dynamic",
    "title": "Routing Table Architecture, Static vs Dynamic Routing & Default Routes",
    "domain": "computer-networks",
    "category": "Module 10: Routing Architecture & Routing Protocols (RIP, OSPF, BGP)",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Routers inspect packet Destination IP and check Routing Table entries: Destination Subnet, Subnet Mask, **Next Hop IP**, and Interface. Default route (`0.0.0.0/0`) handles external internet traffic.",
    "keyConcepts": [
      "Routing Table maps Subnets to Next Hop IP.",
      "Default Route = `0.0.0.0/0`.",
      "Route IP traffic deterministically across hop-by-hop router interfaces."
    ],
    "detailedContent": "### \ud83d\udccc Routing Table Architecture, Static vs Dynamic Routing & Default Routes\n\n**What is it?**  \nRouting selects optimal paths across routers to forward IP packets using Routing Tables.\n\n### \ud83d\udca1 Simple Explanation\nRouters inspect packet Destination IP and check Routing Table entries: Destination Subnet, Subnet Mask, **Next Hop IP**, and Interface. Default route (`0.0.0.0/0`) handles external internet traffic.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Static routing is following printed driving instructions; Default route is taking the highway exit when no local sign matches.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Route IP traffic deterministically across hop-by-hop router interfaces.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Linux systems inspect routing tables via `ip route` command.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Routing Table maps Subnets to Next Hop IP.\n- Default Route = `0.0.0.0/0`.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nLinux Route Table: default via 192.168.1.1 dev eth0\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is a Default Route in a routing table?\n\n### \u26a1 Topicid\n10.1\n\n### \u26a1 Quickrevisionnotes\n- Default route 0.0.0.0/0 handles all unmatched external traffic.\n",
    "interviewQuestions": [
      {
        "question": "What is the purpose of a Default Route (`0.0.0.0/0`) in a router's routing table?",
        "answer": "The Default Route acts as a catch-all gateway. When a router receives a packet whose destination IP does not match any specific subnet entry in its routing table, it forwards the packet to the Default Route (the Default Gateway)."
      }
    ]
  },
  {
    "id": "cn-routing-protocols-rip-ospf-bgp",
    "title": "Routing Protocols: RIP (Distance-Vector), OSPF (Link-State) & BGP (Path-Vector)",
    "domain": "computer-networks",
    "category": "Module 10: Routing Architecture & Routing Protocols (RIP, OSPF, BGP)",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "- **RIP**: Distance-Vector protocol. Uses Hop Count (max 15 hops). Legacy.\n- **OSPF**: Link-State protocol. Uses **Dijkstra's Shortest Path Algorithm** based on link bandwidth. Used inside Autonomo...",
    "keyConcepts": [
      "RIP = Distance Vector (Hop Count max 15).",
      "OSPF = Link State (Dijkstra, IGP inside corporate networks).",
      "BGP = Path Vector (EGP between global ISPs).",
      "Dynamically reroute internet traffic around failed fiber cables and congested routers."
    ],
    "detailedContent": "### \ud83d\udccc Routing Protocols: RIP (Distance-Vector), OSPF (Link-State) & BGP (Path-Vector)\n\n**What is it?**  \nDynamic Routing Protocols automatically discover paths and update routing tables: RIP (Hop count), OSPF (Dijkstra bandwidth cost), and BGP (Internet backbone).\n\n### \ud83d\udca1 Simple Explanation\n- **RIP**: Distance-Vector protocol. Uses Hop Count (max 15 hops). Legacy.\n- **OSPF**: Link-State protocol. Uses **Dijkstra's Shortest Path Algorithm** based on link bandwidth. Used inside Autonomous Systems (IGP).\n- **BGP**: Path-Vector protocol powering the global Internet backbone (EGP). Routes traffic between Autonomous Systems (ISPs).\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> RIP is taking the route with fewest traffic lights. OSPF is taking the fastest highway using Dijkstra speed limits. BGP is arranging international flight paths between countries.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Dynamically reroute internet traffic around failed fiber cables and congested routers.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- BGP route leaks cause major global outages where Facebook or Cloudflare become unreachable.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- RIP = Distance Vector (Hop Count max 15).\n- OSPF = Link State (Dijkstra, IGP inside corporate networks).\n- BGP = Path Vector (EGP between global ISPs).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nProtocols: RIP (Hop Count) | OSPF (Link State/Dijkstra) | BGP (Internet Backbone EGP)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between OSPF (IGP) and BGP (EGP)?\n\n### \u26a1 Topicid\n10.2\n\n### \u26a1 Quickrevisionnotes\n- OSPF routes inside an enterprise (IGP); BGP routes between ISPs (EGP).\n",
    "interviewQuestions": [
      {
        "question": "What is Border Gateway Protocol (BGP) and where is it used?",
        "answer": "BGP is the Path-Vector Exterior Gateway Protocol (EGP) that connects the global Internet. It routes IP traffic between independent Autonomous Systems (AS) operated by major ISPs, cloud providers, and telecom carriers."
      }
    ]
  },
  {
    "id": "cn-arp-resolution-process-scenario",
    "title": "ARP Operation, Resolution Sequence & Destination MAC Unknown Scenario",
    "domain": "computer-networks",
    "category": "Module 11: Address Resolution Protocol (ARP)",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Resolution Sequence:\n1. Check local ARP Cache (`arp -a`).\n2. Send **ARP Request (Broadcast `FF:FF:FF:FF:FF:FF`)**: *'Who has IP 192.168.1.20? Tell 192.168.1.10'*\n3. Target sends **ARP Reply (Unicas...",
    "keyConcepts": [
      "ARP Request = Broadcast (`FF:FF:FF:FF:FF:FF`).",
      "ARP Reply = Unicast.",
      "ARP Cache stores IP-to-MAC mappings.",
      "Bridge logical Layer 3 IP routing to physical Layer 2 Ethernet frame delivery."
    ],
    "detailedContent": "### \ud83d\udccc ARP Operation, Resolution Sequence & Destination MAC Unknown Scenario\n\n**What is it?**  \nARP (Address Resolution Protocol) resolves a known Layer 3 IP Address into a physical Layer 2 MAC Address required for Ethernet frame delivery.\n\n### \ud83d\udca1 Simple Explanation\nResolution Sequence:\n1. Check local ARP Cache (`arp -a`).\n2. Send **ARP Request (Broadcast `FF:FF:FF:FF:FF:FF`)**: *'Who has IP 192.168.1.20? Tell 192.168.1.10'*\n3. Target sends **ARP Reply (Unicast)**: *'192.168.1.20 is at MAC AA:BB:CC:DD:EE:FF'*\n4. Sender caches MAC and transmits data frame.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Shouting in an office: 'Who is John Smith?' (Broadcast). John Smith replies: 'I am at Desk 4' (Unicast Reply).\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Bridge logical Layer 3 IP routing to physical Layer 2 Ethernet frame delivery.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- ARP Spoofing/Poisoning sends fake ARP replies to intercept LAN traffic (MITM attack).\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- ARP Request = Broadcast (`FF:FF:FF:FF:FF:FF`).\n- ARP Reply = Unicast.\n- ARP Cache stores IP-to-MAC mappings.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nARP Request (Broadcast FF:FF:FF:FF:FF:FF) -> ARP Reply (Unicast)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Explain the ARP resolution process when destination MAC is unknown.\n\n### \u26a1 Topicid\n11.1\n\n### \u26a1 Quickrevisionnotes\n- ARP Maps IP to MAC; Request is Broadcast, Reply is Unicast.\n",
    "interviewQuestions": [
      {
        "question": "You know the destination IP address but don't know the destination MAC address. What happens step-by-step?",
        "answer": "The host checks its ARP cache. If missing, it broadcasts an ARP Request frame (`FF:FF:FF:FF:FF:FF`). The target device responds with a unicast ARP Reply containing its MAC address. The host caches the MAC and transmits the pending Ethernet frame."
      }
    ]
  },
  {
    "id": "cn-mac-address-ethernet-frame",
    "title": "MAC Addresses & Ethernet Frame Architecture",
    "domain": "computer-networks",
    "category": "Module 12: Data Link Layer, MAC Addresses & Ethernet Switching",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Ethernet Frame Layout:\n`[ Preamble | Dest MAC (6B) | Source MAC (6B) | Type (2B) | IP Packet Payload | Frame Check Sequence FCS (4B) ]`.\nFirst 3 bytes of MAC = OUI (Organizationally Unique Identifi...",
    "keyConcepts": [
      "MAC = 48-bit (6-byte) physical address.",
      "First 3 bytes = OUI Vendor Code.",
      "Deliver frames between physical network interfaces on local Ethernet links."
    ],
    "detailedContent": "### \ud83d\udccc MAC Addresses & Ethernet Frame Architecture\n\n**What is it?**  \nMAC (Media Access Control) addresses are 48-bit physical hardware identifiers burned into Network Interface Cards (NICs).\n\n### \ud83d\udca1 Simple Explanation\nEthernet Frame Layout:\n`[ Preamble | Dest MAC (6B) | Source MAC (6B) | Type (2B) | IP Packet Payload | Frame Check Sequence FCS (4B) ]`.\nFirst 3 bytes of MAC = OUI (Organizationally Unique Identifier) Vendor Code.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> MAC address is like a fingerprint burned onto a NIC at the factory.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Deliver frames between physical network interfaces on local Ethernet links.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Network engineers use MAC filtering on wireless access points for basic device access control.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- MAC = 48-bit (6-byte) physical address.\n- First 3 bytes = OUI Vendor Code.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nMAC: 00:1A:2B:3C:4D:5E\n[ OUI Vendor (3B) ] [ NIC Serial (3B) ]\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the structure of a 48-bit MAC address?\n\n### \u26a1 Topicid\n12.1\n\n### \u26a1 Quickrevisionnotes\n- MAC address is a 48-bit hardware identifier.\n",
    "interviewQuestions": [
      {
        "question": "What is the OUI in a MAC address?",
        "answer": "The OUI (Organizationally Unique Identifier) is the first 24 bits (3 bytes) of a MAC address, assigned by the IEEE to identify the network hardware manufacturer (e.g. Cisco, Apple, Intel)."
      }
    ]
  },
  {
    "id": "cn-hub-vs-switch-vs-router-matrix",
    "title": "Hub vs Switch vs Router Master Matrix (Collision vs Broadcast Domains)",
    "domain": "computer-networks",
    "category": "Module 12: Data Link Layer, MAC Addresses & Ethernet Switching",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "- **Hub (L1)**: Repeats bits to ALL ports. 1 Collision Domain, 1 Broadcast Domain. Obsolete!\n- **Switch (L2)**: Forwards frames via MAC table. **Splits Collision Domains per port**, 1 Broadcast Dom...",
    "keyConcepts": [
      "Hub: 1 Collision, 1 Broadcast Domain.",
      "Switch: N Collision, 1 Broadcast Domain.",
      "Router: N Collision, N Broadcast Domains.",
      "Isolate network collision and broadcast domains for performance and scale."
    ],
    "detailedContent": "### \ud83d\udccc Hub vs Switch vs Router Master Matrix (Collision vs Broadcast Domains)\n\n**What is it?**  \nHubs (L1), Switches (L2), and Routers (L3) differ in OSI operational layer and domain isolation capabilities.\n\n### \ud83d\udca1 Simple Explanation\n- **Hub (L1)**: Repeats bits to ALL ports. 1 Collision Domain, 1 Broadcast Domain. Obsolete!\n- **Switch (L2)**: Forwards frames via MAC table. **Splits Collision Domains per port**, 1 Broadcast Domain.\n- **Router (L3)**: Routes IP packets. **Splits BOTH Collision & Broadcast Domains**!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Hub is a megaphone. Switch is a private telephone switchboard. Router is an international post office.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Isolate network collision and broadcast domains for performance and scale.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Enterprise networks use Layer 2/3 Switches to configure VLANs isolating DB traffic.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Hub: 1 Collision, 1 Broadcast Domain.\n- Switch: N Collision, 1 Broadcast Domain.\n- Router: N Collision, N Broadcast Domains.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nDomain Isolation Matrix:\nDevice | Layer | Collision Domains | Broadcast Domains\nHub    | L1    | 1                 | 1\nSwitch | L2    | 1 per Port        | 1\nRouter | L3    | 1 per Port        | 1 per Interface\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Compare Hub vs Switch vs Router regarding Collision and Broadcast domains.\n\n### \u26a1 Topicid\n12.2\n\n### \u26a1 Quickrevisionnotes\n- Switches separate Collision Domains; Routers separate Broadcast Domains.\n",
    "interviewQuestions": [
      {
        "question": "How do Switches and Routers differ regarding Broadcast Domains?",
        "answer": "A standard Layer 2 Switch forwards broadcast frames (`FF:FF:FF:FF:FF:FF`) to all ports, sharing 1 Broadcast Domain across all connected devices. A Layer 3 Router blocks broadcast frames by default, creating isolated Broadcast Domains on each interface."
      }
    ]
  },
  {
    "id": "cn-nat-pat-private-public-ip",
    "title": "NAT / PAT Mechanics, Private vs Public IPs & Port Forwarding",
    "domain": "computer-networks",
    "category": "Module 13: Network Address Translation (NAT) & PAT",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "RFC 1918 Private IP Ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.\n- **PAT (Port Address Translation)**: Replaces local Private IP/Port with Public IP and assigned public port (e.g. `192....",
    "keyConcepts": [
      "Private IPs: Non-routable on public Internet.",
      "PAT: Uses unique port numbers to map multiple local devices to 1 public IP.",
      "Prevent IPv4 exhaustion and hide internal private network topology."
    ],
    "detailedContent": "### \ud83d\udccc NAT / PAT Mechanics, Private vs Public IPs & Port Forwarding\n\n**What is it?**  \nNAT/PAT translates private non-routable LAN IP addresses into a single public IP address on the Internet.\n\n### \ud83d\udca1 Simple Explanation\nRFC 1918 Private IP Ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.\n- **PAT (Port Address Translation)**: Replaces local Private IP/Port with Public IP and assigned public port (e.g. `192.168.1.15:54321 <-> 203.0.113.5:40001`). NAT table routes reply traffic back to client.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> An office building with 500 employees (Private IPs) using 1 phone number (Public IP) with 4-digit extension routing.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Prevent IPv4 exhaustion and hide internal private network topology.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- AWS NAT Gateways enable EC2 instances in private subnets to download updates from the Internet.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Private IPs: Non-routable on public Internet.\n- PAT: Uses unique port numbers to map multiple local devices to 1 public IP.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nNAT Table Entry: 192.168.1.15:54321 <-> 203.0.113.5:40001 <-> 142.250.190.46:443\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What are the 3 RFC 1918 Private IP address ranges?\n\n### \u26a1 Topicid\n13.1\n\n### \u26a1 Quickrevisionnotes\n- PAT uses port numbers to multiplex thousands of private IPs onto 1 public IP.\n",
    "interviewQuestions": [
      {
        "question": "What are the 3 reserved Private IP address ranges defined in RFC 1918?",
        "answer": "1. `10.0.0.0` - `10.255.255.255` (`10.0.0.0/8`)\n2. `172.16.0.0` - `172.31.255.255` (`172.16.0.0/12`)\n3. `192.168.0.0` - `192.168.255.255` (`192.168.0.0/16`)"
      }
    ]
  },
  {
    "id": "cn-sharing-one-public-ip-scenario",
    "title": "Scenario: 'How can thousands of devices inside your home access the Internet using one public IP?'",
    "domain": "computer-networks",
    "category": "Module 13: Network Address Translation (NAT) & PAT",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Step-by-step:\n1. Device A (`192.168.1.10:5001`) and Device B (`192.168.1.20:5001`) both open connections to `google.com:443`.\n2. Router intercepts outgoing packets, replaces Private IPs with Public...",
    "keyConcepts": [
      "PAT maintains a translation table of (Private IP:Port <-> Public IP:PublicPort).",
      "Allows home Wi-Fi routers and corporate firewalls to serve hundreds of devices over 1 ISP IP."
    ],
    "detailedContent": "### \ud83d\udccc Scenario: 'How can thousands of devices inside your home access the Internet using one public IP?'\n\n**What is it?**  \nDetailed walkthrough explaining how PAT (Port Address Translation) multiplexes thousands of internal connections onto a single public IP.\n\n### \ud83d\udca1 Simple Explanation\nStep-by-step:\n1. Device A (`192.168.1.10:5001`) and Device B (`192.168.1.20:5001`) both open connections to `google.com:443`.\n2. Router intercepts outgoing packets, replaces Private IPs with Public IP `203.0.113.5`, and assigns unique public ports: `203.0.113.5:10001` for Device A, `203.0.113.5:10002` for Device B.\n3. Router records mappings in NAT table.\n4. When Google sends replies to port 10001, router rewrites destination to `192.168.1.10:5001`. For port 10002, rewrites to `192.168.1.20:5001`!\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Two apartments in a building sending letters with different internal apartment numbers printed on the return envelope.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Allows home Wi-Fi routers and corporate firewalls to serve hundreds of devices over 1 ISP IP.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Carrier-Grade NAT (CGNAT) is used by ISPs to share single public IPs across entire residential neighborhoods.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- PAT maintains a translation table of (Private IP:Port <-> Public IP:PublicPort).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nPAT Translation:\nDev A: 192.168.1.10:5000 -> Router: 203.0.113.5:40001 -> Server\nDev B: 192.168.1.20:5000 -> Router: 203.0.113.5:40002 -> Server\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Explain how PAT resolves port collision when 2 local devices use the same source port.\n\n### \u26a1 Topicid\n13.2\n\n### \u26a1 Quickrevisionnotes\n- PAT assigns unique public port numbers to eliminate source port collisions.\n",
    "interviewQuestions": [
      {
        "question": "How does PAT handle port collisions when two local devices use the exact same source port (e.g. 5000)?",
        "answer": "The NAT router assigns distinct, unique public port numbers from its pool (e.g. mapping Device A's port 5000 to public port 40001, and Device B's port 5000 to public port 40002). The unique public port is recorded in the NAT translation table to route return packets correctly."
      }
    ]
  },
  {
    "id": "cn-pki-symmetric-asymmetric-encryption",
    "title": "Public Key Infrastructure (PKI), Symmetric vs Asymmetric Cryptography & CAs",
    "domain": "computer-networks",
    "category": "Module 14: Network Security, TLS 1.3 Handshake & Security Mechanisms",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "- **Symmetric Encryption (AES-GCM)**: Same key encrypts and decrypts. Fast, but requires secure key distribution.\n- **Asymmetric Encryption (RSA, ECDHE)**: Uses a Public Key (to encrypt) and Privat...",
    "keyConcepts": [
      "Asymmetric: Key exchange & digital signatures.",
      "Symmetric: High-speed data encryption.",
      "Establish trusted, encrypted channels over untrusted public internet connections."
    ],
    "detailedContent": "### \ud83d\udccc Public Key Infrastructure (PKI), Symmetric vs Asymmetric Cryptography & CAs\n\n**What is it?**  \nPKI uses Asymmetric Cryptography (Public/Private keys) for identity authentication and key exchange, and Symmetric Cryptography for fast data payload encryption.\n\n### \ud83d\udca1 Simple Explanation\n- **Symmetric Encryption (AES-GCM)**: Same key encrypts and decrypts. Fast, but requires secure key distribution.\n- **Asymmetric Encryption (RSA, ECDHE)**: Uses a Public Key (to encrypt) and Private Key (to decrypt). Used during TLS handshake.\n- **Digital Certificates & CAs**: Certificate Authorities (Let's Encrypt) sign domain public keys to prevent identity spoofing.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Asymmetric encryption is sending an open padlock over the mail. Anyone can snap it shut around a secret key, but only the owner with the private key can unlock it.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Establish trusted, encrypted channels over untrusted public internet connections.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- SSL Certificates are validated by browsers using root CA certificates pre-installed in the OS.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Asymmetric: Key exchange & digital signatures.\n- Symmetric: High-speed data encryption.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nAsymmetric (Handshake Key Exchange) -> Symmetric (Bulk Data Encryption)\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- Compare Symmetric vs Asymmetric encryption.\n\n### \u26a1 Topicid\n14.1\n\n### \u26a1 Quickrevisionnotes\n- Asymmetric = Handshake Key Exchange; Symmetric = Fast Data Encryption.\n",
    "interviewQuestions": [
      {
        "question": "Why does HTTPS use both Asymmetric and Symmetric Encryption?",
        "answer": "Asymmetric encryption is computationally expensive but allows secure key exchange without prior shared secrets. HTTPS uses Asymmetric encryption during the TLS handshake to authenticate the server and exchange a session key, then switches to fast Symmetric encryption (AES) for actual data transfer."
      }
    ]
  },
  {
    "id": "cn-tls13-handshake-https",
    "title": "TLS 1.3 Handshake & HTTPS Request Execution Flow",
    "domain": "computer-networks",
    "category": "Module 14: Network Security, TLS 1.3 Handshake & Security Mechanisms",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Steps:\n1. `ClientHello`: Sends key share parameters.\n2. `ServerHello + Certificate + Finished`: Server verifies certificate, computes shared symmetric key (ECDHE), and returns encrypted confirmatio...",
    "keyConcepts": [
      "TLS 1.3 = 1-RTT handshake (TLS 1.2 = 2-RTT).",
      "Provide sub-100ms encrypted web connection setup."
    ],
    "detailedContent": "### \ud83d\udccc TLS 1.3 Handshake & HTTPS Request Execution Flow\n\n**What is it?**  \nTLS 1.3 Handshake is a 1-RTT cryptographic sequence establishing an encrypted HTTPS channel.\n\n### \ud83d\udca1 Simple Explanation\nSteps:\n1. `ClientHello`: Sends key share parameters.\n2. `ServerHello + Certificate + Finished`: Server verifies certificate, computes shared symmetric key (ECDHE), and returns encrypted confirmation.\n3. `Client Finished`: Client computes symmetric key and transmits encrypted HTTPS payload.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Handshake verifying passport and exchanging a secret passcode in a single 1-minute conversation.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Provide sub-100ms encrypted web connection setup.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- TLS 1.3 cuts handshake latency in half compared to 2-RTT TLS 1.2.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- TLS 1.3 = 1-RTT handshake (TLS 1.2 = 2-RTT).\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nTLS 1.3: ClientHello (Key Share) -> ServerHello (Certificate + Key Share) -> Encrypted Data\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference in latency between TLS 1.2 and TLS 1.3 handshakes?\n\n### \u26a1 Topicid\n14.2\n\n### \u26a1 Quickrevisionnotes\n- TLS 1.3 achieves 1-RTT connection setup.\n",
    "interviewQuestions": [
      {
        "question": "How does TLS 1.3 reduce handshake latency compared to TLS 1.2?",
        "answer": "TLS 1.2 required 2 round trips (2-RTT) to negotiate cipher suites and exchange keys. TLS 1.3 requires only 1 round trip (1-RTT) by sending key share parameters in the initial `ClientHello` message."
      }
    ]
  },
  {
    "id": "cn-firewall-proxies-vpn-ddos-mitm",
    "title": "Network Security Primitives: Firewall, Forward vs Reverse Proxy, VPN, DDoS & MITM",
    "domain": "computer-networks",
    "category": "Module 14: Network Security, TLS 1.3 Handshake & Security Mechanisms",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "- **Firewall**: Filters incoming/outgoing traffic based on IP/Port rules.\n- **Forward Proxy**: Sits in front of CLIENTS (hides client IP, filters employee browsing).\n- **Reverse Proxy (Nginx, Cloud...",
    "keyConcepts": [
      "Forward Proxy = Protects Clients; Reverse Proxy = Protects Servers.",
      "VPN = Encrypted IP tunnel.",
      "Protect servers and enterprise users from cyber threats."
    ],
    "detailedContent": "### \ud83d\udccc Network Security Primitives: Firewall, Forward vs Reverse Proxy, VPN, DDoS & MITM\n\n**What is it?**  \nCore network security abstractions and attack vectors protecting systems against unauthorized access and volumetric attacks.\n\n### \ud83d\udca1 Simple Explanation\n- **Firewall**: Filters incoming/outgoing traffic based on IP/Port rules.\n- **Forward Proxy**: Sits in front of CLIENTS (hides client IP, filters employee browsing).\n- **Reverse Proxy (Nginx, Cloudflare)**: Sits in front of SERVERS (load balancing, SSL termination, DDoS protection).\n- **VPN**: Creates an encrypted IP tunnel between client and remote network.\n- **DDoS**: Flooding server with traffic from botnets to exhaust CPU/bandwidth.\n- **MITM Attack**: Eavesdropping or modifying communications between two nodes.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Forward Proxy is an employee mask. Reverse Proxy is a bouncer outside a nightclub. VPN is a private underground tunnel.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Protect servers and enterprise users from cyber threats.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Cloudflare acts as a global Reverse Proxy protecting web applications from multi-terabit DDoS attacks.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- Forward Proxy = Protects Clients; Reverse Proxy = Protects Servers.\n- VPN = Encrypted IP tunnel.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nForward Proxy: Client -> [Forward Proxy] -> Internet\nReverse Proxy: Client -> Internet -> [Reverse Proxy / Nginx] -> Backend Servers\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- What is the difference between a Forward Proxy and a Reverse Proxy?\n\n### \u26a1 Topicid\n14.3\n\n### \u26a1 Quickrevisionnotes\n- Forward proxy protects clients; Reverse proxy protects servers.\n",
    "interviewQuestions": [
      {
        "question": "What is the key structural difference between a Forward Proxy and a Reverse Proxy?",
        "answer": "A **Forward Proxy** acts on behalf of clients (hiding client IPs and filtering outbound web requests). A **Reverse Proxy** acts on behalf of backend servers (handling load balancing, SSL termination, and caching)."
      }
    ]
  },
  {
    "id": "cn-cli-diagnostic-commands",
    "title": "Network Diagnostic CLI Tools (ping, traceroute, dig, curl, ss, arp)",
    "domain": "computer-networks",
    "category": "Module 15: Practical Networking Diagnostics & CLI Masterclass",
    "difficulty": "Medium",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 4,
    "summary": "Commands:\n1. `ping google.com`: ICMP reachability and RTT latency.\n2. `traceroute google.com` (`tracert`): Hop-by-hop path tracing using incrementing TTL values.\n3. `dig google.com` / `nslookup`: Q...",
    "keyConcepts": [
      "ping = ICMP RTT.",
      "traceroute = Router hops via TTL expiration.",
      "dig = DNS query.",
      "ss -tulpn = Listening ports.",
      "Enable rapid isolation of network failures during production outages."
    ],
    "detailedContent": "### \ud83d\udccc Network Diagnostic CLI Tools (ping, traceroute, dig, curl, ss, arp)\n\n**What is it?**  \nCommand-line utilities for inspecting connectivity, DNS resolution, socket states, and routing paths.\n\n### \ud83d\udca1 Simple Explanation\nCommands:\n1. `ping google.com`: ICMP reachability and RTT latency.\n2. `traceroute google.com` (`tracert`): Hop-by-hop path tracing using incrementing TTL values.\n3. `dig google.com` / `nslookup`: Queries DNS records directly.\n4. `curl -v https://example.com`: Verbose HTTP headers and TLS handshake inspection.\n5. `ss -tulpn` / `netstat`: Active listening sockets and process PIDs.\n6. `arp -a`: Local IP-to-MAC address cache.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> `ping` is knocking on a door; `traceroute` is checking GPS toll-booths; `curl -v` is reading shipping manifest labels.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Enable rapid isolation of network failures during production outages.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- Engineers use `curl -I` and `ss -tulpn` inside Docker containers to debug backend services.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- ping = ICMP RTT.\n- traceroute = Router hops via TTL expiration.\n- dig = DNS query.\n- ss -tulpn = Listening ports.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\nping -c 4 google.com\ntraceroute google.com\ndig google.com A\ncurl -v https://example.com\nss -tulpn\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- How does traceroute discover intermediate router hops using IP TTL?\n\n### \u26a1 Topicid\n15.1\n\n### \u26a1 Quickrevisionnotes\n- traceroute uses incrementing IP TTL values to trigger ICMP Time Exceeded.\n",
    "interviewQuestions": [
      {
        "question": "How does `traceroute` work internally using IP TTL expiration?",
        "answer": "`traceroute` sends packets with incrementing IP Time-To-Live (TTL) values. The first router decrements TTL=1 to 0, drops the packet, and returns an `ICMP Time Exceeded` message revealing its IP address. This repeats with TTL=2, TTL=3... until reaching the destination."
      }
    ]
  },
  {
    "id": "cn-wireshark-packet-capture-analysis",
    "title": "Packet Capture Analysis & Wireshark Debugging Workflow",
    "domain": "computer-networks",
    "category": "Module 15: Practical Networking Diagnostics & CLI Masterclass",
    "difficulty": "Hard",
    "companyTags": [
      "Cisco",
      "Cloudflare",
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Nginx"
    ],
    "importanceRating": 5,
    "summary": "Wireshark allows inspecting raw network frames:\n- Capture filters (`port 443`, `host 1.1.1.1`).\n- Inspecting TCP 3-Way Handshake flags (`SYN`, `ACK`).\n- Identifying retransmissions, duplicate ACKs,...",
    "keyConcepts": [
      "tcpdump: CLI packet capture tool.",
      "Wireshark: GUI packet analyzer.",
      "Debug complex low-level network issues that cannot be diagnosed from application logs."
    ],
    "detailedContent": "### \ud83d\udccc Packet Capture Analysis & Wireshark Debugging Workflow\n\n**What is it?**  \nPacket analysis using Wireshark and `tcpdump` captures raw network frames to inspect protocol behavior and packet loss.\n\n### \ud83d\udca1 Simple Explanation\nWireshark allows inspecting raw network frames:\n- Capture filters (`port 443`, `host 1.1.1.1`).\n- Inspecting TCP 3-Way Handshake flags (`SYN`, `ACK`).\n- Identifying retransmissions, duplicate ACKs, and TLS 1.3 handshake negotiation.\n\n> \ud83c\udfe2 **Real-World Analogy**:  \n> Wireshark is using an X-ray scanner to view contents of moving shipping boxes.\n\n### \ud83c\udfaf Why It Exists & Core Objectives\n- Debug complex low-level network issues that cannot be diagnosed from application logs.\n\n### \ud83c\udf10 Real World & Tech Industry Usage\n- DBAs use `tcpdump` to capture database packet latencies between app servers and PostgreSQL nodes.\n\n### \ud83d\udd11 Key Takeaways & Core Concepts\n- tcpdump: CLI packet capture tool.\n- Wireshark: GUI packet analyzer.\n\n### \ud83d\udcbb Syntax / Command / Architecture Diagram\n```bash\n# tcpdump CLI capture example:\nsudo tcpdump -i eth0 -n port 80 or port 443 -w capture.pcap\n```\n\n### \ud83c\udfaf Top Interview Focus Areas\n- How do you identify packet loss or retransmissions in Wireshark?\n\n### \u26a1 Topicid\n15.2\n\n### \u26a1 Quickrevisionnotes\n- tcpdump captures raw packets to file; Wireshark parses protocols visually.\n",
    "interviewQuestions": [
      {
        "question": "How do you identify TCP Retransmissions in a Wireshark packet capture?",
        "answer": "Wireshark automatically flags TCP Retransmissions in black/red text when it detects a segment re-sent with a sequence number matching a previously transmitted, unacknowledged segment."
      }
    ]
  }
];
