"use client"
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import DashBoardNav from './DashBoardNav';
import Notes from './Notes';
import DashBoardCard from './DashBoardCard';
import socket from '@/utils/socket';
const DashBoard = () => {
  
    const [activeTab, setActiveTab] = useState('my-notes');
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
      socket.emit('join-room', 'contest-room-123');
    
      socket.on('receive-code', (code) => {
        console.log('Code updated:', code);
        // Update local state here
      });
    
      return () => {
        socket.off('receive-code');
      };
    }, []);
    // Sample data
    const myNotes = [
      {
        id: 1,
        title: 'React Hooks Guide',
        subject: 'Computer Science',
        date: '2023-05-15',
        views: 124,
        likes: 23,
        isPublic: true
      },
      {
        id: 2,
        title: 'Calculus II Formulas',
        subject: 'Mathematics',
        date: '2023-04-28',
        views: 89,
        likes: 15,
        isPublic: false
      },
      {
        id: 3,
        title: 'World History Timeline',
        subject: 'History',
        date: '2023-06-02',
        views: 210,
        likes: 42,
        isPublic: true
      }
    ];
  
    const popularNotes = [
      {
        id: 101,
        title: 'Machine Learning Basics',
        author: 'Jane Doe',
        subject: 'Computer Science',
        date: '2023-05-20',
        views: 542,
        likes: 87
      },
      {
        id: 102,
        title: 'Organic Chemistry Reactions',
        author: 'John Smith',
        subject: 'Chemistry',
        date: '2023-04-15',
        views: 389,
        likes: 65
      }
    ];
  
 
  
    return (
      <div className="min-w-screen min-w-[calc(100%-20px)]">
        <Head>
          <title>NoteShare - Dashboard</title>
          <meta name="description" content="Share and discover study notes" />
        </Head>
  
        {/* Header */}
     
  <DashBoardNav searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        {/* Main Content */}
        <DashBoardCard/>
     
  
     <Notes searchQuery={searchQuery}/>
        </div>
      
  )
}

export default DashBoard