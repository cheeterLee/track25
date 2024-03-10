'use client';

import { useFormState } from 'react-dom';
import { toast } from './ui/use-toast';
import { boolean } from 'drizzle-orm/mysql-core';

export default function AuthForm({
    children,
    action,
}: {
    children: React.ReactNode;
    action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}) {
    const [state, formAction] = useFormState(action, {
        success: false,
        message: null,
    });

    if (state.message !== null) {
        toast({
            variant: 'destructive',
            title: 'Error when submitting',
            description: state.message,
            duration: 2000,
        });
    }

    if (state.success === true) {
        toast({
            title: 'Authentication Succeed',
            duration: 2000,
        });
    }

    return <form action={formAction}>{children}</form>;
}

export interface ActionResult {
    success: boolean;
    message: string | null;
}
