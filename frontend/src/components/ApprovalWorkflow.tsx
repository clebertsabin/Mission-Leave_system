import { ApprovalStep } from '../types/requests';

interface ApprovalWorkflowProps {
  steps: ApprovalStep[];
  currentStep: number;
}

export default function ApprovalWorkflow({ steps, currentStep }: ApprovalWorkflowProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {steps.map((step, stepIdx) => (
          <li key={stepIdx}>
            <div className="relative pb-8">
              {stepIdx !== steps.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      step.status === 'approved'
                        ? 'bg-green-500'
                        : step.status === 'rejected'
                        ? 'bg-red-500'
                        : step.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {step.status === 'approved' ? (
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : step.status === 'rejected' ? (
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {step.role}{' '}
                      <span className="font-medium text-gray-900">
                        {step.status === 'approved'
                          ? 'approved'
                          : step.status === 'rejected'
                          ? 'rejected'
                          : 'pending'}
                      </span>
                    </p>
                    {step.comment && (
                      <p className="mt-1 text-sm text-gray-500">{step.comment}</p>
                    )}
                    {step.approvedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(step.approvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {step.signature && (
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <div className="h-12 w-32 bg-gray-50 rounded border flex items-center justify-center">
                        <span className="text-xs">Signature</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 