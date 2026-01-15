import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ComparisonHighlights } from '~/components/ComparisonHighlights';
import { LoadingState } from '~/components/LoadingState';
import { StatsGrid } from '~/components/StatsGrid';
import { Button } from '~/components/ui/button';
import { UserInputForm } from '~/components/UserInputForm';
import { UserStatsDataGrid } from '~/components/UserStatsDataGrid';

import { resetSearchParams } from '../lib/url';

export function meta() {
    return [{ title: 'Boards' }, { description: 'Manage create, view, and manage boards' }];
}

interface UserStats {
    username: string;
    wpm: number;
    accuracy: number;
    testsCompleted: number;
    bestWpm: number;
    timeTyping: string;
}
const BASE_URL = 'https://api.monkeytype.com/users/';
class MTUserClient {
    private async fetchProfile(name: string) {
        const response = await fetch(`${BASE_URL}${encodeURIComponent(name)}/profile?isUid=false`);

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

const fetchUserStats = async (users: string[]): Promise<{ profiles: UserProfile[]; profileStatList: UserStats[] }> => {
    const profiles = await mtClient.getByUserList(users);

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

    const profileStatList = profiles.map((profile) => {
        const best = bestPerformance(profile);
        const wpm = Math.round(best?.wpm ?? 0);
        const accuracy = Number((best?.acc ?? 0).toFixed(2));

        return {
            username: profile.name,
            wpm,
            accuracy: Number.isFinite(accuracy) ? accuracy : 0,
            testsCompleted: profile.typingStats.completedTests,
            bestWpm: wpm,
            timeTyping: formatTimeTyping(profile.typingStats.timeTyping),
        };
    });

    return {
        profiles,
        profileStatList,
    };
};

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<UserStats[] | null>(null);
    const [profiles, setProfiles] = useState<UserProfile[] | null>(null);

    const handleCompare = async (users: string[]) => {
        setIsLoading(true);
        try {
            const { profiles, profileStatList: userStats } = await fetchUserStats(users);
            setProfiles(profiles);
            setStats(userStats);
            toast.success(`Loaded stats for ${users.length} users!`, {
                description: "Check out who's the typing champion 🏆",
            });
        } catch (error) {
            toast.error('Failed to load stats', {
                description: 'Please try again',
            });
            // oxlint-disable-next-line
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        const usersList = search.get('users')?.split(',');
        if (!usersList?.length) return;
        handleCompare(usersList).catch((err) => {
            // oxlint-disable-next-line
            console.error(err);
            toast('There was an error with handling the comparison of these Users');
        });
    }, []);

    const handleReset = () => {
        setStats(null);
        setProfiles(null);
        resetSearchParams();
    };

    return (
        <main className=''>
            {!stats ? (
                <div className=''>
                    <UserInputForm onCompare={handleCompare} isLoading={isLoading} />
                    {isLoading && <LoadingState />}
                </div>
            ) : (
                <div className=''>
                    <div className=''>
                        <Button variant='ghost' onClick={handleReset} className='gap-2'>
                            <ArrowLeft className='size-4' />
                            New Comparison
                        </Button>
                    </div>

                    <ComparisonHighlights stats={stats} />
                    <StatsGrid stats={stats} />
                    {profiles && <UserStatsDataGrid profiles={profiles} />}

                    {/* Fun footer message */}
                    <div className=''>
                        <p className=''>
                            Want to improve your score? Practice on{' '}
                            <a href='https://monkeytype.com' target='_blank' rel='noopener noreferrer' className=''>
                                MonkeyType.com
                            </a>{' '}
                            🐵
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}
