// src/utils/getEnabledTabs.ts

export const getEnabledTabs = (route: string): string[] => {
    switch (route) {
      case '/admin/createExam':
        return ['dashboard', 'announcements']; // Disable 'Create Exam' tab when on the 'Create Exam' page
      case '/institute':
        return ['createExam', 'results', 'announcements']; // Disable 'Institute' tab on Institute home page
      default:
        return ['dashboard', 'createExam', 'announcements']; // Enable all tabs for other pages
    }
  };
  