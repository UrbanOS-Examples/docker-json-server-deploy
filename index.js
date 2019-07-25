module.exports = () => {
  const data = { users: [] }
  // timestamp
  for (let i = 0; i < 100; i++) {
    data.users.push({ id: i, name: `weather${i}` })
  }
  return data
}