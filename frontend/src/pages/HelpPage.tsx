import { Link } from 'react-router-dom';

export default function HelpPage() {
  const sections = [
    {
      title: 'Getting Started',
      content: (
        <div className="space-y-4">
          <p>
            Welcome to the Leave and Mission Management System. This guide will help you understand how to use the system effectively.
          </p>
          <p>
            The system is designed to streamline the process of requesting and managing leaves and missions for staff members.
          </p>
        </div>
      ),
    },
    {
      title: 'Dashboard Overview',
      content: (
        <div className="space-y-4">
          <p>
            The dashboard provides a quick overview of your requests and their status. You can see:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Pending mission requests</li>
            <li>Pending leave requests</li>
            <li>Approved missions</li>
            <li>Approved leaves</li>
            <li>Recent activities</li>
          </ul>
          <p>
            Click on any card to view more details about that category.
          </p>
        </div>
      ),
    },
    {
      title: 'Requesting a Mission',
      content: (
        <div className="space-y-4">
          <p>
            To request a mission:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the "New Mission" button on the dashboard</li>
            <li>Select the mission type (local or international)</li>
            <li>For local missions, select your district</li>
            <li>Enter the destination</li>
            <li>Select start and end dates</li>
            <li>Provide a detailed purpose</li>
            <li>Upload the invitation letter (required)</li>
            <li>Submit your request</li>
          </ol>
          <p className="text-sm text-gray-500">
            Note: All fields are required, and the invitation letter must be in PDF, JPG, or PNG format with a maximum size of 10MB.
          </p>
        </div>
      ),
    },
    {
      title: 'Requesting Leave',
      content: (
        <div className="space-y-4">
          <p>
            To request leave:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the "Request Leave" button on the dashboard</li>
            <li>Select the leave type</li>
            <li>If "Other" is selected, specify the type</li>
            <li>Select start and end dates</li>
            <li>Provide a reason for your leave</li>
            <li>Optionally upload supporting documents</li>
            <li>Submit your request</li>
          </ol>
          <p className="text-sm text-gray-500">
            Note: Supporting documents are optional but recommended for certain leave types.
          </p>
        </div>
      ),
    },
    {
      title: 'Managing Your Profile',
      content: (
        <div className="space-y-4">
          <p>
            To update your profile:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click on your profile picture in the top right corner</li>
            <li>Select "Profile" from the dropdown menu</li>
            <li>Update your personal information</li>
            <li>Upload a new profile picture if desired</li>
            <li>Click "Save Changes" to update your profile</li>
          </ol>
          <p className="text-sm text-gray-500">
            Note: Your profile picture should be in JPG, PNG, or GIF format with a maximum size of 2MB.
          </p>
        </div>
      ),
    },
    {
      title: 'Approval Process',
      content: (
        <div className="space-y-4">
          <p>
            The approval process follows these steps:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Staff member submits a request</li>
            <li>Head of Department (HOD) reviews the request</li>
            <li>Dean reviews the request</li>
            <li>Final approval is granted</li>
          </ol>
          <p>
            You can track the status of your requests on the dashboard and in the respective request pages.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="mt-4 text-lg text-gray-500">
            Learn how to use the Leave and Mission Management System effectively.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              {section.content}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Still have questions? Contact your system administrator for assistance.
          </p>
          <div className="mt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 