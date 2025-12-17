"use client";

import { useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useGameStore } from "../../store/gameStore";
import { useGame } from "../../hooks/useGame";
import { getMultipliersByRisk } from "../../utils/generateMultipliers";
import { initialCards } from "../../constants/game";
import Card from "./Card";
import MultiplierLabel from "./MultiplierLabel";
import styles from "./CardGrid.module.scss";

const CardGrid = () => {
  const { handleCardClick, isGameProcessing, selectedIndex, resultCards, matches } = useGame();
  const risk = useGameStore(state => state.risk);
  const gameResult = useGameStore(state => state.gameResult);
  const cards = useGameStore(state => state.cards);
  const setCards = useGameStore(state => state.setCards);
  const swapCards = useGameStore(state => state.swapCards);
  const setSelectedIndex = useGameStore(state => state.setSelectedIndex);
  const multipliers = getMultipliersByRisk(risk);

  useEffect(() => {
    if (!gameResult) {
      setCards(initialCards);
    }
  }, [gameResult, setCards]);

  const onCardClick = useCallback(
    (index: number) => {
      handleCardClick(index);
    },
    [handleCardClick]
  );

  const onDragStart = useCallback(() => {
    setSelectedIndex(null);
  }, [setSelectedIndex]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      if (result.source.index === result.destination.index) return;
      if (isGameProcessing) return;

      swapCards(result.source.index, result.destination.index);
    },
    [isGameProcessing, swapCards]
  );

  return (
    <div className={styles.cardGameField}>
      <div className={styles.cardsContainers}>
        <div className={styles.cardsContainer}>
          {initialCards.map((card, index) => (
            <div
              className={styles.cardContainer}
              data-rotated={(resultCards[index]?.img ? true : false).toString()}
              key={`${card.id}-server`}
            >
              <div className={styles.cardContainerInner}>
                <div
                  style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img src="/images/cards/backface.png" className={styles.card} alt="Card back" />
                </div>
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img className={styles.card} src={resultCards[index]?.img ?? undefined} alt="Card front" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="user-cards" direction="horizontal" isDropDisabled={isGameProcessing}>
            {(provided, snapshot) => (
              <div
                className={styles.cardsContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? "rgba(38, 64, 121, 0.1)" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
                {cards.map((card, index) => (
                  <Draggable
                    key={`${card.id}-user`}
                    draggableId={String(card.id)}
                    index={index}
                    isDragDisabled={isGameProcessing}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${styles.draggableCardWrapper} ${
                          snapshot.isDragging ? styles.draggableCardWrapperDragging : ""
                        }`}
                        style={provided.draggableProps.style}
                      >
                        <Card
                          card={card}
                          index={index}
                          isSelected={!isGameProcessing && selectedIndex === index}
                          isSelectable={!isGameProcessing && selectedIndex !== index}
                          onClick={() => onCardClick(index)}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className={styles.cardsContainer}>
          {multipliers.map((multiplier, index) => (
            <MultiplierLabel
              multiplier={multiplier}
              cardId={index + 1}
              key={`${index + 1}-multiplier`}
              isMatched={matches.includes(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGrid;

