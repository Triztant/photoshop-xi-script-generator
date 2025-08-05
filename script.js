// Fetch player, team, nation lists & template on load
let names = [], teams = [], nations = [], template = "";

Promise.all([
  fetch('names.txt').then(r => r.text()),         // player names
  fetch('all_teams.txt').then(r => r.text()),     // team names
  fetch('all_countries.txt').then(r => r.text()), // country names
  fetch('template.jsx').then(r => r.text())       // ExtendScript template
]).then(([namesTxt, teamsTxt, natsTxt, tpl]) => {
  names    = namesTxt.trim().split('\n');
  teams    = teamsTxt.trim().split('\n');
  nations  = natsTxt.trim().split('\n');
  template = tpl;

  // Populate the three datalists
  const dlNames = document.getElementById('namesList');
  const dlTeams = document.getElementById('teamsList');
  const dlNats  = document.getElementById('nationsList');

  names.forEach(v => {
    const o = document.createElement('option');
    o.value = v;
    dlNames.appendChild(o);
  });
  teams.forEach(v => {
    const o = document.createElement('option');
    o.value = v;
    dlTeams.appendChild(o);
  });
  nations.forEach(v => {
    const o = document.createElement('option');
    o.value = v;
    dlNats.appendChild(o);
  });
});

// Handle form submission: build filename arrays, inject into the template, and download the .jsx
document.getElementById('squadForm').addEventListener('submit', e => {
  e.preventDefault();

  // Helper: collect 11 values for a given input name
  const collect = name =>
    Array.from(document.querySelectorAll(`input[name="${name}"]`))
         .map(i => i.value.trim());

  const P = collect('player');   // 11 player names
  const T = collect('team');     // 11 team names
  const N = collect('nation');   // 11 nation names

  // Validate
  if (P.length !== 11 || T.length !== 11 || N.length !== 11) {
    return alert('Please fill exactly 11 players, 11 teams, and 11 nations.');
  }

  // Build imageFiles array (lowercase, hyphens, .png)
  const imgArr = '[' +
    P.map(nm => `"${nm.toLowerCase().replace(/\s+/g, '-')}.png"`).join(',') +
    ']';

  // Build teamFiles array (exact + .png)
  const teamArr = '[' +
    T.map(nm => `"${nm}.png"`).join(',') +
    ']';

  // Build nationFiles array (exact + .png)
  const natArr = '[' +
    N.map(nm => `"${nm}.png"`).join(',') +
    ']';

  // Inject into the ExtendScript template
  const js = template
    .replace(/{{\s*IMAGE_FILES\s*}}/, imgArr)
    .replace(/{{\s*TEAM_FILES\s*}}/,  teamArr)
    .replace(/{{\s*NATION_FILES\s*}}/, natArr);

  // Trigger download of the generated .jsx
  const blob = new Blob([js], { type: 'application/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'photoshop_xi_script.jsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});
