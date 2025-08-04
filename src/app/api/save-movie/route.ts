import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, name, image, favorite } = await req.json();

    if (!email) {
      return new NextResponse('Missing email', { status: 400 });
    }

    if (favorite) {
      // Save or update favorite movie
      const user = await prisma.userMovie.upsert({
        where: { email },
        update: { favorite },
        create: { email, name: name ?? '', image, favorite },
      });

      return NextResponse.json({ message: 'Favorite movie saved!', favorite: user.favorite });
    } else {
      // Just retrieve existing favorite (e.g., after login)
      const user = await prisma.userMovie.findUnique({
        where: { email },
      });

      if (user?.favorite) {
        return NextResponse.json({ favorite: user.favorite });
      } else {
        return new NextResponse(null, { status: 204 }); // no favorite set yet
      }
    }
  } catch (err) {
    console.error('Save movie error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
