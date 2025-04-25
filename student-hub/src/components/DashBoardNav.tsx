"use client"
import { UploadButton } from '@/utils/uploadthing';
import { redirect } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react'

const DashBoardNav = ({searchQuery,setSearchQuery}:{
    searchQuery:string,
    setSearchQuery: Dispatch<SetStateAction<string>>
}) => {
  return (
    <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">NoteShare</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      
      <div onClick={()=>{redirect("/upload")}}>
        +
      </div>

        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-600 font-medium">JS</span>
        </div>
      </div>
    </div>
  </header>
  )
}

export default DashBoardNav