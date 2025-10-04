# AYNIA Development Roadmap

This document outlines the development roadmap for AYNIA (All You Need Is Anime).

## Project Vision
Create a comprehensive, self-hosted anime ecosystem that gives users complete control over their data, preferences, and media consumption experience.

---

## Phase 1: Core Infrastructure ✅ (Current Phase)

### Database Layer ✅ COMPLETED
- [x] PostgreSQL 18 database setup with Docker
- [x] Drizzle ORM integration
- [x] Database schema design (17+ tables)
- [x] Migration system implementation
- [x] Dual database support (main + test)
- [x] Environment-based database routing
- [x] Database health check tooling
- [x] Adminer integration for development

### API Foundation ✅ COMPLETED
- [x] Bun runtime setup
- [x] Custom router implementation
- [x] Response builder utility
- [x] Environment configuration
- [x] Error handling middleware
- [x] CORS support
- [x] Health check endpoint

### Testing Infrastructure ✅ COMPLETED
- [x] Bun test framework setup
- [x] Test database isolation (NODE_ENV=test)
- [x] Integration tests (187 tests passing)
- [x] Repository layer tests
- [x] Service layer tests
- [x] API endpoint tests
- [x] Database creation/migration tests
- [x] Test cleanup hooks

---

## Phase 2: Core Features 🚧 (In Progress)

### User Management API ✅ COMPLETED
- [x] User CRUD operations
- [x] User repository layer
- [x] User service layer with validation
- [x] User REST endpoints
- [x] Password sanitization
- [x] Email/username uniqueness validation

### Anime Management API ✅ COMPLETED
- [x] Anime CRUD operations
- [x] Anime repository layer
- [x] Anime service layer
- [x] Anime REST endpoints
- [x] Search by title
- [x] Filter by genre
- [x] Filter by season/year
- [x] Pagination support

### Data Population 🔄 IN PROGRESS
- [ ] AniList GraphQL API integration
- [ ] AniList scraper/importer service
- [ ] Bulk anime data import from AniList
- [ ] Incremental updates (daily/weekly sync)
- [ ] Data mapping (AniList → local schema)
- [ ] Image caching system
- [ ] Import progress tracking
- [ ] Duplicate detection and merging
- [ ] Studios data import
- [ ] Genres and tags import

### Remaining Core APIs 🔄 IN PROGRESS
- [ ] User authentication & JWT tokens
- [ ] User sessions management
- [ ] User preferences API
- [ ] User anime list API (watch status, progress, ratings)
- [ ] Studios management API
- [ ] Anime-studio relationships API

---

## Phase 3: Dashboard 📋 (Planned)

### Frontend Setup + Sharing between frontend projects like waifu chat
- [ ] Monorepo setup with Bun
- [ ] Shared node_modules
- [ ] Shared components library
- [ ] Theming system (CSS variables)
- [ ] React setup with Bun
- [ ] Routing configuration
- [ ] State management (Zustand)
- [ ] API client setup
- [ ] Authentication flow

### User Interface
- [ ] Login/Register pages
- [ ] User profile page
- [ ] Anime browse/search interface
- [ ] Anime detail page
- [ ] User anime list interface
- [ ] Settings page

### Dashboard Features
- [ ] Anime catalog with filters
- [ ] Advanced search functionality
- [ ] User list management (watching, completed, etc.)
- [ ] Anime rating and review system
- [ ] Statistics and analytics
- [ ] Theme customization (dark/light mode)

---

## Phase 4: Media Library 📺 (Planned)

### Media Server Core
- [ ] Media file scanning
- [ ] Metadata matching with database
- [ ] Transcoding support
- [ ] Subtitle management
- [ ] Multi-quality streaming
- [ ] Resume playback feature

### Video Player
- [ ] Custom video player component
- [ ] Fullscreen support
- [ ] Subtitle support
- [ ] Subtitle selection
- [ ] Audio track selection
- [ ] Playback controls
- [ ] Keyboard shortcuts
- [ ] Watch history tracking

### Library Management
- [ ] File organization system
- [ ] Batch operations
- [ ] Missing episodes detection
- [ ] Library statistics
- [ ] Storage monitoring

---

## Phase 5: Manga Reader (Planned)

### Manga Database
- [ ] Manga schema extension
- [ ] Manga metadata API
- [ ] Chapter management
- [ ] Volume tracking
- [ ] Reading progress API

### Reader Interface
- [ ] Manga viewer component
- [ ] Page navigation
- [ ] Reading modes (single page, double page, continuous)
- [ ] Zoom and pan controls
- [ ] Bookmark system
- [ ] Reading history

### Library Features
- [ ] Manga organization
- [ ] Chapter downloads
- [ ] Format support (CBZ, CBR, PDF)
- [ ] Reading statistics

