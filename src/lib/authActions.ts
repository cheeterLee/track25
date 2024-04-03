'use server';

import { db } from '@/db';
import { friendList, user } from '@/db/schema';
import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { cookies } from 'next/headers';
import { z } from 'zod';

interface ActionResult {
    success: boolean;
    message: string;
}

export async function signup(
    _: any,
    formData: FormData,
): Promise<ActionResult> {
    const schema = z.object({
        username: z.string().min(2),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    });

    const parse = schema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!parse.success) {
        return { message: 'error in form fields', success: false };
    }

    const { username, password, confirmPassword } = parse.data;

    if (username.length < 2) {
        return {
            message: 'username must be 2 characters long',
            success: false,
        };
    }

    if (password !== confirmPassword) {
        return {
            message: 'password must equal to confirm password',
            success: false,
        };
    }

    const hashedPassword = await new Argon2id().hash(password);

    const userId = generateId(15);

    await db.insert(user).values({
        id: userId,
        username: String(username),
        hashed_password: hashedPassword,
    });

    await db.insert(friendList).values({
        userId: userId,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect('/main');
}

export async function logout(): Promise<ActionResult> {
    const { session } = await validateRequest();
    if (!session) {
        return {
            success: false,
            message: 'Unauthorized',
        };
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect('/home');
}

export async function login(_: any, formData: FormData): Promise<ActionResult> {
    const username = formData.get('username');
    const password = formData.get('password')!;

    if (!username) {
        return { message: 'null user', success: false };
    }

    if (typeof password != 'string') {
        return { message: 'invalid password type', success: false };
    }

    const existedUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.username, String(username)),
    });

    if (!existedUser) {
        return { message: 'incorrect username', success: false };
    }

    const validPassword = await new Argon2id().verify(
        existedUser.hashed_password,
        password,
    );

    if (!validPassword) {
        return {
            message: 'Incorrect password',
            success: false,
        };
    }

    const session = await lucia.createSession(existedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect('/main');
}
