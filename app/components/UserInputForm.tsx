import { X, Plus, Zap } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

import { setSearchParam } from '../lib/url';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UserInputFormProps {
    onCompare: (users: string[]) => void;
    isLoading: boolean;
}

export function UserInputForm({ onCompare, isLoading }: UserInputFormProps) {
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState<string[]>([]);
    const [error, setError] = useState('');

    const addUser = () => {
        const trimmedValue = inputValue.trim();

        if (!trimmedValue) {
            setError('Please enter a username');
            return;
        }

        if (users.includes(trimmedValue)) {
            setError('User already added');
            return;
        }

        if (users.length >= 5) {
            setError('Maximum 5 users for comparison');
            return;
        }

        setUsers([...users, trimmedValue]);
        setInputValue('');
        setError('');
    };

    const removeUser = (userToRemove: string) => {
        setUsers(users.filter((user) => user !== userToRemove));
        setError('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            addUser();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleCompare();
        }
    };

    const handleCompare = () => {
        if (!users.length) {
            setError('Add at least 2 users to compare');
            return;
        }
        setSearchParam('users', users.join(','));
        onCompare(users);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCompare();
            }}
            className=''
        >
            <div className=''>
                <div className=''>
                    <Zap className='' />
                    <span className=''>Type Fast. Compare Faster.</span>
                </div>
                <h1 className='text-5xl'>⌨️ MonkeyType Battle</h1>
                <p className='text-muted-foreground'>See who&apos;s the fastest monkey in the jungle</p>
            </div>

            <div className=''>
                <div className=''>
                    <Input
                        placeholder='Enter username (e.g., rocket, casguz4)'
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setError('');
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className='flex-1'
                    />
                    <Button onClick={addUser} disabled={isLoading || users.length >= 5} variant='outline' size='icon'>
                        <Plus className='size-4' />
                    </Button>
                </div>

                {error && <p className=''>{error}</p>}

                {users.length > 0 && (
                    <div className=''>
                        {users.map((user, index) => (
                            <Badge
                                key={user}
                                variant='secondary'
                                className=''
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span>{user}</span>
                                <button onClick={() => removeUser(user)} className='' disabled={isLoading}>
                                    <X className='size-3' />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                <Button type='submit' disabled={!users.length || isLoading} className='' size='lg'>
                    {isLoading ? (
                        <>
                            <span className='animate-pulse'>Loading stats...</span>
                        </>
                    ) : (
                        <>
                            <Zap className='' />
                            Compare {users.length} User{users.length !== 1 ? 's' : ''}
                        </>
                    )}
                </Button>

                <p className=''>
                    Press <kbd className=''>Tab</kbd> to add users quickly
                </p>
            </div>
        </form>
    );
}
