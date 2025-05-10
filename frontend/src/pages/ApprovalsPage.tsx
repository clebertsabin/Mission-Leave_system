import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { missionAPI, leaveAPI } from '../services/api';
import { Mission, Leave, UpdateRequestStatus } from '../types/requests';
import ApprovalForm from '../components/ApprovalForm';
import ApprovalWorkflow from '../components/ApprovalWorkflow';

export default function ApprovalsPage() {
  const [selectedRequest, setSelectedRequest] = useState<Mission | Leave | null>(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: missions = [], isLoading: isLoadingMissions } = useQuery<Mission[]>({
    queryKey: ['missions'],
    queryFn: missionAPI.getMissions,
  });

  const { data: leaves = [], isLoading: isLoadingLeaves } = useQuery<Leave[]>({
    queryKey: ['leaves'],
    queryFn: leaveAPI.getLeaves,
  });

  const updateMissionMutation = useMutation({
    mutationFn: missionAPI.updateMissionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      setShowApprovalForm(false);
      setSelectedRequest(null);
    },
  });

  const updateLeaveMutation = useMutation({
    mutationFn: leaveAPI.updateLeaveStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      setShowApprovalForm(false);
      setSelectedRequest(null);
    },
  });

  const pendingMissions = missions.filter((mission: Mission) => {
    const currentStep = mission.approvalSteps[mission.currentStep];
    const isPending = mission.status === 'pending';
    const isCorrectRole = currentStep?.role === user?.role;
    const isCorrectDepartment = user?.role === 'hod' ? mission.department === user.department : true;
    const isCorrectSchool = user?.role === 'dean' ? mission.school === user.school : true;

    return isPending && isCorrectRole && isCorrectDepartment && isCorrectSchool;
  });

  const pendingLeaves = leaves.filter((leave: Leave) => {
    const currentStep = leave.approvalSteps[leave.currentStep];
    const isPending = leave.status === 'pending';
    const isCorrectRole = currentStep?.role === user?.role;
    const isCorrectDepartment = user?.role === 'hod' ? leave.department === user.department : true;
    const isCorrectSchool = user?.role === 'dean' ? leave.school === user.school : true;

    return isPending && isCorrectRole && isCorrectDepartment && isCorrectSchool;
  });

  const handleApprove = (data: UpdateRequestStatus) => {
    if (selectedRequest && 'destination' in selectedRequest) {
      updateMissionMutation.mutate(data);
    } else {
      updateLeaveMutation.mutate(data);
    }
  };

  const handleReject = (data: UpdateRequestStatus) => {
    if (selectedRequest && 'destination' in selectedRequest) {
      updateMissionMutation.mutate(data);
    } else {
      updateLeaveMutation.mutate(data);
    }
  };

  if (isLoadingMissions || isLoadingLeaves) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Pending Approvals</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all requests waiting for your approval.
          </p>
        </div>
      </div>

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
                  {pendingMissions.map((mission: Mission) => (
                    <tr key={mission.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {mission.type === 'local' ? 'Local Mission' : 'International Mission'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {mission.requester.firstName} {mission.requester.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {mission.department}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {mission.destination}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          Pending
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => {
                            setSelectedRequest(mission);
                            setShowApprovalForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingLeaves.map((leave: Leave) => (
                    <tr key={leave.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Leave
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {leave.requester.firstName} {leave.requester.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {leave.department}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {leave.type} - {leave.duration} days
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          Pending
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => {
                            setSelectedRequest(leave);
                            setShowApprovalForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Review
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

      {showApprovalForm && selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Review Request
                    </h3>
                    <div className="mt-4">
                      <ApprovalWorkflow
                        steps={selectedRequest.approvalSteps}
                        currentStep={selectedRequest.currentStep}
                      />
                    </div>
                    <div className="mt-4">
                      <ApprovalForm
                        request={selectedRequest}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onCancel={() => {
                          setShowApprovalForm(false);
                          setSelectedRequest(null);
                        }}
                        role={user?.role || ''}
                      />
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