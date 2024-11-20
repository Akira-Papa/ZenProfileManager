import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'ユーザーは既に存在します。' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: 'ユーザーが作成されました。' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'エラーが発生しました。' },
      { status: 500 }
    );
  }
}
