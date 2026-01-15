import { Github } from 'lucide-react';
import { Outlet } from 'react-router';

import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

const TITLE = 'Monkey Type Custom Boards';
export default function Layout() {
    return (
        <div>
            {/* Header */}
            <header className=''>
                <div className=''>
                    <div className=''>
                        <span className='text-2xl'>⌨️</span>
                        <span className='text-lg'>MonkeyType Battle</span>
                    </div>
                    <div className=''>
                        <Button className='mr-2' variant='ghost' size='sm' asChild>
                            <a href='https://monkeytype.com' target='_blank' rel='noopener noreferrer' className=''>
                                MonkeyType.com
                            </a>
                        </Button>
                        <Button variant='outline' size='sm' asChild>
                            <a
                                href='https://github.com/casguz4/monkeytype-custom-boards'
                                target='_blank'
                                rel='noopener noreferrer'
                                className=''
                            >
                                <Github />
                            </a>
                        </Button>
                    </div>
                </div>
            </header>
            <div className=''>
                <Toaster />

                <Outlet />
                {/* Background decoration */}
                <div className=''>
                    <div className='' />
                    <div className='' />
                </div>
            </div>
            <footer className=''>
                <p className='text-center'>
                    &copy; {new Date().getFullYear()} {TITLE} by{' '}
                    <a href='https://cg4.dev' target='_blank' rel='noreferrer noopener'>
                        cg4.dev
                    </a>
                </p>
            </footer>
        </div>
    );
}
