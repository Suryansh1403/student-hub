import React from 'react'

const Notes = ({searchQuery}:{searchQuery:string}) => {

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
    
      const filteredNotes = myNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
  return (

          <div className="bg-white shadow rounded-lg overflow-hidden">
            
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
            
  

          </div>
        
  )
}

export default Notes