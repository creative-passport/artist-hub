import './mockEnv';
import request, { SuperAgentTest } from 'supertest';
import { getApp } from '../src/app';
import { Express } from 'express';
import { login, SeedData, seedData, setupDb } from './utils';
import { ArtistPage } from '../src/models/ArtistPage';

describe('Public API', () => {
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

  describe('GET /api/artistpages/:username', () => {
    it('should return public artist page data', async () => {
      for (const p of seededPages) {
        const res = await agent
          .get(`/api/artistpages/${p.username}`)
          .expect(200);

        expect(res.body).toEqual({
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
        });
      }
    });

    it('should return a 404', async () => {
      await agent.get(`/api/artistpages/doesntexist`).expect(404);
    });
  });

  describe('GET /api/artistpages/:username/feed', () => {
    it('should return public artist page feed', async () => {
      for (const p of seededPages) {
        const res = await agent
          .get(`/api/artistpages/${p.username}/feed`)
          .expect(200);

        expect(res.body).toEqual({
          data: p.apActor.deliveredObjects?.reverse().map((o) => {
            return o.actor
              ? {
                  id: o.id,
                  accountUrl: o.actor.url || o.actor.uri,
                  username: o.actor.username,
                  name: o.actor.name,
                  domain: o.actor.domain,
                  iconUrl: o.actor.iconUrl,
                  url: o.url || o.uri,
                  content: o.content,
                  attachments: o.attachments
                    ? o.attachments.map((a) => ({
                        id: a.id,
                        url: a.url,
                        mediaType: a.mediaType,
                        description: a.description,
                        thumbnailUrl: a.thumbnailUrl,
                        blurhash: a.blurhash,
                      }))
                    : [],
                }
              : {};
          }),
        });
      }
    });

    it('should return a 404', async () => {
      await agent.get(`/api/artistpages/doesntexist/feed`).expect(404);
    });
  });
});
