import React from 'react'

const DashBoardCard = () => {
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
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <i className="fas fa-book-open text-xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">My Notes</h3>
            <p className="text-2xl font-semibold">{myNotes.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <i className="fas fa-eye text-xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Total Views</h3>
            <p className="text-2xl font-semibold">
              {myNotes.reduce((sum, note) => sum + note.views, 0)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <i className="fas fa-heart text-xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Total Likes</h3>
            <p className="text-2xl font-semibold">
              {myNotes.reduce((sum, note) => sum + note.likes, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
    </main>
  )
}

export default DashBoardCard