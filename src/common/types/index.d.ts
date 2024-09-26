import { User } from '@/databases/models';

type UserDocument = User;

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
