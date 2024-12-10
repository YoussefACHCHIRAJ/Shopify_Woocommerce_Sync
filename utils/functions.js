function splitToChunks(array, size = 10) {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

module.exports = {
  splitToChunks,
};
