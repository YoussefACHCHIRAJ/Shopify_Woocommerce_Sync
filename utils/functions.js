function splitToChunks(array, size = 10) {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

function getNextPageUrlFromHeader(linkHeader) {
  if (!linkHeader) return null;

  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}

module.exports = {
  splitToChunks,
  getNextPageUrlFromHeader
};
