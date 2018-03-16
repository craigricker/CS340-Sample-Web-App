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
  FOREIGN KEY (bid) REFERENCES building (id) ON DELETE RESTRICT ON UPDATE CASCADE,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE works_on (
  eid INT,
  tid INT,
  join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (eid, tid),
  FOREIGN KEY (eid) REFERENCES employee (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (tid) REFERENCES team (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;