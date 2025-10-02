'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// Types
type Course = {
  id: string;
  code: string;
  title: string;
};

type Meeting = {
  dayOfWeek: number;
  startMin: number;
  endMin: number;
};

type Section = {
  id: string;
  courseCode: string;
  title: string;
  meetings: Meeting[];
  seatsOpen: number;
  campus: string;
};

type ValidationResult = {
  ok: boolean;
  conflicts: string[];
  unmetPrereqs: string[];
  capacityFull: string[];
  holds: string[];
};

// Helper functions
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RegistrationPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientId] = useState(() => Math.random().toString(36).substring(2, 15));

  // Mock personId for demo purposes
  const personId = 'demo-user-123';
  const termId = '2025SP';

  // Fetch catalog search results
  const { data: searchResults, refetch: searchCourses } = useQuery({
    queryKey: ['catalogSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      // In a real app, this would call the BFF GraphQL API
      // For now, we'll simulate the response
      const mockResults: Section[] = [
        {
          id: 'sec-1',
          courseCode: 'CS101',
          title: 'Introduction to Computer Science',
          meetings: [{ dayOfWeek: 2, startMin: 540, endMin: 660 }], // Tue 9:00-11:00
          seatsOpen: 25,
          campus: 'Main Campus',
        },
        {
          id: 'sec-2',
          courseCode: 'CS101',
          title: 'Introduction to Computer Science',
          meetings: [{ dayOfWeek: 4, startMin: 600, endMin: 720 }], // Thu 10:00-12:00
          seatsOpen: 10,
          campus: 'Main Campus',
        },
        {
          id: 'sec-3',
          courseCode: 'MATH201',
          title: 'Calculus I',
          meetings: [
            { dayOfWeek: 2, startMin: 660, endMin: 780 }, // Tue 11:00-13:00
            { dayOfWeek: 4, startMin: 660, endMin: 780 }, // Thu 11:00-13:00
          ],
          seatsOpen: 5,
          campus: 'Main Campus',
        },
      ];
      
      return mockResults.filter(section => 
        section.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    enabled: false, // Don't auto-fetch
  });

  // Validation mutation
  const { mutate: validateRegistration } = useMutation({
    mutationFn: async (sections: Section[]) => {
      // In a real app, this would call the BFF GraphQL API
      // For now, we'll simulate validation logic
      
      const sectionIds = sections.map(s => s.id);
      
      // Simulate some validation results
      const result: ValidationResult = {
        ok: true,
        conflicts: [],
        unmetPrereqs: [],
        capacityFull: [],
        holds: [],
      };
      
      // Check for time conflicts (simplified)
      for (let i = 0; i < sections.length; i++) {
        for (let j = i + 1; j < sections.length; j++) {
          const secA = sections[i];
          const secB = sections[j];
          
          for (const meetingA of secA.meetings) {
            for (const meetingB of secB.meetings) {
              if (meetingA.dayOfWeek === meetingB.dayOfWeek) {
                if (
                  (meetingA.startMin < meetingB.endMin) &&
                  (meetingA.endMin > meetingB.startMin)
                ) {
                  result.ok = false;
                  result.conflicts.push(`${secA.courseCode} conflicts with ${secB.courseCode}`);
                }
              }
            }
          }
        }
      }
      
      // Simulate capacity check
      const fullSections = sections.filter(s => s.seatsOpen <= 0);
      if (fullSections.length > 0) {
        result.ok = false;
        result.capacityFull = fullSections.map(s => s.id);
      }
      
      // Simulate financial hold (random for demo)
      if (Math.random() > 0.8) {
        result.ok = false;
        result.holds = ['financial'];
      }
      
      return result;
    },
    onSuccess: (data) => {
      setValidationResult(data);
    },
  });

  // Confirm registration mutation
  const { mutate: confirmRegistration } = useMutation({
    mutationFn: async (sections: Section[]) => {
      // In a real app, this would call the BFF GraphQL API
      // For now, we'll simulate a successful registration
      return {
        registrationId: `reg-${Date.now()}`,
      };
    },
    onSuccess: () => {
      setShowSuccess(true);
      // Clear cart after successful registration
      setSelectedSections([]);
      setValidationResult(null);
    },
  });

  // Handle search
  const handleSearch = () => {
    if (searchQuery) {
      searchCourses();
    }
  };

  // Add section to cart
  const addToCart = (section: Section) => {
    if (!selectedSections.some(s => s.id === section.id)) {
      setSelectedSections([...selectedSections, section]);
    }
  };

  // Remove section from cart
  const removeFromCart = (sectionId: string) => {
    setSelectedSections(selectedSections.filter(s => s.id !== sectionId));
    setValidationResult(null); // Clear validation when cart changes
  };

  // Handle validate
  const handleValidate = () => {
    if (selectedSections.length > 0) {
      validateRegistration(selectedSections);
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    if (validationResult?.ok && selectedSections.length > 0) {
      confirmRegistration(selectedSections);
    }
  };

  // Clear success message after delay
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Registration</h1>
        
        {/* Financial Hold Banner */}
        {validationResult?.holds.includes('financial') && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Financial Hold</strong> - You have an outstanding balance. Please visit the 
            <a href="/billing" className="text-red-700 underline ml-1">billing page</a> to resolve this issue.
          </div>
        )}
        
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Registration successful! 
            <a href="/schedule" className="text-green-700 underline ml-1">View your schedule</a>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search courses (e.g., CS101)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
              
              {/* Search Results */}
              {searchResults && searchResults.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
                  {searchResults.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {section.courseCode}: {section.title}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Campus:</span> {section.campus}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Schedule:</span> 
                              {section.meetings.map((meeting, idx) => (
                                <span key={idx} className="ml-1">
                                  {dayNames[meeting.dayOfWeek]} {formatTime(meeting.startMin)}-{formatTime(meeting.endMin)}
                                  {idx < section.meetings.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">
                            <span className="font-medium">Seats:</span> {section.seatsOpen}
                          </p>
                          <button
                            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            onClick={() => addToCart(section)}
                            disabled={selectedSections.some(s => s.id === section.id)}
                          >
                            {selectedSections.some(s => s.id === section.id) ? 'Added' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults && searchResults.length === 0 && searchQuery && (
                <p className="text-gray-500">No courses found matching your search.</p>
              )}
            </div>
            
            {/* Validation Results */}
            {validationResult && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Validation Results</h2>
                
                {validationResult.ok ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                    All validations passed! You can now confirm your registration.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {validationResult.conflicts.length > 0 && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                        <p className="font-medium">Time Conflicts:</p>
                        <ul className="list-disc list-inside mt-1">
                          {validationResult.conflicts.map((conflict, idx) => (
                            <li key={idx}>{conflict}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {validationResult.unmetPrereqs.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                        <p className="font-medium">Unmet Prerequisites:</p>
                        <ul className="list-disc list-inside mt-1">
                          {validationResult.unmetPrereqs.map((prereq, idx) => (
                            <li key={idx}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {validationResult.capacityFull.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded">
                        <p className="font-medium">Sections at Capacity:</p>
                        <ul className="list-disc list-inside mt-1">
                          {validationResult.capacityFull.map((sectionId, idx) => (
                            <li key={idx}>Section {sectionId} is full</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Cart</h2>
              
              {selectedSections.length === 0 ? (
                <p className="text-gray-500">No courses selected</p>
              ) : (
                <div className="space-y-4">
                  {selectedSections.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {section.courseCode}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {section.meetings.map((meeting, idx) => (
                              <span key={idx}>
                                {dayNames[meeting.dayOfWeek]} {formatTime(meeting.startMin)}-{formatTime(meeting.endMin)}
                                {idx < section.meetings.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(section.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                      onClick={handleValidate}
                      disabled={selectedSections.length === 0}
                    >
                      Validate Registration
                    </button>
                    
                    <button
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                      onClick={handleConfirm}
                      disabled={!validationResult?.ok}
                    >
                      Confirm Registration
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}