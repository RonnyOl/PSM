"use client";
import React from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

export default function Chat() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div>{user ? `Welcome ${user.username}` : "Please log in"}</div>
  )
}
