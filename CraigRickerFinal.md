#CS340 Final Project

##Outline
My final project is different than my proposed project in order to reudce the number of many to many relationships, and to increase interest in the project

I will model a very simple company. The company is made up of a collection of buildings, employees, teams, and titles.

Employees have a phone number,gender , a first/last name, SSN, a single title, a single building they work in, and they are assigned to a team.

There is a collection of titles, each title has a description, a yearly salary, and a minimum number of years of experience. Multiple people can have the same title

Teams have a name, a description, associated employees (MANY TO MANY) and an associated building.

Buildings have a name, an address broken down into appropriate datafields (1st line, 2nd line, city, state and zip) and the year purchased.

##ER Diagram

##Schema
![Final Project Schema](schema.png)
##Data Definition Queries

CREATE TABLE title (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  salary INT NOT NULL,
  min_years INT
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE building (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  ad_line1 VARCHAR(255) NOT NULL,
  ad_line2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(255) NOT NULL,
  year_purchased INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE team (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  bid INT NOT NULL,
  FOREIGN KEY (bid) REFERENCES building (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  f_name VARCHAR(255) NOT NULL,
  l_name VARCHAR(255) NOT NULL,
  ssn INT(8) NOT NULL,
  phone VARCHAR(255),
  bid INT NOT NULL,
  FOREIGN KEY (bid) REFERENCES building (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE works_on (
  eid INT,
  tid INT,
  PRIMARY KEY (eid, tid),
  FOREIGN KEY (eid) REFERENCES employee (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (tid) REFERENCES team (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  

##Data Maniuplation Queries
This section contains the MySQL code that drives the website viewing. Do not include javascript. Represent all variables that the user would input.



