import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { usersTable } from '../db/schema';

export class UserRepository {
  async findAll() {
    return await db.select().from(usersTable);
  }

  async findById(id: number) {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return result[0] || null;
  }

  async findByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return result[0] || null;
  }

  async findByUsername(username: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    return result[0] || null;
  }

  async create(data: typeof usersTable.$inferInsert) {
    const result = await db.insert(usersTable).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<typeof usersTable.$inferInsert>) {
    const result = await db
      .update(usersTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    const result = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    return result[0] || null;
  }
}
