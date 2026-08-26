import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ArrowLeft, Search, UserPlus, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddStudents = () => {
  const { searchStudents, addStudentLink } = useProgress();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedStudents, setAddedStudents] = useState(new Set());
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const data = await searchStudents(searchQuery.trim());
      setResults(data || []);
    } catch (err) {
      setError(err.message || "Failed to search for students.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (studentId) => {
    try {
      const success = await addStudentLink(studentId);
      if (success) {
        setAddedStudents(prev => new Set([...prev, studentId]));
      } else {
        setError("Failed to add student. They may already be linked.");
      }
    } catch (err) {
      setError("An error occurred while adding the student.");
    }
  };

  return (
    <div className="pb-16 animate-fade-in" style={{ paddingTop: 24, paddingLeft: 24, paddingRight: 24 }}>
      <div className="flex flex-wrap items-center gap-4 mt-4 mb-8">
        <Link to="/" className="p-2 glass-card hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-primary-progress" />
        </Link>
        <h1 className="text-3xl font-bold text-primary-progress flex-1">Add Students</h1>
      </div>

      <div className="w-full max-w-2xl bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8 mx-auto">
        <p className="text-gray-400 mb-6 text-sm">
          Search for students by their full name to add them to your class. Once added, you can track their progress in the Progress Report.
        </p>

        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl py-3 pl-12 pr-24 text-white focus:outline-none focus:border-primary-progress transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-progress text-white font-bold py-1.5 px-4 rounded-lg text-sm hover:bg-opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            No students found matching "{searchQuery}".
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Search Results</h3>
            {results.map(student => {
              const isAdded = addedStudents.has(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-4 bg-[#0d0d0d] border border-[#222] rounded-xl hover:border-[#333] transition-colors">
                  <div>
                    <h4 className="font-bold text-white text-lg">{student.full_name}</h4>
                    {student.email && <p className="text-sm text-gray-500">{student.email}</p>}
                  </div>
                  
                  {isAdded ? (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-500/20">
                      <CheckCircle size={16} /> Added
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAdd(student.id)}
                      className="flex items-center gap-2 bg-[#222] hover:bg-primary-progress text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <UserPlus size={16} /> Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudents;
