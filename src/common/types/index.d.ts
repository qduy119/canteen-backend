import { z } from 'zod';
import { User } from '@/databases/models';
import { configSchema } from '@/config';

type UserDocument = User;

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }

  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
