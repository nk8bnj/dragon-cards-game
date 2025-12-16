"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card as CardType } from "../../types/game.types";
import styles from "./CardGrid.module.scss";

interface CardProps {
  card: CardType;
  index: number;
  isSelected: boolean;
  isSelectable: boolean;
  onClick: () => void;
  isDragging?: boolean;
}

const Card = memo(({ card, index, isSelected, isSelectable, onClick, isDragging }: CardProps) => {
  return (
    <motion.div layout={!isDragging} style={{ position: "relative" }}>
      <motion.img
        layout={!isDragging}
        src={card.img}
        className={styles.card}
        onClick={onClick}
        data-selected={isSelected ? "true" : "false"}
        data-selectable={isSelectable ? "true" : "false"}
        transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
        style={{
          cursor: isDragging ? "grabbing" : isSelectable ? "grab" : isSelected ? "pointer" : "default",
        }}
        whileHover={!isDragging && isSelectable ? { scale: 1.02 } : {}}
        whileTap={!isDragging ? { scale: 0.98 } : {}}
        alt={`Card ${card.value}`}
      />
    </motion.div>
  );
});

export default Card;

