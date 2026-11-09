import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, locale = 'id' } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Nama dan email wajib diisi' },
        },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Format email tidak valid' },
        },
        { status: 400 }
      );
    }

    let userObj = {
      id: '',
      name: trimmedName,
      email: trimmedEmail,
      locale: locale as 'id' | 'en',
      created_at: new Date().toISOString(),
    };

    // Try Supabase if available
    try {
      const supabase = await createServerSupabaseClient();
      const usersTable = (supabase as any).from('users');
      const { data: existingUser } = await usersTable
        .select('*')
        .eq('email', trimmedEmail)
        .maybeSingle();

      if (existingUser) {
        userObj = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          locale: existingUser.locale,
          created_at: existingUser.created_at,
        };
      } else {
        const { data: newUser } = await usersTable
          .insert({
            name: trimmedName,
            email: trimmedEmail,
            locale,
          })
          .select()
          .single();

        if (newUser) {
          userObj = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            locale: newUser.locale,
            created_at: newUser.created_at,
          };
        }
      }
    } catch {
      // Fallback for offline / local demo without database connection
      const deterministicId = `usr_${Buffer.from(trimmedEmail).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
      userObj.id = deterministicId;
    }

    if (!userObj.id) {
      userObj.id = `usr_${Date.now()}`;
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('nexam_session', userObj.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server' },
      },
      { status: 500 }
    );
  }
}
