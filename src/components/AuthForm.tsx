'use client';

import { useFormState } from 'react-dom';

export default function AuthForm({
    children,
    action,
}: {
    children: React.ReactNode;
    action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}) {
    const [state, formAction] = useFormState(action, {
        error: null,
    });
    return <form action={formAction}>{children}</form>;
}

export interface ActionResult {
    error: string | null;
}
