import { LoginForm } from '@/components/auth/login-form';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <div className="mb-4 inline-block bg-primary text-primary-foreground rounded-full p-3 shadow-md">
                <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary">
                Guardian Angel
            </h1>
            <p className="text-md text-muted-foreground">
                Secure Monitoring for Your Peace of Mind.
            </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
