import prisma from "../src/application/database";
import argon2 from "argon2";
import supertest from "supertest";
import { web } from "../src/application/web";
import jwt from "jsonwebtoken";

export class AuthTest {
    static async deleteAll() {
        await prisma.user.deleteMany({
            where: {
                username: 'test'
            }
        });
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

    static async generateInvalidToken() {
        const invalidToken = jwt.sign({id: 1}, 'invalid', {expiresIn: '30d'});
        return invalidToken;
    }

}