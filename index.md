# Artist Hub Technical Specifications

# Introduction

## Summary

- Music Makers have a number of ways to interact with their fans digitally however these are mostly through different social media platforms where they have to compete with millions of others for attention. It also means those platforms decide what content will show in various feeds instead of the musicians themselves
- The Creative Passport Artist Hub is an open space that allows music makers (or other creatives if they wish to self-host) to create a custom page for their fans highlighting their best work, giving them control of what their fans see with links to both open-source and conventional platforms.
- Fans will be able to subscribe to music maker accounts via the open-source platforms and share their experience back with the music maker (Using ActivityPub’s federation functions). This reduces the amount of work music makers need to do every time they introduce new content, while creating an overview of who they are as professionals and giving their subscribers freedom to consume the content on their platform of choice.

## Terminology

- NLNet
- ActivityPub
- Open Source
- Federation
- Creative Passport
- Self-hosted server

## Background

This project was created from the need for musicians to have more direct tools at their disposal for interacting with their fans and to take over control of how and when their content is shared. Currently on popular streaming and social media platforms, the algorithms that determine whether a musician's work will be showcased are designed by the platform and hidden from the creator. With Artist Hub, we aim to build (with the help of Open Source platforms) a direct artist to fan relationship without competition from other creatives and with complete control of how fans see the musician's content.

## Product Goals

- Present the option of using open source tools to musicians
- Create a more direct artist to fan experience to give artists control of the algorithms that decide how their content will be experienced
- Remove the need to solely rely on social media and streaming sites for fan interaction

## Non-Goals

- Artist Hub is Not a social media platform
- Artist Hub does not store its own content, rather the Artist Hub will connect existing platforms to give musicians the option of creating a custom portfolio-like view of their work for their fans

## Risks

- Users unfamiliar with open-source tools or interfaces may ignore those options altogether

## Assumptions

- Music Makers want more control of their digital presence
- Superfans would prefer to follow a musician directly instead of losing the latest updates amongst the noise on streaming and social media sites

# Solution Design

Artist page is a standalone tool to allow Music Makers to present their best work to their fans via open source alternatives. Music makers will be able to create a custom fan page on a self-hosted server where all their content can be placed and shared with their fans.

The underlying architecture for subscribing and receiving posts/updates from connected services will be built using ActivityPub. Services that currently use ActivityPub and can be integrated with the Artist Hub:

1. Mastodon
2. Funkwhale
3. Peertube
4. PixelFed

We will use ActivityPub to showcase updates and subscriptions from the above platforms. This will enable us to offer support for video (using PeerTube), audio (using Funkwhale), images (using PixelFed) and text (using Mastodon).

## Architecture

1. How to start your own server, how to run a local instance?
    1. Location of source files and packages
    2. What tools are needed to run the server
    3. Docker Instructions
