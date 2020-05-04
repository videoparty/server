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