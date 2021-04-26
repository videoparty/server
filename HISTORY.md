# 2.0.3 - 26-03-2021
- Updated dependencies

# 2.0.2 - 22-06-2020
- Supporting `update-displayname` message type

# 2.0.1 - 01-06-2020
- Supporting `chat` message type

# 2.0.0 - 22-05-2020
*Version 2.0 is still backwards-compatible with 1.x and legacy extension versions.*
- Rewrite to a Chain of Responsibility pattern to handle messages in a scalable way
- Several bugfixes
- Updated `ts-node` and `typescript`

# 1.4.3 - 16-05-2020
- Passing through data about legacy/non-legacy webplayer to correct the playtime
- Removed unused party variable

# 1.4.2 - 11-05-2020
- Changed partymember structure to an object, containing ID and displayname

# 1.4.1 - 09-05-2020
- Passing through an optional reason for pausing a video

# 1.4.0 - 05-05-2020
- Restoring state after server restart
- Syncing next episode
- When a new video starts, all members have status `readyToPlay = false`.

# 1.3.0 - 02-05-2020
- Relaying the `watching-trailer` message to inform other party members that they need to wait

# 1.2.0 - 30-04-2020
- Sending member username for each initiated action

# 1.1.0 - 26-04-2020
- When a party member joins or leaves, the message now contains a list of all member ID's

# 1.0.1 - 25-04-2020
- Added [README](README.md) and [LICENSE](LICENSE)
- Setup initial CI build
- Cleaned up unused API routes
- Changed SocketEvents method access modifiers to prepare for unit tests

# 1.0.0 - 22-04-2020
- Initial release