2. Architecture:
    1. Server: The Artist Hub will run on a standalone NodeJS server, available to be run in a Docker container or locally
    2. Front End: The thin layer FrontEnd of Artist Hub will allow music makers to set up a custom page for their fans, and for the fans (unauthenticated users) to view the page and follow through the links
    3. ActivityPub: Open Source services that are available on Artist Hub connect to each other via the [ActivityPub Protocol](https://www.w3.org/TR/2018/REC-activitypub-20180123/)  allowing them to receive notifications from each other
    4. Authentication: Supported authentication methods are currently `oidc` (OpenID Connect) and `local` (Hardcoded username/password).

        **OIDC authentication:** To use OpenID Connect you can either use a hosted service such (e.g [Auth0](https://auth0.com/)) or run your own server (e.g. [Ory Hydra](https://www.ory.sh/hydra/)).

## Frameworks and Libraries

- NodeJS: Framework used to build the server
- ExpressJS: A flexible Node.js web application framework
- PassportJS: An authentication middleware for Node.js
- Objection.js: An ORM for interacting with the database

## Data Models

[Data Models](https://www.notion.so/dfd4433985d4423cbb1c07eb1413cbc5)

## API

### Server Server Interactions

### API Endpoints

[API Endpoints](https://www.notion.so/5362736241c84c2391c3147d22dcd7e9)

## User Interface:

Types of users:

1. Music Makers (authenticated):
    - Can create an account or view the content of another music maker anonymously or via other ActivityPub-enabled services
    - Can create one or more Artist Pages
    - Can connect their Artist Pages to ActivityPub-enabled services and show content from those platforms on their Artist Page
    - Can add links from known streaming and/or social media platforms to their page (Youtube, Spotify, Instagram, etc)
    - Can view a preview of how the Artist Page will show to fans
    - Can arrange the look of the Artist Pages that showcase their work

2. Fans (guest):
    - Can view the content of a music maker via their Artist Page and click through to their platform of choice for further interaction
    - Use any of the federated services that support ActivityPub to comment on a post
    - Follow a music maker from a different federated ActivityPub service. e.g. Mastodon
    - If the platforms supported by ActivityPub are used, the fan will be able to see other peoples' comments added on those platforms

## UI/UX Wireframes

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e5eddcfc-fa8b-4ce7-82a5-c3045f1f1842/Screenshot_2021-03-31_at_15.17.37.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e5eddcfc-fa8b-4ce7-82a5-c3045f1f1842/Screenshot_2021-03-31_at_15.17.37.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/86c3f1b7-effa-4939-a19b-66e770676f5d/Screenshot_2021-03-31_at_15.20.18.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/86c3f1b7-effa-4939-a19b-66e770676f5d/Screenshot_2021-03-31_at_15.20.18.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/062324e3-fa33-49b2-a998-21b28433605f/Screenshot_2021-03-31_at_15.28.10.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/062324e3-fa33-49b2-a998-21b28433605f/Screenshot_2021-03-31_at_15.28.10.png)

## Accessibility considerations

- The Artist Hub will be built using responsive design and the Material UI Library. As such standards to maintain basic web accessibility will be integrated into the platform

## Software/Hardware Dependencies

The services below will be available for integration as sources however Artist Hub does not directly depend on any of these services.

1. Mastodon
2. Funkwhale
3. Pixelfed
4. PeerTube

## Error Handling

Routing, and API errors are handled through ExpressJS, taking care of redirects and showing the appropriate error codes

Database errors are handled by the Objection.js ORM (

FrontEnd user errors are handled within the React Framework

## License & Copyright

Copyright (c) 2021 Creative Passport MTÜ. All rights reserved.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## Testing

- Both the Frontend and the Backend will be covered via unit tests as well as Integrations tests,

## Deployment

- We will use continuous integration using Circle CI ([https://circleci.com/](https://circleci.com/)) and host the code in a public repository on Github. There will be a development environment for each engineer working on the project, a staging environment and a production environment
- After the first version of Artist Hub has been made publicly available, future iterations will be announced on Github and compatibility will be ensured with older versions for users who are self-hosting the server

# Alternate Solutions / Designs

- Short summary
- Pros and cons for each alternative
- Reasons why each solution couldn’t work

# Success Evaluation

## Impact

- Product impact
    - How many standalone servers will be created and running
    - Once integrated with the Creative Passport, how many users will create and maintain their Artist Pages (total number of users, number of active users per month)
    - Interaction with open source platforms

## Metrics

- Total signups
- Total standalone servers
- Active monthly users (within Creative Passport Community)
- Rate of usage of the open source platforms

# Future work

- Develop further user interaction with the platforms available on Artist Hub
- Community building and education

# References

- [https://www.w3.org/TR/activitypub/](https://www.w3.org/TR/activitypub/)
- [https://joinpeertube.org/](https://joinpeertube.org/)
- [https://mastodon.online/about](https://mastodon.online/about)
- [https://funkwhale.audio/](https://funkwhale.audio/)
- [https://pixelfed.org/](https://pixelfed.org/)

# Acknowledgments

- Richard Strand, Michiel, Carlotta de Ninni, Enrico Catalano, Nlnet Foundation
