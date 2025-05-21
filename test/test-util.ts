import prisma from "../src/application/database";
import argon2 from "argon2";
import supertest from "supertest";
import { web } from "../src/application/web";
import jwt from "jsonwebtoken";

export class AuthTest {
    static async deleteAll() {
        await prisma.user.deleteMany({});
    }

    static async createUser() {
        const hashedPassword = await argon2.hash('test12345678');

        await prisma.user.create({
           data: {
               username: 'test',
               email: 'test@dev.com',
               password: hashedPassword
           }
        });
    }

    static async getToken() {
        await this.createUser();
        const response = await supertest(web).post('/api/v1/auth/login').send({
            username: 'test',
            password: 'test12345678'
        });

        return response.body.accessToken;
    }

    static async generateInvalidToken() {
        const invalidToken = jwt.sign({id: 1}, 'invalid', {expiresIn: '30d'});
        return invalidToken;
    }

}

export class UserTestUtil {
    static async getUser() {
        const user = await prisma.user.findFirst({
            where: {
                username: 'test'
            }
        });

        if (!user) throw new Error('User not found');

        return user;
    }
}