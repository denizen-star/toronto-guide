/**
 * Adds events from docs/toronto-events-2026-mar-may.md to public/data/scoop_standardized.csv.
 * Run: node scripts/add-toronto-events-2026-mar-may.js
 */

const fs = require('fs');
const path = require('path');

const SCOOP_CSV = path.join(__dirname, '../public/data/scoop_standardized.csv');

// Escape CSV field (wrap in quotes if contains comma or quote)
function escape(field) {
  if (field == null || field === '') return '';
  const s = String(field).trim();
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// Events to add: id, title, description, location, startDate, endDate, cost, website, tags
const events = [
  { title: 'Doors Open Toronto 2026', description: 'Free access to 150+ buildings and sites. Theme: The World in a City (FIFA World Cup 26).', location: 'City-wide Toronto', start: '2026-05-23', end: '2026-05-24', cost: 'Free', website: 'https://www.toronto.ca/explore-enjoy/festivals-events/doors-open-toronto/', tags: 'free,architecture,culture,family' },
  { title: 'Departure', description: 'Conference and festival: 200+ speakers, entrepreneurs, music and creative-industry leaders.', location: 'Toronto', start: '2026-05-04', end: '2026-05-10', cost: 'On sale Mar 2026', website: 'https://departurefest.com', tags: 'conference,music,innovation' },
  { title: 'ROM SHOKKAN: Japanese Art Through the Sense of Touch', description: 'Hands-on exhibition of 100+ Japanese objects (textiles, armour, paintings, ceramics).', location: 'Royal Ontario Museum, 100 Queen\'s Park, Toronto', start: '2026-04-04', end: '2026-09-07', cost: 'See ROM admission', website: 'https://www.rom.on.ca', tags: 'museum,exhibition,culture' },
  { title: 'TO Food and Drink Fest 2026', description: "Canada's largest food and drink festival; 200+ exhibits, chef demos, tastings.", location: 'Metro Toronto Convention Centre', start: '2026-04-17', end: '2026-04-19', cost: 'See venue', website: 'https://tofoodanddrinkfest.com', tags: 'food,festival' },
  { title: 'PDAC Convention', description: "World premier mineral exploration and mining convention; 30,000+ attendees from 130+ countries.", location: 'Metro Toronto Convention Centre, Fairmont Royal York', start: '2026-03-01', end: '2026-03-04', cost: 'See venue', website: 'https://pdac.ca', tags: 'conference,mining' },
  { title: 'Winter Stations', description: 'Free outdoor art installations along Woodbine Beach.', location: 'Woodbine Beach', start: '2026-02-28', end: '2026-03-29', cost: 'Free', website: 'https://nowtoronto.com', tags: 'art,outdoor,free' },
  { title: 'Lumière: The Art of Light', description: 'Free outdoor light exhibition; 14 installations by Ontario artists.', location: 'Trillium Park', start: '2026-02-28', end: '2026-05-31', cost: 'Free', website: 'https://nowtoronto.com', tags: 'art,outdoor,free' },
  { title: 'Claude Monet: The Immersive Experience', description: 'Immersive exhibition of Monet\'s work.', location: 'Toronto', start: '2026-02-26', end: '2026-05-31', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'art,immersive,exhibition' },
  { title: 'Sugar Shack TO 2026', description: 'Maple taffy, comfort food, Canadian atmosphere.', location: 'Harbourfront Centre', start: '2026-03-14', end: '2026-03-15', cost: 'See venue', website: 'https://harbourfrontcentre.com', tags: 'food,family' },
  { title: 'St. Patrick\'s Parade of Toronto', description: "One of city's biggest March traditions; music, dance, floats.", location: 'Downtown Toronto', start: '2026-03-15', end: '2026-03-15', cost: 'Free', website: 'https://overheretoronto.com', tags: 'parade,free' },
  { title: 'Eid Bazaar 2026', description: '180+ vendors; shopping, food, henna, entertainment.', location: 'Ikon Event Space, Mississauga', start: '2026-03-07', end: '2026-03-19', cost: 'See venue', website: 'https://overheretoronto.com', tags: 'festival,family' },
  { title: 'Cardi B: Little Miss Drama Tour', description: 'Concert.', location: 'Scotiabank Arena', start: '2026-03-30', end: '2026-03-30', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'music,concert' },
  { title: 'FKA twigs: Body High Tour', description: 'Concert.', location: 'Coca-Cola Coliseum', start: '2026-03-24', end: '2026-03-24', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'music,concert' },
  { title: 'Bert Kreischer: Permission to Party Tour', description: 'Comedy.', location: 'Scotiabank Arena', start: '2026-03-21', end: '2026-03-21', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'comedy' },
  { title: 'Shrek 2 In Concert', description: 'Live-to-film with full orchestra.', location: 'Meridian Hall', start: '2026-03-14', end: '2026-03-15', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'film,family' },
  { title: 'Shucked', description: 'Tony-winning musical; Nashville songwriting.', location: 'Princess of Wales Theatre', start: '2026-03-03', end: '2026-04-04', cost: 'See venue', website: 'https://mirvish.com', tags: 'theatre,musical' },
  { title: 'Moulin Rouge! The Musical', description: 'Broadway sensation; 70+ pop hits.', location: 'Ed Mirvish Theatre', start: '2026-04-22', end: '2026-05-10', cost: 'See venue', website: 'https://mirvish.com', tags: 'theatre,musical' },
  { title: 'Hayley Williams', description: 'Paramore lead singer in concert.', location: 'Massey Hall', start: '2026-04-01', end: '2026-04-01', cost: 'See venue', website: 'https://overheretoronto.com', tags: 'music,concert' },
  { title: 'Raye', description: 'Concert.', location: 'Toronto', start: '2026-04-14', end: '2026-04-14', cost: 'See venue', website: 'https://overheretoronto.com', tags: 'music' },
  { title: 'The Last Dinner Party', description: 'Concert.', location: 'Toronto', start: '2026-04-24', end: '2026-04-24', cost: 'See venue', website: 'https://overheretoronto.com', tags: 'music' },
  { title: 'Bruno Mars', description: 'Concert.', location: 'Rogers Centre', start: '2026-05-23', end: '2026-05-30', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'music,concert' },
  { title: '& Juliet', description: 'Modern musical; Max Martin hits.', location: 'Royal Alexandra Theatre', start: '2026-03-01', end: '2026-07-05', cost: 'See venue', website: 'https://mirvish.com', tags: 'theatre,musical' },
  { title: 'A Beautiful Noise', description: 'Neil Diamond musical.', location: 'Princess of Wales Theatre', start: '2026-05-01', end: '2026-05-31', cost: 'See venue', website: 'https://mirvish.com', tags: 'theatre,musical' },
  { title: 'Toronto Tattoo Show NIX 2026', description: "Canada's longest-running tattoo convention; 26 years.", location: 'Toronto', start: '2026-05-01', end: '2026-05-03', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'expo,tattoo' },
  { title: 'hommage – Sylvie Bouchard', description: 'Citadel LIVE; multi-sensory dance journey; BoucharDanse.', location: 'Toronto', start: '2026-05-13', end: '2026-05-17', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'dance' },
  { title: 'COC Werther', description: 'Canadian Opera Company; Massenet; all-new co-production with Opéra de Montréal.', location: 'Four Seasons Centre', start: '2026-05-01', end: '2026-05-31', cost: 'See venue', website: 'https://coc.ca', tags: 'opera' },
  { title: 'National Ballet of Canada – Crystal Pite double bill', description: 'Two full company works (Crystal Pite + contrasting piece).', location: 'Four Seasons Centre', start: '2026-02-28', end: '2026-03-08', cost: 'See venue', website: 'https://national.ballet.ca', tags: 'ballet,dance' },
  { title: 'Ronnie Burkett – Marionettes', description: 'World-renowned marionette artist; Canadian Stage.', location: 'Canadian Stage', start: '2026-02-01', end: '2026-02-28', cost: 'See venue', website: 'https://canadianstage.com', tags: 'theatre,marionettes' },
  { title: 'The Empire Strips Back', description: 'Star Wars-themed burlesque.', location: 'The Royal Theatre, 608 College St', start: '2026-02-01', end: '2026-02-28', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'burlesque,theatre' },
  { title: 'Chanticleer', description: 'Grammy-winning vocal ensemble; a cappella Renaissance to spirituals.', location: 'Koerner Hall', start: '2026-03-01', end: '2026-03-01', cost: 'From $79', website: 'https://nowtoronto.com', tags: 'music,choral' },
  { title: 'Cat Power', description: 'Concert.', location: 'History', start: '2026-03-01', end: '2026-03-01', cost: 'From $53', website: 'https://nowtoronto.com', tags: 'music,concert' },
  { title: 'La La Land in Concert', description: 'Live-to-film spectacle with full orchestra.', location: 'Meridian Hall', start: '2026-03-07', end: '2026-03-07', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'film,music' },
  { title: 'AGO March Break', description: 'Kids visit FREE; hands-on artmaking, activity books.', location: 'AGO, 317 Dundas St W', start: '2026-03-14', end: '2026-03-22', cost: 'Free for kids', website: 'https://www.toronto.ca', tags: 'art,family,free' },
  { title: 'The Art of Brick', description: 'LEGO art exhibition; 130+ sculptures.', location: 'YZD, 30 Hanover Rd', start: '2026-03-05', end: '2026-05-31', cost: 'See venue', website: 'https://childslife.ca', tags: 'exhibition,family' },
  { title: 'Some Like It Hot', description: '13-time Tony-nominated musical.', location: 'Ed Mirvish Theatre', start: '2026-02-10', end: '2026-03-15', cost: 'See venue', website: 'https://mirvish.com', tags: 'theatre,musical' },
  { title: 'Peppa Pig\'s My First Concert', description: 'Interactive children\'s concert; orchestral instruments.', location: 'Meridian Hall', start: '2026-03-02', end: '2026-03-31', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'family,music' },
  { title: 'InTouch – Magic show', description: "Canada's most intimate magic; immersive, theatrical.", location: 'Toronto', start: '2026-05-01', end: '2026-05-31', cost: 'See venue', website: 'https://nowtoronto.com', tags: 'magic,theatre' },
  { title: 'Bluebeard\'s Castle / Erwartung – COC', description: 'Double-bill; Robert Lepage; spring at Canadian Opera Company.', location: 'Four Seasons Centre', start: '2026-05-01', end: '2026-05-31', cost: 'See venue', website: 'https://coc.ca', tags: 'opera' },
];

const now = new Date().toISOString();
let id = 1;
const rows = events.map((e) => {
  const sid = `sc2026_${id++}`;
  const image = `https://source.unsplash.com/random/?${encodeURIComponent(e.title)}`;
  return [
    sid,
    escape(e.title),
    escape(e.description),
    image,
    escape(e.location),
    '3',
    e.start,
    e.end,
    '',
    'varies',
    escape(e.description),
    escape(e.cost),
    escape(e.website),
    '',
    '',
    'false',
    escape(e.tags),
    now,
    '3',
    'special_event',
    escape(e.location.includes('Toronto') ? 'Toronto' : 'Toronto'),
    'spring',
    e.cost === 'Free' ? 'free' : 'varies',
    'special_event',
  ].join(',');
});

const csvRows = rows.join('\n');
let csv = fs.readFileSync(SCOOP_CSV, 'utf8');
// Remove trailing empty/malformed line if present
csv = csv.replace(/\n,,.*\n?$/, '\n');
fs.writeFileSync(SCOOP_CSV, csv + '\n' + csvRows + '\n', 'utf8');
console.log(`Added ${events.length} events to ${SCOOP_CSV}`);
