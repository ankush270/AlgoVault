import { TopicItem } from '../types';

export const networksTopics: TopicItem[] = [
  {
    id: 'cn-osi-tcpip-model',
    title: 'Computer Networks: OSI 7-Layer vs TCP/IP Architecture',
    domain: 'computer-networks',
    category: 'Network Architecture',
    difficulty: 'Easy',
    companyTags: ['Cisco', 'Google', 'Amazon', 'Cloudflare', 'Jio'],
    importanceRating: 5,
    summary: 'Comprehensive walkthrough of OSI 7 layers, protocols at each layer, encapsulation/decapsulation, MAC vs IP addressing.',
    keyConcepts: [
      '7 OSI Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application',
      'Encapsulation Header appending (Data -> Segment -> Packet -> Frame -> Bits)',
      'IP Address (Logical L3 routing) vs MAC Address (Physical L2 hop-to-hop)',
      'ARP (Address Resolution Protocol) IP-to-MAC mapping'
    ],
    detailedContent: `
### Summary Table of OSI Layers & Protocols
| Layer | Name | Unit | Primary Protocols & Hardware |
| :--- | :--- | :--- | :--- |
| 7 | **Application** | Data | HTTP, HTTPS, FTP, DNS, SMTP, SSH |
| 6 | **Presentation** | Data | SSL/TLS, JPEG, ASCII, Encryption/Decryption |
| 5 | **Session** | Data | RPC, NetBIOS, Sockets Session Mgmt |
| 4 | **Transport** | Segment | TCP (Reliable), UDP (Fast Unreliable), Ports |
| 3 | **Network** | Packet | IP (IPv4/IPv6), ICMP (Ping), Routers, BGP |
| 2 | **Data Link** | Frame | Ethernet, Wi-Fi (802.11), Switches, MAC Address |
| 1 | **Physical** | Bits | Cables, Fiber Optics, Hubs, Repeaters |
    `,
    interviewQuestions: [
      {
        question: 'What happens when you type https://google.com in a web browser address bar?',
        answer: '1. Browser checks HSTS & local cache -> 2. DNS Lookup (Local -> Recursive -> Root -> TLD -> Authoritative) -> 3. TCP 3-Way Handshake (SYN, SYN-ACK, ACK) -> 4. TLS 1.3 Handshake (Key Exchange, Server Cert) -> 5. HTTP GET Request sent over encrypted TLS stream -> 6. Server responds HTTP 200 OK -> 7. Browser renders DOM & executes JS.'
      }
    ]
  },
  {
    id: 'cn-tcp-vs-udp-handshake',
    title: 'Transport Layer: TCP 3-Way Handshake, 4-Way Teardown & UDP vs TCP',
    domain: 'computer-networks',
    category: 'Transport Layer',
    difficulty: 'Medium',
    companyTags: ['Netflix', 'Google', 'Meta', 'Uber', 'Zoom'],
    importanceRating: 5,
    summary: 'Reliable connection establishment (SYN, SYN-ACK, ACK), Flow Control (Sliding Window), Congestion Control (Tahoe/Reno), and UDP streaming.',
    keyConcepts: [
      'TCP 3-Way Handshake sequence numbers',
      'TCP 4-Way Connection Teardown (FIN, ACK, FIN, ACK)',
      'TCP Flow Control (Receiver Window size) vs Congestion Control (Congestion Window)',
      'TCP vs UDP tradeoffs for Video Streaming, Gaming, Web'
    ],
    detailedContent: `
### TCP 3-Way Handshake Flow
1. **Client $\\rightarrow$ Server**: Sends \`SYN\` segment with initial sequence number $ISN_c = x$.
2. **Server $\\rightarrow$ Client**: Responds with \`SYN-ACK\` segment, sequence number $ISN_s = y$, acknowledgement number $ACK = x + 1$.
3. **Client $\\rightarrow$ Server**: Sends \`ACK\` segment with sequence number $x + 1$, acknowledgement number $y + 1$. Connection Established!
    `,
    interviewQuestions: [
      {
        question: 'Why is TCP called a Connection-Oriented protocol while UDP is Connectionless?',
        answer: 'TCP requires establishing a logical session state (3-way handshake) before transmitting data, guaranteeing sequence ordering, loss retransmission, and flow control. UDP simply sends datagrams without session handshake or delivery guarantees.'
      }
    ]
  },
  {
    id: 'cn-http-versions-websockets',
    title: 'HTTP Evolution: HTTP/1.1 vs HTTP/2 vs HTTP/3 & WebSockets',
    domain: 'computer-networks',
    category: 'Application Protocols',
    difficulty: 'Hard',
    companyTags: ['Cloudflare', 'Google', 'Meta', 'Twitter/X', 'Discord'],
    importanceRating: 5,
    summary: 'Evolution from HTTP/1.1 Keep-Alive pipelining to HTTP/2 Multiplexing & HPACK to HTTP/3 QUIC protocol over UDP.',
    keyConcepts: [
      'HTTP/1.1 Head-of-Line (HOL) Blocking issue',
      'HTTP/2 Binary Frames, Multiplexing over 1 TCP connection, HPACK Header Compression',
      'HTTP/3 QUIC over UDP (Eliminates TCP HOL Blocking & fast 0-RTT reconnect)',
      'WebSockets full-duplex persistent bidirectional TCP connection'
    ],
    detailedContent: `
### HTTP Protocol Comparison
- **HTTP/1.1**: Text-based. Supports \`Connection: keep-alive\` to reuse TCP socket. Suffers from HTTP Head-of-Line blocking (subsequent requests blocked until first completes).
- **HTTP/2**: Binary-based. Introduces Multiplexing (interleaving multiple request/response streams over single TCP socket).
- **HTTP/3**: Built on QUIC (UDP-based transport). Replaces TCP so packet loss on one stream does NOT stall independent streams!
    `,
    interviewQuestions: [
      {
        question: 'How do WebSockets differ from HTTP Long Polling?',
        answer: 'Long polling opens an HTTP connection that the server holds open until new data arrives, then closes and re-opens a new connection. WebSockets establish a single persistent, full-duplex TCP connection using an initial HTTP Upgrade handshake, allowing zero-overhead real-time message exchange.'
      }
    ]
  }
];
