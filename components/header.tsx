'use client'

import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs'

export default function Header() {
    const { user } = useUser();
     

  return (
    <div className='flex items-center justify-between p-5'>
        {user && (
            <h1 className='text-2xl'>{user?.firstName}{`'s`} Notes</h1>
        )}

        <div>
            <SignedOut>
                <SignOutButton />
            </SignedOut>
            <SignedIn>
                <SignInButton />
            </SignedIn>
        </div>
    </div>
  )
}
