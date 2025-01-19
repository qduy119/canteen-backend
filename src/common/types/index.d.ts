import { z } from 'zod';
import type { User as IUser } from '@/databases/models';
import { configSchema } from '@/config';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IUser {}
    interface Request {
      user?: User;
    }
  }

  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
