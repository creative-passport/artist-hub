import './mockEnv';
import request, { SuperAgentTest } from 'supertest';
import { getApp } from '../src/app';
import { Express } from 'express';
import { login, SeedData, seedData, setupDb } from './utils';
import { ArtistPage } from '../src/models/ArtistPage';

describe('Artist page admin', () => {
  let app: Express;
  let agent: SuperAgentTest;
  let cleanupDb: () => Promise<void>;
  let data: SeedData;
  let seededPages: ArtistPage[];

  beforeAll(async () => {
    cleanupDb = await setupDb();
    data = await seedData();
    if (!data.users[0].artistPages) {
      throw new Error('Seeded pages not found');
    }
    seededPages = data.users[0].artistPages;
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
          expect(res.body).toEqual(
            seededPages.map((p) => ({
              id: p.id,
              title: p.title,
              headline: p.headline,
              description: p.description,
              username: p.username,
              url: `http://0.0.0.0:4000/p/${p.username}`,
              links: p.links
                ? p.links.map((l) => ({
                    id: l.id,
                    url: l.url,
                    sort: l.sort,
                  }))
                : [],
            }))
          );
        });
    });
  });

  describe('GET /admin/api/artistpages/:id', () => {
    it('should get an artist page', async () => {
      for (const p of seededPages) {
        const res = await agent
          .get(`/api/admin/artistpages/${p.id}`)
          .expect(200);
        expect(res.body).toEqual({
          id: p.id,
          title: p.title,
          headline: p.headline,
          description: p.description,
          username: p.username,
          url: `http://0.0.0.0:4000/p/${p.username}`,
          links: p.links
            ? p.links.map((l) => ({
                id: l.id,
                url: l.url,
                sort: l.sort,
              }))
            : [],
          following: p.apActor?.followingActors
            ? p.apActor?.followingActors.map((a) => ({
                id: a.id,
                domain: a.domain,
                username: a.username,
                name: a.name,
                url: a.uri,
                followState: a.followState,
                followUri: a.followUri,
                iconUrl: a.iconUrl,
              }))
            : undefined,
        });
      }
    });
  });

  let newPageId: string;
  describe('POST /admin/api/artistpages', () => {
    it('should create an artist page', async () => {
      const res = await agent
        .post('/api/admin/artistpages')
        .send({
          title: 'New page',
          username: 'newpage',
        })
        .expect(200);
      newPageId = res.body.id;
      expect(res.body).toEqual({
        id: newPageId,
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

  describe('DELETE /admin/api/artistpages/:id', () => {
    it('should delete an artist page', async () => {
      await agent.delete(`/api/admin/artistpages/${newPageId}`).expect(204);
      await agent.get(`/api/admin/artistpages/${newPageId}`).expect(404);
    });
  });

  let linkId: string;
  describe('POST /admin/api/artistpages/:id/links', () => {
    it('should create link', async () => {
      let res = await agent
        .post(`/api/admin/artistpages/${seededPages[0].id}/links`)
        .send({
          url: 'https://creativepassport.net',
        })
        .expect(200);
      expect(res.body).toMatchObject({
        url: 'https://creativepassport.net',
      });
      linkId = res.body.id;

      res = await agent
        .get(`/api/admin/artistpages/${seededPages[0].id}`)
        .expect(200);
      expect(res.body.links).toMatchObject([
        {
          url: 'https://creativepassport.net',
        },
      ]);
    });
  });

  describe('POST /admin/api/artistpages/:id/links', () => {
    it('should fail to add invalid link', () => {
      return agent
        .post(`/api/admin/artistpages/${seededPages[0].id}/links`)
        .send({
          url: 'not a link',
        })
        .expect(400);
    });
  });

  describe('PUT /admin/api/artistpages/1=:id/links/:linkId', () => {
    it('should update link', async () => {
      const res = await agent
        .put(`/api/admin/artistpages/${seededPages[0].id}/links/${linkId}`)
        .send({
          url: 'https://example.com',
        })
        .expect(200);
      expect(res.body).toMatchObject({
        url: 'https://example.com',
      });
    });
  });

  describe('DELETE /admin/api/artistpages/:id/links/:linkId', () => {
    it('should delete link', async () => {
      await agent
        .delete(`/api/admin/artistpages/${seededPages[0].id}/links/${linkId}`)
        .expect(204);
      const res = await agent
        .get(`/api/admin/artistpages/${seededPages[0].id}`)
        .expect(200);
      expect(res.body.links).toEqual([]);
    });
  });
});
