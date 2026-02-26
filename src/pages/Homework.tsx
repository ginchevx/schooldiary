import React, { useState } from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface Assignment {
  id: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'submitted';
  submissionText?: string;
  grade?: number;
  feedback?: string;
}

export const Homework: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  // Mock data - replace with Firestore queries
  React.useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        subject: 'Mathematics',
        title: 'Algebra Problem Set',
        description: 'Complete problems 1-20 from Chapter 5',
        deadline: '2024-03-25',
        status: 'pending'
      },
      {
        id: '2',
        subject: 'Physics',
        title: 'Lab Report',
        description: 'Write a report on the pendulum experiment',
        deadline: '2024-03-20',
        status: 'submitted',
        submissionText: 'Here is my lab report...',
        grade: 5.5,
        feedback: 'Good work, but include more details'
      }
    ];
    setAssignments(mockAssignments);
  }, []);

  const handleSubmitAssignment = async (assignmentId: string) => {
    if (!submissionText.trim()) {
      toast.error('Please enter your submission text');
      return;
    }

    try {
      // Update in Firestore
      // await updateDoc(doc(db, 'homework', assignmentId), {
      //   status: 'submitted',
      //   submissionText,
      //   submittedAt: new Date().toISOString(),
      //   studentId: user?.uid
      // });

      // Update local state
      setAssignments(prev =>
        prev.map(a =>
          a.id === assignmentId
            ? { ...a, status: 'submitted', submissionText }
            : a
        )
      );

      toast.success('Homework submitted successfully!');
      setSelectedAssignment(null);
      setSubmissionText('');
    } catch (error) {
      toast.error('Failed to submit homework');
    }
  };

  const filteredAssignments = assignments.filter(a =>
    a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = assignments.filter(a => a.status === 'pending').length;

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Homework</h1>
          <p className="mt-1 text-sm text-gray-500">
            You have {pendingCount} pending assignment{pendingCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search assignments..."
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {assignment.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {assignment.subject}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.status === 'submitted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status === 'submitted' ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Submitted
                      </>
                    ) : (
                      <>
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Pending
                      </>
                    )}
                  </span>
                  {assignment.grade && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.grade >= 5.5 ? 'bg-green-100 text-green-800' :
                      assignment.grade >= 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Grade: {assignment.grade}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{assignment.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </dd>
                </div>
              </dl>

              {assignment.status === 'submitted' && assignment.submissionText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Your Submission:</h4>
                  <p className="mt-1 text-sm text-gray-600">{assignment.submissionText}</p>
                  {assignment.feedback && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">Teacher Feedback:</h4>
                      <p className="mt-1 text-sm text-gray-600">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {assignment.status === 'pending' && (
                <div className="mt-4">
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Assignment
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No homework</h3>
            <p className="mt-1 text-sm text-gray-500">
              No assignments found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Submit: {selectedAssignment.title}
            </h3>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={6}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter your answer or submission text here..."
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setSubmissionText('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Don't forget to import BookOpenIcon
import { BookOpenIcon } from '@heroicons/react/24/outline';
