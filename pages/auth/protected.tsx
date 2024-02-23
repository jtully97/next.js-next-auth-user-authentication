import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';
import AuthSignOutButton from '@/components/reusable/authSIgnOutButton/Index';

export default function Protected() {
    return (
        <div>
            protected <AuthSignOutButton />
        </div>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: { destination: '/auth', permanent: false },
        };
    }

    return {
        props: { session },
    };
}
