import { randomUUID } from "crypto";

export const get_random_uuid = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID(); // Browser or Node.js >= 14
      }
      return randomUUID();
      
}