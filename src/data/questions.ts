// Questionnaire questions data
// Each question has 5 answer options:
// 1 - Completely agree
// 2 - Somewhat agree
// 3 - Unsure
// 4 - Somewhat disagree
// 5 - Completely disagree

export interface Question {
  id: number
  text: string
}

export interface AnswerOption {
  value: number
  label: string
  emoji: string
}

export const questions: Question[] = [
  {
    id: 1,
    text: 'I feel happy when I go to school',
  },
  {
    id: 2,
    text: 'I like learning new things',
  },
  {
    id: 3,
    text: 'My teachers help me understand things',
  },
  {
    id: 4,
    text: 'I feel safe at school',
  },
  {
    id: 5,
    text: 'I have friends who care about me',
  },
  {
    id: 6,
    text: 'I can ask for help when I need it',
  },
  {
    id: 7,
    text: 'I enjoy doing my homework',
  },
  {
    id: 8,
    text: 'I feel proud of my work',
  },
  {
    id: 9,
    text: 'School is fun for me',
  },
  {
    id: 10,
    text: 'I feel confident in my abilities',
  },
]

export const answerOptions: AnswerOption[] = [
  { value: 1, label: 'Completely agree', emoji: '😊' },
  { value: 2, label: 'Somewhat agree', emoji: '🙂' },
  { value: 3, label: 'Unsure', emoji: '😐' },
  { value: 4, label: 'Somewhat disagree', emoji: '😕' },
  { value: 5, label: 'Completely disagree', emoji: '😢' },
]

