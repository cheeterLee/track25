'use server';

import { db } from '@/db';
import { user } from '@/db/schema';
import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
// import { Argon2id } from 'oslo/password';
import { argon2id } from '@noble/hashes/argon2';
import { randomBytes } from '@noble/hashes/utils';
import { generateId } from 'lucia';
import { cookies } from 'next/headers';

interface ActionResult {
    error: string;
}

export async function signup(
    _: any,
    formData: FormData,
): Promise<ActionResult> {
    const username = formData.get('username');
    const password = formData.get('password')!;

    if (!username) {
        return { error: 'null user' };
    }

    if (typeof password != 'string') {
        return { error: 'invalid password type' };
    }

    const salt = randomBytes(32);

    // const hashedPassword = await new Argon2id().hash(password);
    const hashedPassword = String(argon2id(password, salt, { t: 2, m: 65536, p: 1 }));
    const userId = generateId(15);

    await db.insert(user).values({
        id: userId,
        username: String(username),
        hashed_password: hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect('/');
}

export async function logout(): Promise<ActionResult> {
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: 'Unauthorized',
        };
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect('/');
}

export async function login(_: any, formData: FormData): Promise<ActionResult> {
    const username = formData.get('username');
    const password = formData.get('password')!;

    if (!username) {
        return { error: 'null user' };
    }

    if (typeof password != 'string') {
        return { error: 'invalid password type' };
    }

    const existedUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.username, String(username)),
    });

    if (!existedUser) {
        return { error: 'incorrect username' };
    }

    const validPassword = () => {
        const hashedPassword = String(argon2id(password, 'salt', { t: 2, m: 65536, p: 1 }));
        return hashedPassword === existedUser.hashed_password
    }
    
    if (!validPassword) {
        return {
            error: 'Incorrect password',
        };
    }

    const session = await lucia.createSession(existedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect('/');
}
