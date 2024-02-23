import React, { useState } from 'react';
import styled from 'styled-components';
import ToggleFormButton from './ToggleFormButton';
import { createUser } from './utility';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

const Container = styled.div`
    button.toggleForm {
    }
`;

export default function AuthForm() {
    const router = useRouter();
    const [loading, setLoading] = useState();
    const [toggleSignUpForm, setToggleSignUpForm] = useState(true);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const usernameInputRef = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const confirmPasswordRef = React.useRef<HTMLInputElement>(null);
    //signin
    const identifierInputRef = React.useRef<HTMLInputElement>(null);

    const toggleForm = () => {
        setToggleSignUpForm((prevState) => !prevState);
    };

    const submitHandler = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (toggleSignUpForm) {
            //create user
            const enteredEmail = emailInputRef.current?.value;
            const enteredUsername = usernameInputRef.current?.value;
            const enteredPassword = passwordInputRef.current?.value;
            const enteredConfirmPassword = confirmPasswordRef.current?.value;

            /* 
                validate fields are not null and that the entered passwords match
                All other validation like email @ signs pass restrictions are done on /auth/signup
            */
            if (
                enteredPassword &&
                enteredUsername &&
                enteredPassword == enteredConfirmPassword
            ) {
                try {
                    const result = await createUser(
                        enteredUsername,
                        enteredEmail,
                        enteredPassword
                    );
                } catch (error) {
                    let message = 'Unknown Error';
                    if (error instanceof Error) message = error.message;
                    throw new Error(message);
                }
            } else {
                if (!enteredUsername) {
                    window.alert('Please enter a username');
                }
                if (enteredPassword !== enteredConfirmPassword) {
                    window.alert('Passwords do not match');
                }
            }
        } else {
            //signin user
            const enteredIdentifier = identifierInputRef.current?.value;
            const enteredPassword = passwordInputRef.current?.value;

            const result = await signIn('credentials', {
                redirect: false,
                identifier: enteredIdentifier,
                password: enteredPassword,
            });

            if (!result?.error) {
                router.replace('/auth/protected');
            }
        }
    };

    return (
        <Container>
            {toggleSignUpForm ? (
                <SignUpForm
                    submitHandler={submitHandler}
                    emailInputRef={emailInputRef}
                    usernameInputRef={usernameInputRef}
                    passwordInputRef={passwordInputRef}
                    confirmPasswordRef={confirmPasswordRef}
                />
            ) : (
                <SignInForm
                    identifierInputRef={identifierInputRef}
                    passwordInputRef={passwordInputRef}
                    submitHandler={submitHandler}
                />
            )}

            <ToggleFormButton
                toggleSignUpForm={toggleSignUpForm}
                onClick={toggleForm}
            />
        </Container>
    );
}
