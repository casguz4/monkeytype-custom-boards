import { ArrowUp, ArrowDown, Minus, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface UserStats {
  username: string;
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  bestWpm: number;
  timeTyping: string;
}

interface StatsGridProps {
  stats: UserStats[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  const getComparison = (value: number, allValues: number[], higherIsBetter = true) => {
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    
    if (max === min) return 'neutral';
    if (higherIsBetter) {
      return value === max ? 'best' : value === min ? 'worst' : 'neutral';
    } else {
      return value === min ? 'best' : value === max ? 'worst' : 'neutral';
    }
  };

  const getIndicator = (status: string) => {
    if (status === 'best') {
      return <ArrowUp className="size-4 text-green-500" />;
    }
    if (status === 'worst') {
      return <ArrowDown className="size-4 text-red-500" />;
    }
    return <Minus className="size-4 text-muted-foreground" />;
  };

  const wpmValues = stats.map(s => s.wpm);
  const accuracyValues = stats.map(s => s.accuracy);
  const testsValues = stats.map(s => s.testsCompleted);
  // const bestWpmValues = stats.map(s => s.bestWpm);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="size-5 text-purple-600" />
        <h2 className="text-2xl">Battle Results</h2>
      </div>

      <div className="grid gap-4">
        {stats.map((user, index) => {
          const wpmStatus = getComparison(user.wpm, wpmValues);
          const accuracyStatus = getComparison(user.accuracy, accuracyValues);
          const testsStatus = getComparison(user.testsCompleted, testsValues);
          // const bestWpmStatus = getComparison(user.bestWpm, bestWpmValues);

          const isTopPerformer = wpmStatus === 'best' || accuracyStatus === 'best';

          return (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-6 transition-all hover:shadow-lg ${
                  isTopPerformer
                    ? 'border-purple-500/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2">
                        {user.username}
                        {isTopPerformer && (
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                            🏆 Top Performer
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.timeTyping} typing time
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Average WPM</p>
                      {getIndicator(wpmStatus)}
                    </div>
                    <p className="text-2xl">{user.wpm}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      {getIndicator(accuracyStatus)}
                    </div>
                    <p className="text-2xl">{user.accuracy}%</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Tests</p>
                      {getIndicator(testsStatus)}
                    </div>
                    <p className="text-2xl">{user.testsCompleted}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Best WPM</p>
                      <TrendingUp className="size-4 text-purple-500" />
                    </div>
                    <p className="text-2xl">{user.bestWpm}</p>
                  </div>
                </div>

                {/* Progress bars for visual comparison */}
                <div className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Speed Score</span>
                      <span>{Math.round((user.wpm / Math.max(...wpmValues)) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.wpm / Math.max(...wpmValues)) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
