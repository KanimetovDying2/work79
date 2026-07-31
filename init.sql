SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS places;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categories (
    id int auto_increment primary key,
    name varchar(255) not null,
    description varchar(255) null
);

CREATE TABLE places (
    id int auto_increment primary key,
    name varchar(255) not null,
    description varchar(255) null
);

CREATE TABLE items (
    id int auto_increment primary key,
    category_id int not null,
    place_id int not null,
    name varchar(255) not null,
    description varchar(255) null,
    photo varchar(255) null,
    created_at datetime not null DEFAULT CURRENT_TIMESTAMP,
    constraint items_categories_id_fk foreign key (category_id) references categories (id),
    constraint items_places_id_fk foreign key (place_id) references places (id)
);

INSERT INTO categories (name, description) VALUES ('Мебель', 'Стулья, столы');
INSERT INTO categories (name, description) VALUES ('Компьютеры', 'Ноутбуки, мониторы');

INSERT INTO places (name, description) VALUES ('Кабинет директора', 'Главный офис');
INSERT INTO places (name, description) VALUES ('Бишкек Офис 001', 'Рабочая зона');

INSERT INTO items (category_id, place_id, name, description, created_at)
VALUES (2, 1, 'Ноутбук HP Probook 450', 'Белый ноутбук', NOW());