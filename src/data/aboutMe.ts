export interface AboutMeStat {
  value : string;
  label : string;
}

export interface AboutMeHobby {
  name    : string;
  detail  : string;
}

// Shown on the first face of the ProcessCube
export const aboutMe = {
  title   : 'A "Byte" About Me',

  summary : 'I\'m a full stack developer with 6+ years of experience building and shipping scalable cloud applications across AWS and Azure. ' +
            'With a passion for creativity and problem-solving, I constantly seek out new challenges and opportunities to grow. ' +
            'Today I deliver end-to-end features on a regulated commercial insurance platform as part of a 10+ developer team. ' +
            'Before that, I helped build and led a programming & automation team from the ground up, helping scale a startup from 7 to 24 employees.',

  // From the resume
  stats   : [
    { value: '6+',      label: 'Years shipping cloud apps between AWS & Azure' },
    { value: '10',      label: 'Package serverless monorepo behind the insurance platform I help build upon' },
    { value: '7 → 24',  label: 'Startup growth I helped drive' },
  ] as AboutMeStat[],

  // TODO: Review — drafted from projects on the site, replace with your own
  hobbies : [
    { name: 'Card games',         detail: 'Star Wars Unlimited & Magic: The Gathering (a few of my projects started here)' },
    { name: 'Re-creating art',    detail: 'Rebuilding designs & illustrations in pure HTML/CSS' },
    { name: 'Coffee',             detail: 'I\'m a big fan of exploring different coffee blends and brewing methods. The AeroPress is my daily driver!' },
    { name: 'Music',              detail: 'Enjoying a wide range of genres and discovering new artists. I collect records, and love 80s and indie pop/rock in particular' },
  ] as AboutMeHobby[],
};
