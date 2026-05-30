// src/constants/cards.ts
import { GameCard } from '../types/settings';

export const CHANCE_CARDS: GameCard[] = [
  { id: 1, type: 'chance', text: "Advance to GO (Collect $200)", amount: 200, action: 'move', targetPosition: 0 },
  { id: 2, type: 'chance', text: "Bank error in your favor. Collect $200", amount: 200, action: 'money' },
  { id: 3, type: 'chance', text: "Doctor's fee. Pay $50", amount: -50, action: 'money' },
  { id: 4, type: 'chance', text: "From sale of stock you get $50", amount: 50, action: 'money' },
  { id: 5, type: 'chance', text: "Get Out of Jail Free", amount: 0, action: 'outOfJail' },
  { id: 6, type: 'chance', text: "Go to Jail. Go directly to jail, do not pass GO, do not collect $200", amount: 0, action: 'jail' },
  { id: 7, type: 'chance', text: "Holiday Fund matures. Receive $100", amount: 100, action: 'money' },
  { id: 8, type: 'chance', text: "Income tax refund. Collect $20", amount: 20, action: 'money' },
  { id: 9, type: 'chance', text: "It is your birthday. Collect $10 from every player", amount: 10, action: 'money' },
  { id: 10, type: 'chance', text: "Life insurance matures. Collect $100", amount: 100, action: 'money' },
  { id: 11, type: 'chance', text: "Pay hospital fees of $100", amount: -100, action: 'money' },
  { id: 12, type: 'chance', text: "Pay school fees of $50", amount: -50, action: 'money' },
  { id: 13, type: 'chance', text: "Receive $25 consultancy fee", amount: 25, action: 'money' },
  { id: 14, type: 'chance', text: "You have won second prize in a beauty contest. Collect $10", amount: 10, action: 'money' },
  { id: 15, type: 'chance', text: "You inherit $100", amount: 100, action: 'money' },
];

export const COMMUNITY_CHEST_CARDS: GameCard[] = [
  { id: 101, type: 'chest', text: "Advance to GO (Collect $200)", amount: 200, action: 'move', targetPosition: 0 },
  { id: 102, type: 'chest', text: "Bank error in your favor. Collect $200", amount: 200, action: 'money' },
  { id: 103, type: 'chest', text: "Doctor's fee. Pay $50", amount: -50, action: 'money' },
  { id: 104, type: 'chest', text: "From sale of stock you get $50", amount: 50, action: 'money' },
  { id: 105, type: 'chest', text: "Get Out of Jail Free", amount: 0, action: 'outOfJail' },
  { id: 106, type: 'chest', text: "Go to Jail", amount: 0, action: 'jail' },
  { id: 107, type: 'chest', text: "Grand Opera Night. Collect $50 from every player for opening night seats", amount: 50, action: 'money' },
  { id: 108, type: 'chest', text: "Holiday Fund matures. Receive $100", amount: 100, action: 'money' },
  { id: 109, type: 'chest', text: "Income tax refund. Collect $20", amount: 20, action: 'money' },
  { id: 110, type: 'chest', text: "Life insurance matures. Collect $100", amount: 100, action: 'money' },
  { id: 111, type: 'chest', text: "Pay hospital fees of $100", amount: -100, action: 'money' },
  { id: 112, type: 'chest', text: "Pay school fees of $50", amount: -50, action: 'money' },
  { id: 113, type: 'chest', text: "Receive $25 consultancy fee", amount: 25, action: 'money' },
  { id: 114, type: 'chest', text: "You are assessed for street repairs. $40 per house. $115 per hotel", amount: -40, action: 'money' },
  { id: 115, type: 'chest', text: "You have won second prize in a beauty contest. Collect $10", amount: 10, action: 'money' },
];
