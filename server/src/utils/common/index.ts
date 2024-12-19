import { randomBytes } from 'crypto';

export const createId = () => randomBytes(Math.ceil(25 / 2)).toString('hex').slice(0, 25);