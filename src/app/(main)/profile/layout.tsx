// src/app/(main)/profile/layout.tsx

import React from 'react';

/**
 * This is a layout component. It must accept `children` as a prop
 * and render them somewhere in the returned JSX.
 */
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a simple pass-through layout. It doesn't add any extra UI.
  // In a real scenario, you might add a sidebar or a special header here.
  return (
    <>
      {/* You could add a profile-specific header here */}
      {/* <ProfileHeader /> */}
      {children}
    </>
  );
}