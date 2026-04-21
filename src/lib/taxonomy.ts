import type { TopicTag } from '../types'

export const TAXONOMY: Record<TopicTag, string[]> = {
  Work: [
    'job','career','meeting','project','deadline','client','manager','team',
    'salary','hire','fired','interview','resume','promotion','colleague',
    'office','remote','slack','email','report','presentation','budget',
    'revenue','stakeholder','sprint','agile','scrum','deliverable','boss',
  ],
  Learning: [
    'learn','study','course','book','tutorial','understand','concept','skill',
    'practice','exercise','read','notes','class','lesson','lecture','teach',
    'knowledge','education','school','university','certificate','degree',
    'workshop','training','research','explain','example','definition',
  ],
  Creative: [
    'write','writing','story','design','art','draw','paint','music','song',
    'poem','novel','screenplay','creative','idea','imagine','create','build',
    'craft','blog','content','brand','logo','style','aesthetic','vision',
    'narrative','character','plot','draft','edit','publish',
  ],
  Technical: [
    'code','coding','programming','software','algorithm','function','bug',
    'error','debug','deploy','api','database','server','frontend','backend',
    'react','python','javascript','typescript','sql','git','docker','linux',
    'architecture','system','performance','test','refactor','library','framework',
    'component','module','interface','class','object','array','loop',
  ],
  Planning: [
    'plan','goal','target','milestone','strategy','roadmap','priority','schedule',
    'timeline','decision','option','choose','next','step','action','task',
    'agenda','calendar','organize','structure','framework','approach','solution',
    'outcome','objective','measure','track','progress','review','reflect',
  ],
  Personal: [
    'feel','feeling','emotion','stress','anxiety','happy','sad','excited',
    'worried','family','friend','relationship','health','sleep','eat','exercise',
    'mental','therapy','journal','life','home','move','travel','vacation',
    'habit','routine','morning','evening','weekend','birthday','personal',
  ],
  Research: [
    'research','paper','study','data','analysis','survey','experiment','hypothesis',
    'evidence','source','reference','citation','article','journal','finding',
    'conclusion','methodology','sample','statistic','chart','graph','model',
    'compare','evaluate','measure','quantify','observe','document','literature',
  ],
}

export function classifyTopics(terms: string[]): TopicTag[] {
  const scores: Record<TopicTag, number> = {
    Work: 0, Learning: 0, Creative: 0, Technical: 0,
    Planning: 0, Personal: 0, Research: 0,
  }

  for (const term of terms) {
    for (const [topic, keywords] of Object.entries(TAXONOMY) as [TopicTag, string[]][]) {
      if (keywords.some(k => term.includes(k) || k.includes(term))) {
        scores[topic] += 1
      }
    }
  }

  return (Object.entries(scores) as [TopicTag, number][])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic)
}
