use webdb2024;
create table schedule05 (
id int NOT NULL auto_increment,
title varchar(50) not null,
start varchar(8) not null,
end  varchar(8) not null,
content text,
created datetime not null,
PRIMARY KEY(id)
);

select * from schedule05;

