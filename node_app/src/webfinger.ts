import { asyncWrapper } from './asyncWrapper';
import config from './config';
import { ArtistPage } from './models/ArtistPage';

function createWebfinger(username: string) {
  return {
    subject: `acct:${username}@${config.domain}`,
    aliases: [`${config.baseUrl}/p/${username}`],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
        href: `${config.baseUrl}/p/${username}`,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `${config.baseUrl}/p/${username}`,
      },
    ],
  };
}

export const webfingerHandler = asyncWrapper(async (req, res) => {
  console.log('webfinger request');
  const resource = req.query.resource;
  if (
    !resource ||
    typeof resource !== 'string' ||
    !resource.startsWith('acct:')
  ) {
    res.sendStatus(500);
    return;
  }
  const resourceWithoutAccount = resource.replace(/^acct:/, '');
  const [user, domain] = resourceWithoutAccount.split('@');
  if (domain !== config.domain) {
    res.sendStatus(500);
  }

  const artistPage = await ArtistPage.query().findOne({
    username: user,
  });
  if (artistPage) {
    const webfinger = createWebfinger(artistPage.username);
    console.log(webfinger);
    res.type('application/jrd+json');
    res.send(webfinger);
  } else {
    res.sendStatus(500);
  }
});
