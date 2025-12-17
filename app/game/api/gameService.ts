import { Card } from "../types/game.types";
import { initialCards } from "../constants/game";

let roundId = 0;

class GameService {
  getResult(): Promise<{ serverCards: Card[]; roundId: number }> {
    const outcome = this.getOutcomes();
    const results = outcome.map(val => Math.floor(val * 6));
    const shuffledCards = this.getRandom(results);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          roundId: roundId++,
          serverCards: shuffledCards,
        });
      }, 200);
    });
  }

  private generateRandomBytesArray(length: number) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array);
  }

  private getOutcomes() {
    const cardsCount = 6;
    const bytes = this.generateRandomBytesArray(cardsCount * 4);
    const chunks = bytes.reduce((result, current, index) => {
      if (index % 4 === 0) result.push([current]);
      else {
        const chunkIndex = Math.floor(index / 4);
        const chunk = result[chunkIndex];
        chunk.push(current);
      }
      return result;
    }, [] as number[][]);

    const outcome = chunks.map(bytesChunk =>
      bytesChunk.reduce((result, value, i) => {
        const divider = 256 ** (i + 1);
        const partialResult = value / divider;
        return result + partialResult;
      }, 0),
    );

    return outcome;
  }

  private getRandom(results: number[]) {
    const deck = [...initialCards];

    for (let i = deck.length - 1; i > 0; i--) {
      const j = results[i];
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }
}

const gameService = new GameService();
export default gameService;

