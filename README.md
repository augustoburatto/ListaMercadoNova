# ListaMercadoNova

Site de lista de mercado em HTML/CSS/JS, pronto para GitHub Pages.

## Funcionalidades

- Colunas: **Nome do item, Quantidade, Categoria, Valor unitário, Valor total, Carrinho e Remover**.
- Inclusão de novos itens.
- Edição em linha de **quantidade, categoria e valor unitário**, com recálculo automático.
- Ordenação por categoria: **Higiene, Mercearia, Congelados, Hortifruti, Outros**.
- Total geral dinâmico.
- Layout moderno e responsivo (web/mobile).
- Botão **Salvar e atualizar GitHub** para persistir o arquivo `data/lista-mercado.json` no repositório.

## Compartilhamento entre dispositivos (sem banco)

- Ao abrir o app, ele tenta carregar a lista diretamente do arquivo JSON no GitHub.
- Ao clicar em **Salvar e atualizar GitHub**, o app faz commit do JSON atualizado usando a API do GitHub.
- Assim, se você salvar pelo computador, ao abrir no celular verá os mesmos dados atualizados.

## Como configurar

1. Preencha na seção de configuração:
   - Owner
   - Repositório
   - Branch
   - Caminho (`data/lista-mercado.json`)
   - Token GitHub com permissão de escrita no repositório
2. Clique em **Salvar e atualizar GitHub**.

> Observação: por ser um site estático, o token é informado no cliente (navegador). Use token com escopo mínimo necessário.

## Publicar no GitHub Pages

1. Suba o projeto para o GitHub.
2. Acesse **Settings > Pages**.
3. Selecione:
   - **Source**: Deploy from a branch
   - **Branch**: `main` e pasta `/root`
4. URL esperada:
   - `https://SEU_USUARIO.github.io/ListaMercadoNova/`
