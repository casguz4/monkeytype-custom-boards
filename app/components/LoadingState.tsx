import { motion } from 'motion/react';

export function LoadingState() {
  const keys = ['W', 'P', 'M'];
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex gap-3 mb-6">
        {keys.map((key, index) => (
          <motion.div
            key={key}
            className="size-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg"
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
            <span className="text-2xl text-white">{key}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Fetching typing speeds...
      </motion.p>
    </div>
  );
}
