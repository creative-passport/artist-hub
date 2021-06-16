import './mockEnv';
import request, { SuperAgentTest } from 'supertest';
import { getApp } from '../src/app';
import { Express } from 'express';
import { seedData, setupDb } from './utils';

describe('Authentication', () => {
  let app: Express;
  let agent: SuperAgentTest;
  let cleanupDb: () => Promise<void>;

  beforeAll(async () => {
    cleanupDb = await setupDb();
    await seedData();

    app = await getApp();
    agent = request.agent(app);
  });

  afterAll(() => {
    cleanupDb();
  });

  let csrfToken = '';
  it('GET /auth', async () => {
    const res = await agent.get(`/auth`);
    expect(res.status).toEqual(200);
    expect(res.body.csrfToken).toBeDefined();
    expect(res.body.signedIn).toBe(false);
  });

  describe('POST /auth/login', () => {
    it('CSRF failure', async () => {
      await agent.get(`/auth`).then((res) => {
        csrfToken = res.body.csrfToken;
      });
      await request(app)
        .post(`/auth/login`)
        .type('form')
        .send({
          _csrf: 'badtoken',
          username: 'admin',
          password: 'admin',
        })
        .then((res) => {
          expect(res.status).toEqual(403);
        });
    });

    it('Auth failure', async () => {
      let res = await agent.post(`/auth/login`).type('form').send({
        _csrf: csrfToken,
        username: 'admin',
        password: 'wrong',
      });
      expect(res.status).toEqual(302);
      res = await agent.get(`/auth`);
      expect(res.status).toEqual(200);
      expect(res.body.signedIn).toBe(false);
    });

    it('Auth success', async () => {
      let res = await agent.post(`/auth/login`).type('form').send({
        _csrf: csrfToken,
        username: 'admin',
        password: 'admin',
      });
      expect(res.status).toEqual(302);
      res = await agent.get(`/auth`);
      expect(res.status).toEqual(200);
      expect(res.body.signedIn).toBe(true);
    });
  });
});
