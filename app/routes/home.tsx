import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ComparisonHighlights } from "~/components/ComparisonHighlights";
import { LoadingState } from "~/components/LoadingState";
import { StatsGrid } from "~/components/StatsGrid";
import { Button } from "~/components/ui/button";
import { UserInputForm } from "~/components/UserInputForm";
import { UserStatsDataGrid } from "~/components/UserStatsDataGrid";

// eslint-disable-next-line react-refresh/only-export-components
export function meta() {
  return [
    { title: "Boards" },
    { description: "Manage create, view, and manage boards" },
  ];
}

const useFetchBoardsByUsernameList = (usernames: { value: string }[]) => {
  const [data, setData] = useState<UserProfile[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null
  );

  const fetchBoards = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await Promise.all(
        usernames.map(async ({ value: username }) => {
          const response = await fetch(
            `https://api.monkeytype.com/users/${username}/profile?isUid=false`
          );
          const data = (await response.json()) as {
            data: UserProfile;
          };
          return data.data;
        })
      );
      setData(data);
      setStatus("success");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setStatus("error");
    }
  }, [usernames]);

  useEffect(() => {
    fetchBoards();
  }, [usernames, fetchBoards]);

  return {
    data,
    isLoading: status === "loading",
    error: status === "error",
    success: status === "success",
    refetch: fetchBoards,
  };
};

interface UserStats {
  username: string;
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  bestWpm: number;
  timeTyping: string;
}
const BASE_URL = "https://api.monkeytype.com/users/";
class MTUserClient {
  private async fetchProfile(name: string) {
    const response = await fetch(
      `${BASE_URL}${encodeURIComponent(name)}/profile?isUid=false`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${name}: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: UserProfile };
    return data;
  }

  async getByUserName(name: string) {
    return this.fetchProfile(name);
  }

  async getByUserList(names: Array<string>) {
    return Promise.all(names.map((n) => this.fetchProfile(n)));
  }
}
const mtClient = new MTUserClient();

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<UserStats[] | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[] | null>(null);

  const fetchUserStats = async (users: string[]): Promise<UserStats[]> => {
    const profiles = await mtClient.getByUserList(users);
    setProfiles(profiles);

    const formatTimeTyping = (seconds: number) => {
      const hours = seconds / 3600;
      if (hours >= 1) {
        return `${hours.toFixed(1)}h`;
      }
      const minutes = Math.max(Math.round(seconds / 60), 1);
      return `${minutes}m`;
    };

    const bestPerformance = (profile: UserProfile) => {
      const timeEntries = Object.values(profile.personalBests.time ?? {}).flat();
      const wordEntries = Object.values(profile.personalBests.words ?? {}).flat();
      const all = [...timeEntries, ...wordEntries];
      return [...all].sort((a, b) => b.wpm - a.wpm)[0];
    };

    return profiles.map((profile) => {
      const best = bestPerformance(profile);
      const wpm = Math.round(best?.wpm ?? 0);
      const accuracy = Number(((best?.acc ?? 0)).toFixed(2));

      return {
        username: profile.name,
        wpm,
        accuracy: Number.isFinite(accuracy) ? accuracy : 0,
        testsCompleted: profile.typingStats.completedTests,
        bestWpm: wpm,
        timeTyping: formatTimeTyping(profile.typingStats.timeTyping),
      };
    });
  };

  const handleCompare = async (users: string[]) => {
    setIsLoading(true);
    try {
      const userStats = await fetchUserStats(users);
      setStats(userStats);
      toast.success(`Loaded stats for ${users.length} users!`, {
        description: "Check out who's the typing champion 🏆",
      });
    } catch (error) {
      toast.error("Failed to load stats", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStats(null);
    setProfiles(null);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {!stats ? (
        <div className="max-w-4xl mx-auto">
          <UserInputForm onCompare={handleCompare} isLoading={isLoading} />
          {isLoading && <LoadingState />}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <ArrowLeft className="size-4" />
              New Comparison
            </Button>
          </div>

          <ComparisonHighlights stats={stats} />
          <StatsGrid stats={stats} />
          {profiles && <UserStatsDataGrid profiles={profiles} />}

          {/* Fun footer message */}
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              Want to improve your score? Practice on{" "}
              <a
                href="https://monkeytype.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                MonkeyType.com
              </a>{" "}
              🐵
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
