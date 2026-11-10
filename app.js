const D=[
{id:'CH',name:'Председатель',mandate:'Я называю конфликт, а потом записываю решение.',role:'Показывает, где директора расходятся, и подписывает вердикт: решение, ответственный, дата.',themes:'Вердикт · Ответственный · Дата'},
{id:'I',name:'Финансовый директор',mandate:'Покажите, где остаются деньги.',role:'Смотрит на решение через прибыль, деньги на счёте и цену ошибки.',themes:'Прибыль · Деньги · Цена'},
{id:'II',name:'Директор по росту',mandate:'Откуда придёт следующий клиент?',role:'Отвечает за спрос, повторные визиты и каналы, которые приводят людей.',themes:'Спрос · Повторные визиты · Каналы'},
{id:'III',name:'Операционный директор',mandate:'Кто будет делать это в понедельник?',role:'Проверяет, есть ли люди, часы и порядок работы, чтобы решение выполнить.',themes:'Загрузка · Люди · Порядок'},
{id:'IV',name:'Директор по бренду',mandate:'Что подумают ваши постоянные клиенты?',role:'Говорит от имени клиента и репутации, которую вы уже заработали.',themes:'Репутация · Клиенты · Сервис'},
{id:'V',name:'Директор по рискам',mandate:'Сколько это может стоить в худшем случае?',role:'Читает договор и считает худший исход до подписи.',themes:'Договоры · Худший исход · Закон'},
{id:'VI',name:'Адвокат дьявола',mandate:'Я говорю последним и спорю со всеми.',role:'Бьёт по допущению, с которым все согласились.',themes:'Несогласие · Допущения'}
];

/* Стол совета: роли сменяются сами каждые 2 секунды.
   Наведение мыши ставит смену на паузу, нажатие на кресло — на 8 секунд. */
const STEP=2000;
const HOLD=8000;
const seats=[...document.querySelectorAll('[data-seat]')];
const board=document.getElementById('board');
const profile=document.getElementById('profile');
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
let current='CH',timer=null,swap=null,resume=null,stopped=calm,hover=false,focus=false,visible=false;

function show(id){
  const d=D.find(x=>x.id===id);
  if(!d||id===current)return;
  current=id;
  seats.forEach(b=>{const on=b.dataset.seat===id;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',on);});
  const fill=()=>{
    for(const k of ['name','mandate','role','themes'])document.querySelector('[data-f="'+k+'"]').textContent=d[k];
    profile.classList.remove('is-fading');
  };
  clearTimeout(swap);
  if(calm){fill();return;}
  profile.classList.add('is-fading');
  swap=setTimeout(fill,200);
}
function next(){
  const i=D.findIndex(x=>x.id===current);
  show(D[(i+1)%D.length].id);
}
function sync(){
  const run=!stopped&&!hover&&!focus&&visible;
  if(run&&!timer)timer=setInterval(next,STEP);
  if(!run&&timer){clearInterval(timer);timer=null;}
}
function hold(){
  stopped=true;sync();
  clearTimeout(resume);
  if(!calm)resume=setTimeout(()=>{stopped=false;sync();},HOLD);
}
seats.forEach(b=>{
  const id=b.dataset.seat;
  b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(id);});
  b.addEventListener('focus',()=>{if(b.matches(':focus-visible')){focus=true;show(id);sync();}});
  b.addEventListener('blur',()=>{focus=false;sync();});
  b.addEventListener('click',()=>{show(id);hold();});
});
board.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync();}});
board.addEventListener('pointerleave',()=>{hover=false;sync();});
new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:0.4}).observe(board);

/* Форма: три шага прототипа, ничего не отправляется. */
const form=document.getElementById('start-form');
const first=form.innerHTML;
function stepOne(){form.innerHTML=first;form.onsubmit=e=>{e.preventDefault();stepTwo();};}
function stepTwo(){
  form.innerHTML='<h2 class="heading-md" style="margin:0">Куда прислать протокол?</h2>'+
  '<label style="display:flex;flex-direction:column;gap:4px"><span class="body" style="color:var(--text-body)">Ваша почта</span><input class="fcl-field" type="email" name="email" placeholder="you@company.com" required></label>'+
  '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding-top:8px"><button class="fcl-button" type="submit">Начать сессию<span class="fcl-button__arrow" aria-hidden="true">→</span></button><button class="fcl-button fcl-button--outline" type="button" id="back">Назад</button></div>'+
  '<p class="body" style="margin:0;color:var(--text-body)">Карта и ключи не нужны.</p>';
  document.getElementById('back').onclick=stepOne;
  form.onsubmit=e=>{e.preventDefault();stepThree();};
  form.querySelector('input').focus();
}
function stepThree(){
  form.innerHTML='<h2 class="heading-md" style="margin:0">Совет собирается</h2>'+
  '<p class="body-lg" style="margin:0;color:var(--text-body)">Это прототип: на этом шаге в продукте открывается сессия совета.</p>'+
  '<div><button class="fcl-button fcl-button--outline" type="button" id="again">Начать заново</button></div>';
  document.getElementById('again').onclick=stepOne;
}
stepOne();
