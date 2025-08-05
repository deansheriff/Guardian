import { LoginForm } from '@/components/auth/login-form';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="mb-4 flex justify-center">
            <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
            <ShieldCheck className="h-12 w-12" />
            </div>
        </div>
        <div className="space-y-2">
            <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary">
                Guardian Angel
            </h1>
            <p className="text-lg text-muted-foreground">
                Secure Monitoring for Your Peace of Mind.
            </p>
        </div>
      </div>
      <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </main>
  );
}
