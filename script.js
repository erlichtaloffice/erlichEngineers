
async function loadStandards(){ const res = await fetch('standards.json'); return await res.json(); }
function round1(n){ return Math.round(n*10)/10; }
function fmt(n){ if (n===null || n==='') return ''; if (Math.abs(n-Math.round(n))<1e-6) return Math.round(n); return n.toFixed(1); }

document.addEventListener('DOMContentLoaded', async ()=>{
  const standards = await loadStandards();
  const purposeSel = document.getElementById('purpose');
  Object.keys(standards).forEach(k => { if (k==='meta') return; const opt = document.createElement('option'); opt.value = k; opt.textContent = k + ' (' + standards[k].unit + ')'; purposeSel.appendChild(opt); });

  document.getElementById('calc').addEventListener('click', ()=>{
    const purpose = purposeSel.value;
    const zone = document.getElementById('zone').value;
    const qty = parseFloat(document.getElementById('qty').value);
    const supplyVal = document.getElementById('supply').value;
    const supply = supplyVal==='' ? null : parseFloat(supplyVal);
    if (!purpose || isNaN(qty)){ alert('נא לבחור ייעוד ולהזין כמות תקינה'); return; }
    const info = standards[purpose];
    let demand = 0;
    let unit = info.unit || '';
    if (purpose === 'חינוך' && info.zones[zone].type === 'per_class'){
      const rmin = info.zones[zone].rate_min; const rmax = info.zones[zone].rate_max; const rate = (rmin + rmax)/2.0; demand = qty * rate;
    } else {
      const z = info.zones[zone] || Object.values(info.zones)[0];
      const rate = z.rate; demand = qty * rate;
    }
    demand = round1(demand);
    const balance = supply===null ? '' : round1(supply - demand);
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = `<tr>
      <td>${purpose}</td>
      <td>${fmt(qty)}</td>
      <td>${unit}</td>
      <td>${fmt(demand)}</td>
      <td>${supply===null ? '' : fmt(supply)}</td>
      <td>${balance=== '' ? '' : fmt(balance)}</td>
    </tr>`;
    document.getElementById('results').style.display = 'block';
    const summary = document.getElementById('summary');
    if (balance === '') summary.textContent = '';
    else if (balance >=0) { summary.textContent = 'עודף חניות: ' + fmt(balance); summary.style.color = 'var(--primary)'; }
    else { summary.textContent = 'חוסר חניות: ' + fmt(Math.abs(balance)); summary.style.color = '#d9534f'; }
  });

  document.getElementById('reset').addEventListener('click', ()=>{
    document.getElementById('purpose').selectedIndex = 0;
    document.getElementById('zone').value = 'א';
    document.getElementById('qty').value = '';
    document.getElementById('supply').value = '';
    document.getElementById('results').style.display = 'none';
  });
});
