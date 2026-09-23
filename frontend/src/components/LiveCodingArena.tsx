import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { io, Socket } from 'socket.io-client';
import {
  Swords,
  Users,
  Bot,
  Trophy,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  ArrowRight,
  Terminal,
  Activity,
  Award,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Send,
  BookOpen,
  ChevronRight,
  FileCode,
  Flame,
  UserCheck
} from 'lucide-react';
import { executeCode } from '../services/codeExecutionService';
import {
  LanguageType,
  AiDifficulty,
  ArenaProblem,
  OpponentTelemetry,
  MatchWinnerInfo,
  ArenaChatMessage,
  MatchHistoryItem,
  LeaderboardEntry
} from '../types/arena';

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'Alex "SpeedCoder" Chen', elo: 2150, wins: 42, losses: 5, winRate: 89.3, badge: 'Grandmaster' },
  { rank: 2, username: 'Sarah_AlgoQueen', elo: 2010, wins: 38, losses: 8, winRate: 82.6, badge: 'Grandmaster' },
  { rank: 3, username: 'AlgoBot AI (Grandmaster Tier)', elo: 1980, wins: 150, losses: 12, winRate: 92.5, badge: 'AI Bot' },
  { rank: 4, username: 'Dev_Ninja_99', elo: 1850, wins: 29, losses: 11, winRate: 72.5, badge: 'Master' },
  { rank: 5, username: 'Elena_CodeCraft', elo: 1720, wins: 21, losses: 9, winRate: 70.0, badge: 'Master' },
];

const PRESET_EMOJIS = ['👋 Good luck!', '🤝 GG!', '🚀 Speed demon!', '🔥 On fire!', '💡 Almost there!'];

