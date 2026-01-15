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
            return <ArrowUp className='' />;
        }
        if (status === 'worst') {
            return <ArrowDown className='' />;
        }
        return <Minus className='' />;
    };

    const wpmValues = stats.map((s) => s.wpm);
    const accuracyValues = stats.map((s) => s.accuracy);
    const testsValues = stats.map((s) => s.testsCompleted);
    // const bestWpmValues = stats.map(s => s.bestWpm);

    return (
        <div className='w-full'>
            <div className=''>
                <BarChart3 className='' />
                <h2 className='text-2xl'>Battle Results</h2>
            </div>

            <div className=''>
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
                            <Card className={` ${isTopPerformer ? '' : ''}`}>
                                <div className=''>
                                    <div className=''>
                                        <div className=''>{user.username.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <h3 className=''>
                                                {user.username}
                                                {isTopPerformer && (
                                                    <Badge variant='secondary' className=''>
                                                        🏆 Top Performer
                                                    </Badge>
                                                )}
                                            </h3>
                                            <p className=''>{user.timeTyping} typing time</p>
                                        </div>
                                    </div>
                                </div>

                                <div className=''>
                                    <div className='space-y-1'>
                                        <div className=''>
                                            <p className=''>Average WPM</p>
                                            {getIndicator(wpmStatus)}
                                        </div>
                                        <p className='text-2xl'>{user.wpm}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <div className=''>
                                            <p className=''>Accuracy</p>
                                            {getIndicator(accuracyStatus)}
                                        </div>
                                        <p className='text-2xl'>{user.accuracy}%</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <div className=''>
                                            <p className=''>Tests</p>
                                            {getIndicator(testsStatus)}
                                        </div>
                                        <p className='text-2xl'>{user.testsCompleted}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <div className=''>
                                            <p className=''>Best WPM</p>
                                            <TrendingUp className='' />
                                        </div>
                                        <p className='text-2xl'>{user.bestWpm}</p>
                                    </div>
                                </div>

                                {/* Progress bars for visual comparison */}
                                <div className=''>
                                    <div className='space-y-1'>
                                        <div className=''>
                                            <span>Speed Score</span>
                                            <span>{Math.round((user.wpm / Math.max(...wpmValues)) * 100)}%</span>
                                        </div>
                                        <div className=''>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(user.wpm / Math.max(...wpmValues)) * 100}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                                className=''
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
