
import { Topic } from './types';

export const PALLIATIVE_TOPICS: Topic[] = [
  {
    id: 'intro-palliative',
    title: 'Introduction to Palliative Care',
    description: 'What is Palliative Care and what services does it provide?',
    learningObjectives: ['Define palliative care', 'Distinguish between palliative care and hospice', 'List interdisciplinary team members']
  },
  {
    id: 'non-opioid-pain',
    title: 'Non-Opioid Pain Management',
    description: 'Evidence-based adjuncts and non-pharmacological interventions.',
    learningObjectives: ['Topical therapies', 'Neuropathic agents', 'Physical and integrative therapies']
  },
  {
    id: 'opioid-convos',
    title: 'Opioid Conversations',
    description: 'Talking to patients about benefits, risks, and stigmas of opioid use.',
    learningObjectives: ['Addressing opioid phobia', 'Safe prescribing education', 'Setting realistic expectations']
  },
  {
    id: 'nausea-vomiting',
    title: 'Nausea & Vomiting Management',
    description: 'Pathophysiology-based symptom management.',
    learningObjectives: ['Identifying the 4 pathways of nausea', 'Selecting targeted antiemetics', 'Non-pharmacologic strategies']
  },
  {
    id: 'spikes',
    title: 'The SPIKES Approach',
    description: 'A framework for delivering difficult news.',
    learningObjectives: ['Mastering the 6 steps of SPIKES', 'Managing emotional responses', 'Collaborative planning']
  },
  {
    id: 'eol-signs',
    title: 'End of Life Signs & Symptoms',
    description: 'What to expect in the final days and hours.',
    learningObjectives: ['Recognizing the actively dying phase', 'Educating families on common changes', 'Managing terminal secretions']
  },
  {
    id: 'prognostication',
    title: 'Prognostication',
    description: 'Clinical tools for estimating survival and goals of care.',
    learningObjectives: ['Using the Palliative Performance Scale (PPS)', 'Communication strategies for prognosis', 'Understanding variability']
  },
  {
    id: 'intro-hospice',
    title: 'Introduction to Hospice',
    description: 'How to talk about hospice and understanding the "Hospice House".',
    learningObjectives: ['Eligibility criteria', 'Common misconceptions', 'Levels of hospice care']
  },
  {
    id: 'code-status',
    title: 'Discussing Code Status',
    description: 'Clarifying values around CPR, intubation, and life support.',
    learningObjectives: ['Focusing on outcomes rather than procedures', 'The DNR/DNI conversation', 'Aligning with goals']
  },
  {
    id: 'constipation',
    title: 'Constipation & Bowel Regimens',
    description: 'Proactive management of the "opioid-induced" gut.',
    learningObjectives: ['Stimulants vs Osmotics', 'PAMORAs for refractory cases', 'Dignity in bowel care']
  },
  {
    id: 'family-meeting',
    title: 'Running a Care Conference',
    description: 'How to lead an effective multi-party family meeting.',
    learningObjectives: ['Preparation and agenda setting', 'Ensuring everyone is heard', 'Documenting consensus']
  },
  {
    id: 'polst-advanced',
    title: 'POLST & Advanced Directives',
    description: 'Practical guide to filling out legal medical forms.',
    learningObjectives: ['Differences between AD and POLST', 'When to use a POLST', 'Engaging the surrogate']
  },
  {
    id: 'ethics-surrogate',
    title: 'Ethics & Surrogate Decision Making',
    description: 'Common end-of-life ethical quandaries.',
    learningObjectives: ['Substituted judgment vs Best interests', 'Conflict resolution', 'Moral distress']
  }
];
