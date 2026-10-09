function filterCards(){
  const query = document.getElementById('usertext').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.hub-card');
  let found = 0;

  cards.forEach(card => {
    const title = card.querySelector('span').textContent.toLowerCase();
    if(title.includes(query)){
      card.style.display = 'flex';
      found++;
    }else{
      card.style.display = 'none';
    }
  });

  document.getElementById('noResult').style.display = found === 0 ? 'block' : 'none';
}