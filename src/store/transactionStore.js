import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Helper to set an exact day (1-31) in the past to prevent month-bleed
const getPastDate = (monthsAgo, specificDay) => {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(specificDay); 
  return d.toISOString();
};

const initialDummyData = [
  // ==========================================
  // JUNE (0 months ago - Only up to June 3rd)
  // ==========================================
  { id: crypto.randomUUID(), amount: 12.50, category: 'Food', date: getPastDate(0, 3), note: 'Nasi Lemak' },
  { id: crypto.randomUUID(), amount: 24.00, category: 'Transport', date: getPastDate(0, 2), note: 'Grab to KL Sentral' },
  { id: crypto.randomUUID(), amount: 15.00, category: 'Food', date: getPastDate(0, 2), note: 'Lunch Cafe' },
  { id: crypto.randomUUID(), amount: 4.50, category: 'Transport', date: getPastDate(0, 1), note: 'LRT Ticket' },
  { id: crypto.randomUUID(), amount: 8.00, category: 'Food', date: getPastDate(0, 1), note: 'Teh Tarik & Roti' },

  // ==========================================
  // MAY (1 month ago) - 2 to 3 per week
  // ==========================================
  // Week 1
  { id: crypto.randomUUID(), amount: 20.00, category: 'Food', date: getPastDate(1, 2), note: 'Burger King' },
  { id: crypto.randomUUID(), amount: 15.00, category: 'Transport', date: getPastDate(1, 4), note: 'Grab to Class' },
  { id: crypto.randomUUID(), amount: 120.00, category: 'Shopping', date: getPastDate(1, 7), note: 'Running Shoes' },
  // Week 2
  { id: crypto.randomUUID(), amount: 25.00, category: 'Entertainment', date: getPastDate(1, 10), note: 'Movie Ticket' },
  { id: crypto.randomUUID(), amount: 45.00, category: 'Food', date: getPastDate(1, 12), note: 'Dinner with friends' },
  { id: crypto.randomUUID(), amount: 18.00, category: 'Transport', date: getPastDate(1, 14), note: 'Grab Home' },
  // Week 3
  { id: crypto.randomUUID(), amount: 150.00, category: 'Groceries', date: getPastDate(1, 16), note: 'Lotus Supermarket' },
  { id: crypto.randomUUID(), amount: 12.00, category: 'Food', date: getPastDate(1, 18), note: 'Chicken Rice' },
  { id: crypto.randomUUID(), amount: 8.50, category: 'Transport', date: getPastDate(1, 20), note: 'Train Ticket' },
  // Week 4
  { id: crypto.randomUUID(), amount: 30.00, category: 'Food', date: getPastDate(1, 24), note: 'Sushi' },
  { id: crypto.randomUUID(), amount: 200.00, category: 'Shopping', date: getPastDate(1, 26), note: 'Jacket' },
  { id: crypto.randomUUID(), amount: 25.00, category: 'Transport', date: getPastDate(1, 29), note: 'Grab to Mall' },

  // ==========================================
  // APRIL (2 months ago) - 2 to 3 per week
  // ==========================================
  // Week 1
  { id: crypto.randomUUID(), amount: 50.00, category: 'Transport', date: getPastDate(2, 1), note: 'My50 Monthly Pass' },
  { id: crypto.randomUUID(), amount: 15.00, category: 'Food', date: getPastDate(2, 3), note: 'KFC' },
  { id: crypto.randomUUID(), amount: 18.00, category: 'Food', date: getPastDate(2, 6), note: 'Mamak Session' },
  // Week 2
  { id: crypto.randomUUID(), amount: 90.00, category: 'Groceries', date: getPastDate(2, 9), note: 'Weekly Groceries' },
  { id: crypto.randomUUID(), amount: 12.00, category: 'Transport', date: getPastDate(2, 11), note: 'Grab' },
  { id: crypto.randomUUID(), amount: 150.00, category: 'Entertainment', date: getPastDate(2, 14), note: 'Game Purchase' },
  // Week 3
  { id: crypto.randomUUID(), amount: 15.00, category: 'Food', date: getPastDate(2, 17), note: 'Starbucks' },
  { id: crypto.randomUUID(), amount: 22.00, category: 'Food', date: getPastDate(2, 19), note: 'Pasta Lunch' },
  { id: crypto.randomUUID(), amount: 14.00, category: 'Transport', date: getPastDate(2, 21), note: 'Grab' },
  // Week 4
  { id: crypto.randomUUID(), amount: 85.00, category: 'Shopping', date: getPastDate(2, 24), note: 'Uniqlo Shirts' },
  { id: crypto.randomUUID(), amount: 55.00, category: 'Food', date: getPastDate(2, 26), note: 'Steamboat' },
  { id: crypto.randomUUID(), amount: 20.00, category: 'Transport', date: getPastDate(2, 28), note: 'Night Grab' },

  // ==========================================
  // MARCH (3 months ago) - 2 to 3 per week
  // ==========================================
  // Week 1
  { id: crypto.randomUUID(), amount: 10.00, category: 'Food', date: getPastDate(3, 2), note: 'Mixed Rice' },
  { id: crypto.randomUUID(), amount: 15.00, category: 'Transport', date: getPastDate(3, 5), note: 'Grab to Clinic' },
  { id: crypto.randomUUID(), amount: 120.00, category: 'Groceries', date: getPastDate(3, 7), note: 'Jaya Grocer' },
  // Week 2
  { id: crypto.randomUUID(), amount: 14.00, category: 'Food', date: getPastDate(3, 9), note: 'Noodles' },
  { id: crypto.randomUUID(), amount: 20.00, category: 'Food', date: getPastDate(3, 12), note: 'Pizza Delivery' },
  { id: crypto.randomUUID(), amount: 10.00, category: 'Transport', date: getPastDate(3, 14), note: 'LRT + Bus' },
  // Week 3
  { id: crypto.randomUUID(), amount: 65.00, category: 'Shopping', date: getPastDate(3, 16), note: 'Birthday Gift' },
  { id: crypto.randomUUID(), amount: 250.00, category: 'Entertainment', date: getPastDate(3, 19), note: 'Concert Ticket' },
  { id: crypto.randomUUID(), amount: 30.00, category: 'Transport', date: getPastDate(3, 21), note: 'Grab to Concert' },
  // Week 4
  { id: crypto.randomUUID(), amount: 12.00, category: 'Food', date: getPastDate(3, 24), note: 'Mcdonalds' },
  { id: crypto.randomUUID(), amount: 18.00, category: 'Transport', date: getPastDate(3, 27), note: 'Grab' },
  { id: crypto.randomUUID(), amount: 75.00, category: 'Groceries', date: getPastDate(3, 30), note: 'Restock Snacks' },
];

export const useTransactionStore = create(
  persist(
    (set) => ({
      transactions: initialDummyData,

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      clearAll: () => set({ transactions: [] }),
    }),
    { name: 'vocafin-transactions' },
  ),
)