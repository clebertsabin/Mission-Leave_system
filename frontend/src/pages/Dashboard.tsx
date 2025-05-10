import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { useQuery } from '@tanstack/react-query';
import { missionAPI, leaveAPI } from '../services/api';
import { Mission, Leave } from '../types/requests';
import Notifications from '../components/Notifications';
import MissionRequestForm from '../components/MissionRequestForm';
import LeaveRequestForm from '../components/LeaveRequestForm';

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const navigate = useNavigate();

  const { data: missionsData } = useQuery<Mission[] | { data: Mission[] }>({
    queryKey: ['missions'],
    queryFn: missionAPI.getMissions,
  });
  const missions: Mission[] = Array.isArray(missionsData)
    ? missionsData
    : Array.isArray((missionsData as { data?: Mission[] })?.data)
      ? (missionsData as { data: Mission[] }).data
      : [];

  const { data: leavesData } = useQuery<Leave[] | { data: Leave[] }>({
    queryKey: ['leaves'],
    queryFn: leaveAPI.getLeaves,
  });
  const leaves: Leave[] = Array.isArray(leavesData)
    ? leavesData
    : Array.isArray((leavesData as { data?: Leave[] })?.data)
      ? (leavesData as { data: Leave[] }).data
      : [];

  const pendingMissions = missions.filter((m: Mission) => m.status === 'pending');
  const pendingLeaves = leaves.filter((l: Leave) => l.status === 'pending');
  const approvedMissions = missions.filter((m: Mission) => m.status === 'approved');
  const approvedLeaves = leaves.filter((l: Leave) => l.status === 'approved');

  const stats = [
    {
      name: 'Pending Missions',
      value: pendingMissions.length,
      icon: (
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => setShowMissionForm(true),
    },
    {
      name: 'Pending Leaves',
      value: pendingLeaves.length,
      icon: (
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => setShowLeaveForm(true),
    },
    {
      name: 'Approved Missions',
      value: approvedMissions.length,
      icon: (
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      name: 'Approved Leaves',
      value: approvedLeaves.length,
      icon: (
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  const recentActivities = [
    { id: 1, type: 'Mission', title: 'Conference in New York', status: 'pending', date: '2024-03-15', department: 'IT' },
    { id: 2, type: 'Leave', title: 'Annual Leave', status: 'approved', date: '2024-03-10', department: 'IT' },
    { id: 3, type: 'Mission', title: 'Training Workshop', status: 'rejected', date: '2024-03-05', department: 'IT' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Rendered Banner */}
      <div className="w-full bg-green-100 text-green-800 text-center py-2 text-sm font-semibold">Dashboard rendered successfully!</div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100">Here's what's happening with your requests today.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Professional Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, idx) => {
            // Assign a unique color scheme for each card
            const cardColors = [
              {
                bg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
                iconBg: 'bg-white',
                iconColor: 'text-indigo-600',
              },
              {
                bg: 'bg-gradient-to-br from-purple-500 via-pink-400 to-rose-400',
                iconBg: 'bg-white',
                iconColor: 'text-purple-600',
              },
              {
                bg: 'bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400',
                iconBg: 'bg-white',
                iconColor: 'text-blue-600',
              },
              {
                bg: 'bg-gradient-to-br from-emerald-500 via-green-400 to-lime-300',
                iconBg: 'bg-white',
                iconColor: 'text-emerald-600',
              },
            ];
            const color = cardColors[idx % cardColors.length];
            return (
              <div
                key={stat.name}
                onClick={stat.onClick}
                className={`group cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center border border-gray-100 hover:border-indigo-200 ${color.bg}`}
                style={{ minHeight: 180 }}
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-sm ${color.iconBg}`}>
                  {stat.icon && (
                    <span className={`text-3xl ${color.iconColor}`}>{stat.icon}</span>
                  )}
                </div>
                <div className="text-4xl font-extrabold text-white mb-1 group-hover:text-yellow-200 transition-colors duration-200">
                  {stat.value}
                </div>
                <div className="text-base font-medium text-white mb-2 text-center drop-shadow">
                  {stat.name}
                </div>
                <div className="w-8 h-1 rounded-full bg-white/40 mb-2"></div>
                <div className="text-xs text-white/80 text-center">
                  {stat.name.includes('Pending') ? 'Awaiting approval' : 'Approved by management'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowMissionForm(true)}
              className="group inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Mission
            </button>
            <button
              onClick={() => setShowLeaveForm(true)}
              className="group inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Request Leave
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`${
                  activeTab === 'activities'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                Recent Activities
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' ? (
              <div className="space-y-4 sm:space-y-6">
                <Notifications />
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-6 shadow-inner">
                  <h3 className="text-base sm:text-lg font-medium text-indigo-800">Quick Tips</h3>
                  <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-indigo-700">Submit mission requests at least 2 weeks in advance</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-indigo-700">Include all necessary documentation with your requests</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-indigo-700">Check the status of your requests regularly</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => navigate(activity.type === 'Mission' ? '/missions' : '/leaves')}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'Mission' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'Mission' ? (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{activity.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : activity.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {activity.status}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mission Form Modal */}
      {showMissionForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">New Mission Request</h2>
                <button
                  onClick={() => setShowMissionForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <MissionRequestForm onSuccess={() => setShowMissionForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Leave Form Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">New Leave Request</h2>
                <button
                  onClick={() => setShowLeaveForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <LeaveRequestForm onSuccess={() => setShowLeaveForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 