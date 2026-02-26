import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface HomeworkForm {
  classId: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
}

export const TeacherHomework: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HomeworkForm>();
  const [submissions, setSubmissions] = useState<any[]>([]);

  const classes = ['Class 10A', 'Class 10B', 'Class 11A']; // Mock data
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Literature']; // Mock data

  const onSubmit = async (data: HomeworkForm) => {
    try {
      // Add to Firestore
      // await addDoc(collection(db, 'homework'), {
      //   ...data,
      //   createdAt: new Date().toISOString(),
      //   createdBy: user?.uid,
      //   status: 'active'
      // });

      toast.success('Homework assignment created successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to create homework');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Homework</h1>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  {...register('classId', { required: 'Class is required' })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="">Select a class</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="mt-1 text-sm text-red-600">{errors.classId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <select
                  {...register('subject', { required: 'Subject is required' })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  {...register('deadline', { required: 'Deadline is required' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* View Submissions Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="divide-y divide-gray-200">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div key={submission.id} className="p-4">
                  {/* Submission items */}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No submissions yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
