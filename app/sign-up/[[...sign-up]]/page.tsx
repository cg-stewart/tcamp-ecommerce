import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp appearance={{
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-800 text-white',
          footerActionLink: 'text-blue-500 hover:text-blue-600'
        }
      }} />
    </div>
  );
}
