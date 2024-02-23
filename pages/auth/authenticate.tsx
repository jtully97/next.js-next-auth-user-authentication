import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import AuthForm from '@/components/main/authForm/Index';

export default function Authenticate() {
    return <AuthForm />;
}

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return { props: {} };
    }

    return {
        redirect: { destination: '/auth/protected', permanent: false },
        props: { session },
    };
}
