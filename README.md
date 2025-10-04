# AYNIA (All you need is Anime) - Anime Toolkit

`IN DEVELOPMENT, NOT READY FOR PRODUCTION USE`

ROADMAP:
- [ ] Dashboard
- [ ] Database
- [ ] List
- [ ] Media Server
- [ ] Manga Reader
- [ ] Waifu Chat
- [ ] Downloader
- [ ] Translator

AYNIA is an open-source anime toolkit that provides all the essential tools for otakus who want control in their hands.

Anyone who cares and wants to have control over their data, for whatever reason, will love the services provided by AYNIA.

## Tools and Features

- **Anime database**: A comprehensive database of anime metadata that you can host locally, ensuring data stays private, without limit access and fast.
- **Anime List**: Your anime list locally hosted, giving you full control over your watch history and preferences. (You can import/export from MyAnimeList, AniList, Kitsu, etc.)
- **Anime Media Server**: Stream your anime collection from anywhere with a self-hosted media server that is focused on anime.
- **Manga Reader**: Read manga with a self-hosted manga reader.
- **Waifu chat**: An complete solution for building and chatting with your own waifu AI, you can use local LLMs ensuring your conversations remain private and secure, or connect to cloud-based services. Support text and voice chat and image generation.
- **Anime Downloader**: Download anime episodes from various sources directly to your local server with qBittorrent integration.
- **Anime Translator**: Translate anime subtitles using local LLMs or API providers.

You can use any of these tools independently or combine them to create a comprehensive anime ecosystem tailored to your needs. The choice is yours!

You can suggest new features or tools by opening an issue or a pull request.

## Installation
You can install AYNIA using Docker Compose. Make sure you have Docker and Docker Compose installed on your system.
1. Clone the repository:
   ```bash
   git clone https://github.com/LuffyOtaku/AYNIA.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AYNIA
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file to configure your settings.
   - Set `NODE_ENV=development` for development (creates test database)
   - Set `NODE_ENV=production` for production (main database only)
5. Start the services:
   ```bash
   docker compose up -d
   ```
6. Setup the database schema:
   ```bash
   cd api
   bun run db:push:all
   ```
7. Access the web interface at `http://localhost:3000` (or the port you specified in the `.env` file).
8. Follow the on-screen instructions to complete the setup.
9. Enjoy your self-hosted anime toolkit!

For detailed database setup and testing information, see [api/DATABASE_SETUP.md](api/DATABASE_SETUP.md).

## Contributing
Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.