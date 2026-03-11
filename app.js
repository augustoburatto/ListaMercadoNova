const categoriasOrdem = ['Higiene', 'Mercearia', 'Congelados', 'Hortifruti'];
const categoriaFallback = 'Outros';

const categoriaSelect = document.getElementById('categoria');
const listaBody = document.getElementById('lista-body');
const totalGeral = document.getElementById('total-geral');
const form = document.getElementById('item-form');
const salvarArquivoBtn = document.getElementById('salvar-arquivo');
const saveStatus = document.getElementById('save-status');

const ghOwner = document.getElementById('gh-owner');
const ghRepo = document.getElementById('gh-repo');
const ghBranch = document.getElementById('gh-branch');
const ghPath = document.getElementById('gh-path');

const githubClientId = "Ov23ctG2HaZ7D2WyoxFG";
const repo = "ListaMercadoNova";
const owner = "augustoburatto";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if(code){
  obterToken(code);
}

async function obterTokenOAuth() {

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  try {

    const resposta = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: githubClientId,
        code: code
      })
    });

    const data = await resposta.json();

    if (data.access_token) {
      localStorage.setItem("github_token", data.access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

  } catch (e) {
    console.error("Erro ao obter token OAuth", e);
  }
}

function obterToken() {
  return localStorage.getItem("github_token");
}

async function carregarDoGithub() {
  const url = githubApiUrl();
  if (!url) return false;

  const token = obterToken();

  try {

    const headers = {
      Accept: 'application/vnd.github+json'
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const resposta = await fetch(url, { headers });

    if (!resposta.ok) return false;

    const arquivo = await resposta.json();
    const conteudo = atob(arquivo.content.replace(/\n/g, ''));

    itens = normalizarLista(JSON.parse(conteudo));

    salvarLocal();
    renderizar();

    statusSalvar('Lista carregada do GitHub.');

    return true;

  } catch {
    return false;
  }
}

let itens = [];

function preencherCategorias() {
  [...categoriasOrdem, categoriaFallback].forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    categoriaSelect.appendChild(option);
  });
}

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ordenarItens(lista) {
  return [...lista].sort((a, b) => {
    const indexA = categoriasOrdem.indexOf(a.categoria);
    const indexB = categoriasOrdem.indexOf(b.categoria);
    const ordemA = indexA === -1 ? categoriasOrdem.length : indexA;
    const ordemB = indexB === -1 ? categoriasOrdem.length : indexB;
    if (ordemA !== ordemB) return ordemA - ordemB;
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
}

function salvarLocal() {
  localStorage.setItem('listaMercadoNova', JSON.stringify(itens));
}

function carregarConfigGithub() {
  const config = JSON.parse(localStorage.getItem('listaMercadoNovaConfig') || '{}');
  ghOwner.value = config.owner || 'augustoburatto';
  ghRepo.value = config.repo || 'ListaMercadoNova';
  ghBranch.value = config.branch || 'main';
  ghPath.value = config.path || 'data/lista-mercado.json';
}

function salvarConfigGithub() {
  localStorage.setItem(
    'listaMercadoNovaConfig',
    JSON.stringify({
      owner: ghOwner.value.trim(),
      repo: ghRepo.value.trim(),
      branch: ghBranch.value.trim() || 'main',
      path: ghPath.value.trim() || 'data/lista-mercado.json',
    }),
  );
}

function statusSalvar(msg, erro = false) {
  saveStatus.textContent = msg;
  saveStatus.className = `save-status ${erro ? 'error' : 'ok'}`;
}

function atualizarTotalGeral() {
  const total = itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0);
  totalGeral.textContent = formatarMoeda(total);
}

function atualizarItem(id, campo, valor) {
  itens = itens.map((item) => (item.id === id ? { ...item, [campo]: valor } : item));
  salvarLocal();
  renderizar();
}

function removerItem(id) {
  itens = itens.filter((item) => item.id !== id);
  salvarLocal();
  renderizar();
}

function criarInputNumero(item, campo, min, step) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = min;
  input.step = step;
  input.value = item[campo];
  input.addEventListener('change', (e) => {
    const valor = Number(e.target.value);
    if (Number.isNaN(valor) || valor < Number(min)) {
      e.target.value = item[campo];
      return;
    }
    atualizarItem(item.id, campo, valor);
  });
  return input;
}

