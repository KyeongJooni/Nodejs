drop table author;

CREATE TABLE author (
   id int NOT NULL AUTO_INCREMENT,
   name varchar(20) NOT NULL,
   profile varchar(200) DEFAULT NULL,
   PRIMARY KEY (id)
);

insert into author(name,profile) values('김서울', 'scientist');
insert into author(name,profile) values('이부산', 'columnist');

select * from author;


