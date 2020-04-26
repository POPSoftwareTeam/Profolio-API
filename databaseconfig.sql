DROP DATABASE UPLOAD;
create DATABASE UPLOAD;
USE UPLOAD;

CREATE TABLE USER(
    ID int NOT NULL AUTO_INCREMENT,
    EMAIL varchar(255) NOT NULL,
    PASSWORD varchar(255) NOT NULL,
    ROLE varchar(255) NOT NULL,
    EMAILCODE varchar(255),
    PRIMARY KEY (ID),
    UNIQUE KEY unique_email (EMAIL)
);