function criarSelectCategoria(item) {
  const select = document.createElement('select');
  [...categoriasOrdem, categoriaFallback].forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    if (item.categoria === categoria) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => atualizarItem(item.id, 'categoria', e.target.value));
  return select;
}

function renderizar() {
  listaBody.innerHTML = '';
  const itensOrdenados = ordenarItens(itens);

  for (const item of itensOrdenados) {
    const tr = document.createElement('tr');
    const tdNome = document.createElement('td');
    tdNome.textContent = item.nome;

    const tdQuantidade = document.createElement('td');
    tdQuantidade.appendChild(criarInputNumero(item, 'quantidade', '0.01', '0.01'));

    const tdCategoria = document.createElement('td');
    tdCategoria.appendChild(criarSelectCategoria(item));

    const tdUnitario = document.createElement('td');
    tdUnitario.appendChild(criarInputNumero(item, 'valorUnitario', '0', '0.01'));

    const tdTotal = document.createElement('td');
    tdTotal.textContent = formatarMoeda(item.quantidade * item.valorUnitario);

    const tdCarrinho = document.createElement('td');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'checkbox';
    check.checked = item.noCarrinho;
    check.addEventListener('change', (e) => atualizarItem(item.id, 'noCarrinho', e.target.checked));
    tdCarrinho.appendChild(check);

    const tdRemover = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => removerItem(item.id));
    tdRemover.appendChild(removeBtn);

    tr.append(tdNome, tdQuantidade, tdCategoria, tdUnitario, tdTotal, tdCarrinho, tdRemover);
    listaBody.appendChild(tr);
  }

  atualizarTotalGeral();
}

function novoId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
}

function normalizarLista(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((item) => ({
    id: item.id || novoId(),
    nome: String(item.nome || 'Item sem nome'),
    quantidade: Number(item.quantidade || 0),
    categoria: item.categoria || categoriaFallback,
    valorUnitario: Number(item.valorUnitario || 0),
    noCarrinho: Boolean(item.noCarrinho),
  }));
}

function githubApiUrl() {
  const owner = ghOwner.value.trim();
  const repo = ghRepo.value.trim();
  const branch = encodeURIComponent(ghBranch.value.trim() || 'main');
  const path = encodeURIComponent((ghPath.value.trim() || 'data/lista-mercado.json').replace(/^\//, ''));
  if (!owner || !repo) return null;
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
}

async function carregarDoGithub() {
  const url = githubApiUrl();
  if (!url) return false;

  try {
    const resposta = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!resposta.ok) return false;
    const arquivo = await resposta.json();
    const conteudo = atob(arquivo.content.replace(/\n/g, ''));
    itens = normalizarLista(JSON.parse(conteudo));
    salvarLocal();
    renderizar();
    statusSalvar('Lista carregada do GitHub.');
    return true;
  } catch {
    return false;
  }
}

async function salvarNoGithub() {
  const url = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=repo`;
  window.location.href = url;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const quantidade = Number(document.getElementById('quantidade').value);
  const categoria = categoriaSelect.value;
  const valorUnitario = Number(document.getElementById('valor').value);

  if (!nome || quantidade <= 0 || valorUnitario < 0) return;

  itens.push({ id: novoId(), nome, quantidade, categoria, valorUnitario, noCarrinho: false });
  salvarLocal();
  form.reset();
  categoriaSelect.value = categoriasOrdem[0];
  renderizar();
});

salvarArquivoBtn.addEventListener('click', salvarNoGithub);

async function carregarDadosIniciais() {
  await obterTokenOAuth();

  preencherCategorias();
  carregarConfigGithub();
  categoriaSelect.value = categoriasOrdem[0];

  const carregouGithub = await carregarDoGithub();
  if (carregouGithub) return;

  const local = localStorage.getItem('listaMercadoNova');
  if (local) {
    itens = normalizarLista(JSON.parse(local));
    renderizar();
    statusSalvar('Lista carregada do dispositivo (localStorage).', true);
    return;
  }

  try {
    const resposta = await fetch('data/lista-mercado.json');
    if (!resposta.ok) throw new Error('Falha ao ler JSON inicial');
    itens = normalizarLista(await resposta.json());
  } catch {
    itens = [];
  }

  salvarLocal();
  renderizar();
}

carregarDadosIniciais();

