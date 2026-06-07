import { speakText as audioSpeakText } from './audioFeedback';

const NUMBER_WORDS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
}

/**
 * Text-to-speech wrapper for backward compatibility
 * @param {string} text - Text to speak
 * @param {Object} options - TTS options
 */
export const speakText = (text, options = {}) => {
  return audioSpeakText(text, { ...options, rate: options.rate || 0.95 });
}

export const CATEGORY_KEYWORDS = {
  Food: ['food', 'lunch', 'dinner', 'breakfast', 'meal', 'burger', 'nasi', 'coffee'],
  Transport: ['grab', 'taxi', 'bus', 'transport', 'train', 'mrt', 'lrt', 'toll'],
  Groceries: ['grocery', 'groceries', 'supermarket', 'market', 'tesco', 'lotus'],
  Shopping: ['shopping', 'clothes', 'shirt', 'shoes', 'mall'],
  Entertainment: ['entertainment', 'movie', 'cinema', 'game', 'concert'],
}

export function parseAmount(text) {
  const normalized = text.toLowerCase().replace(/rm\s*/g, 'rm ')
  const numericMatch = normalized.match(/(?:rm|ringgit)?\s*(\d+(?:\.\d{1,2})?)/)

  if (numericMatch) return Number.parseFloat(numericMatch[1])

  const words = normalized.split(/[\s-]+/)
  let total = 0
  let current = 0
  let matched = false

  words.forEach((word) => {
    if (!(word in NUMBER_WORDS)) return
    matched = true
    const value = NUMBER_WORDS[word]

    if (value === 100) {
      current = Math.max(current, 1) * 100
      return
    }

    current += value
  })

  total += current
  return matched ? total : 0
}

export function detectCategory(text) {
  const normalized = text.toLowerCase()
  return Object.entries(CATEGORY_KEYWORDS).find(([, keywords]) => (
    keywords.some((keyword) => normalized.includes(keyword))
  ))?.[0] || null
}

export function parseSpokenExpense(text) {
  const amount = parseAmount(text)
  const category = detectCategory(text)

  return {
    amount,
    category,
    note: text.trim(),
    needsAmount: amount <= 0,
    needsCategory: !category,
  }
}

export function getCategoryTotals(transactions) {
  return transactions.reduce((totals, tx) => {
    const amount = Number.parseFloat(tx.amount || 0)
    totals[tx.category] = (totals[tx.category] || 0) + amount
    return totals
  }, {})
}

export function getTopCategory(transactions) {
  const categoryTotals = getCategoryTotals(transactions)
  return Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0] || ['None', 0]
}

export function getPeriodSpent(transactions, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return transactions
    .filter((tx) => new Date(tx.date).getTime() >= cutoff)
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount || 0), 0)
}

export function buildFinancialSummary({ transactions, remainingBudget, totalSpentThisMonth }) {
  const weeklySpent = getPeriodSpent(transactions, 7)
  const [topCategory, topAmount] = getTopCategory(transactions)
  const remainingText = remainingBudget < 0
    ? `You are over budget by RM ${Math.abs(remainingBudget).toFixed(2)}.`
    : `Remaining budget is RM ${remainingBudget.toFixed(2)}.`

  return `You spent RM ${weeklySpent.toFixed(2)} this week. You spent RM ${totalSpentThisMonth.toFixed(2)} this month. ${remainingText} Your top category is ${topCategory} at RM ${topAmount.toFixed(2)}.`
}

export function speakText(text, { onEnd, onError } = {}) {
  if (!('speechSynthesis' in window)) {
    onError?.()
    return null
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-MY'
  utterance.rate = 0.9
  utterance.onend = onEnd
  utterance.onerror = onError
  window.speechSynthesis.speak(utterance)
  return utterance
}
