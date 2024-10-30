drop table topic;

create table topic (
id int NOT NULL auto_increment,
title varchar(30) not null,
descrpt text,
created datetime not null,
author_id int DEFAULT null,
PRIMARY KEY(id)
);

insert topic
values(1,'MySQL','MySQL is Database Name.','2023-09-20',1);

insert topic
values(2,'Node.js','Node.js is runtime of javascript','2023-09-20',1);

insert topic
values(3,'HTML','HTML is Hyper Text Markup Language','2023-09-20',1);

insert topic
values(4,'CSS','CSS is used to decorate HTML Page.','2023-09-20',1);

insert topic
values(5,'express','express is the framework for web service.','2023-09-20',1);

select * from topic;

commit;