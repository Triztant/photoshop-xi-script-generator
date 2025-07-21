// Fetch names and template on load
let names = [], template = "";

Promise.all([
  fetch('names.txt').then(r => r.text()),
  fetch('template.jsx').then(r => r.text())
]).then(([namesTxt, tpl]) => {
  names = namesTxt.trim().split('\n');
  template = tpl;

  // Populate datalist for autocomplete
  const dl = document.getElementById('namesList');
  names.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    dl.appendChild(opt);
  });

  // Dynamically create the 11 inputs
  const inputsDiv = document.getElementById('inputs');
  for (let i = 0; i < 11; i++) {
    const label = document.createElement('label');
    label.textContent = `Player ${i+1}: `;
    const inp = document.createElement('input');
    inp.name = 'player';
    inp.setAttribute('list', 'namesList');
    inp.required = true;
    label.appendChild(inp);
    inputsDiv.appendChild(label);
  }
});

// On form submit: build and download the .jsx
document.getElementById('squadForm').addEventListener('submit', async e => {
  e.preventDefault();

  // Gather chosen names
  const players = Array.from(document.querySelectorAll('input[name="player"]'))
                       .map(i => i.value.trim());

  if (players.length !== 11) {
    return alert('Please pick exactly 11 players.');
  }

  // Build the IMAGE_FILES array literal using hyphens only
  const imageFilesArray = '[' +
    players
      .map(nm => {
        // turn spaces into hyphens and lowercase
        return `"${nm.trim().toLowerCase().replace(/\s+/g, '-')}.png"`;
      })
      .join(',') +
    ']';

  console.log('Injecting imageFiles =', imageFilesArray);

  // Match the placeholder in your template (allowing whitespace)
  const placeholderRE = /{{\s*IMAGE_FILES\s*}}/;

  // Inject the real filename array
  let js = template.replace(placeholderRE, imageFilesArray);

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
