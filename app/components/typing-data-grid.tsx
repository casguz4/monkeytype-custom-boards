"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Crown,
  Zap,
  Target,
  Clock,
} from "lucide-react";

// Sample data - replace with your actual data
const sampleData = [
  {
    name: "casguz4",
    addedAt: 1736017785044,
    typingStats: {
      completedTests: 24,
      startedTests: 27,
      timeTyping: 773.77,
    },
    personalBests: {
      time: {
        "15": [
          {
            acc: 90.52,
            consistency: 71.49,
            difficulty: "normal",
            lazyMode: false,
            language: "english",
            punctuation: false,
            raw: 83.18,
            wpm: 83.18,
            numbers: false,
            timestamp: 1749245753189,
          },
        ],
        "30": [
          {
            acc: 95.8,
            consistency: 79.69,
            difficulty: "normal",
            lazyMode: false,
            language: "english",
            punctuation: false,
            raw: 91.18,
            wpm: 89.99,
            numbers: false,
            timestamp: 1745265868925,
          },
          {
            acc: 92.5,
            consistency: 65.08,
            difficulty: "normal",
            lazyMode: false,
            language: "english",
            punctuation: false,
            raw: 73.59,
            wpm: 73.59,
            numbers: true,
            timestamp: 1736110291321,
          },
        ],
      },
      words: {},
    },
    xp: 1873,
    streak: 1,
    maxStreak: 2,
    isPremium: false,
    allTimeLbs: {
      time: {
        "15": {},
        "60": {},
      },
    },
    uid: "JGfM0yjn70elnOjOM4vO9h3A6Po1",
  },
  {
    name: "stephansama",
    addedAt: 1724454466307,
    typingStats: {
      completedTests: 171,
      startedTests: 173,
      timeTyping: 4948.49000000001,
    },
    personalBests: {
      time: {
        "15": [
          {
            acc: 95.18,
            consistency: 63.95,
            difficulty: "normal",
            lazyMode: false,
            language: "english",
            punctuation: false,
            raw: 63.18,
            wpm: 63.18,
            numbers: false,
            timestamp: 1724454471635,
          },
        ],
        "30": [
          {
            acc: 95.95,
            consistency: 75.68,
            difficulty: "normal",
            lazyMode: false,
            language: "english",
            punctuation: false,
            raw: 87.19,
            wpm: 84.79,
            numbers: false,
            timestamp: 1727356666135,
          },
          {
            acc: 89.9,
            consistency: 49.92,
            difficulty: "normal",
            lazyMode: false,
            language: "code_javascript_1k",
            punctuation: false,
            raw: 35.19,
            wpm: 35.19,
            numbers: false,
            timestamp: 1724455260710,
          },
        ],
      },
      words: {},
    },
    xp: 18020,
    streak: 1,
    maxStreak: 4,
    isPremium: false,
    allTimeLbs: {
      time: {
        "15": {},
        "60": {},
      },
    },
    uid: "x9RZAACq15MADNQyX5g2SUV6VOq2",
  },
];

type SortField =
  | "name"
  | "completedTests"
  | "timeTyping"
  | "xp"
  | "streak"
  | "maxStreak"
  | "bestWpm15"
  | "bestWpm30"
  | "bestAcc15"
  | "bestAcc30"
  | "addedAt";
type SortDirection = "asc" | "desc";

interface ProcessedUser {
  name: string;
  addedAt: number;
  completedTests: number;
  startedTests: number;
  timeTyping: number;
  xp: number;
  streak: number;
  maxStreak: number;
  isPremium: boolean;
  bestWpm15: number;
  bestWpm30: number;
  bestAcc15: number;
  bestAcc30: number;
  bestConsistency15: number;
  bestConsistency30: number;
  uid: string;
}

