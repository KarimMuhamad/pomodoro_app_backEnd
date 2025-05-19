import {AuthTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import prisma from "../src/application/database";

describe('POST /api/v1/auth/login', () => {
    afterEach(async () => {
        AuthTest.deleteAll();
    });

    it('should be able to register new user', async () => {
        const response = await supertest(web).post('/api/v1/auth/register').send({
            username: 'test',
            email: 'test@dev.com',
            password: 'test12345678'
        });

        const isUserPreferenceCreated = await prisma.userPreferences.count({
            where: {
                userId: response.body.data.id
            }
        });

        const isLabelCreated = await prisma.label.count({
            where: {
                userId: response.body.data.id
            }
        });

        expect(isUserPreferenceCreated).toBe(1);
        expect(isLabelCreated).toBe(1);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe('SuccessFully registered');
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.email).toBe('test@dev.com');
        expect(response.body.data.password).toBeUndefined();
    });

    it('should reject validation error', async () => {
        const response = await supertest(web).post('/api/v1/auth/register').send({
            username: 't2',
            email: 'tes.com',
            password: '1'
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
});

describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
        await AuthTest.createUser();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to login with email', async () => {
        const response = await supertest(web).post('/api/v1/auth/login').send({
            email: 'test@dev.com',
            password: 'test12345678'
        });

        const refreshToken = await prisma.refreshToken.findFirst({
            where: {
                userId: response.body.data.userId,
            }
        });

        expect(refreshToken).toBeDefined();
        expect(refreshToken?.token).toBeDefined();
        expect(refreshToken?.expiredAt).toBeDefined();

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('SuccessFully logged in');
        expect(response.body.data.token).toBeDefined();

    });

    it('should be able to login with username', async () => {
        const response = await supertest(web).post('/api/v1/auth/login').send({
            username: 'test',
            password: 'test12345678'
        });

        const refreshToken = await prisma.refreshToken.findFirst({
            where: {
                userId: response.body.data.userId,
            }
        });

        expect(refreshToken).toBeDefined();
        expect(refreshToken?.token).toBeDefined();
        expect(refreshToken?.expiredAt).toBeDefined();

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('SuccessFully logged in');
        expect(response.body.data.token).toBeDefined();

    });

    it('should reject if username, email or password wrong', async () => {
        const response = await supertest(web).post('/api/v1/auth/login').send({
            username: 'test',
            password: 'test123456782'
        });

        const refreshToken = await prisma.refreshToken.count({})

        expect(refreshToken).toBe(0);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});