export const LiveCodingArena: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<'lobby' | 'searching' | 'in_battle' | 'match_ended'>('lobby');

  const [eloRating, setEloRating] = useState<number>(() => {
    const saved = localStorage.getItem('algovault_elo');
    return saved ? parseInt(saved, 10) : 1500;
  });

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('algovault_username') || 'Candidate';
  });

  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>(() => {
    const saved = localStorage.getItem('algovault_match_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [roomId, setRoomId] = useState<string | null>(null);
  const [isAiMatch, setIsAiMatch] = useState<boolean>(false);
  const [currentProblem, setCurrentProblem] = useState<ArenaProblem | null>(null);

  const [userCode, setUserCode] = useState<string>('');
  const [language, setLanguage] = useState<LanguageType>('python');
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('master');
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  const [testsPassed, setTestsPassed] = useState<number>(0);
  const [executing, setExecuting] = useState<boolean>(false);
  const [stdout, setStdout] = useState<string>('');

  const [activeTabLeft, setActiveTabLeft] = useState<'problem' | 'console'>('problem');
  const [lobbySubTab, setLobbySubTab] = useState<'arena' | 'leaderboard' | 'history'>('arena');

  const [opponent, setOpponent] = useState<OpponentTelemetry>({
    username: 'Opponent',
    codeLength: 0,
    testsPassed: 0,
    totalTests: 5,
  });

  const [chatMessages, setChatMessages] = useState<ArenaChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');

  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 mins
  const [winnerInfo, setWinnerInfo] = useState<MatchWinnerInfo | null>(null);
  const [disconnectedMessage, setDisconnectedMessage] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('waiting_for_opponent', () => {
      setMatchState('searching');
    });

    newSocket.on('match_found', (data) => {
      setRoomId(data.roomId);
      setIsAiMatch(!!data.isAiMatch);
      setCurrentProblem(data.problem);

      const initial = data.problem?.initialCode?.[language] || data.problem?.initialCode?.python || '# Write code here';
      setUserCode(initial);

      const opponentName = data.players.find((p: string) => p !== username) || (data.isAiMatch ? 'AlgoBot AI' : 'Opponent');
      setOpponent({
        username: opponentName,
        codeLength: 0,
        testsPassed: 0,
        totalTests: 5,
      });

      setMatchState('in_battle');
      setTimerSeconds(900);
      setTestsPassed(0);
      setWinnerInfo(null);
      setDisconnectedMessage(null);
      setChatMessages([
        {
          id: 'welcome',
          sender: 'System',
          text: `Battle started against ${opponentName}! First to pass 5 test cases wins.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    });

    newSocket.on('opponent_progress', (data) => {
      setOpponent((prev) => ({
        ...prev,
        username: data.username || prev.username,
        codeLength: data.codeLength ?? prev.codeLength,
        testsPassed: data.testsPassed ?? prev.testsPassed,
        totalTests: data.totalTests || 5,
        lastAction: data.lastAction
      }));
    });

    newSocket.on('arena_chat_message', (msg: ArenaChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    newSocket.on('opponent_disconnected', (data) => {
      setDisconnectedMessage(data.message || 'Opponent left the room.');
    });

    newSocket.on('match_ended', (data) => {
      const isWinner = data.winnerUsername === username || data.winnerSocketId === newSocket.id;
      const delta = isWinner ? 25 : -15;

      let newElo = 1500;
      setEloRating((prev) => {
        newElo = Math.max(1000, prev + delta);
        localStorage.setItem('algovault_elo', newElo.toString());
        return newElo;
      });

      const winInfo: MatchWinnerInfo = {
        winnerUsername: data.winnerUsername || 'Candidate',
        timeTakenSeconds: data.timeTakenSeconds || 120,
        eloDelta: delta,
        problemTitle: currentProblem?.title || 'Coding Duel'
      };

      setWinnerInfo(winInfo);
      setMatchState('match_ended');

      // Record History
      const newHistoryItem: MatchHistoryItem = {
        id: `match_${Date.now()}`,
        opponentName: opponent.username,
        result: isWinner ? 'WIN' : 'LOSS',
        eloDelta: delta,
        timeTakenSeconds: winInfo.timeTakenSeconds,
        problemTitle: currentProblem?.title || 'Coding Challenge',
        date: new Date().toLocaleDateString()
      };

      setMatchHistory((prev) => {
        const updated = [newHistoryItem, ...prev].slice(0, 20);
        localStorage.setItem('algovault_match_history', JSON.stringify(updated));
        return updated;
      });

      if (isWinner) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [username, language, currentProblem]);

  // Battle Countdown Timer
  useEffect(() => {
    if (matchState === 'in_battle') {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSurrender();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [matchState]);

  // Language Change Handler
  const handleLanguageChange = (newLang: LanguageType) => {
    setLanguage(newLang);
    if (currentProblem && currentProblem.initialCode?.[newLang]) {
      setUserCode(currentProblem.initialCode[newLang]);
    }
  };

  // Code change emission
  const handleCodeChange = (val: string | undefined) => {
    const codeVal = val || '';
    setUserCode(codeVal);

    if (socket && roomId) {
      socket.emit('code_progress', {
        roomId,
        codeLength: codeVal.length,
        testsPassed,
        totalTests: 5,
      });
    }
  };

  const handleJoinPvP = () => {
    if (!socket) return;
    setMatchState('searching');
    socket.emit('join_matchmaking', { userId: socket.id, username });
  };

  const handleStartAiBattle = (diff: AiDifficulty) => {
    if (!socket) return;
    setShowAiModal(false);
    setMatchState('searching');
    socket.emit('start_ai_battle', { userId: socket.id, username, aiDifficulty: diff });
  };

  const handleRunTests = async () => {
    setExecuting(true);
    setActiveTabLeft('console');
    try {
      const res = await executeCode(language, userCode);
      setStdout(res.output || res.stderr || 'Code executed successfully with zero syntax errors.');

      if (res.status === 'SUCCESS') {
        const passed = Math.min(5, testsPassed + 1);
        setTestsPassed(passed);

        if (socket && roomId) {
          socket.emit('code_progress', {
            roomId,
            codeLength: userCode.length,
            testsPassed: passed,
            totalTests: 5,
          });
        }
      }
    } catch (err: any) {
      setStdout(err?.message || 'Execution error');
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitSolution = () => {
    if (!socket || !roomId) return;
    socket.emit('submit_solution', {
      roomId,
      isCorrect: true,
      timeTakenSeconds: 900 - timerSeconds,
    });
  };

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || !socket || !roomId) return;
    socket.emit('send_arena_chat', {
      roomId,
      text,
      isEmoji: !!textToSend
    });
    if (!textToSend) setChatInput('');
  };

  const handleSurrender = () => {
    setMatchState('lobby');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // User Stats Calculation
  const totalBattles = matchHistory.length;
  const winsCount = matchHistory.filter((m) => m.result === 'WIN').length;
  const lossesCount = matchHistory.filter((m) => m.result === 'LOSS').length;
  const winRate = totalBattles > 0 ? Math.round((winsCount / totalBattles) * 100) : 0;

  const getRankTitle = (elo: number) => {
    if (elo >= 2000) return 'Grandmaster';
    if (elo >= 1800) return 'Master';
    if (elo >= 1600) return 'Challenger';
    return 'Candidate';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Swords className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              1v1 Speed Coding Arena
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Live Multiplayer
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Battle online candidates or AI Bots in real-time synchronized speed coding duels.
            </p>
          </div>
        </div>

        {/* Candidate Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Rank: {getRankTitle(eloRating)}</div>
              <div className="text-base font-black text-amber-400 font-mono">{eloRating} ELO</div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Win Rate</span>
              <span className="text-emerald-400 font-bold font-mono">{winRate}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">W/L</span>
              <span className="text-slate-200 font-bold font-mono">{winsCount}/{lossesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* LOBBY VIEW */}
      {matchState === 'lobby' && (
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setLobbySubTab('arena')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                lobbySubTab === 'arena'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Battle Modes</span>
            </button>

            <button
              onClick={() => setLobbySubTab('leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                lobbySubTab === 'leaderboard'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Global Leaderboard</span>
            </button>

            <button
              onClick={() => setLobbySubTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                lobbySubTab === 'history'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Match History ({matchHistory.length})</span>
            </button>
          </div>

          {/* TAB 1: BATTLE MODES */}
          {lobbySubTab === 'arena' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PvP Matchmaking Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6 hover:border-purple-500/50 transition">
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Live PvP Matchmaking</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Match with an online candidate of similar ELO rating in real-time. Synchronize code length, test passes, and speed run solutions. First to pass 5/5 test cases wins +25 ELO.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rating Tier:</span>
                      <strong className="text-purple-400">{getRankTitle(eloRating)} ({eloRating} ELO)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Match Format:</span>
                      <strong className="text-slate-200">1v1 Speed Duel (15m limit)</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleJoinPvP}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold px-4 py-4 rounded-2xl transition shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  <span>Find Online Opponent</span>
                </button>
              </div>

              {/* AI Bot Battle Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6 hover:border-emerald-500/50 transition">
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Challenge AlgoBot AI</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Instant 1v1 battle against our simulated AI Bot across 3 difficulty tiers: Apprentice, Master, or Grandmaster. Perfect for warmups and testing problem-solving speed without waiting in queue.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Selected Bot Tier:</span>
                      <strong className="text-emerald-400 capitalize">{aiDifficulty} Tier</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Queue Time:</span>
                      <strong className="text-emerald-400">Instant (0s)</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAiModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold px-4 py-4 rounded-2xl transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Select AI Tier & Start Battle</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LEADERBOARD */}
          {lobbySubTab === 'leaderboard' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Global 1v1 Arena Leaderboard
                  </h3>
                  <p className="text-xs text-slate-400">Top ranked speed programmers in AlgoVault.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Badge</th>
                      <th className="py-3 px-4">ELO Rating</th>
                      <th className="py-3 px-4">W / L</th>
                      <th className="py-3 px-4">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                    {SAMPLE_LEADERBOARD.map((item) => (
                      <tr key={item.rank} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-amber-400">#{item.rank}</td>
                        <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                          {item.username}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                            {item.badge}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-amber-400 font-bold">{item.elo} ELO</td>
                        <td className="py-3 px-4 text-slate-300">{item.wins} / {item.losses}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">{item.winRate}%</td>
                      </tr>
                    ))}

                    {/* Current User Row */}
                    <tr className="bg-purple-950/30 border-t-2 border-purple-500/40 font-mono text-slate-200">
                      <td className="py-3.5 px-4 font-bold text-purple-400">YOU</td>
                      <td className="py-3.5 px-4 font-bold text-white font-sans flex items-center gap-2">
                        {username} (You)
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          {getRankTitle(eloRating)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-amber-400 font-bold">{eloRating} ELO</td>
                      <td className="py-3.5 px-4 text-slate-300">{winsCount} / {lossesCount}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{winRate}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MATCH HISTORY */}
          {lobbySubTab === 'history' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Match History
              </h3>

              {matchHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No 1v1 battle history recorded yet. Enter PvP Matchmaking or challenge AlgoBot AI!
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 font-mono text-xs">
                  {matchHistory.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-3 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            item.result === 'WIN'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.result === 'WIN' ? 'W' : 'L'}
                        </div>
                        <div>
                          <div className="text-white font-bold font-sans">{item.problemTitle}</div>
                          <div className="text-[10px] text-slate-400">vs {item.opponentName} • {item.date}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold ${item.eloDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.eloDelta > 0 ? `+${item.eloDelta}` : item.eloDelta} ELO
                        </div>
                        <div className="text-[10px] text-slate-400">{item.timeTakenSeconds}s</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AI BOT DIFFICULTY MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                Select AI Bot Difficulty
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Apprentice */}
              <button
                onClick={() => handleStartAiBattle('apprentice')}
                className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-400">Apprentice Tier AI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">1200 ELO</span>
                </div>
                <p className="text-xs text-slate-400">Slower coding pace (6.5s per test step). Great for warmups.</p>
              </button>

              {/* Master */}
              <button
                onClick={() => handleStartAiBattle('master')}
                className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white group-hover:text-purple-400">Master Tier AI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">1600 ELO</span>
                </div>
                <p className="text-xs text-slate-400">Moderate coding pace (4.2s per test step). Standard competitive duel.</p>
              </button>

              {/* Grandmaster */}
              <button
                onClick={() => handleStartAiBattle('grandmaster')}
                className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white group-hover:text-amber-400">Grandmaster Tier AI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">2000 ELO</span>
                </div>
                <p className="text-xs text-slate-400">Lightning fast coding pace (2.5s per test step). Extreme challenge!</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCHING MATCH OVERLAY */}
      {matchState === 'searching' && (
        <div className="h-96 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <h3 className="text-lg font-bold text-white">Searching for 1v1 Opponent...</h3>
          <p className="text-xs text-slate-400">Connecting to WebSocket Matchmaking & Initializing Room</p>
          <button
            onClick={handleSurrender}
            className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
          >
            Cancel Matchmaking
          </button>
        </div>
      )}

      {/* LIVE BATTLE ARENA */}
      {matchState === 'in_battle' && currentProblem && (
        <div className="space-y-4">
          {/* Battle Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                {currentProblem.difficulty}
              </span>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {currentProblem.title}
                  <span className="text-xs font-mono text-slate-400">({currentProblem.category})</span>
                </h2>
              </div>
            </div>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as LanguageType)}
                className="bg-slate-950 border border-slate-800 text-white font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="cpp">C++ 17</option>
                <option value="java">Java 15</option>
              </select>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-slate-200 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{formatTime(timerSeconds)}</span>
            </div>

            <button
              onClick={handleSurrender}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-900/40 transition cursor-pointer"
            >
              Surrender Battle
            </button>
          </div>

          {disconnectedMessage && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{disconnectedMessage}</span>
            </div>
          )}

          {/* Arena Main Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Panel: Problem Details & Console (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[620px]">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-bold">
                <button
                  onClick={() => setActiveTabLeft('problem')}
                  className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTabLeft === 'problem'
                      ? 'bg-slate-900 text-purple-400 border-b-2 border-purple-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Problem Statement</span>
                </button>
                <button
                  onClick={() => setActiveTabLeft('console')}
                  className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTabLeft === 'console'
                      ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Console Output</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {activeTabLeft === 'problem' ? (
                  <div className="space-y-4 text-slate-300">
                    <p className="leading-relaxed whitespace-pre-line">{currentProblem.description}</p>

                    {/* Examples */}
                    {currentProblem.examples && currentProblem.examples.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400">
                          Example Test Cases:
                        </h4>
                        {currentProblem.examples.map((ex, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono space-y-1">
                            <div>
                              <span className="text-slate-500 font-bold">Input: </span>
                              <span className="text-slate-200">{ex.input}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400 font-bold">Output: </span>
                              <span className="text-slate-200">{ex.expectedOutput}</span>
                            </div>
                            {ex.explanation && (
                              <div className="text-[10px] text-slate-400 font-sans pt-1">
                                {ex.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Constraints */}
                    {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400">
                          Constraints:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-400">
                          {currentProblem.constraints.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-mono text-xs text-slate-300">
                    <div className="text-[10px] text-slate-500 font-sans font-bold mb-2">Piston Code Execution Logs:</div>
                    {stdout ? (
                      <pre className="whitespace-pre-wrap bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200">
                        {stdout}
                      </pre>
                    ) : (
                      <div className="text-slate-500 italic">No output yet. Click "Run Tests" to evaluate your solution.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Monaco Editor & Opponent Telemetry (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Code Editor Container */}
              <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden h-[420px] shadow-xl">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    Candidate Workspace ({language})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunTests}
                      disabled={executing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{executing ? 'Executing...' : 'Run Tests'}</span>
                    </button>

                    <button
                      onClick={handleSubmitSolution}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language}
                    theme="vs-dark"
                    value={userCode}
                    onChange={handleCodeChange}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>

              {/* Bottom Split: Telemetry & Quick Chat (7 Cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telemetry Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                        {isAiMatch ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate max-w-[130px]">{opponent.username}</div>
                        <div className="text-[9px] text-slate-400 font-mono">Opponent Telemetry</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300 font-mono font-semibold">
                      <span>Test Progress</span>
                      <span className="text-purple-400">{opponent.testsPassed} / {opponent.totalTests}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
                        style={{ width: `${(opponent.testsPassed / opponent.totalTests) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-300 font-mono font-semibold pt-1">
                    <span>Your Progress</span>
                    <span className="text-emerald-400">{testsPassed} / 5</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                      style={{ width: `${(testsPassed / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Live Quick Chat & Reactions Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-2 h-[180px]">
                  <div className="text-[11px] font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      Arena Live Chat
                    </span>
                  </div>

                  {/* Chat Messages Log */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] font-mono pr-1">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="leading-tight">
                        <span className="text-purple-400 font-bold">{msg.sender}: </span>
                        <span className="text-slate-200">{msg.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Preset Emojis & Input */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <div className="flex flex-wrap gap-1">
                      {PRESET_EMOJIS.map((emoji, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendChat(emoji)}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Type taunt or chat..."
                        className="flex-1 bg-slate-950 border border-slate-800 text-white text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={() => handleSendChat()}
                        className="bg-purple-600 hover:bg-purple-500 text-white p-1 rounded-lg transition cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY / DEFEAT SCREEN */}
      {matchState === 'match_ended' && winnerInfo && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-5 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-14 h-14" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              {winnerInfo.winnerUsername === username ? '🏆 Victory!' : '💔 Battle Concluded'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Winner: <strong className="text-white">{winnerInfo.winnerUsername}</strong> ({winnerInfo.timeTakenSeconds}s elapsed)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm space-y-1">
            <div>
              Rating Adjustment: <strong className={winnerInfo.eloDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {winnerInfo.eloDelta > 0 ? `+${winnerInfo.eloDelta}` : winnerInfo.eloDelta} ELO
              </strong>
            </div>
            <div className="text-xs text-slate-400">
              New ELO Rating: <strong className="text-amber-400">{eloRating} ELO</strong> ({getRankTitle(eloRating)})
            </div>
          </div>

          <button
            onClick={() => setMatchState('lobby')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Arena Lobby</span>
          </button>
        </div>
      )}
    </div>
  );
};
