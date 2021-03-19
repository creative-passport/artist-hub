import express from 'express';
import { requireAuth } from '../auth/auth';
import { User } from '../models/User';
import axios from 'axios';
import { asyncWrapper } from '../asyncWrapper';
import crypto from 'crypto';
import { promisify } from 'util';

const generateKeyPair = promisify(crypto.generateKeyPair);

export const apiRouter = express.Router();
apiRouter.use(requireAuth, express.json());

// Test API endpoint
apiRouter.get('/ping', (req, res) => {
  res.send({ success: true });
});

// Get artist pages
apiRouter.get(
  '/artistpages',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const artistPages = await user
      .$relatedQuery('artistPages')
      .orderBy('title')
      .allowNotFound();
    res.send(artistPages);
  })
);

// Get artist page
apiRouter.get(
  '/artistpages/:artistPageId',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const artistPage = await user
      .$relatedQuery('artistPages')
      .findById(req.params.artistPageId);
    if (artistPage) {
      res.send(artistPage);
    } else {
      res.sendStatus(404);
    }
  })
);

// Create new artist page
apiRouter.post(
  '/artistpages',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const { publicKey, privateKey } = await generateKeyPair('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    const artistPage = await user
      .$relatedQuery('artistPages')
      .insert({
        title: req.body.title,
        username: req.body.username,
        publicKey,
        privateKey,
      })
      .returning('*')
      .first();
    res.send(artistPage);
  })
);

// Update artist page
apiRouter.put(
  '/artistpages/:artistPageId',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const artistPage = await user
      .$relatedQuery('artistPages')
      .patch({ title: req.body.title })
      .where('id', req.params.artistPageId)
      .returning('*')
      .first();
    res.send(artistPage);
  })
);

// Delete artist page
apiRouter.delete(
  '/artistpages/:artistPageId',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    await user.$relatedQuery('artistPages').deleteById(req.params.artistPageId);
    res.sendStatus(204);
  })
);

const contentType =
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

const webfingerRegex = /^@?(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

const activityPubMimeTypes = [
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
  'application/activity+json',
];

apiRouter.post(
  '/activitypub/lookup',
  asyncWrapper(async (req, res) => {
    if (!req.body || typeof req.body.url !== 'string') {
      console.log(req);
      res.sendStatus(500);
      return;
    }
    let url: string = req.body.url;
    if (webfingerRegex.test(req.body.url)) {
      let acct = req.body.url;
      if (acct.startsWith('@')) {
        acct = acct.slice(1);
      }
      const [username, domain] = acct.split('@');
      const r = await axios.get<{
        links: {
          type: string;
          href: string;
        }[];
      }>(`https://${domain}/.well-known/webfinger`, {
        params: {
          resource: `acct:${username}@${domain}`,
        },
        headers: {
          Accept: 'application/jrd+json',
        },
      });
      if (r.data.links) {
        const link = r.data.links.find((l) =>
          activityPubMimeTypes.includes(l.type)
        );
        if (link && link.href) {
          url = link.href;
        } else {
          throw new Error('Webfinger failed');
        }
      }
    }
    const result = await axios.get(url, {
      headers: {
        Accept: contentType,
      },
    });
    res.send(result.data);
  })
);

apiRouter.post(
  '/activitypub/follow',
  asyncWrapper(async (req, res) => {
    if (!req.body || typeof req.body.id !== 'string') {
      console.log(req);
      res.sendStatus(500);
      return;
    }
    let id: string = req.body.id;
    const result = await axios.get(id, {
      headers: {
        Accept: contentType,
      },
    });

    // TODO - use profile to follow ActivityPub source

    res.sendStatus(500);
  })
);
