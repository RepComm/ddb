/**TypeScript modification of murmurhash-js
 * 
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author Gary Court
 * @see http://github.com/garycourt/murmurhash-js
 * @author Austin Appleby
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param key ASCII only
 * @param seed Positive integer only
 * @return 32-bit positive integer hash 
 */
export function murmurhash3(key, seed) {
  let remainder = 0;
  let bytes = 0;
  let h1 = 0;
  let h1b = 0;
  let c1 = 0;
  let c1b = 0;
  let c2 = 0;
  let c2b = 0;
  let k1 = 0;
  let i = 0;
  remainder = key.length & 3; // key.length % 4

  bytes = key.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
    k1 = key.charCodeAt(i) & 0xff | (key.charCodeAt(++i) & 0xff) << 8 | (key.charCodeAt(++i) & 0xff) << 16 | (key.charCodeAt(++i) & 0xff) << 24;
    ++i;
    k1 = (k1 & 0xffff) * c1 + (((k1 >>> 16) * c1 & 0xffff) << 16) & 0xffffffff;
    k1 = k1 << 15 | k1 >>> 17;
    k1 = (k1 & 0xffff) * c2 + (((k1 >>> 16) * c2 & 0xffff) << 16) & 0xffffffff;
    h1 ^= k1;
    h1 = h1 << 13 | h1 >>> 19;
    h1b = (h1 & 0xffff) * 5 + (((h1 >>> 16) * 5 & 0xffff) << 16) & 0xffffffff;
    h1 = (h1b & 0xffff) + 0x6b64 + (((h1b >>> 16) + 0xe654 & 0xffff) << 16);
  }

  k1 = 0;

  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;
      k1 = (k1 & 0xffff) * c1 + (((k1 >>> 16) * c1 & 0xffff) << 16) & 0xffffffff;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 0xffff) * c2 + (((k1 >>> 16) * c2 & 0xffff) << 16) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (h1 & 0xffff) * 0x85ebca6b + (((h1 >>> 16) * 0x85ebca6b & 0xffff) << 16) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = (h1 & 0xffff) * 0xc2b2ae35 + (((h1 >>> 16) * 0xc2b2ae35 & 0xffff) << 16) & 0xffffffff;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}