import { User } from '../models/types';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/appError';

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData: User): Promise<User> {
        // Check if user exists
        const existingUser = await this.userRepository.getUserByEmail(
            userData.email
        );
        if (existingUser) {
            throw new AppError('User with this email already exists', 409);
        }

        return this.userRepository.create(userData);
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check if new email is already taken by another user
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.userRepository.getUserByEmail(
                userData.email
            );
            if (existingUser) {
                throw new AppError('Email already in use', 409);
            }
        }

        await this.userRepository.update(id, userData);
        return this.getUserById(id);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await this.userRepository.delete(id);
    }
}
