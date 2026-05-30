// src/components/ui/Dice.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  values: [number, number];
  rolling: boolean;
}

const Dot = () => <div className="w-2 h-2 bg-gray-800 rounded-full" />;

const DieFace = ({ value }: { value: number }) => {
  const dots = {
    1: [<Dot key="1" />],
    2: [<Dot key="1" />, <Dot key="2" />],
    3: [<Dot key="1" />, <Dot key="2" />, <Dot key="3" />],
    4: [<Dot key="1" />, <Dot key="2" />, <Dot key="3" />, <Dot key="4" />],
    5: [<Dot key="1" />, <Dot key="2" />, <Dot key="3" />, <Dot key="4" />, <Dot key="5" />],
    6: [<Dot key="1" />, <Dot key="2" />, <Dot key="3" />, <Dot key="4" />, <Dot key="5" />, <Dot key="6" />],
  };

  const layouts = {
    1: "flex items-center justify-center",
    2: "flex items-center justify-between",
    3: "flex items-center justify-between",
    4: "grid grid-cols-2 gap-2 p-2",
    5: "grid grid-cols-2 gap-2 p-2 relative",
    6: "grid grid-cols-2 gap-2 p-2",
  };

  return (
    <div className={`w-12 h-12 bg-white rounded-lg shadow-md border border-gray-200 ${layouts[value as keyof typeof layouts]}`}>
      {value === 5 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Dot /></div>}
      {dots[value as keyof typeof dots]}
    </div>
  );
};

export const Dice: React.FC<DiceProps> = ({ values, rolling }) => {
  return (
    <div className="flex gap-4">
      {values.map((v, i) => (
        <motion.div
          key={i}
          animate={rolling ? {
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.5, repeat: rolling ? Infinity : 0 }}
        >
          <DieFace value={v} />
        </motion.div>
      ))}
    </div>
  );
};
