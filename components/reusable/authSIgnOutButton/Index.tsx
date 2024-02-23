import React from 'react';
import { signOut } from 'next-auth/react';

export default function AuthSignOutButton() {
    function signOutHandler() {
        signOut({ callbackUrl: '/' });
    }
    return <button onClick={signOutHandler}>Sign Out</button>;
}
