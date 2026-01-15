import { motion } from 'motion/react';

export function LoadingState() {
    const keys = ['W', 'P', 'M'];

    return (
        <div className=''>
            <div className=''>
                {keys.map((key, index) => (
                    <motion.div
                        key={key}
                        className=''
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: index * 0.15,
                        }}
                    >
                        <span className=''>{key}</span>
                    </motion.div>
                ))}
            </div>
            <motion.p
                className='text-muted-foreground'
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Fetching typing speeds...
            </motion.p>
        </div>
    );
}
