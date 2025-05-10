import { useState } from 'react';
import { UpdateRequestStatus, Mission, Leave } from '../types/requests';

interface ApprovalFormProps {
  request: Mission | Leave;
  onApprove: (data: UpdateRequestStatus) => void;
  onReject: (data: UpdateRequestStatus) => void;
  onCancel: () => void;
  role: string;
}

export default function ApprovalForm({ request, onApprove, onReject, onCancel, role }: ApprovalFormProps) {
  const [comment, setComment] = useState('');
  const [signature, setSignature] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const currentStep = request.approvalSteps[request.currentStep];
  const requiresSignature = currentStep?.requiresSignature;

  const handleApprove = () => {
    onApprove({
      id: request.id,
      status: 'approved',
      comment,
      ...(requiresSignature && { signature }),
    });
  };

  const handleReject = () => {
    onReject({
      id: request.id,
      status: 'rejected',
      comment,
    });
  };

  const handleSignatureStart = () => {
    setIsSigning(true);
    // TODO: Implement signature pad
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add your comments here..."
        />
      </div>

      {requiresSignature && !signature && (
        <div>
          <button
            type="button"
            onClick={handleSignatureStart}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Add Electronic Signature
          </button>
        </div>
      )}

      {requiresSignature && isSigning && (
        <div className="border rounded-md p-4">
          <div className="h-32 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-sm text-gray-500">Signature pad will be implemented here</p>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleReject}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={requiresSignature && !signature}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Approve
        </button>
      </div>
    </div>
  );
} 