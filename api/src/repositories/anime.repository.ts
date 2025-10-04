import { eq, desc, like, sql } from 'drizzle-orm';
import { db } from '../config/database';
import { animeTable } from '../db/schema';

export class AnimeRepository {
  async findAll(limit: number = 50, offset: number = 0) {
    return await db
      .select()
      .from(animeTable)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(animeTable.popularity));
  }

  async findById(id: number) {
    const result = await db.select().from(animeTable).where(eq(animeTable.id, id)).limit(1);
    return result[0] || null;
  }

  async findByTitle(title: string) {
    return await db
      .select()
      .from(animeTable)
      .where(
        sql`${animeTable.titleRomaji} ILIKE ${`%${title}%`} OR ${animeTable.titleEnglish} ILIKE ${`%${title}%`}`
      )
      .limit(20);
  }

  async create(data: typeof animeTable.$inferInsert) {
    const result = await db.insert(animeTable).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<typeof animeTable.$inferInsert>) {
    const result = await db
      .update(animeTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(animeTable.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db.delete(animeTable).where(eq(animeTable.id, id)).returning();
    return result[0] || null;
  }

  async findByGenre(genre: string, limit: number = 50) {
    return await db
      .select()
      .from(animeTable)
      .where(sql`${animeTable.genres}::jsonb @> ${JSON.stringify([genre])}::jsonb`)
      .limit(limit)
      .orderBy(desc(animeTable.averageScore));
  }

  async findBySeason(season: string, year: number) {
    return await db
      .select()
      .from(animeTable)
      .where(sql`${animeTable.season} = ${season} AND ${animeTable.seasonYear} = ${year}`)
      .orderBy(desc(animeTable.popularity));
  }
}
