import { Trophy, Target, Zap, Award } from 'lucide-react';
import { motion } from 'motion/react';

import { Card } from './ui/card';

interface UserStats {
  username: string;
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  bestWpm: number;
}

interface ComparisonHighlightsProps {
  stats: UserStats[];
}

export function ComparisonHighlights({ stats }: ComparisonHighlightsProps) {
  const fastestTyper = [...stats].sort((a, b) => b.wpm - a.wpm)[0];
  const mostAccurate = [...stats].sort((a, b) => b.accuracy - a.accuracy)[0];
  const mostExperienced = [...stats].sort((a, b) => b.testsCompleted - a.testsCompleted)[0];
  const bestRecord = [...stats].sort((a, b) => b.bestWpm - a.bestWpm)[0];

  const highlights = [
    {
      icon: Zap,
      title: 'Speed Demon',
      winner: fastestTyper.username,
      value: `${fastestTyper.wpm} WPM`,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      icon: Target,
      title: 'Accuracy King',
      winner: mostAccurate.username,
      value: `${mostAccurate.accuracy}% accuracy`,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: Trophy,
      title: 'Record Holder',
      winner: bestRecord.username,
      value: `${bestRecord.bestWpm} WPM best`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Award,
      title: 'Most Dedicated',
      winner: mostExperienced.username,
      value: `${mostExperienced.testsCompleted} tests`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {highlights.map((highlight, index) => {
        const Icon = highlight.icon;
        return (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 ${highlight.bgColor} ${highlight.borderColor}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${highlight.color}`}>
                  <Icon className="size-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {highlight.title}
                  </p>
                  <p className="truncate">{highlight.winner}</p>
                  <p className="text-sm text-muted-foreground">
                    {highlight.value}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
