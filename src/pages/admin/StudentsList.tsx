import React from 'react';

const StudentsList: React.FC = () => {
  const students = [
    { id: 101, name: 'Alice Johnson', email: 'alice@student.com' },
    { id: 102, name: 'Bob Smith', email: 'bob@student.com' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Students List</h2>
      <table className="w-full border bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="border-t">
              <td className="p-2">{student.id}</td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;
