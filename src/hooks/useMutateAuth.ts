import { useState } from 'react';
import { useMutation } from 'react-query';
import { supabase } from '@/utils/supabase';

export const useMutateAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const reset = () => {
    setEmail('')
    setPassword('')
  }
  const loginMutation = useMutation(async() => {
    const {error, data} = await supabase.auth.signInWithPassword({email, password})
    if (error) throw new Error(error.message)
    console.log('loginMutation signInwithPassword data', data)
  }, {
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  const registerMutation = useMutation(async() => {
    const {error, data} = await supabase.auth.signUp({email, password})
    if (error) throw new Error(error.message)
    console.log('registerMutation signUp data', data)
  }, {
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  return {
    email, 
    setEmail, 
    password,
    setPassword,
    loginMutation,
    registerMutation
  }
}