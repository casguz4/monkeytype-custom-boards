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
			className='w-full max-w-2xl mx-auto space-y-6'
		>
			<div className='text-center space-y-2'>
				<div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-300/10 to-blue-600/10 rounded-full border border-blue-500/20'>
					<Zap className='size-4 text-blue-500' />
					<span className='text-sm text-blue-600'>Type Fast. Compare Faster.</span>
				</div>
				<h1 className='text-5xl'>⌨️ MonkeyType Battle</h1>
				<p className='text-muted-foreground'>See who&apos;s the fastest monkey in the jungle</p>
			</div>

			<div className='space-y-4 p-6 rounded-lg border bg-card'>
				<div className='flex gap-2'>
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

				{error && <p className='text-sm text-red-500 animate-in fade-in slide-in-from-top-1'>{error}</p>}

				{users.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{users.map((user, index) => (
							<Badge
								key={user}
								variant='secondary'
								className='pl-3 pr-2 py-1.5 text-sm animate-in fade-in zoom-in'
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<span>{user}</span>
								<button
									onClick={() => removeUser(user)}
									className='ml-2 hover:bg-destructive/20 rounded-full p-0.5 transition-colors'
									disabled={isLoading}
								>
									<X className='size-3' />
								</button>
							</Badge>
						))}
					</div>
				)}

				<Button
					type='submit'
					disabled={!users.length || isLoading}
					className='w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-700 hover:to-blue-700'
					size='lg'
				>
					{isLoading ? (
						<>
							<span className='animate-pulse'>Loading stats...</span>
						</>
					) : (
						<>
							<Zap className='size-4 mr-2' />
							Compare {users.length} User{users.length !== 1 ? 's' : ''}
						</>
					)}
				</Button>

				<p className='text-xs text-center text-muted-foreground'>
					Press <kbd className='px-1.5 py-0.5 bg-muted rounded text-xs'>Tab</kbd> to add users quickly
				</p>
			</div>
		</form>
	);
}
