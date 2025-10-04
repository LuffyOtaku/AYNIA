CREATE TABLE "activity_log" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activity_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"action" varchar(100) NOT NULL,
	"entityType" varchar(50),
	"entityId" integer,
	"details" json,
	"ipAddress" varchar(50),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "anime_studios" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "anime_studios_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"animeId" integer NOT NULL,
	"studioId" integer NOT NULL,
	"isMain" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "anime" (
	"id" integer PRIMARY KEY NOT NULL,
	"titleRomaji" varchar(500),
	"titleEnglish" varchar(500),
	"titleNative" varchar(500),
	"description" text,
	"format" varchar(50),
	"status" varchar(50),
	"episodes" integer,
	"duration" integer,
	"season" varchar(20),
	"seasonYear" integer,
	"startDateYear" integer,
	"startDateMonth" integer,
	"startDateDay" integer,
	"endDateYear" integer,
	"endDateMonth" integer,
	"endDateDay" integer,
	"coverImageExtraLarge" varchar(500),
	"coverImageLarge" varchar(500),
	"coverImageMedium" varchar(500),
	"coverImageColor" varchar(20),
	"bannerImage" varchar(500),
	"genres" json,
	"averageScore" integer,
	"popularity" integer,
	"favourites" integer,
	"isAdult" boolean DEFAULT false,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"lastScrapedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manga" (
	"id" integer PRIMARY KEY NOT NULL,
	"titleRomaji" varchar(500),
	"titleEnglish" varchar(500),
	"titleNative" varchar(500),
	"description" text,
	"format" varchar(50),
	"status" varchar(50),
	"chapters" integer,
	"volumes" integer,
	"startDateYear" integer,
	"startDateMonth" integer,
	"startDateDay" integer,
	"endDateYear" integer,
	"endDateMonth" integer,
	"endDateDay" integer,
	"coverImageExtraLarge" varchar(500),
	"coverImageLarge" varchar(500),
	"coverImageMedium" varchar(500),
	"coverImageColor" varchar(20),
	"bannerImage" varchar(500),
	"genres" json,
	"averageScore" integer,
	"popularity" integer,
	"favourites" integer,
	"isAdult" boolean DEFAULT false,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"lastScrapedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "media_library" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_library_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"animeId" integer NOT NULL,
	"filePath" varchar(1000) NOT NULL,
	"fileName" varchar(500) NOT NULL,
	"fileSize" integer,
	"quality" varchar(50),
	"resolution" varchar(20),
	"codec" varchar(50),
	"subtitles" json,
	"audioTracks" json,
	"episodeNumber" integer,
	"duration" integer,
	"checksum" varchar(100),
	"isAvailable" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"token" varchar(500) NOT NULL,
	"ipAddress" varchar(50),
	"userAgent" text,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "studios" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "studios_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "studios_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_anime_list" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_anime_list_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"animeId" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"score" integer,
	"progress" integer DEFAULT 0,
	"rewatchCount" integer DEFAULT 0,
	"notes" text,
	"startedAt" date,
	"completedAt" date,
	"isFavorite" boolean DEFAULT false,
	"isPrivate" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_anime_rating" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_anime_rating_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"animeId" integer NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_manga_list" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_manga_list_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"mangaId" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"score" integer,
	"chaptersRead" integer DEFAULT 0,
	"volumesRead" integer DEFAULT 0,
	"rereadCount" integer DEFAULT 0,
	"notes" text,
	"startedAt" date,
	"completedAt" date,
	"isFavorite" boolean DEFAULT false,
	"isPrivate" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_preferences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"theme" varchar(50) DEFAULT 'dark',
	"language" varchar(10) DEFAULT 'en',
	"autoplay" boolean DEFAULT true,
	"subtitleLanguage" varchar(10) DEFAULT 'en',
	"preferredQuality" varchar(20) DEFAULT '1080p',
	"notificationsEnabled" boolean DEFAULT true,
	"emailNotifications" boolean DEFAULT true,
	"settings" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"displayName" varchar(255),
	"avatar" varchar(500),
	"isAdmin" boolean DEFAULT false,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"lastLoginAt" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waifu_characters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "waifu_characters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"personality" text,
	"avatar" varchar(500),
	"voiceModel" varchar(255),
	"llmModel" varchar(255),
	"systemPrompt" text,
	"temperature" integer,
	"maxTokens" integer,
	"isActive" boolean DEFAULT true,
	"settings" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "waifu_chat_history" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "waifu_chat_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"characterId" integer NOT NULL,
	"userId" integer NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"imageUrl" varchar(500),
	"audioUrl" varchar(500),
	"metadata" json,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_studios" ADD CONSTRAINT "anime_studios_animeId_anime_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_studios" ADD CONSTRAINT "anime_studios_studioId_studios_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_animeId_anime_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_anime_list" ADD CONSTRAINT "user_anime_list_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_anime_list" ADD CONSTRAINT "user_anime_list_animeId_anime_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_anime_rating" ADD CONSTRAINT "user_anime_rating_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_anime_rating" ADD CONSTRAINT "user_anime_rating_animeId_anime_id_fk" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_manga_list" ADD CONSTRAINT "user_manga_list_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_manga_list" ADD CONSTRAINT "user_manga_list_mangaId_manga_id_fk" FOREIGN KEY ("mangaId") REFERENCES "public"."manga"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waifu_characters" ADD CONSTRAINT "waifu_characters_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waifu_chat_history" ADD CONSTRAINT "waifu_chat_history_characterId_waifu_characters_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."waifu_characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waifu_chat_history" ADD CONSTRAINT "waifu_chat_history_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;