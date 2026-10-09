const form = document.getElementById("multistepForm");
const steps = document.querySelectorAll(".form-step");
const indicators = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const formActions = document.getElementById("formActions");

let currentStep = 1;
const totalSteps = indicators.length;

/* ---------- Dropdown yetu ---------- */
const INSET = 8;    // kibox kipungue px ngapi kila upande
const GAP = 6;      // nafasi kati ya field na kibox
const MARGIN = 12;  // nafasi ya usalama kutoka ukingo wa skrini

const closeAll = () => {
  document.querySelectorAll(".cselect.open").forEach(c => {
    c.classList.remove("open");
    if (c._menu) c._menu.classList.remove("show");
  });
};

document.addEventListener("click", e => {
  if (!e.target.closest(".cselect, .cselect-menu")) closeAll();
});
window.addEventListener("resize", closeAll);
window.addEventListener("scroll", closeAll);

function placeMenu(box, menu){
  const field = box.closest(".phone-field") || box;
  const r = field.getBoundingClientRect();

  menu.style.left = `${r.left + INSET}px`;
  menu.style.width = `${r.width - INSET * 2}px`;
  menu.style.maxHeight = "none";

  const total = Math.min(menu.scrollHeight + 4, box._maxH || Infinity);
  const below = window.innerHeight - r.bottom - GAP - MARGIN;
  const above = r.top - GAP - MARGIN;
  const down = total <= below || below >= above;
  const h = Math.min(total, down ? below : above);

  menu.style.maxHeight = `${h}px`;
  menu.style.top = down ? `${r.bottom + GAP}px` : `${r.top - GAP - h}px`;
}

function toggleMenu(box){
  const wasOpen = box.classList.contains("open");
  closeAll();
  if (wasOpen) return;
  box.classList.add("open");
  box._menu.classList.add("show");
  placeMenu(box, box._menu);
}

document.querySelectorAll(".form-group select").forEach(sel => {
  sel.classList.add("native-hidden");

  const box = document.createElement("div");
  box.className = "cselect";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cselect-btn";
  const label = document.createElement("span");
  btn.appendChild(label);
  const menu = document.createElement("ul");
  menu.className = "cselect-menu";

  const sync = () => {
    label.textContent = sel.options[sel.selectedIndex].text;
    btn.classList.toggle("placeholder", !sel.value);
    menu.querySelectorAll("li").forEach(li =>
      li.classList.toggle("selected", li.dataset.value === sel.value)
    );
  };

  [...sel.options].forEach(o => {
    if (!o.value) return;
    const li = document.createElement("li");
    li.textContent = o.text.trim();
    li.dataset.value = o.value;
    li.addEventListener("click", () => {
      sel.value = o.value;
      sync();
      closeAll();
      sel.dispatchEvent(new Event("input", { bubbles: true }));
    });
    menu.appendChild(li);
  });

  btn.addEventListener("click", () => toggleMenu(box));
  box.appendChild(btn);
  box._menu = menu;
  document.body.appendChild(menu);
  sel.after(box);
  sync();
});

/* ---------- Simu + nchi ---------- */
const countries = [
  { n: "Tanzania",     f: "🇹🇿", c: "255", len: 9,  start: /^[67]/ },
  { n: "Kenya",        f: "🇰🇪", c: "254", len: 9,  start: /^[17]/ },
  { n: "Uganda",       f: "🇺🇬", c: "256", len: 9,  start: /^7/ },
  { n: "Rwanda",       f: "🇷🇼", c: "250", len: 9,  start: /^7/ },
  { n: "Burundi",      f: "🇧🇮", c: "257", len: 8,  start: /^8/ },
  { n: "DR Congo",     f: "🇨🇩", c: "243", len: 9 },
  { n: "Zambia",       f: "🇿🇲", c: "260", len: 9 },
  { n: "Malawi",       f: "🇲🇼", c: "265", len: 9 },
  { n: "Mozambique",   f: "🇲🇿", c: "258", len: 9 },
  { n: "South Africa", f: "🇿🇦", c: "27",  len: 9 },
  { n: "Ethiopia",     f: "🇪🇹", c: "251", len: 9 },
  { n: "Nigeria",      f: "🇳🇬", c: "234", len: 10 },
  { n: "Ghana",        f: "🇬🇭", c: "233", len: 9 },
  { n: "UAE",          f: "🇦🇪", c: "971", len: 9 },
  { n: "India",        f: "🇮🇳", c: "91",  len: 10 },
  { n: "UK",           f: "🇬🇧", c: "44",  len: 10 },
  { n: "USA / Canada", f: "🇺🇸", c: "1",   len: 10 }
];

