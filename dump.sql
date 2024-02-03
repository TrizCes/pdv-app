create database pdv;

create table usuarios (
  id serial primary key,
  nome text not null, 
  email text not null unique,
  senha text not null
 );
  
create table categorias (
  id serial primary key,
  descricao text not null
);

insert into categorias (descricao) 
values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(350) NOT NULL, 
  quantidade_estoque INT NOT NULL,
  valor INT NOT NULL,
  categoria_id INT REFERENCES categorias(id) NOT NULL
 );
 
 CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(350) NOT NULL, 
  email VARCHAR(350) NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  cep VARCHAR(09) NOT NULL,
  rua VARCHAR(550) NOT NULL,
  numero VARCHAR(50) NOT NULL,
  bairro VARCHAR(250) NOT NULL,
  cidade VARCHAR(250) NOT NULL,
  estado VARCHAR(150) NOT NULL
 );

CREATE TABLE pedidos(
id SERIAL PRIMARY KEY,
cliente_id INT REFERENCES clientes(id) NOT NULL,
observacao TEXT,
valor_total INT NOT NULL
);

CREATE TABLE pedido_produtos (
id SERIAL PRIMARY KEY,
pedido_id INT REFERENCES pedidos(id) NOT NULL,
produto_id INT REFERENCES produtos(id) NOT NULL,
quantidade_produto INT NOT NULL,
valor_produto INT NOT NULL
);

ALTER TABLE produtos ADD COLUMN produto_imagem TEXT; 