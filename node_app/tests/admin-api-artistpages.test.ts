import './mockEnv';
import request, { SuperAgentTest } from 'supertest';
import { getApp } from '../src/app';
import { Express } from 'express';
import { login, seedData, setupDb } from './utils';

describe('Artist page admin', () => {
  let app: Express;
  let agent: SuperAgentTest;
  let cleanupDb: () => Promise<void>;

  beforeAll(async () => {
    cleanupDb = await setupDb();
    await seedData();
    app = await getApp();
    agent = request.agent(app);
    await login(agent);
  });

  afterAll(() => {
    cleanupDb();
  });

  describe('GET /admin/api/artistpages', () => {
    it('should return a list of artist page', async () => {
      return agent
        .get('/api/admin/artistpages')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual([
            {
              id: '1',
              title: 'Test Page',
              headline: null,
              description: null,
              username: 'test',
              url: '123556',
              links: [],
            },
          ]);
        });
    });
  });

  describe('GET /admin/api/artistpages/:id', () => {
    it('should get an artist page', () => {
      return agent
        .get('/api/admin/artistpages/1')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: '1',
            url: '123556',
            username: 'test',
            title: 'Test Page',
            headline: null,
            description: null,
            following: [],
            links: [],
          });
        });
    });
  });

  describe('POST /admin/api/artistpages', () => {
    it('should create an artist page', () => {
      return agent
        .post('/api/admin/artistpages')
        .send({
          title: 'New page',
          username: 'newpage',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: '2',
            url: 'http://0.0.0.0:4000/p/newpage',
            username: 'newpage',
            title: 'New page',
            headline: null,
            description: null,
            following: [],
            links: [],
          });
        });
    });
  });

  describe('DELETE /admin/api/artistpages/2', () => {
    it('should delete an artist page', async () => {
      await agent.delete('/api/admin/artistpages/2').expect(204);
      await agent.get('/api/admin/artistpages/2').expect(404);
    });
  });
});
