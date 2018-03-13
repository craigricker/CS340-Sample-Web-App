# CS340 Final Project

## Outline
My final project is different than my proposed project in order to reudce the number of many to many relationships, and to increase interest in the project

I will model a very simple company. The company is made up of a collection of buildings, employees, teams, and titles.

Employees have a phone number, a first/last name, SSN, a single title, they must work in a single building, and they are assigned to at least one team.

There is a collection of titles, each title has a description, a yearly salary, and a minimum number of years of experience. Multiple people can have the same title

Teams have a name, a description, associated employees (MANY TO MANY) and must be associated with a building. An empty team cannot exist.

Buildings have a name, an address broken down into appropriate datafields (1st line, 2nd line, city, state and zip) and the year purchased. A building can exist without having any active employee or teams working there.

## ER Diagram
![Final Project ER Diagram](ERdiagram.png)
## Schema
![Final Project Schema](schema.png)
## Data Definition Queries

```
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
  tid INT NOT NULL,
  FOREIGN KEY (bid) REFERENCES building (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (tid) REFERENCES title (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE works_on (
  eid INT,
  tid INT,
  PRIMARY KEY (eid, tid),
  FOREIGN KEY (eid) REFERENCES employee (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (tid) REFERENCES team (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
  

## Data Maniuplation Queries
This section contains the MySQL code that drives the website viewing. Do not include javascript. Represent all variables that the user would input.

## Project Observations

## Project link
My final project can be found at this link.

## Thank you
I wanted to thank botht the professor, and all the hard working TA's. I think it is important to acknolwedge that the skeleton of this project was forked from the [Professor's example code](https://github.com/wolfordj/CS340-Sample-Web-App).