const countryBox = document.getElementById("countrySelect");
const phoneInput = document.getElementById("phoneInput");
const phoneHint = document.getElementById("phoneHint");
const phoneFull = document.getElementById("phoneFull");
const phoneField = phoneInput.closest(".phone-field");
let country = countries[0];

const cBtn = document.createElement("button");
cBtn.type = "button";
cBtn.className = "cselect-btn";
const cLabel = document.createElement("span");
cBtn.appendChild(cLabel);
const cMenu = document.createElement("ul");
cMenu.className = "cselect-menu";

countries.forEach(ct => {
  const li = document.createElement("li");
  li.innerHTML = `<span>${ct.f} ${ct.n}</span><span>+${ct.c}</span>`;
  li.addEventListener("click", () => {
    country = ct;
    renderCountry();
    closeAll();
    checkPhone();
    phoneInput.focus();
  });
  cMenu.appendChild(li);
});

function renderCountry(){
  cLabel.textContent = `${country.f} +${country.c}`;
  [...cMenu.children].forEach((li, i) =>
    li.classList.toggle("selected", countries[i] === country)
  );
}

cBtn.addEventListener("click", () => toggleMenu(countryBox));
countryBox.appendChild(cBtn);
countryBox._menu = cMenu;
countryBox._maxH = 180;
document.body.appendChild(cMenu);
renderCountry();

function checkPhone(){
  let d = phoneInput.value.replace(/\D/g, "");
  const max = country.len + (d.startsWith("0") ? 1 : 0);
  d = d.slice(0, max);
  phoneInput.value = d;
  const n = d.replace(/^0/, "");

  phoneField.classList.remove("bad", "ok");
  phoneFull.value = "";

  if (!n){ phoneHint.textContent = ""; return true; }

  if (n.length < country.len){
    phoneField.classList.add("bad");
    phoneHint.textContent = `Namba haijakamilika (${n.length}/${country.len})`;
    return false;
  }
  if (country.start && !country.start.test(n)){
    phoneField.classList.add("bad");
    phoneHint.textContent = `Namba hii si sahihi kwa ${country.n}`;
    return false;
  }
  phoneField.classList.add("ok");
  phoneFull.value = `+${country.c}${n}`;
  phoneHint.textContent = `✔ ${phoneFull.value}`;
  return true;
}

phoneInput.addEventListener("input", checkPhone);

/* ---------- Steps ---------- */
const updateUI = () => {
  closeAll();
  steps.forEach((s, i) => s.classList.toggle("active", i + 1 === currentStep));

  indicators.forEach((s, i) => {
    s.classList.toggle("step-active", i + 1 === currentStep);
    s.classList.toggle("step-completed", i + 1 < currentStep);
  });

  const done = Math.min(currentStep - 1, totalSteps - 1);
  progressBar.style.width = `${(done / (totalSteps - 1)) * 100}%`;

  prevBtn.style.display = currentStep === 1 ? "none" : "block";
  nextBtn.textContent = currentStep === totalSteps ? "Submit" : "Next step";
  formActions.style.display = currentStep > totalSteps ? "none" : "flex";
};

const errTarget = field =>
  field.tagName === "SELECT"
    ? field.parentElement.querySelector(".cselect-btn")
    : field;

const validateStep = () => {
  const fields = document.querySelectorAll(
    `.form-step[data-step="${currentStep}"] [required]`
  );
  let ok = true;

  fields.forEach(field => {
    let valid;
    if (field.type === "radio"){
      valid = !!form.querySelector(`input[name="${field.name}"]:checked`);
      document
        .querySelectorAll(`input[name="${field.name}"] + .radio-label`)
        .forEach(l => (l.style.borderColor = valid ? "" : "#ef4444"));
    } else {
      valid = field.value.trim() !== "" && field.checkValidity();
      errTarget(field).style.borderColor = valid ? "" : "#ef4444";
    }
    if (!valid) ok = false;
  });

  if (currentStep === 1 && !checkPhone()) ok = false;

  return ok;
};

nextBtn.addEventListener("click", () => {
  if (!validateStep()) return;

  if (currentStep === totalSteps){
    console.log("Form Submitted", Object.fromEntries(new FormData(form)));
    setTimeout(() => {
      window.location.href = "hub.html";
    }, 2500);
  }
  currentStep++;
  updateUI();
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 1){
    currentStep--;
    updateUI();
  }
});

form.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "phoneInput") return;
  errTarget(t).style.borderColor = "";
  if (t.type === "radio"){
    document
      .querySelectorAll(`input[name="${t.name}"] + .radio-label`)
      .forEach(l => (l.style.borderColor = ""));
  }
});

updateUI();