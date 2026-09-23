import { Server } from 'socket.io';

const SAMPLE_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    initialCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`
    }
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        expectedOutput: 'true'
      },
      {
        input: 's = "rat", t = "car"',
        expectedOutput: 'false'
      }
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    initialCode: {
      python: `def isAnagram(s: str, t: str) -> bool:
    # Write your solution here
    pass`,
      javascript: `function isAnagram(s, t) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        return false;
    }
}`
    }
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        expectedOutput: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.'
      }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    initialCode: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Write your solution here
    pass`,
      javascript: `function merge(intervals) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        
    }
};`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        return new int[][]{};
    }
}`
    }
  },
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        expectedOutput: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        expectedOutput: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    initialCode: {
      python: `def maxProfit(prices: list[int]) -> int:
    # Write your solution here
    pass`,
      javascript: `function maxProfit(prices) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        return 0;
    }
}`
    }
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        expectedOutput: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    initialCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your solution here
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        return 0;
    }
}`
    }
  }
];

export default function setupSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const waitingQueue = [];
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    // Join PvP Matchmaking
    socket.on('join_matchmaking', ({ userId, username }) => {
      // Remove any existing entry for this socket
      const existingIdx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (existingIdx !== -1) waitingQueue.splice(existingIdx, 1);

      if (waitingQueue.length > 0) {
        const opponent = waitingQueue.shift();
        const roomId = `room_${Date.now()}`;
        const randomProblem = SAMPLE_PROBLEMS[Math.floor(Math.random() * SAMPLE_PROBLEMS.length)];

        const roomData = {
          roomId,
          players: [
            { socketId: opponent.socketId, username: opponent.username, userId: opponent.userId },
            { socketId: socket.id, username: username || 'Candidate #2', userId }
          ],
          problem: randomProblem,
          startTime: Date.now(),
          isAiMatch: false
        };

        activeRooms.set(roomId, roomData);

        socket.join(roomId);
        io.sockets.sockets.get(opponent.socketId)?.join(roomId);

        io.to(roomId).emit('match_found', {
          roomId,
          players: roomData.players.map((p) => p.username),
          problem: randomProblem,
          isAiMatch: false
        });
      } else {
        waitingQueue.push({ socketId: socket.id, userId, username: username || 'Candidate #1' });
        socket.emit('waiting_for_opponent');
      }
    });

    // Start Instant AI Bot Match with difficulty tiers
    socket.on('start_ai_battle', ({ userId, username, aiDifficulty = 'master' }) => {
      const roomId = `room_ai_${Date.now()}`;
      const randomProblem = SAMPLE_PROBLEMS[Math.floor(Math.random() * SAMPLE_PROBLEMS.length)];

      const botTitles = {
        apprentice: 'AlgoBot AI (Apprentice Tier)',
        master: 'AlgoBot AI (Master Tier)',
        grandmaster: 'AlgoBot AI (Grandmaster Tier)'
      };
      const botName = botTitles[aiDifficulty] || botTitles.master;

      const roomData = {
        roomId,
        players: [
          { socketId: socket.id, username: username || 'Candidate', userId },
          { socketId: 'ai_bot', username: botName, userId: 'ai_bot' }
        ],
        problem: randomProblem,
        startTime: Date.now(),
        isAiMatch: true,
        aiDifficulty
      };

      activeRooms.set(roomId, roomData);
      socket.join(roomId);

      socket.emit('match_found', {
        roomId,
        players: [username || 'Candidate', botName],
        problem: randomProblem,
        isAiMatch: true,
        aiDifficulty
      });

      // Simulate AI bot telemetry steps based on difficulty
      let aiTests = 0;
      const stepIntervals = {
        apprentice: 6500,
        master: 4200,
        grandmaster: 2500
      };
      const intervalMs = stepIntervals[aiDifficulty] || 4200;

      const aiInterval = setInterval(() => {
        if (!activeRooms.has(roomId)) {
          clearInterval(aiInterval);
          return;
        }
        aiTests += 1;
        if (aiTests > 5) aiTests = 5;

        socket.emit('opponent_progress', {
          username: botName,
          codeLength: aiTests * 52,
          testsPassed: aiTests,
          totalTests: 5,
          lastAction: aiTests === 5 ? 'Submitting Solution...' : 'Running Test Suite'
        });

        if (aiTests >= 5) {
          clearInterval(aiInterval);
          // AI submits after small delay
          setTimeout(() => {
            if (activeRooms.has(roomId)) {
              io.to(roomId).emit('match_ended', {
                winnerSocketId: 'ai_bot',
                winnerUsername: botName,
                timeTakenSeconds: Math.round((Date.now() - roomData.startTime) / 1000)
              });
              activeRooms.delete(roomId);
            }
          }, 1500);
        }
      }, intervalMs);
    });

    // Code Progress Synchronization
    socket.on('code_progress', ({ roomId, codeLength, testsPassed, totalTests }) => {
      socket.to(roomId).emit('opponent_progress', {
        socketId: socket.id,
        codeLength,
        testsPassed,
        totalTests: totalTests || 5
      });
    });

    // Send Arena Chat / Emoji Reaction
    socket.on('send_arena_chat', ({ roomId, text, isEmoji }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const senderPlayer = room.players.find((p) => p.socketId === socket.id);
        io.to(roomId).emit('arena_chat_message', {
          id: `msg_${Date.now()}`,
          sender: senderPlayer ? senderPlayer.username : 'Candidate',
          text,
          isEmoji: !!isEmoji,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    // Submit Solution
    socket.on('submit_solution', ({ roomId, isCorrect, timeTakenSeconds }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        io.to(roomId).emit('match_ended', {
          winnerSocketId: socket.id,
          winnerUsername: room.players.find((p) => p.socketId === socket.id)?.username || 'Winner',
          timeTakenSeconds: timeTakenSeconds || Math.round((Date.now() - room.startTime) / 1000)
        });
        activeRooms.delete(roomId);
      }
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      const qIdx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (qIdx !== -1) waitingQueue.splice(qIdx, 1);

      // Check active rooms
      activeRooms.forEach((room, rId) => {
        const pIdx = room.players.findIndex((p) => p.socketId === socket.id);
        if (pIdx !== -1) {
          socket.to(rId).emit('opponent_disconnected', {
            message: 'Opponent disconnected from battle.'
          });
          activeRooms.delete(rId);
        }
      });
    });
  });

  console.log('⚡ Socket.io Real-Time Multiplayer Engine initialized.');
  return io;
}
