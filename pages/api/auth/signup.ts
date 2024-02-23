import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const data = req.body;

        const { email, username, password } = data;

        if (
            !email ||
            !email.includes('@') ||
            !password ||
            password.trim().length < 7
        ) {
            res.status(422).json({ message: 'invalid input' });
            return;
        }

        const client = await connectToDatabase();

        const db = client.db();

        /* Check for existing users by email Or username identifiers */
        const existingUserEmail = await db
            .collection('users')
            .findOne({ email: email });

        const existingUserUsername = await db
            .collection('users')
            .findOne({ username: username });

        if (existingUserEmail || existingUserUsername) {
            res.status(422).json({ message: 'User already exists' });
            client.close();
            return;
        }

        const hashedPassword = await hashPassword(password);

        const result = await db.collection('users').insertOne({
            email: email,
            username: username,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created' });
        client.close();
    }
}

export default handler;