---

## Phase 6: Waifu Chat (Planned)

### AI Integration
- [ ] LLM provider abstraction layer
- [ ] Local LLM support (Ollama, LM Studio)
- [ ] Cloud LLM support (OpenAI, Anthropic)
- [ ] Character personality system
- [ ] Conversation memory/context
- [ ] Multi-character support

### Voice Features
- [ ] Text-to-Speech integration
- [ ] Voice model selection
- [ ] Speech-to-Text for input
- [ ] Voice personality matching

### Image Generation
- [ ] Stable Diffusion integration
- [ ] Character appearance generation
- [ ] Expression variations
- [ ] Scene generation

### Chat Interface
- [ ] Real-time chat UI
- [ ] Character selection
- [ ] Conversation history
- [ ] Message formatting
- [ ] Audio playback controls

---

## Phase 7: Downloader (Planned)

### Download Core
- [ ] qBittorrent integration
- [ ] RSS feed monitoring
- [ ] Automatic episode downloads
- [ ] Quality preferences
- [ ] Download queue management
- [ ] Storage location configuration

### Torrent Management
- [ ] Torrent search integration
- [ ] Manual torrent addition
- [ ] Download progress tracking
- [ ] Seeding management
- [ ] Bandwidth limiting

### Automation
- [ ] Auto-download new episodes
- [ ] Nyaa.si integration
- [ ] SubsPlease integration
- [ ] Custom RSS feeds
- [ ] Download notifications

---

## Phase 8: Translator (Planned)

### Translation Engine
- [ ] Subtitle file parsing (SRT, ASS, VTT)
- [ ] LLM-based translation
- [ ] Translation provider abstraction
- [ ] Context-aware translation
- [ ] Terminology consistency

### Translation Features
- [ ] Batch subtitle translation
- [ ] Multiple language support
- [ ] Translation quality settings
- [ ] Manual correction interface
- [ ] Translation memory
- [ ] Glossary management

### Integration
- [ ] Integration with media server
- [ ] Auto-translate on import
- [ ] Multiple subtitle tracks
- [ ] Translation progress tracking

---

## Phase 9: Advanced Features (Future)

### Data Import/Export
- [ ] MyAnimeList import/export
- [ ] AniList import/export
- [ ] Kitsu import/export
- [ ] Backup system
- [ ] Data migration tools

### Social Features
- [ ] Recommendations
- [ ] Activity feed
- [ ] Shared lists

### Mobile Support
- [ ] Responsive design
- [ ] Mobile apps (Flutter)
- [ ] Offline mode
- [ ] Push notifications

### Advanced Analytics
- [ ] Watch time statistics
- [ ] Genre preferences analysis
- [ ] Viewing patterns
- [ ] Recommendations algorithm
- [ ] Year-in-review feature

---

## Technical Debt & Improvements

### Performance
- [ ] Database query optimization
- [ ] API response caching
- [ ] Image optimization
- [ ] Lazy loading implementation

### Security
- [ ] Rate limiting
- [ ] Input sanitization review
- [ ] SQL injection prevention audit
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers

### Documentation
- [ ] API documentation
- [ ] Developer guide
- [ ] User manual
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Architecture documentation

### DevOps
- [ ] CI/CD pipeline
- [ ] Automated testing in CI
- [ ] Docker image optimization
- [ ] Kubernetes deployment configs
- [ ] Monitoring and logging
- [ ] Backup automation

---

## Version Milestones

### v0.1.0 - Alpha (Current)
- ✅ Core infrastructure
- ✅ Database setup with migrations
- ✅ User management API
- ✅ Anime management API
- ✅ Comprehensive test suite

### v0.2.0 - Beta 1 (Next)
- Authentication system
- Complete user management
- Dashboard foundation
- Basic anime browsing

### v0.3.0 - Beta 2
- Media library core
- Video player
- File scanning
- Streaming support

### v0.4.0 - Beta 3
- Manga reader
- Chapter management
- Reading interface

### v0.5.0 - Release Candidate
- All core features complete
- Stability improvements
- Performance optimization
- Documentation complete

### v1.0.0 - Stable Release
- Production-ready
- Full feature set
- Comprehensive testing
- Community feedback incorporated

---

## Contributing

We welcome contributions! Areas where you can help:

- 🐛 Bug fixes and testing
- 📝 Documentation improvements
- 🎨 UI/UX design
- 🔧 Feature implementation
- 🌐 Translations
- 📊 Performance optimization

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Notes

- Priorities may shift based on community feedback
- Timeline is flexible and depends on contributor availability
- Features marked as "Planned" are subject to change
- Some phases may be developed in parallel

**Last Updated:** October 2025
