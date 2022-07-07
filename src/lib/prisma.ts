import { Image, Item, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export type ItemWithImages = Item & { images: Image[] }
