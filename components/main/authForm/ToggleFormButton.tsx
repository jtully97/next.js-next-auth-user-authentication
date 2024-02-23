import styled from 'styled-components';

const Prompt = styled.p`
    button {
        background-color: unset;
        border: unset;
        font-size: inherit;
        font-family: inherit;
        padding: unset;
        text-decoration: underline;
        cursor: pointer;
    }
`;

interface ToggleFormButtonProps {
    toggleSignUpForm: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

export default function ToggleFormButton({
    toggleSignUpForm,
    onClick,
    className,
}: ToggleFormButtonProps) {
    return toggleSignUpForm ? (
        <Prompt className={className}>
            Have an account already? <button onClick={onClick}>Sign In</button>
        </Prompt>
    ) : (
        <Prompt className={className}>
            Don't have an account? <button onClick={onClick}>Sign Up</button>
        </Prompt>
    );
}
