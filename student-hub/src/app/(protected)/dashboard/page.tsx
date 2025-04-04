// import { db } from '@/db';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// import { redirect } from 'next/navigation';

// const Page = async () => {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   if (!user || !user.id) {
//     redirect('/');
//   }

//   const dbUser = await db.user.findFirst({
//     where: {
//       id: user.id,
//     },
//   });

//   if (!dbUser || !dbUser.id) {
//     redirect('/auth-callback');
//   }

//   return (
//  <div>


//   hello
//  </div>
//   );
// };

// export default Page;

"use client"
import { useState } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my-notes');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredNotes = myNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>NoteShare - Dashboard</title>
        <meta name="description" content="Share and discover study notes" />
      </Head>

      {/* Header */}
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
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Upload New
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">JS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-notes')}
              className={`${activeTab === 'my-notes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Notes
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`${activeTab === 'popular' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Popular Notes
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`${activeTab === 'bookmarks' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bookmarks
            </button>
          </nav>
        </div>

        {/* Notes List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {activeTab === 'my-notes' && (
            <div>
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium">My Notes</h2>
                <span className="text-sm text-gray-500">
                  Showing {filteredNotes.length} of {myNotes.length} notes
                </span>
              </div>
              <ul className="divide-y divide-gray-200">
                {filteredNotes.map((note) => (
                  <li key={note.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{note.subject}</span>
                          <span className="mx-2">•</span>
                          <span>Uploaded on {note.date}</span>
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${note.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {note.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-eye mr-1"></i>
                          <span>{note.views}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-heart mr-1 text-red-500"></i>
                          <span>{note.likes}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600">
                            <i className="fas fa-trash"></i>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600">
                            <i className="fas fa-share-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'popular' && (
            <div>
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">Popular Notes</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {popularNotes.map((note) => (
                  <li key={note.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>By {note.author}</span>
                          <span className="mx-2">•</span>
                          <span>{note.subject}</span>
                          <span className="mx-2">•</span>
                          <span>Posted on {note.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-eye mr-1"></i>
                          <span>{note.views}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-heart mr-1 text-red-500"></i>
                          <span>{note.likes}</span>
                        </div>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
                          View Note
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-bookmark text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900">No bookmarks yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Save notes you find useful to access them later
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}