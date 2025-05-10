import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { missionAPI, leaveAPI } from '../services/api';
import { Mission, Leave } from '../types/requests';
import ApprovalWorkflow from '../components/ApprovalWorkflow';

export default function MyRequestsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedRequest, setSelectedRequest] = useState<Mission | Leave | null>(null);

  const { data: missions = [], isLoading: isLoadingMissions, error: missionsError } = useQuery<Mission[]>({
    queryKey: ['missions'],
    queryFn: missionAPI.getMissions,
  });

  const { data: leaves = [], isLoading: isLoadingLeaves, error: leavesError } = useQuery<Leave[]>({
    queryKey: ['leaves'],
    queryFn: leaveAPI.getLeaves,
  });

  // Filter requests based on user role
  const myRequests = [...missions, ...leaves].filter((request) => {
    if (user?.role === 'staff') {
      return request.requester?.id === user.id;
    }
    if (user?.role === 'hod') {
      return request.department === user.department;
    }
    if (user?.role === 'dean') {
      return request.school === user.school;
    }
    if (user?.role === 'admin') {
      return true; // Admin can see all requests
    }
    return false;
  });

  if (isLoadingMissions || isLoadingLeaves) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (missionsError || leavesError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          {missionsError ? 'Failed to load missions' : 'Failed to load leaves'}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">My Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all requests that require your attention.
          </p>
        </div>
      </div>

      {myRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no requests that require your attention at this time.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Requester
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Department
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Details
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {myRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {'destination' in request
                            ? request.type === 'local'
                              ? 'Local Mission'
                              : 'International Mission'
                            : 'Leave'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.requester?.firstName} {request.requester?.lastName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.department}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {'destination' in request
                            ? request.destination
                            : `${request.type} - ${request.duration} days`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              request.status === 'approved'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : request.status === 'rejected'
                                ? 'bg-red-50 text-red-700 ring-red-600/20'
                                : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                            } ring-1 ring-inset`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Request Details
                    </h3>
                    <div className="mt-4">
                      <ApprovalWorkflow
                        steps={selectedRequest.approvalSteps}
                        currentStep={selectedRequest.currentStep}
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(null)}
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 