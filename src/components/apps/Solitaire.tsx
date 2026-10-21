import React, { useState, useEffect, useCallback } from 'react';
import { retroAudio } from '../../services/audio';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = {
  suit: Suit;
  value: number; // 1 (Ace) to 13 (King)
  faceUp: boolean;
  id: string;
};

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const VALUE_NAMES: Record<number, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
};

export const Solitaire: React.FC = () => {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    card: Card;
    source: 'waste' | 'tableau';
    columnIndex?: number;
    cardIndex?: number;
  } | null>(null);

  const initGame = useCallback(() => {
    // Generate fresh deck
    const deck: Card[] = [];
    SUITS.forEach((suit) => {
      for (let v = 1; v <= 13; v++) {
        deck.push({
          suit,
          value: v,
          faceUp: false,
          id: `${suit}-${v}-${Math.random()}`,
        });
      }
    });

    // Shuffle Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal tableau
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck.pop()!;
        if (row === col) card.faceUp = true;
        newTableau[col].push(card);
      }
    }

    setTableau(newTableau);
    setStock(deck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setScore(0);
    setHasWon(false);
    setSelectedCard(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Draw card from stock to waste
  const handleStockClick = () => {
    retroAudio.playMineClick();
    if (stock.length > 0) {
      const newStock = [...stock];
      const card = newStock.pop()!;
      card.faceUp = true;
      setStock(newStock);
      setWaste((prev) => [...prev, card]);
    } else {
      // Recycle waste back to stock
      if (waste.length === 0) return;
      const newStock = [...waste].reverse().map((c) => ({ ...c, faceUp: false }));
      setStock(newStock);
      setWaste([]);
      setScore((s) => Math.max(0, s - 20));
    }
  };

  const isRed = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

  // Can move to tableau?
  const canMoveToTableau = (card: Card, targetCol: Card[]) => {
    if (targetCol.length === 0) {
      return card.value === 13; // King only on empty column
    }
    const topCard = targetCol[targetCol.length - 1];
    return isRed(card.suit) !== isRed(topCard.suit) && card.value === topCard.value - 1;
  };

  // Can move to foundation?
  const canMoveToFoundation = (card: Card, foundation: Card[]) => {
    if (foundation.length === 0) {
      return card.value === 1; // Ace only
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && card.value === topCard.value + 1;
  };

  // Try auto move card to foundation
  const tryAutoMoveToFoundation = (card: Card, source: 'waste' | 'tableau', colIdx?: number) => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      if (canMoveToFoundation(card, foundations[fIdx])) {
        retroAudio.playMineClick();
        const newFoundations = foundations.map((f, i) => (i === fIdx ? [...f, card] : [...f]));

        if (source === 'waste') {
          setWaste((prev) => prev.slice(0, -1));
        } else if (colIdx !== undefined) {
          const newTab = tableau.map((col, idx) => {
            if (idx !== colIdx) return [...col];
            const updated = col.slice(0, -1);
            if (updated.length > 0) {
              updated[updated.length - 1].faceUp = true;
            }
            return updated;
          });
          setTableau(newTab);
        }

        setFoundations(newFoundations);
        setScore((s) => s + 10);
        setSelectedCard(null);

        // Check if won
        const totalInFoundations = newFoundations.reduce((acc, f) => acc + f.length, 0);
        if (totalInFoundations === 52) {
          setHasWon(true);
          retroAudio.playWindowsStartup();
        }
        return true;
      }
    }
    return false;
  };

  // Click on a tableau card
  const handleTableauCardClick = (colIdx: number, cardIdx: number) => {
    const col = tableau[colIdx];
    const card = col[cardIdx];

    if (!card.faceUp) return;

    // Double click or top card foundation check
    if (cardIdx === col.length - 1) {
      if (tryAutoMoveToFoundation(card, 'tableau', colIdx)) return;
    }

    if (!selectedCard) {
      setSelectedCard({ card, source: 'tableau', columnIndex: colIdx, cardIndex: cardIdx });
    } else {
      // Try moving selected card(s) onto this column
      handleMoveToTableauColumn(colIdx);
    }
  };

  const handleMoveToTableauColumn = (targetColIdx: number) => {
    if (!selectedCard) return;

    const targetCol = tableau[targetColIdx];
    const { card, source, columnIndex, cardIndex } = selectedCard;

    if (canMoveToTableau(card, targetCol)) {
      retroAudio.playMineClick();
      if (source === 'waste') {
        setWaste((prev) => prev.slice(0, -1));
        setTableau((prev) =>
          prev.map((c, idx) => (idx === targetColIdx ? [...c, card] : [...c]))
        );
      } else if (columnIndex !== undefined && cardIndex !== undefined) {
        const sourceCol = tableau[columnIndex];
        const movingCards = sourceCol.slice(cardIndex);
        const remainingSource = sourceCol.slice(0, cardIndex);
        if (remainingSource.length > 0) {
          remainingSource[remainingSource.length - 1].faceUp = true;
        }

        setTableau((prev) =>
          prev.map((c, idx) => {
            if (idx === columnIndex) return remainingSource;
            if (idx === targetColIdx) return [...c, ...movingCards];
            return [...c];
          })
        );
      }
      setScore((s) => s + 5);
      setSelectedCard(null);
    } else {
      setSelectedCard(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#008000] text-white font-sans text-xs select-none">
      {/* Top Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-0.5 text-black flex items-center justify-between text-[11px]">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={initGame}
            className="win3-button px-2 py-0.5"
          >
            New Game
          </button>
        </div>
        <div className="flex gap-4 font-mono font-bold text-xs">
          <span>Score: {score}</span>
        </div>
      </div>

      {/* Playing Board */}
      <div className="flex-1 p-3 flex flex-col justify-between overflow-auto relative">
        {hasWon && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
            <div className="bg-[#c0c0c0] text-black win3-box-raised p-4 text-center">
              <h2 className="text-xl font-bold mb-2">🎉 You Win Solitaire! 🎉</h2>
              <p className="text-sm mb-3">Congratulations on clearing the deck!</p>
              <button
                type="button"
                onClick={initGame}
                className="win3-button px-4 py-1 font-bold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Top Piles: Stock, Waste, and 4 Foundations */}
        <div className="flex justify-between items-start mb-4">
          {/* Stock & Waste */}
          <div className="flex gap-2">
            {/* Stock */}
            <div
              onClick={handleStockClick}
              className="w-12 h-16 rounded border border-black bg-[#000080] flex items-center justify-center cursor-pointer shadow-md hover:scale-105"
            >
              {stock.length > 0 ? (
                <div className="w-10 h-14 border border-white/50 bg-[#0000aa] rounded flex items-center justify-center text-[10px] text-yellow-300 font-bold">
                  🎴
                </div>
              ) : (
                <div className="text-gray-400 text-lg">↺</div>
              )}
            </div>

            {/* Waste */}
            <div className="w-12 h-16 rounded border border-black/40 bg-[#006000] flex items-center justify-center relative">
              {waste.length > 0 && (
                <div
                  onClick={() => {
                    const topWaste = waste[waste.length - 1];
                    if (!tryAutoMoveToFoundation(topWaste, 'waste')) {
                      setSelectedCard({ card: topWaste, source: 'waste' });
                    }
                  }}
                  className={`w-12 h-16 rounded border bg-white flex flex-col justify-between p-1 cursor-pointer shadow-md ${
                    isRed(waste[waste.length - 1].suit) ? 'text-red-600' : 'text-black'
                  } ${
                    selectedCard?.source === 'waste' ? 'ring-2 ring-yellow-400' : 'border-black'
                  }`}
                >
                  <div className="text-[10px] font-bold leading-none">
                    {VALUE_NAMES[waste[waste.length - 1].value]}
                  </div>
                  <div className="text-center text-sm">
                    {SUIT_SYMBOLS[waste[waste.length - 1].suit]}
                  </div>
                  <div className="text-[10px] font-bold text-right leading-none">
                    {SUIT_SYMBOLS[waste[waste.length - 1].suit]}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4 Foundations */}
          <div className="flex gap-2">
            {foundations.map((foundation, fIdx) => (
              <div
                key={fIdx}
                className="w-12 h-16 rounded border border-black/50 bg-[#006000] flex items-center justify-center relative"
              >
                {foundation.length > 0 ? (
                  <div
                    className={`w-12 h-16 rounded border border-black bg-white flex flex-col justify-between p-1 shadow-md ${
                      isRed(foundation[foundation.length - 1].suit) ? 'text-red-600' : 'text-black'
                    }`}
                  >
                    <div className="text-[10px] font-bold leading-none">
                      {VALUE_NAMES[foundation[foundation.length - 1].value]}
                    </div>
                    <div className="text-center text-sm">
                      {SUIT_SYMBOLS[foundation[foundation.length - 1].suit]}
                    </div>
                    <div className="text-[10px] font-bold text-right leading-none">
                      {SUIT_SYMBOLS[foundation[foundation.length - 1].suit]}
                    </div>
                  </div>
                ) : (
                  <span className="text-white/30 text-base">{['♠', '♥', '♦', '♣'][fIdx]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau 7 Columns */}
        <div className="flex gap-2 justify-between flex-1 items-start min-h-[160px]">
          {tableau.map((column, colIdx) => (
            <div
              key={colIdx}
              onClick={() => handleMoveToTableauColumn(colIdx)}
              className="w-12 min-h-[140px] rounded border border-black/30 bg-[#006000]/50 relative"
            >
              {column.map((card, cIdx) => (
                <div
                  key={card.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTableauCardClick(colIdx, cIdx);
                  }}
                  style={{ top: `${cIdx * 18}px` }}
                  className={`absolute w-12 h-16 rounded border shadow-sm cursor-pointer select-none transition-transform ${
                    card.faceUp
                      ? `bg-white ${isRed(card.suit) ? 'text-red-600' : 'text-black'} ${
                          selectedCard?.card.id === card.id
                            ? 'ring-2 ring-yellow-400 -translate-y-1'
                            : 'border-black'
                        }`
                      : 'bg-[#0000aa] border-black'
                  }`}
                >
                  {card.faceUp ? (
                    <div className="w-full h-full flex flex-col justify-between p-1">
                      <div className="text-[10px] font-bold leading-none">
                        {VALUE_NAMES[card.value]}
                      </div>
                      <div className="text-center text-sm">
                        {SUIT_SYMBOLS[card.suit]}
                      </div>
                      <div className="text-[10px] font-bold text-right leading-none">
                        {SUIT_SYMBOLS[card.suit]}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full border border-white/20 rounded flex items-center justify-center text-[10px] text-yellow-300">
                      🎴
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
