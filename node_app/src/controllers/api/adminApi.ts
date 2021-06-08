import express, { Request, Response, Router, Express } from 'express';
import { requireAuth } from '../../auth/auth';
import { User } from '../../models/User';
import axios from 'axios';
import { asyncWrapper } from '../asyncWrapper';
import crypto from 'crypto';
import { promisify } from 'util';
import config from '../../config';
import { createFollow } from '../../activitypub/follow';
import { getActor } from '../../activitypub/actor';
import { createUndo } from '../../activitypub/undo';
import { APFollow } from '../../models/APFollow';
import { signedPost } from '../../activitypub/request';
import multer from 'multer';
import sharp from 'sharp';
import Debug from 'debug';
import path from 'path';
import { promises as fs } from 'fs';
import { ModelObject, PartialModelObject } from 'objection';
import { ArtistPage } from '../../models/ArtistPage';
import { Link } from '../../models/Link';
const debug = Debug('artisthub:adminapi');

const generateKeyPair = promisify(crypto.generateKeyPair);
const randomBytes = promisify(crypto.randomBytes);

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage });

/**
 * Get the admin API routes
 *
 * @returns An Express Router
 */
export function getAdminApiRoutes(): Router {
  const router = express.Router();
  router.use(requireAuth);
  router.get('/ping', ping);
  router.get('/artistpages', getArtistPages);
  router.get('/artistpages/:artistPageId', getArtistPage);
  router.post('/artistpages/:artistPageId/links', createLink);
  router.put('/artistpages/:artistPageId/links/:linkId', updateLink);
  router.delete('/artistpages/:artistPageId/links/:linkId', deleteLink);
  router.post('/artistpages', createArtistPage);
  router.put(
    '/artistpages/:artistPageId',
    upload.fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    updateArtistPage
  );
  router.delete('/artistpages/:artistPageId', deleteArtistPage);
  router.post('/activitypub/lookup', lookupActivityPub);
  router.post(
    '/artistpages/:artistPageId/activitypub/follow',
    followActivityPub
  );
  router.delete(
    '/artistpages/:artistPageId/activitypub/follow/:followingActorId',
    unfollowActivityPub
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
  const artistPages = await user
    .$relatedQuery('artistPages')
    .orderBy('title')
    .withGraphFetched('[apActor, links]')
    .modifyGraph('links', (builder) => {
      builder.orderBy('sort');
    });
  res.send(artistPages.map((p) => artistPageJsonFromModel(p)));
});

function linkJson(link: Link) {
  return {
    id: link.id,
    url: link.url,
    sort: link.sort,
  };
}

function artistPageJsonFromModel(artistPage?: ArtistPage) {
  if (!artistPage) {
    return undefined;
  }
  return {
    id: artistPage.id,
    title: artistPage.title,
    headline: artistPage.headline,
    description: artistPage.description,
    username: artistPage.username,
    url: artistPage.apActor.url || artistPage.apActor.uri,
    profileImage: artistPage.profileImageUrl(),
    coverImage: artistPage.coverImageUrl(),
    following: artistPage.apActor.followingActors?.map((a) => ({
      id: a.id,
      followState: a.followState,
      followUri: a.followUri,
      url: a.url || a.uri,
      username: a.username,
      domain: a.domain,
      name: a.username, // To-do store the AP name field
    })),
    links: artistPage.links?.map((link) => linkJson(link)),
  };
}

async function artistPageJsonFromId(user: User, id: string) {
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(id)
    .withGraphFetched('[apActor.followingActors, links]');
  return artistPageJsonFromModel(artistPage);
}

// Get artist page
const getArtistPage = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPageJson = await artistPageJsonFromId(
    user,
    req.params.artistPageId
  );
  if (artistPageJson) {
    res.send(artistPageJson);
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
  const artistPageJson = await artistPageJsonFromId(user, artistPage.id);
  res.send(artistPageJson);
});

const createLink = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId)
    .withGraphFetched('links')
    .modifyGraph('links', (builder) => {
      builder.orderBy('sort');
    });
  let sort = 1;
  if (artistPage.links && artistPage.links.length > 0) {
    sort = artistPage.links[artistPage.links.length - 1].sort + 1;
  }
  const newLink = await artistPage
    .$relatedQuery('links')
    .insert({ url: req.body.url, sort })
    .returning('*');
  res.send(linkJson(newLink));
});

const updateLink = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId);
  const link = await artistPage
    .$relatedQuery('links')
    .patch({ url: req.body.url })
    .findById(req.params.linkId)
    .returning('*');
  res.send(linkJson(link));
});

const deleteLink = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId);
  await artistPage.$relatedQuery('links').deleteById(req.params.linkId);
  res.sendStatus(204);
});

const formats: { [format: string]: string } = {
  jpeg: 'jpg',
  png: 'png',
  gif: 'gif',
};

async function randomFilename(format: string): Promise<string> {
  const extension = formats[format];
  if (!extension) {
    throw new Error('Unsupported file format');
  }
  const buffer = await randomBytes(8);
  return buffer.toString('hex') + '.' + extension;
}

type MulterFiles =
  | {
      [fieldName: string]: Express.Multer.File[];
    }
  | Express.Multer.File[];

async function deleteFiles(fileNames: string[]) {
  for (const file of fileNames) {
    try {
      await fs.unlink(file);
    } catch (e) {
      debug(`Error deleting ${file}`, e);
    }
  }
}

