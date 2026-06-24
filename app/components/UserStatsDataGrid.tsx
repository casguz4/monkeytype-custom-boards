import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type SortDir = 'asc' | 'desc';

type TimeKey = '15' | '30' | '60' | '120';
type WordKey = '10' | '25' | '50' | '100';

type FlatRow = {
    // profile
    username: string;
    uid: string;
    isPremium: boolean;
    xp: number;
    streak: number;
    maxStreak: number;
    addedAt: string;
    // typing stats
    completedTests: number;
    startedTests: number;
    timeTypingSec: number;
    timeTyping: string;
    // overall best
    bestOverallWpm: number;
    bestOverallAcc: number;
    bestOverallConsistency: number;
    // all-time lbs (best per bucket)
    lb15Wpm: number;
    lb30Wpm: number;
    lb60Wpm: number;
    lb120Wpm: number;
    // personal best time buckets
    pb15Wpm: number;
    pb15Acc: number;
    pb15Cons: number;
    pb30Wpm: number;
    pb30Acc: number;
    pb30Cons: number;
    pb60Wpm: number;
    pb60Acc: number;
    pb60Cons: number;
    pb120Wpm: number;
    pb120Acc: number;
    pb120Cons: number;
    // personal best word buckets
    pb10Wpm: number;
    pb10Acc: number;
    pb10Cons: number;
    pb25Wpm: number;
    pb25Acc: number;
    pb25Cons: number;
    pb50Wpm: number;
    pb50Acc: number;
    pb50Cons: number;
    pb100Wpm: number;
    pb100Acc: number;
    pb100Cons: number;
};

type Column = {
    key: keyof FlatRow;
    label: string;
    sortable?: boolean;
};

const timeBuckets: TimeKey[] = ['15', '30', '60', '120'];
const wordBuckets: WordKey[] = ['10', '25', '50', '100'];

const columns: Column[] = [
    // Profile
    { key: 'username', label: 'User', sortable: true },
    { key: 'uid', label: 'UID' },
    { key: 'isPremium', label: 'Premium', sortable: true },
    { key: 'xp', label: 'XP', sortable: true },
    { key: 'streak', label: 'Streak', sortable: true },
    { key: 'maxStreak', label: 'Max Streak', sortable: true },
    { key: 'addedAt', label: 'Added At', sortable: true },
    // Activity
    { key: 'completedTests', label: 'Completed Tests', sortable: true },
    { key: 'startedTests', label: 'Started Tests', sortable: true },
    { key: 'timeTyping', label: 'Time Typing' },
    // Overall best
    { key: 'bestOverallWpm', label: 'Best Overall WPM', sortable: true },
    { key: 'bestOverallAcc', label: 'Best Overall Acc', sortable: true },
    { key: 'bestOverallConsistency', label: 'Best Overall Consistency', sortable: true },
    // All-time leaderboards
    { key: 'lb15Wpm', label: 'LB 15s WPM', sortable: true },
    { key: 'lb30Wpm', label: 'LB 30s WPM', sortable: true },
    { key: 'lb60Wpm', label: 'LB 60s WPM', sortable: true },
    { key: 'lb120Wpm', label: 'LB 120s WPM', sortable: true },
    // PB Time buckets
    { key: 'pb15Wpm', label: 'PB 15s WPM', sortable: true },
    { key: 'pb15Acc', label: 'PB 15s Acc', sortable: true },
    { key: 'pb15Cons', label: 'PB 15s Consistency', sortable: true },
    { key: 'pb30Wpm', label: 'PB 30s WPM', sortable: true },
    { key: 'pb30Acc', label: 'PB 30s Acc', sortable: true },
    { key: 'pb30Cons', label: 'PB 30s Consistency', sortable: true },
    { key: 'pb60Wpm', label: 'PB 60s WPM', sortable: true },
    { key: 'pb60Acc', label: 'PB 60s Acc', sortable: true },
    { key: 'pb60Cons', label: 'PB 60s Consistency', sortable: true },
    { key: 'pb120Wpm', label: 'PB 120s WPM', sortable: true },
    { key: 'pb120Acc', label: 'PB 120s Acc', sortable: true },
    { key: 'pb120Cons', label: 'PB 120s Consistency', sortable: true },
    // PB Word buckets
    { key: 'pb10Wpm', label: 'PB 10w WPM', sortable: true },
    { key: 'pb10Acc', label: 'PB 10w Acc', sortable: true },
    { key: 'pb10Cons', label: 'PB 10w Consistency', sortable: true },
    { key: 'pb25Wpm', label: 'PB 25w WPM', sortable: true },
    { key: 'pb25Acc', label: 'PB 25w Acc', sortable: true },
    { key: 'pb25Cons', label: 'PB 25w Consistency', sortable: true },
    { key: 'pb50Wpm', label: 'PB 50w WPM', sortable: true },
    { key: 'pb50Acc', label: 'PB 50w Acc', sortable: true },
    { key: 'pb50Cons', label: 'PB 50w Consistency', sortable: true },
    { key: 'pb100Wpm', label: 'PB 100w WPM', sortable: true },
    { key: 'pb100Acc', label: 'PB 100w Acc', sortable: true },
    { key: 'pb100Cons', label: 'PB 100w Consistency', sortable: true },
];

type Props = { profiles: UserProfile[] };