export function TypingDataGrid({ sampleData }: { sampleData: UserProfile[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("xp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [columnGroupFilter, setColumnGroupFilter] = useState<string>("all");

  // Process raw data into flattened structure
  const processedData = useMemo(() => {
    return sampleData.map((user) => {
      const best15 = user.personalBests.time["15"]?.[0];
      const best30 = user.personalBests.time["30"]?.[0];

      return {
        name: user.name,
        addedAt: user.addedAt,
        completedTests: user.typingStats.completedTests,
        startedTests: user.typingStats.startedTests,
        timeTyping: user.typingStats.timeTyping,
        xp: user.xp,
        streak: user.streak,
        maxStreak: user.maxStreak,
        isPremium: user.isPremium,
        bestWpm15: best15?.wpm || 0,
        bestWpm30: best30?.wpm || 0,
        bestAcc15: best15?.acc || 0,
        bestAcc30: best30?.acc || 0,
        bestConsistency15: best15?.consistency || 0,
        bestConsistency30: best30?.consistency || 0,
        uid: user.uid,
      } as ProcessedUser;
    });
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = processedData.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [processedData, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getVisibleColumns = () => {
    const userInfoColumns = ["name", "addedAt", "isPremium"];
    switch (columnGroupFilter) {
      case "user-info":
        return userInfoColumns;
      case "activity-stats":
        return [...userInfoColumns, "completedTests", "timeTyping", "xp"];
      case "performance":
        return [
          ...userInfoColumns,
          "bestWpm15",
          "bestWpm30",
          "bestAcc15",
          "bestAcc30",
        ];
      case "streaks":
        return [...userInfoColumns, "streak", "maxStreak"];
      default:
        return [
          ...userInfoColumns,
          "completedTests",
          "timeTyping",
          "xp",
          "bestWpm15",
          "bestWpm30",
          "bestAcc15",
          "bestAcc30",
          "streak",
          "maxStreak",
        ];
    }
  };

  const visibleColumns = getVisibleColumns();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          User Performance Dashboard
        </CardTitle>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={columnGroupFilter}
            onValueChange={setColumnGroupFilter}
          >
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Columns</SelectItem>
              <SelectItem value="user-info">User Info</SelectItem>
              <SelectItem value="activity-stats">Activity Stats</SelectItem>
              <SelectItem value="performance">Best Performance</SelectItem>
              <SelectItem value="streaks">Streaks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* User Info Group */}
                {(columnGroupFilter === "all" ||
                  columnGroupFilter === "user-info") && (
                  <>
                    <TableHead className="bg-muted/50 font-semibold">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        User Info
                      </div>
                    </TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </>
                )}

                {/* Activity Stats Group */}
                {(columnGroupFilter === "all" ||
                  columnGroupFilter === "activity-stats") && (
                  <TableHead className="bg-muted/50 font-semibold" colSpan={3}>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Activity Stats
                    </div>
                  </TableHead>
                )}

                {/* Performance Group */}
                {(columnGroupFilter === "all" ||
                  columnGroupFilter === "performance") && (
                  <TableHead className="bg-muted/50 font-semibold" colSpan={4}>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Best Performance
                    </div>
                  </TableHead>
                )}

                {/* Streaks Group */}
                {(columnGroupFilter === "all" ||
                  columnGroupFilter === "streaks") && (
                  <TableHead className="bg-muted/50 font-semibold" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Streaks
                    </div>
                  </TableHead>
                )}
              </TableRow>

              <TableRow>
                {/* User Info */}
                {visibleColumns.includes("name") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Name {getSortIcon("name")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("addedAt") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("addedAt")}
                      className="h-auto p-0 font-semibold"
                    >
                      Joined {getSortIcon("addedAt")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("isPremium") && (
                  <TableHead>Status</TableHead>
                )}

                {/* Activity Stats */}
                {visibleColumns.includes("completedTests") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("completedTests")}
                      className="h-auto p-0 font-semibold"
                    >
                      Tests {getSortIcon("completedTests")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("timeTyping") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("timeTyping")}
                      className="h-auto p-0 font-semibold"
                    >
                      Time Typing {getSortIcon("timeTyping")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("xp") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("xp")}
                      className="h-auto p-0 font-semibold"
                    >
                      XP {getSortIcon("xp")}
                    </Button>
                  </TableHead>
                )}

                {/* Performance */}
                {visibleColumns.includes("bestWpm15") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("bestWpm15")}
                      className="h-auto p-0 font-semibold"
                    >
                      15s WPM {getSortIcon("bestWpm15")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("bestWpm30") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("bestWpm30")}
                      className="h-auto p-0 font-semibold"
                    >
                      30s WPM {getSortIcon("bestWpm30")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("bestAcc15") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("bestAcc15")}
                      className="h-auto p-0 font-semibold"
                    >
                      15s Acc {getSortIcon("bestAcc15")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("bestAcc30") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("bestAcc30")}
                      className="h-auto p-0 font-semibold"
                    >
                      30s Acc {getSortIcon("bestAcc30")}
                    </Button>
                  </TableHead>
                )}

                {/* Streaks */}
                {visibleColumns.includes("streak") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("streak")}
                      className="h-auto p-0 font-semibold"
                    >
                      Current {getSortIcon("streak")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.includes("maxStreak") && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("maxStreak")}
                      className="h-auto p-0 font-semibold"
                    >
                      Max {getSortIcon("maxStreak")}
                    </Button>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredAndSortedData.map((user) => (
                <TableRow key={user.uid}>
                  {/* User Info */}
                  {visibleColumns.includes("name") && (
                    <TableCell className="font-medium">{user.name}</TableCell>
                  )}
                  {visibleColumns.includes("addedAt") && (
                    <TableCell>{formatDate(user.addedAt)}</TableCell>
                  )}
                  {visibleColumns.includes("isPremium") && (
                    <TableCell>
                      <Badge variant={user.isPremium ? "default" : "secondary"}>
                        {user.isPremium ? "Premium" : "Free"}
                      </Badge>
                    </TableCell>
                  )}

                  {/* Activity Stats */}
                  {visibleColumns.includes("completedTests") && (
                    <TableCell>{user.completedTests}</TableCell>
                  )}
                  {visibleColumns.includes("timeTyping") && (
                    <TableCell>{formatTime(user.timeTyping)}</TableCell>
                  )}
                  {visibleColumns.includes("xp") && (
                    <TableCell>{user.xp.toLocaleString()}</TableCell>
                  )}

                  {/* Performance */}
                  {visibleColumns.includes("bestWpm15") && (
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {user.bestWpm15 > 0 ? Math.round(user.bestWpm15) : "-"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("bestWpm30") && (
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {user.bestWpm30 > 0 ? Math.round(user.bestWpm30) : "-"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("bestAcc15") && (
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {user.bestAcc15 > 0
                          ? `${user.bestAcc15.toFixed(1)}%`
                          : "-"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("bestAcc30") && (
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {user.bestAcc30 > 0
                          ? `${user.bestAcc30.toFixed(1)}%`
                          : "-"}
                      </Badge>
                    </TableCell>
                  )}

                  {/* Streaks */}
                  {visibleColumns.includes("streak") && (
                    <TableCell>{user.streak}</TableCell>
                  )}
                  {visibleColumns.includes("maxStreak") && (
                    <TableCell>{user.maxStreak}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
