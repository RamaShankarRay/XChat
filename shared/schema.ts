import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  phoneNumber: text("phone_number"),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  status: text("status").default("online"),
  lastSeen: timestamp("last_seen").defaultNow(),
  onlineStatus: boolean("online_status").default(true),
  platformUsed: text("platform_used").default("web"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull().unique(),
  participants: text("participants").array().notNull(),
  lastMessage: text("last_message"),
  lastMessageTime: timestamp("last_message_time").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").notNull().unique(),
  chatId: text("chat_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // text, image, video, audio, document
  mediaUrl: text("media_url"),
  deliveryStatus: text("delivery_status").default("sent"), // sent, delivered, seen
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
