
export enum RotationLength {
  TWO_WEEKS = '2 weeks',
  FOUR_WEEKS = '4 weeks'
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
}

export interface ScheduleItem {
  date: string;
  topicId: string;
  completed: boolean;
}

export interface UserRotation {
  startDate: string;
  length: RotationLength;
  schedule: ScheduleItem[];
}

export interface ChatMessage {
  role: 'student' | 'patient' | 'attending';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}
