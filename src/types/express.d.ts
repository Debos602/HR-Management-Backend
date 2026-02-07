import { JwtPayload } from '../middleware/auth';

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload;
        }
    }
}

export { };
