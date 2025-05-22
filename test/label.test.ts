import {AuthTest} from "./test-util";
import logging from "../src/application/logging";
import supertest from "supertest";
import {web} from "../src/application/web";

describe('GET /api/v1/labels', () =>{
    let token: string;
    let labelId: number;
    beforeEach(async () => {
        token = await AuthTest.getToken();
        const label = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'test',
            color: '#000000'
        });
        labelId = label.body.data.id;
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to get labels', async () => {
        const response = await supertest(web).get('/api/v1/labels').set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should be able to get label by id', async () => {
        const response = await supertest(web).get(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(labelId);
    });

    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).get('/api/v1/users/preferences').set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if no token', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).get('/api/v1/users/preferences');

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe('POST /api/v1/labels', () => {
    let token: string;
    beforeEach(async () => {
        token = await AuthTest.getToken();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to create label', async () => {
        const response = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'test',
            color: '#000000'
        });

        logging.info('Response', response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe('test');
    });

    it('should reject create label with validation error', async () => {
        const response = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'q',
            color: '#zzzzzz'
        });

        logging.info('Response', response.body);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).get('/api/v1/users/preferences').set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if no token', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).get('/api/v1/users/preferences');

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe('PATCH /api/v1/labels/:labelId', () => {
    let token: string;
    let labelId: number;
    beforeEach(async () => {
        token = await AuthTest.getToken();
        const label = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'test',
            color: '#000000'
        });
        labelId = label.body.data.id;
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to update label', async () => {
        const response = await supertest(web).patch(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${token}`)
            .send({
                name: 'work',
                color: '#888000'
            });

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('work');
        expect(response.body.data.color).toBe('#888000');
    });

    it('should be able to update label only 1 req.body', async () => {
        const response = await supertest(web).patch(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${token}`)
            .send({
                color: '#123456'
            });

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.color).toBe('#123456');
    });

    it('should be reject if id not Found', async () => {
        const response = await supertest(web).patch(`/api/v1/labels/${labelId + 2}`).set('Authorization', `Bearer ${token}`)
            .send({
                color: '#123456'
            });

        logging.info('Response', response.body);
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).patch(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if no token', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).get(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe('DELETE /api/v1/labels/:labelId', () => {
    let token: string;
    let labelId: number;
    beforeEach(async () => {
        token = await AuthTest.getToken();
        const label = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'test',
            color: '#000000'
        });
        labelId = label.body.data.id;
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to delete label', async () => {
        const response = await supertest(web).delete(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.color).toBe('#000000');
    });

    it('should be reject if id Not Found', async () => {
        const response = await supertest(web).delete(`/api/v1/labels/${labelId + 2}`).set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).delete(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should be reject if no token', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).delete(`/api/v1/labels/${labelId}`).set('Authorization', `Bearer ${invalidToken}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});