"use client"
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';

import React, { useEffect } from 'react'
const page =  () => {
  const addUser = async () => {

    const response = await fetch('/api/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  // const queryClient = useQueryClient();
const router = useRouter()
  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
     router.push("/dashboard")
    },
  });

useEffect(() => {
  console.log("hi")
mutation.mutate()
}, [])


  return (
    <div className='w-full mt-24 flex justify-center'>
    <div className='flex flex-col items-center gap-2'>
      <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
      <h3 className='font-semibold text-xl'>
        Setting up your account...
      </h3>
      <p>You will be redirected automatically.</p>
    </div>
  </div>
  )
}

export default page