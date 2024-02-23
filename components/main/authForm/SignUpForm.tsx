import styled from 'styled-components';
import TextInput from '@/components/reusable/formFields/TextInput';

const Form = styled.form``;

interface signUpFormProps {
    submitHandler: (event: React.SyntheticEvent) => void;
    emailInputRef: React.RefObject<HTMLInputElement>;
    usernameInputRef: React.RefObject<HTMLInputElement>;
    passwordInputRef: React.RefObject<HTMLInputElement>;
    confirmPasswordRef: React.RefObject<HTMLInputElement>;
}

export default function SignUpForm({
    submitHandler,
    emailInputRef,
    usernameInputRef,
    passwordInputRef,
    confirmPasswordRef,
}: signUpFormProps) {
    return (
        <Form>
            <h2>Sign up</h2>
            <TextInput
                name='email'
                label='Email'
                required={true}
                ref={emailInputRef}
            />
            <TextInput
                name='username'
                label='Username'
                required={true}
                ref={usernameInputRef}
            />
            <TextInput
                type='password'
                name='password'
                label='Password'
                required={true}
                ref={passwordInputRef}
            />
            <TextInput
                type='password'
                name='confirmPassword'
                label='Confirm Password'
                required={true}
                ref={confirmPasswordRef}
            />
            <button onClick={submitHandler} className='submit'>
                Sign Up
            </button>
        </Form>
    );
}
