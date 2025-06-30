Este é a versão **Frontend** do projeto **User-Manipulation**. Utiliza-se **Next** com **Tailwind** com backend separado para melhor manejo de dados.

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Objetivo

Este projeto serviu como parte do meu treinamento de estágio na empresa **BE1 Tecnologia**. Tendo como objetivo a criação de uma interface que permita o manipulamento por **CRUD** de usuários vindos de um banco de dados **PostGreeSQL** junto com **Prisma**.

## Interface

![image](https://github.com/user-attachments/assets/6983cfab-495c-49d5-87c0-d400ffcf2f1b)

Os usuários são dispostos em uma tabela que permite o controlador gerencia-los por meio das operações básicas CRUD através de modais. Além disso, é possível pesquisar usuários pela search bar e controlar o limite de usuários por paginação, que chegam no Backend por **query.params**.

## Guia de Instalação

### 📌 Pré-requisitos

Antes de iniciar o guia de instalação, precisa-se seguir primeiro o passo a passo da API do [Backend](https://github.com/JoaoAugustoTopanotti/Backend-User-Manipulation/blob/main/README.md)

### 📌 Passos para Instalação

#### Passo 1 - Clone o repositório

` https://github.com/JoaoAugustoTopanotti/Frontend-User-Manipulation.git ` <br> <br>
` cd Frontend-User-Manipulation `

#### Passo 2 - Instale as dependências

` yarn install `

#### Passo 3 - Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:

` NEXT_PUBLIC_API_URL=http://localhost:3001 `

#### Passo 5 - Rode o projeto

` yarn dev `
