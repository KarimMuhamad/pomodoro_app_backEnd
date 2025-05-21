import supertest from "supertest";
import {AuthTest} from "./test-util";
import { web } from "../src/application/web";
import logging from "../src/application/logging";

describe('GET /api/v1/users/preferences', () =>{
    let token: string;
    beforeEach(async () => {
        token = await AuthTest.getToken();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to get user preferences', async () => {
        const response = await supertest(web).get('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.focusDuration).toBe(1500);
        expect(response.body.data.shortBreakDuration).toBe(300);
        expect(response.body.data.longBreakDuration).toBe(900);
        expect(response.body.data.autoStartFocus).toBe(false);
        expect(response.body.data.autoStartBreak).toBe(false);
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

describe('PATCH /api/v1/users/preferences', () => {
    let token: string;
    beforeEach(async () => {
        token = await AuthTest.getToken();
    });

    afterEach(async () => {
        await AuthTest.deleteAll();
    });

    it('should be able to update userPreferences', async () => {
        const response = await supertest(web).patch('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`).send({
            focusDuration: 3000,
            shortBreakDuration: 600,
            longBreakDuration: 1800,
            autoStartFocus: true,
            autoStartBreak: true
        });

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('SuccessFully update preferences');
        expect(response.body.data.focusDuration).toBe(3000);
        expect(response.body.data.shortBreakDuration).toBe(600);
        expect(response.body.data.longBreakDuration).toBe(1800);
        expect(response.body.data.autoStartFocus).toBe(true);
        expect(response.body.data.autoStartBreak).toBe(true);
    });

    it('should be able to update userPreferences with optional', async () => {
        const response = await supertest(web).patch('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`).send({
            focusDuration: 3000,
            shortBreakDuration: 600,
            longBreakDuration: 1800,
        });

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('SuccessFully update preferences');
        expect(response.body.data.focusDuration).toBe(3000);
        expect(response.body.data.shortBreakDuration).toBe(600);
        expect(response.body.data.longBreakDuration).toBe(1800);
        expect(response.body.data.autoStartFocus).toBe(false);
        expect(response.body.data.autoStartBreak).toBe(false);
    });

    it('should be reject update userPreferences with validationError', async () => {
        const response = await supertest(web).patch('/api/v1/users/preferences').set('Authorization', `Bearer ${token}`).send({
           focusDuration: -100,
           shortBreakDuration: 'test',
           longBreakDuration: 1800,
           autoStartFocus: 'true',
           autoStartBreak: 'true'
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