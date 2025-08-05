// Fetch player, team, nation lists & template on load
let names = [], teams = [], nations = [], template = "";

Promise.all([
  fetch('names.txt').then(r => r.text()),         // player names
  fetch('all_teams.txt').then(r => r.text()),     // team names
  fetch('all_countries.txt').then(r => r.text()), // country names
  fetch('template.jsx').then(r => r.text())       // ExtendScript template
]).then(([namesTxt, teamsTxt, natsTxt, tpl]) => {
  // Parse each list into arrays
  names   = namesTxt.trim().split('\n');
  teams   = teamsTxt.trim().split('\n');
  nations = natsTxt.trim().split('\n');
  template = tpl;

  // Populate datalists for autocomplete
  const dlNames = document.getElementById('namesList');
  const dlTeams = document.getElementById('teamsList');
  const dlNats  = document.getElementById('nationsList');

  names.forEach(v => { let o = document.createElement('option'); o.value = v; dlNames.appendChild(o); });
  teams.forEach(v => { let o = document.createElement('option'); o.value = v; dlTeams.appendChild(o); });
  nations.forEach(v => { let o = document.createElement('option'); o.value = v; dlNats.appendChild(o); });

  // After injecting inputs, capture positions order
  const positions = Array.from(
    document.querySelectorAll('#inputs .row label')
  ).map(lbl => lbl.textContent);

  // Store for use on submit
  window._positions = positions;
});

// On form submit: build filename arrays, inject positions, and download .jsx
document.getElementById('squadForm').addEventListener('submit', e => {
  e.preventDefault();

  // Helper to collect input values by name
  const collect = fieldName =>
    Array.from(document.querySelectorAll(`input[name="${fieldName}"]`))
         .map(i => i.value.trim());

  const P = collect('player');
  const T = collect('team');
  const N = collect('nation');

  // Validate exactly 11 entries
  if (P.length !== 11 || T.length !== 11 || N.length !== 11) {
    alert('Please fill exactly 11 players, 11 teams, and 11 nations.');
    return;
  }

  // Build the IMAGE_FILES array literal
  const imgArr = '[' +
    P.map(nm => `"${nm.toLowerCase().replace(/\s+/g, '-')}.png"`).join(',') +
    ']';

  // Build the TEAM_FILES array literal
  const teamArr = '[' +
    T.map(nm => `"${nm.trim().replace(/\s+/g, '_')}.png"`).join(',') +
    ']';

  // Build the NATION_FILES array literal
  const natArr = '[' +
    N.map(nm => `"Flag_of_${nm.trim().replace(/\s+/g, '_')}_Flat_Round-256x256.png"`).join(',') +
    ']';

  // Inject into the template, including POSITIONS
  let js = template
    .replace(/{{\s*POSITIONS\s*}}/, JSON.stringify(window._positions))
    .replace(/{{\s*IMAGE_FILES\s*}}/, imgArr)
    .replace(/{{\s*TEAM_FILES\s*}}/,  teamArr)
    .replace(/{{\s*NATION_FILES\s*}}/, natArr);

  // Trigger download of the generated .jsx
  const blob = new Blob([js], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'photoshop_xi_script.jsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});