export function UserStatsDataGrid({ profiles }: Props) {
    const [sortKey, setSortKey] = useState<keyof FlatRow>('bestOverallWpm');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const getBucketBest = (profile: UserProfile, group: 'time' | 'words', key: TimeKey | WordKey) => {
        // @ts-expect-error key has `any` type because key cannot be type TimeKey | WordKey
        const bucket = profile.personalBests?.[group]?.[key];
        const entries = Array.isArray(bucket) ? bucket : [];
        const best = [...entries].sort((a, b) => b.wpm - a.wpm)[0];
        return {
            wpm: Math.round(best?.wpm ?? 0),
            acc: Number((best?.acc ?? 0).toFixed(2)),
            cons: Number((best?.consistency ?? 0).toFixed(2)),
        };
    };

    const getOverallBest = (profile: UserProfile) => {
        const timeEntries = Object.values(profile.personalBests.time ?? {}).flat();
        const wordEntries = Object.values(profile.personalBests.words ?? {}).flat();
        const all = [...timeEntries, ...wordEntries];
        const best = [...all].sort((a, b) => b.wpm - a.wpm)[0];
        return {
            wpm: Math.round(best?.wpm ?? 0),
            acc: Number((best?.acc ?? 0).toFixed(2)),
            cons: Number((best?.consistency ?? 0).toFixed(2)),
        };
    };

    const getLbBest = (profile: UserProfile, key: TimeKey) => {
        const bucket = profile.allTimeLbs?.time?.[key];
        const entries = Array.isArray(bucket) ? bucket : [];
        const best = [...entries].sort((a, b) => b.wpm - a.wpm)[0];
        return Math.round(best?.wpm ?? 0);
    };

    const formatTimeTyping = (seconds: number) => {
        const hours = seconds / 3600;
        if (hours >= 1) return `${hours.toFixed(1)}h`;
        const minutes = Math.max(Math.round(seconds / 60), 1);
        return `${minutes}m`;
    };

    const rows = useMemo<FlatRow[]>(() => {
        return profiles.map((profile) => {
            const overall = getOverallBest(profile);
            const lb = {
                '15': getLbBest(profile, '15'),
                '30': getLbBest(profile, '30'),
                '60': getLbBest(profile, '60'),
                '120': getLbBest(profile, '120'),
            };
            const time = Object.fromEntries(timeBuckets.map((k) => [k, getBucketBest(profile, 'time', k)])) as Record<
                TimeKey,
                ReturnType<typeof getBucketBest>
            >;
            const words = Object.fromEntries(wordBuckets.map((k) => [k, getBucketBest(profile, 'words', k)])) as Record<
                WordKey,
                ReturnType<typeof getBucketBest>
            >;

            return {
                username: profile.name,
                uid: profile.uid,
                isPremium: profile.isPremium,
                xp: profile.xp,
                streak: profile.streak,
                maxStreak: profile.maxStreak,
                addedAt: new Date(profile.addedAt).toLocaleDateString(),
                completedTests: profile.typingStats.completedTests,
                startedTests: profile.typingStats.startedTests,
                timeTypingSec: profile.typingStats.timeTyping,
                timeTyping: formatTimeTyping(profile.typingStats.timeTyping),
                bestOverallWpm: overall.wpm,
                bestOverallAcc: overall.acc,
                bestOverallConsistency: overall.cons,
                lb15Wpm: lb['15'],
                lb30Wpm: lb['30'],
                lb60Wpm: lb['60'],
                lb120Wpm: lb['120'],
                pb15Wpm: time['15'].wpm,
                pb15Acc: time['15'].acc,
                pb15Cons: time['15'].cons,
                pb30Wpm: time['30'].wpm,
                pb30Acc: time['30'].acc,
                pb30Cons: time['30'].cons,
                pb60Wpm: time['60'].wpm,
                pb60Acc: time['60'].acc,
                pb60Cons: time['60'].cons,
                pb120Wpm: time['120'].wpm,
                pb120Acc: time['120'].acc,
                pb120Cons: time['120'].cons,
                pb10Wpm: words['10'].wpm,
                pb10Acc: words['10'].acc,
                pb10Cons: words['10'].cons,
                pb25Wpm: words['25'].wpm,
                pb25Acc: words['25'].acc,
                pb25Cons: words['25'].cons,
                pb50Wpm: words['50'].wpm,
                pb50Acc: words['50'].acc,
                pb50Cons: words['50'].cons,
                pb100Wpm: words['100'].wpm,
                pb100Acc: words['100'].acc,
                pb100Cons: words['100'].cons,
            };
        });
    }, [profiles]);

    const sorted = useMemo(() => {
        const copy = [...rows];
        copy.sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortDir === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
        return copy;
    }, [rows, sortDir, sortKey]);

    const toggleSort = (key: keyof FlatRow) => {
        const col = columns.find((c) => c.key === key);
        if (!col?.sortable) return;
        if (key === sortKey) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir(col.key === 'username' ? 'asc' : 'desc');
        }
    };

    const SortIcon = ({ col }: { col: Column }) => {
        if (!col.sortable) return null;
        if (sortKey !== col.key) return <ArrowUpDown className='' />;
        return sortDir === 'asc' ? <ArrowUp className='' /> : <ArrowDown className='' />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Comparison (full API data)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead
                                        key={col.key as string}
                                        className={col.sortable ? '' : ''}
                                        onClick={() => toggleSort(col.key)}
                                    >
                                        <span className=''>
                                            {col.label}
                                            <SortIcon col={col} />
                                        </span>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sorted.map((row) => (
                                <TableRow key={row.uid}>
                                    {columns.map((col) => (
                                        <TableCell key={`${row.uid}-${String(col.key)}`}>
                                            {typeof row[col.key] === 'boolean'
                                                ? row[col.key]
                                                    ? 'Yes'
                                                    : 'No'
                                                : row[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
