import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export const authOptions = {
    session: { jwt: true },
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProvider({
            async authorize(credentials) {
                const client = await connectToDatabase();

                const usersCollection = client.db().collection('users');

                let user;

                const userViaEmail = await usersCollection.findOne({
                    email: credentials.identifier,
                });
                const userViaUsername = await usersCollection.findOne({
                    username: credentials.identifier,
                });

                user = userViaEmail || userViaUsername;

                if (!user) {
                    client.close();
                    throw new Error('No user found');
                }

                const isValid = await verifyPassword(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error('Could not log you in');
                }

                client.close();

                return {
                    email: user.email,
                    redirect: {
                        destination: '/auth/protected',
                    },
                };
            },
        }),
    ],
};

export default NextAuth(authOptions);
