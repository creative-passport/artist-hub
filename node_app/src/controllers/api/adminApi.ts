import express, { Request, Response } from 'express';
import { requireAuth } from '../../auth/auth';
import { User } from '../../models/User';
import axios from 'axios';
import { asyncWrapper } from '../asyncWrapper';
import crypto from 'crypto';
import { promisify } from 'util';
import config from '../../config';
import { URL } from 'url';
import { createFollow } from '../../activitypub/follow';
import { getActor } from '../../activitypub/actor';

const generateKeyPair = promisify(crypto.generateKeyPair);

export function getAdminApiRoutes() {
  const router = express.Router();
  router.use(requireAuth);
  router.get('/ping', ping);
  router.get('/artistpages', getArtistPages);
  router.get('/artistpages/:artistPageId', getArtistPage);
  router.post('/artistpages', createArtistPage);
  router.put('/artistpages/:artistPageId', updateArtistPage);
  router.delete('/artistpages/:artistPageId', deleteArtistPage);
  router.post('/activitypub/lookup', lookupActivityPub);
  router.post(
    '/artistpages/:artistPageId/activitypub/follow',
    followActivityPub
  );
  return router;
}

// Test API endpoint
function ping(req: Request, res: Response) {
  res.send({ success: true });
}

// Get artist pages
const getArtistPages = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPages = await user.$relatedQuery('artistPages').orderBy('title');
  res.send(artistPages);
});

// Get artist page
const getArtistPage = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId);
  if (artistPage) {
    res.send(artistPage);
  } else {
    res.sendStatus(404);
  }
});

// Create new artist page
const createArtistPage = asyncWrapper(async (req, res) => {
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
  const uri = `${config.baseUrl}/p/${req.body.username}`;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .insertGraph({
      title: req.body.title,
      username: req.body.username,
      apActor: {
        uri,
        username: req.body.username,
        actorType: 'Person',
        publicKey,
        privateKey,
        inboxUrl: `${uri}/inbox`,
        sharedInboxUrl: `${config.baseUrl}/sharedInbox`,
      },
    })
    .returning('*')
    .first();
  res.send(artistPage);
});

// Update artist page
const updateArtistPage = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .patch({ title: req.body.title })
    .where('id', req.params.artistPageId)
    .returning('*')
    .first();
  res.send(artistPage);
});

// Delete artist page
const deleteArtistPage = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  await user.$relatedQuery('artistPages').deleteById(req.params.artistPageId);
  res.sendStatus(204);
});

const contentType =
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

const webfingerRegex = /^@?(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

const activityPubMimeTypes = [
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
  'application/activity+json',
];

const lookupActivityPub = asyncWrapper(async (req, res) => {
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
});

const followActivityPub = asyncWrapper(async (req, res) => {
  console.log('Follow');
  if (!req.body || typeof req.body.id !== 'string') {
    console.log(req);
    res.sendStatus(500);
    return;
  }
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId)
    .withGraphFetched('apActor');

  let id: string = req.body.id;
  const result = await axios.get(id, {
    headers: {
      Accept: contentType,
    },
  });

  const target = await getActor(id);
  const follow = await createFollow(artistPage.apActor, target);

  const date = new Date().toUTCString();
  const url = new URL(result.data.inbox);

  const body = JSON.stringify(follow);
  const bodyHash = crypto.createHash('sha256').update(body).digest('base64');
  console.log('*** DATE ***', date);
  console.log('*** HOST ****', url.host);
  const headers = {
    Date: date,
    Host: url.host,
    Digest: `sha-256=${bodyHash}`,
  };
  const headersWithTarget = {
    '(request-target)': `post ${url.pathname}`,
    ...headers,
  };
  const headerString = Object.entries(headersWithTarget)
    .map(([k, v]) => `${k.toLowerCase()}: ${v}`)
    .join('\n');
  console.log(headerString);
  const signer = crypto.createSign('sha256');
  signer.update(headerString);
  signer.end();
  const signature = signer
    .sign(artistPage.apActor.privateKey)
    .toString('base64');
  const sigKeyId = `${config.baseUrl}/p/${artistPage.username}#main-key`;
  const sigHeaders = `(request-target) ${Object.keys(headers)
    .join(' ')
    .toLowerCase()}`;

  const signatureHeader = `keyId="${sigKeyId}",headers="${sigHeaders}",signature="${signature}"`;
  console.log(signatureHeader);
  console.log(body);

  try {
    const r = await axios.post(result.data.inbox, body, {
      headers: {
        Signature: signatureHeader,
        ...headers,
      },
    });
    console.log('Success???', r.headers, r.status, r.data);
  } catch (e) {
    console.log(e);
    throw e;
  }

  res.sendStatus(500);
});
