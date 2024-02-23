import { hashPassword, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req: req });
    /* If no session, forbid request and return */
    if (!session) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const userEmail = session.user?.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();
    const userCollection = client.db().collection('users');
    const user = await userCollection.findOne({ email: userEmail });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        client.close();
        return;
    }

    const currentPassword = user.password;

    const matchedPasswords = await verifyPassword(oldPassword, currentPassword);
    if (!matchedPasswords) {
        res.status(403).json({
            message: 'Authenticated but passwords do not match',
        });
        client.close();
        return;
    }

    /* Has new password and update within db */
    const hashedNewPassword = await hashPassword(newPassword);

    userCollection.updateOne(
        { email: userEmail },
        { $set: { password: hashedNewPassword } }
    );

    client.close();
    res.status(200).json({ message: 'Password successfully updated' });
}

export default handler;
