import ImageKit, { toFile } from "@imagekit/nodejs";
import { imagekitPrivateKey } from "./env.js";

export const imagekit = new ImageKit({
  privateKey: imagekitPrivateKey,
  timeout: 5 * 60 * 1000,
});

export { toFile };
