import {AuthTest, UserTestUtil} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import logging from "../src/application/logging";
import argon2 from "argon2";

describe('GET /api/v1/users/me', () => {
    let token: string;
    beforeEach(async () => {
       token = await AuthTest.getToken();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to get user', async () => {
        const response = await supertest(web).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
    });

    it('should reject to get user if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).get('/api/v1/users/me').set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe('PATCH /api/v1/users/me', () => {
    let token: string;
    beforeEach(async () => {
        token = await AuthTest.getToken();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to update user', async () => {
        const response = await supertest(web).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({
            username: 'test2',
            email: 'test2@dev.com'
        });

        logging.info('Response: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe("SuccessFully update user");
        expect(response.body.data.username).toBe('test2');
        expect(response.body.data.email).toBe('test2@dev.com');
    });

    it('should be able to update user only 1 req.body', async () => {
        const response = await supertest(web).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({
            username: 'test2'
        });

        logging.info('Response : ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe("SuccessFully update user");
        expect(response.body.data.username).toBe('test2');
        expect(response.body.data.email).toBe('test@dev.com');
    });

    it('should be able to update user password', async () => {
        const response = await supertest(web).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({
            password: 'test212345678'
        });

        const user = await UserTestUtil.getUser();

        logging.info('Response : ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe("SuccessFully update user");
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.email).toBe('test@dev.com');

        expect(await argon2.verify(user.password, 'test212345678')).toBe(true);
    });

    it('should reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).patch('/api/v1/users/me').set('Authorization', `Bearer ${invalidToken}`).send({
            username: 'test2'
        });

        logging.info('Failed Update', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if req.body is blank', async () => {
        const response = await supertest(web).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`);

        logging.info('Failed Update', response.body);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
    });
});

describe('DELETE /api/v1/users/me', () => {
    let token: string;
    beforeEach(async () => {
        token = await AuthTest.getToken();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to delete user', async () => {
        const response = await supertest(web).delete('/api/v1/users/me').set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('OK');
    });

    it('should reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).delete('/api/v1/users/me').set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should reject if token blank', async () => {
        const response = await supertest(web).delete('/api/v1/users/me');

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

});