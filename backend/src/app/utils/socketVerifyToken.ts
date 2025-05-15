import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
export const socketVerifyToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};