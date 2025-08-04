import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, name, image, favorite } = await req.json();

    if (!email || !name || !favorite) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const user = await prisma.userMovie.upsert({
      where: { email },
      update: { favorite },
      create: { email, name, image, favorite },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error('Save movie error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
