// ponytail: Next 12 bundles a jsonwebtoken that needs buffer.SlowBuffer, removed in Node 25+.
// Preloaded by the npm scripts. Delete this file (and the `-r` flags) when Next is upgraded.
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
