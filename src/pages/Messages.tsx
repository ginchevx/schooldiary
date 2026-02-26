import React, { useState } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { query, where, orderBy } from 'firebase/firestore';
import { Message } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';
import { EmptyState } from '../components/Common/EmptyState';
import toast from 'react-hot-toast';

export const Messages: React.FC = () => {
  const { user, role } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'outbox' | 'compose'>('inbox');
  const [composeData, setComposeData] = useState({
    toId: '',
    subject: '',
    content: ''
  });

  const { data: inbox, loading: inboxLoading } = useFirestore<Message>(
    'messages',
    user ? [
      where('toId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ] : []
  );

  const { data: outbox, loading: outboxLoading } = useFirestore<Message>(
    'messages',
    user ? [
      where('fromId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ] : []
  );

  const { add: sendMessage } = useFirestore('messages');

  const handleSendMessage = async () => {
    if (!composeData.subject || !composeData.content || !composeData.toId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await sendMessage({
        fromId: user?.uid,
        fromName: user?.email?.split('@')[0] || 'User',
        fromRole: role,
        toId: composeData.toId,
        toName: 'Teacher', // In real app, fetch from users collection
        toRole: 'teacher',
        subject: composeData.subject,
        content: composeData.content,
        read: false
      });

      toast.success('Message sent successfully');
      setSelectedTab('outbox');
      setComposeData({ toId: '', subject: '', content: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    // Update message as read
    // await update('messages', messageId, { read: true });
  };

  if (inboxLoading || outboxLoading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <div className="mt-3 sm:mt-0">
          <button
            onClick={() => setSelectedTab('compose')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            New Message
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['inbox', 'outbox', 'compose'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`${
                  selectedTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
                {tab === 'inbox' && inbox.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                    {inbox.filter(m => !m.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {selectedTab === 'inbox' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {inbox.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {inbox.map((message) => (
                    <li
                      key={message.id}
                      className={`hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(message.id)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary truncate">
                            {message.subject}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            From: {message.fromName}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No messages"
                  message="Your inbox is empty."
                  icon={EnvelopeIcon}
                />
              )}
            </div>
          )}

          {selectedTab === 'outbox' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {outbox.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {outbox.map((message) => (
                    <li key={message.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary truncate">
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          To: {message.toName}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {message.content}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No sent messages"
                  message="You haven't sent any messages yet."
                  icon={EnvelopeIcon}
                />
              )}
            </div>
          )}

          {selectedTab === 'compose' && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      To
                    </label>
                    <select
                      value={composeData.toId}
                      onChange={(e) => setComposeData({ ...composeData, toId: e.target.value })}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="">Select recipient</option>
                      <option value="teacher1">Mathematics Teacher</option>
                      <option value="teacher2">Physics Teacher</option>
                      <option value="teacher3">Literature Teacher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeData.subject}
                      onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      value={composeData.content}
                      onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedTab('inbox')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                    >
                      <PaperAirplaneIcon className="h-4 w-4 mr
