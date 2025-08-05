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

  // Populate datalists
  const dl0 = document.getElementById('namesList');
  const dl1 = document.getElementById('teamsList');
  const dl2 = document.getElementById('nationsList');

  names  .forEach(v => { let o = document.createElement('option'); o.value = v; dl0.appendChild(o); });
  teams  .forEach(v => { let o = document.createElement('option'); o.value = v; dl1.appendChild(o); });
  nations.forEach(v => { let o = document.createElement('option'); o.value = v; dl2.appendChild(o); });

  // Build 11 rows exactly once
  const positions = ["GK","LB","LCB","RCB","RB","RCM","LCM","CM","LW","ST","RW"];
  const wrap = document.getElementById('inputs');
  positions.forEach(pos => {
    const row = document.createElement('div');
    row.className = 'row';
    ['player','team','nation'].forEach(type => {
      const wrapi = document.createElement('div');
      const lbl   = document.createElement('label');
      lbl.textContent = type==='player' ? pos
                       : `${pos}_${type.charAt(0).toUpperCase() + type.slice(1)}`;
      const inp = document.createElement('input');
      inp.name = type;
      inp.setAttribute('list',
        type==='player' ? 'namesList'
        : type==='team'   ? 'teamsList'
                         : 'nationsList'
      );
      inp.placeholder = `Type a ${type}…`;
      inp.required = true;
      wrapi.append(lbl, inp);
      row.appendChild(wrapi);
    });
    wrap.appendChild(row);
  });
});

// On submit: build filename arrays & download .jsx
document.getElementById('squadForm').addEventListener('submit', e => {
  e.preventDefault();
  const collect = n =>
    Array.from(document.querySelectorAll(`input[name="${n}"]`)).map(i => i.value.trim());

  const P = collect('player'),
        T = collect('team'),
        N = collect('nation');

  if (P.length!==11 || T.length!==11 || N.length!==11) {
    return alert('Please fill exactly 11 players, 11 teams, and 11 nations.');
  }

  const imgArr  = '[' + P.map(nm => `"${nm.toLowerCase().replace(/\s+/g,'-')}.png"`).join(',') + ']';
  const teamArr = '[' + T.map(nm => `"${nm.trim().replace(/\s+/g,'_')}.png"`).join(',')    + ']';
  const natArr  = '[' + N.map(nm => `"Flag_of_${nm.trim().replace(/\s+/g,'_')}_Flat_Round-256x256.png"`).join(',') + ']';

  let js = template
    .replace(/{{\s*IMAGE_FILES\s*}}/, imgArr)
    .replace(/{{\s*TEAM_FILES\s*}}/,  teamArr)
    .replace(/{{\s*NATION_FILES\s*}}/, natArr);

  const blob = new Blob([js], { type:'application/javascript' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'photoshop_xi_script.jsx';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});
