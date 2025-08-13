"use client";

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
import { useState, useMemo } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
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
  }, [sampleData]);

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