async function deleteMulterFiles(files: MulterFiles) {
  await deleteFiles(
    (Array.isArray(files) ? files : Object.values(files).flat()).map(
      (f) => f.path
    )
  );
}

interface Attachment {
  files: Express.Multer.File[] | undefined;
  basePath: string;
  dimensions: (metadata: sharp.Metadata) => [number, number];
  oldImage?: string;
  updateKey: NonNullable<keyof ModelObject<ArtistPage>>;
}

// Update artist page
const updateArtistPage = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  const files = req.files as {
    profileImage?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };
  const update: PartialModelObject<ArtistPage> = {
    title: req.body.title,
    headline: req.body.headline,
    description: req.body.description,
  };
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId);
  const replacedFiles: string[] = [];
  const newFiles: string[] = [];

  const attachments: Attachment[] = [
    {
      files: files.profileImage,
      basePath: artistPage.profileImageBasePath(),
      dimensions: (metadata: sharp.Metadata) => {
        if (!metadata.width || !metadata.height) {
          throw new Error('Image dimensions not found');
        }
        const minDimension = Math.min(metadata.width, metadata.height, 400);
        return [minDimension, minDimension];
      },
      oldImage: artistPage.profileImagePath(),
      updateKey: 'profileImageFilename',
    },
    {
      files: files.coverImage,
      basePath: artistPage.coverImageBasePath(),
      dimensions: (metadata: sharp.Metadata) => {
        const expectedRatio = 1440 / 240;
        if (!metadata.width || !metadata.height) {
          throw new Error('Image dimensions not found');
        }
        let width, height;
        if (metadata.width / metadata.height > expectedRatio) {
          width = Math.min(metadata.width, 1440);
          height = width / expectedRatio;
        } else {
          height = Math.min(metadata.height, 240);
          width = height * expectedRatio;
        }
        return [width, height];
      },
      oldImage: artistPage.coverImagePath(),
      updateKey: 'coverImageFilename',
    },
  ];

  try {
    for (const attachment of attachments) {
      if (attachment.files && attachment.files.length > 0) {
        const file = attachment.files[0];
        const image = sharp(file.path);
        const metaData = await image.metadata();
        if (metaData.width && metaData.height && metaData.format) {
          const dimensions = attachment.dimensions(metaData);
          const filename = await randomFilename(metaData.format);
          const destPath = path.join(attachment.basePath, filename);
          await fs.mkdir(attachment.basePath, { recursive: true });
          await image.resize(dimensions[0], dimensions[1]).toFile(destPath);
          if (attachment.oldImage) {
            replacedFiles.push(attachment.oldImage);
          }
          newFiles.push(destPath);
          update[attachment.updateKey] = filename;
          debug('Uploaded file', destPath);
        }
      }
    }
  } finally {
    await deleteMulterFiles(files);
  }

  let artistPageJson;
  try {
    await user
      .$relatedQuery('artistPages')
      .patch(update)
      .where('id', req.params.artistPageId);
    artistPageJson = await artistPageJsonFromId(user, req.params.artistPageId);
    await deleteFiles(replacedFiles);
  } catch (e) {
    await deleteFiles(newFiles);
  }

  res.send(artistPageJson);
});

// Delete artist page
const deleteArtistPage = asyncWrapper(async (req, res) => {
  const user = req.user as User;
  await user.$relatedQuery('artistPages').deleteById(req.params.artistPageId);
  res.sendStatus(204);
});

const contentType =
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

// eslint-disable-next-line no-control-regex
const webfingerRegex = /^@?(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

const activityPubMimeTypes = [
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
  'application/activity+json',
];

const lookupActivityPub = asyncWrapper(async (req, res) => {
  if (!req.body || typeof req.body.url !== 'string') {
    debug('Invalid request body', req);
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
  debug('Follow');
  if (!req.body || typeof req.body.id !== 'string') {
    debug('Invalid request body', req);
    res.sendStatus(500);
    return;
  }
  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId)
    .withGraphFetched('apActor');

  const id: string = req.body.id;
  const result = await axios.get(id, {
    headers: {
      Accept: contentType,
    },
  });

  const target = await getActor(id);
  if (!target) {
    return;
  }

  const follow = await createFollow(artistPage.apActor, target);

  try {
    const r = await signedPost(
      result.data.inbox,
      JSON.stringify(follow),
      artistPage.apActor
    );
    debug('Follow success', r.headers, r.status, r.data);
  } catch (e) {
    debug(e);
    throw e;
  }

  res.sendStatus(204);
});

const unfollowActivityPub = asyncWrapper(async (req, res) => {
  debug('Unfollow', req.params);

  const user = req.user as User;
  const artistPage = await user
    .$relatedQuery('artistPages')
    .findById(req.params.artistPageId)
    .withGraphFetched('apActor');
  const follow = await artistPage.apActor
    .$relatedQuery('following')
    .findOne('targetActorId', req.params.followingActorId)
    .withGraphFetched('actorFollowing');

  const inbox = follow.actorFollowing.inboxUrl;
  const undo = await createUndo(artistPage.apActor, follow);

  try {
    const r = await signedPost(inbox, JSON.stringify(undo), artistPage.apActor);
    debug('Unfollow success', r.headers, r.status, r.data);
  } catch (e) {
    debug(e);
    throw e;
  }

  await APFollow.query().deleteById(follow.id);
  await artistPage.apActor
    .$relatedQuery('deliveredObjects')
    .unrelate()
    .where('apObjects.actorId', follow.actorFollowing.id);

  res.sendStatus(204);
});
