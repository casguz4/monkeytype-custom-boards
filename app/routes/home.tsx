import { ArrowLeft, Github } from "lucide-react";
import { useState } from "react";

import { ComparisonHighlights } from "~/components/ComparisonHighlights";
import { LoadingState } from "~/components/LoadingState";
import { StatsGrid } from "~/components/StatsGrid";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { UserInputForm } from "~/components/UserInputForm";

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

  async getByUserName(name: string) {
    const res = await fetch(BASE_URL + `${name}/profile?isUid=false`);
    const data = await res.json();
    return data;
  }

  async getByUserList(names: Array<string>) {
    const fetchNames = names.map((n) => {
      return fetch(BASE_URL + `${n}/profile?isUid=false`);
    });
    const responses = await Promise.all(fetchNames);
    const results = Promise.all(responses.map(async res => {
      return (await res.json());
    }));
    const data = results.map((res) => {
      debugger;
      return {
        ...res.data
      }
    })
    debugger;
    return data;
  }
}
const mtClient = new MTUserClient();

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<UserStats[] | null>(null);

  // Mock API call - in production this would fetch from MonkeyType API
  const fetchUserStats = async (users: string[]): Promise<UserStats[]> => {
    const stats = mtClient.getByUserList(users);
    console.log("stats: ", stats);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data generator
    return users.map((username) => {
      const seed = username
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = (min: number, max: number, offset: number = 0) => {
        const seeded = Math.sin(seed + offset) * 10000;
        return Math.floor(min + (seeded - Math.floor(seeded)) * (max - min));
      };

      return {
        username,
        wpm: random(45, 120, 1),
        accuracy: random(85, 99, 2),
        testsCompleted: random(50, 2500, 3),
        bestWpm: random(80, 150, 4),
        timeTyping: `${random(10, 500, 5)}h`,
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
