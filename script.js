// Fetch player, team, nation lists & template on load
let names = [], teams = [], nations = [], template = "";

Promise.all([
  fetch('names.txt').then(r => r.text()),         // player names
  fetch('all_teams.txt').then(r => r.text()),     // team names
  fetch('all_countries.txt').then(r => r.text()), // country names
  fetch('template.jsx').then(r => r.text())       // ExtendScript template
]).then(([namesTxt, teamsTxt, natsTxt, tpl]) => {
  // Parse text files into arrays
  names   = namesTxt.trim().split('\n');
  teams   = teamsTxt.trim().split('\n');
  nations = natsTxt.trim().split('\n');
  template = tpl;

  // Populate each datalist for autocomplete
  const dlNames = document.getElementById('namesList');
  const dlTeams = document.getElementById('teamsList');
  const dlNats  = document.getElementById('nationsList');

  names.forEach(v => { const o = document.createElement('option'); o.value = v; dlNames.appendChild(o); });
  teams.forEach(v => { const o = document.createElement('option'); o.value = v; dlTeams.appendChild(o); });
  nations.forEach(v => { const o = document.createElement('option'); o.value = v; dlNats.appendChild(o); });

  // Build 11 rows of Player/Team/Nation inputs
  const positions = ["GK","LB","LCB","RCB","RB","LM","CM","CM","RM","ST","ST"];
  const container = document.getElementById('inputs');

  positions.forEach((pos, i) => {
    const row = document.createElement('div');
    row.className = 'row';

    // Player input
    const wrapP = document.createElement('div');
    const labelP = document.createElement('label');
    labelP.textContent = pos;
    const inpP = document.createElement('input');
    inpP.setAttribute('list', 'namesList');
    inpP.name = 'player';
    inpP.placeholder = 'Type a player…';
    inpP.required = true;
    wrapP.append(labelP, inpP);
    row.appendChild(wrapP);

    // Team input
    const wrapT = document.createElement('div');
    const labelT = document.createElement('label');
    labelT.textContent = pos + '_Team';
    const inpT = document.createElement('input');
    inpT.setAttribute('list', 'teamsList');
    inpT.name = 'team';
    inpT.placeholder = 'Type a team…';
    inpT.required = true;
    wrapT.append(labelT, inpT);
    row.appendChild(wrapT);

    // Nation input
    const wrapN = document.createElement('div');
    const labelN = document.createElement('label');
    labelN.textContent = pos + '_Nation';
    const inpN = document.createElement('input');
    inpN.setAttribute('list', 'nationsList');
    inpN.name = 'nation';
    inpN.placeholder = 'Type a nation…';
    inpN.required = true;
    wrapN.append(labelN, inpN);
    row.appendChild(wrapN);

    container.appendChild(row);
  });
});

// On form submit: build filename arrays & download the script
document.getElementById('squadForm').addEventListener('submit', e => {
  e.preventDefault();

  // Collect values from each column
  const collect = fieldName =>
    Array.from(document.querySelectorAll(`input[name="${fieldName}"]`))
         .map(i => i.value.trim());

  const players = collect('player');
  const teams   = collect('team');
  const nations = collect('nation');

  if (players.length !== 11 || teams.length !== 11 || nations.length !== 11) {
    alert('Please fill exactly 11 players, 11 teams, and 11 nations.');
    return;
  }

  // Build the IMAGE_FILES array: space→hyphen, lowercase, + .png
  const imgArr = '[' +
    players.map(nm => `"${nm.toLowerCase().replace(/\s+/g, '-')}.png"`).join(',') +
    ']';

  // Build the TEAM_FILES array: spaces→underscore, uppercase, + .png
  const teamArr = '[' +
    teams.map(nm => `"${nm.trim().replace(/\s+/g, '_').toUpperCase()}.png"`).join(',') +
    ']';

  // Build the NATION_FILES array: prefixFlag, spaces→underscore, + Flat_Round-256x256.png
  const natArr = '[' +
    nations.map(nm => `"Flag_of_${nm.trim().replace(/\s+/g, '_')}_Flat_Round-256x256.png"`).join(',') +
    ']';

  // Replace placeholders in the template
  let js = template
    .replace(/{{\s*IMAGE_FILES\s*}}/, imgArr)
    .replace(/{{\s*TEAM_FILES\s*}}/,  teamArr)
    .replace(/{{\s*NATION_FILES\s*}}/, natArr);

  // Trigger download
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
