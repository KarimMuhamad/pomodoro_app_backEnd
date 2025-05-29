import { AuthTest, LabelTestUtil } from "./test-util";
import logging from "../src/application/logging";
import supertest from "supertest";
import { web } from "../src/application/web";
import prisma from "../src/application/database";

describe('POST /api/v1/session', () => {
    let token: string;
    let labelId: number;
    
    beforeEach(async () => {
        token = await AuthTest.getToken();
        const label = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'Belajar Java',
            color: '#09f129'
        });
        labelId = label.body.data.id;
    });
    
    afterEach(async () => {
        await prisma.pomodoroSession.deleteMany({});
        await AuthTest.deleteAll();
    });
    
    it('should be able to create session', async () => {
        const response = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${token}`).send({
            labelId: labelId,
            duration: 0,
            hour: new Date().getHours(),
            type: 'FOCUS'
        });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.labelId).toBe(labelId);
        expect(response.body.data.duration).toBe(0);
        expect(response.body.data.hour).toBe(new Date().getHours());
        expect(response.body.data.type).toBe('FOCUS');
        expect(response.body.data.isCompleted).toBe(false);
    });

    it('should be able to create session with default label', async () => {
        const response = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${token}`).send({
            duration: 0,
            hour: new Date().getHours(),
            type: 'FOCUS'
        });

        logging.info('Response', response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.duration).toBe(0);
        expect(response.body.data.hour).toBe(new Date().getHours());
        expect(response.body.data.type).toBe('FOCUS');
        expect(response.body.data.isCompleted).toBe(false);
    });
    
    it('should reject create session with validation error', async () => {
        const response = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${token}`).send({
            labelId: 'invalid',
            duration: -1,
            hour: 25,
            type: 'INVALID'
        });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
    
    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${invalidToken}`).send({
            labelId: labelId,
            duration: 1500,
            hour: 14,
            type: 'FOCUS'
        });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
    
    it('should be reject if no token', async () => {
        const response = await supertest(web).post('/api/v1/session').send({
            labelId: labelId,
            duration: 1500,
            hour: 14,
            type: 'FOCUS'
        });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe('PATCH /api/v1/session/:sessionId', () => {
    let token: string;
    let labelId: number;
    let sessionId: number;
    
    beforeEach(async () => {
        token = await AuthTest.getToken();
        const label = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'Belajar Rust',
            color: '#076fc5'
        });
        labelId = label.body.data.id;
        
        const session = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${token}`).send({
            labelId: labelId,
            duration: 0,
            hour: new Date().getHours(),
            type: 'FOCUS'
        });
        sessionId = session.body.data.id;
    });
    
    afterEach(async () => {
        await prisma.pomodoroSession.deleteMany({});
        await AuthTest.deleteAll();
    });
    
    it('should be able to update session', async () => {
        const response = await supertest(web).patch(`/api/v1/session/${sessionId}`).set('Authorization', `Bearer ${token}`)
            .send({
                duration: 1500,
                isCompleted: true
            });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(sessionId);
        expect(response.body.data.isCompleted).toBe(true);
        expect(new Date(response.body.data.endTime)).toBeInstanceOf(Date);
    });
    
    it('should be able to update session with only isCompleted', async () => {
        const response = await supertest(web).patch(`/api/v1/session/${sessionId}`).set('Authorization', `Bearer ${token}`)
            .send({
                duration: 3600,
            });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(sessionId);
        expect(response.body.data.isCompleted).toBe(false);
    });
    
    it('should be reject if id not Found', async () => {
        const response = await supertest(web).patch(`/api/v1/session/${sessionId + 999}`).set('Authorization', `Bearer ${token}`)
            .send({
                isCompleted: true
            });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });
    
    it('should be reject if token invalid', async () => {
        const invalidToken = token.slice(0, -3) + 'abc';
        const response = await supertest(web).patch(`/api/v1/session/${sessionId}`).set('Authorization', `Bearer ${invalidToken}`)
            .send({
                isCompleted: true
            });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
    
    it('should be reject if no token', async () => {
        const response = await supertest(web).patch(`/api/v1/session/${sessionId}`)
            .send({
                isCompleted: true
            });
        
        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe('GET /api/v1/session/:sessionId', () => {
    let token: string;
    let labelId: number;
    beforeEach(async () => {
        token = await AuthTest.getToken();
        const label = await supertest(web).post('/api/v1/labels').set('Authorization', `Bearer ${token}`).send({
            name: 'Belajar Java',
            color: '#09f129'
        });
        labelId = label.body.data.id;
    });

    afterEach(async () => {
        await prisma.pomodoroSession.deleteMany({});
        await AuthTest.deleteAll();
    });

    it('should be able to get session', async () => {
        const session = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${token}`).send({
            duration: 0,
            hour: new Date().getHours(),
            type: 'FOCUS'
        });

        logging.info('Session', session.body);

        const sessionId = session.body.data.id;

        const response = await supertest(web).get(`/api/v1/session/${sessionId}`).set('Authorization', `Bearer ${token}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(sessionId);
    });

    it('should reject to get session if token invalid', async () => {
        const session = await supertest(web).post('/api/v1/session').set('Authorization', `Bearer ${token}`).send({
            duration: 0,
            hour: new Date().getHours(),
            type: 'FOCUS'
        });

        logging.info('Session', session.body);

        const sessionId = session.body.data.id;

        const response = await supertest(web).get(`/api/v1/session/${sessionId}`).set('Authorization', `Bearer ${token + 'abd'}`);

        logging.info('Response', response.body);
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});