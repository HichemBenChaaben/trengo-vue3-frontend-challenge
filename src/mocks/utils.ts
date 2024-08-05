/*
  Utility function to generate a random number for the delay msw utility
  this is slowed down to simulate a real network request
*/
export const getRandomDelay = (min = 100, max = 600) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
