-- file: 10-create-user-and-db.sql
CREATE DATABASE persons;
CREATE ROLE program WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE persons TO program;
ALTER ROLE program WITH LOGIN;

CREATE TABLE persons_table (
	id integer CONSTRAINT firstkey PRIMARY KEY,
	name text,
	age integer,
	address text,
	work text,
	CONSTRAINT id_unique UNIQUE(id)
);