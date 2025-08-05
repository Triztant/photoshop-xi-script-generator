// Fetch names, teams, nations & template on load
let names = [], teams = [], nations = [], template = "";

Promise.all([
  fetch('names.txt').then(r => r.text()),
  fetch('teams.txt').then(r => r.text()),
  fetch('nations.txt').then(r => r.text()),
  fetch('template.jsx').then(r => r.text())
]).then(([nTxt, tTxt, natTxt, tpl]) => {
  names = nTxt.trim().split('\n');
  teams = tTxt.trim().split('\n');
  nations = natTxt.trim().split('\n');
  template = tpl;

  // Populate datalists
  const dlN = document.getElementById('namesList');
  const dlT = document.getElementById('teamsList');
  const dlF = document.getElementById('nationsList');
  names.forEach(v => dlN.appendChild(Object.assign(document.createElement('option'), { value: v })));
  teams.forEach(v => dlT.appendChild(Object.assign(document.createElement('option'), { value: v })));
  nations.forEach(v => dlF.appendChild(Object.assign(document.createElement('option'), { value: v })));

  // Create 11 rows of inputs
  const wrap = document.getElementById('inputs');
  for (let i = 0; i < 11; i++) {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr 1fr 1fr';
    row.style.gap = '0.5rem';

    ['player', 'team', 'nation'].forEach(type => {
      const inp = document.createElement('input');
      inp.name = type;
      inp.setAttribute('list', type === 'player' ? 'namesList' : type + 'sList');
      inp.placeholder = type.charAt(0).toUpperCase() + type.slice(1);
      inp.required = true;
      row.appendChild(inp);
    });

    wrap.appendChild(row);
  }
});

// On form submit: build filename arrays & download .jsx
document.getElementById('squadForm').addEventListener('submit', e => {
  e.preventDefault();

  // Collect values
  const collect = name => Array.from(document.querySelectorAll(`input[name="${name}"]`))
                                .map(i => i.value.trim());
  const P = collect('player'), T = collect('team'), N = collect('nation');
  if (P.length !== 11 || T.length !== 11 || N.length !== 11) {
    return alert('Fill exactly 11 entries in all three columns.');
  }

  // Build image arrays
  const imgArr = '[' + P.map(nm => `"${nm.trim().toLowerCase().replace(/\s+/g, '-')}.png"`).join(',') + ']';
  const teamArr = '[' + T.map(nm => `"${nm.trim().replace(/\s+/g, '_').toUpperCase()}.png"`).join(',') + ']';
  const natArr = '[' + N.map(nm => `"Flag_of_${nm.trim().replace(/\s+/g, '_')}_Flat_Round-256x256.png"`).join(',') + ']';

  // Replace placeholders
  let js = template
    .replace(/{{\s*IMAGE_FILES\s*}}/, imgArr)
    .replace(/{{\s*TEAM_FILES\s*}}/, teamArr)
    .replace(/{{\s*NATION_FILES\s*}}/, natArr);

  // Download
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
