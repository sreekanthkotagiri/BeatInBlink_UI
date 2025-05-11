import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

interface Exam {
  id: string;
  title: string;
  scheduled_date: string; // Format: YYYY-MM-DD
}

const ExamCalendar = ({ exams }: { exams: Exam[] }) => {
  const events = exams.map((exam) => ({
    title: exam.title,
    date: exam.scheduled_date,
  }));

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Exam Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
      />
    </div>
  );
};

export default ExamCalendar;
