import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TimetableSlot } from '../types';
import { TableSkeleton } from '../components/Common/LoadingSkeleton';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

export const Timetable: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [timetable, setTimetable] = React.useState<TimetableSlot[]>([]);

  React.useEffect(() => {
    // Mock data - replace with Firestore query
    const mockTimetable: TimetableSlot[] = [
      { id: '1', day: 'monday', period: 1, subject: 'Mathematics', teacher: 'Mr. Petrov', room: '101' },
      { id: '2', day: 'monday', period: 2, subject: 'Physics', teacher: 'Ms. Ivanova', room: '102' },
      { id: '3', day: 'tuesday', period: 1, subject: 'Literature', teacher: 'Mrs. Georgieva', room: '103' },
      // Add more mock data as needed
    ];
    setTimetable(mockTimetable);
    setLoading(false);
  }, []);

  const getSlotForDayAndPeriod = (day: string, period: number) => {
    return timetable.find(slot => slot.day === day && slot.period === period);
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Timetable</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                {days.map(day => (
                  <th
                    key={day}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periods.map(period => (
                <tr key={period}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Period {period}
                  </td>
                  {days.map(day => {
                    const slot = getSlotForDayAndPeriod(day, period);
                    return (
                      <td key={`${day}-${period}`} className="px-6 py-4 whitespace-nowrap">
                        {slot ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {slot.subject}
                            </div>
                            <div className="text-sm text-gray-500">
                              {slot.teacher}
                            </div>
                            <div className="text-xs text-gray-400">
                              Room {slot.room}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
