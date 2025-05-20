import {AuthTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import prisma from "../src/application/database";
import logging from "../src/application/logging";
import {request} from "express";

describe('POST /api/v1/auth/register', () => {
    afterEach(async () => {
        AuthTest.deleteAll();
    });

    it('should be able to register new user', async () => {
        const response = await supertest(web).post('/api/v1/auth/register').send({
            username: 'test',
            email: 'test@dev.com',
            password: 'test12345678'
        });

        const isUserPreferenceCreated = await prisma.userPreferences.findFirst({
            where: {
                userId: response.body.data.id
            }
        });

        const isLabelCreated = await prisma.label.findMany({
            where: {
                userId: response.body.data.id
            }
        });
        logging.info('Response', response.body);
        logging.info('User preference', isUserPreferenceCreated);
        logging.info('Label', isLabelCreated);

        expect(isUserPreferenceCreated).toBeDefined();
        expect(isLabelCreated).toBeDefined();
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
        logging.info('Response', response.body);

        const refreshToken = await prisma.refreshToken.findFirst({
            where: {
                userId: response.body.data.userId,
            }
        });
        logging.info('Refresh token', refreshToken);

        expect(refreshToken).toBeDefined();

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('SuccessFully logged in');
        expect(response.headers['set-cookie']).toBeDefined();
        expect(response.headers['set-cookie'][0]).toBeDefined();
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
        expect(response.headers['set-cookie']).toBeDefined();
        expect(response.headers['set-cookie'][0]).toBeDefined();
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
        expect(response.headers['set-cookie']).toBeUndefined();
    });
    
    
});

describe('POST /api/v1/auth/logout', () => {
    let token: string;
    let id: number;

    beforeEach(async () => {
        await AuthTest.createUser();
        const response = await supertest(web).post('/api/v1/auth/login').send({
            username: 'test',
            password: 'test12345678'
        });
        token = response.body.accessToken;
        id = response.body.data.userId;
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should successfully logout', async () => {
        const response = await supertest(web)
            .delete('/api/v1/auth/logout')
            .set('Authorization', `Bearer ${token}`);

        const refreshToken = await prisma.refreshToken.count({});

        logging.info(response.body)

        expect(refreshToken).toBe(0);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('OK');
        expect(request.cookies).toBeUndefined();
    });

    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web)
            .delete('/api/v1/auth/logout')
            .set('Authorization', `Bearer ${invalidToken}`);
        logging.info('Failed Logout', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    // it('should reject if tekn expired', async () => {
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //
    //     const refresh = await prisma.refreshToken.findFirst({
    //         where: {
    //             userId: id,
    //         }
    //     });
    //
    //     const refreshToken = refresh?.token;
    //
    //     const response = await supertest(web)
    //         .delete('/api/v1/auth/logout')
    //         .set('Authorization', `Bearer ${token}`)
    //         .set('Cookie', `refreshToken=${refreshToken};`);
    //
    //     logging.info('Failed Logout', response.body);
    //     // expect(response.status).toBe(401);
    //     // expect(response.body.status).toBe(401);
    //     // expect(response.body.error).toBeDefined();
    //
    // }, 6000);
});

describe('POST /api/v1/auth/refresh', () => {
   let cookiesToken: string;
    beforeEach(async () => {
       await AuthTest.createUser();
        const response = await supertest(web).post('/api/v1/auth/login').send({
            username: 'test',
            password: 'test12345678'
        });
        cookiesToken = response.headers['set-cookie'];
   });

   afterEach(async () => {
        await AuthTest.deleteAll();
   });

    it('should be reject if no refreshToken in cookie', async () => {
        const response = await supertest(web).post('/api/v1/auth/refresh');

        logging.info('Failed Refresh', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should be able to generate new AccesToken', async () => {
        const response = await supertest(web).post('/api/v1/auth/refresh').set('Cookie', cookiesToken);

        logging.info('Success Refresh', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('OK');
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.expiresIn).toBeDefined();
    });

    it('should rejcet if refreshTokenInvalid', async () => {
        const invalidToken = AuthTest.generateInvalidToken();

        const response = await supertest(web).post('/api/v1/auth/refresh').set('Cookie', `refreshToken=${invalidToken};`);
        logging.info('Failed Refresh', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});