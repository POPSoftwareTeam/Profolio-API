  
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


CREATE TABLE PHOTO(
    ID int NOT NULL AUTO_INCREMENT,
    OWNER_ID int NOT NULL,
    FILENAME varchar(255),
    TITLE varchar(255),
    PRIMARY KEY (ID),
    FOREIGN KEY (OWNER_ID) REFERENCES USER(ID) ON DELETE CASCADE,
    CONSTRAINT USER_FILENAME UNIQUE (OWNER_ID,FILENAME)
);

CREATE TABLE USER_PHOTO(
    USER_ID int not null,
    PHOTO_ID int not null,
    PERMISSION varchar(255) NOT NULL,
    PRIMARY KEY (USER_ID,PHOTO_ID),
    UNIQUE KEY only_one_photo_user(USER_ID,PHOTO_ID),
    FOREIGN KEY (USER_ID) REFERENCES USER(ID) ON DELETE CASCADE,
    FOREIGN KEY (PHOTO_ID) REFERENCES PHOTO(ID) ON DELETE CASCADE
);

CREATE TABLE GALLERY(
    ID int NOT NULL AUTO_INCREMENT,
    OWNER_ID int NOT NULL,
    NAME varchar(255),
    DESCRIPTION varchar(255),
    PRIMARY KEY(ID),
    UNIQUE KEY only_one_gallery_name(OWNER_ID,NAME),
    FOREIGN KEY (OWNER_ID) REFERENCES USER(ID) ON DELETE CASCADE
);

CREATE TABLE GALLERY_PHOTO(
    GALLERY_ID int NOT NULL,
    PHOTO_ID int NOT NULL,
    PRIMARY KEY(GALLERY_ID,PHOTO_ID),
    FOREIGN KEY(GALLERY_ID) REFERENCES GALLERY(ID) ON DELETE CASCADE,
    FOREIGN KEY(PHOTO_ID) REFERENCES PHOTO(ID) ON DELETE CASCADE
);

CREATE TABLE USER_GALLERY(
    USER_ID int NOT NULL,
    GALLERY_ID int NOT NULL,
    PRIMARY KEY(GALLERY_ID,USER_ID),
    FOREIGN KEY(GALLERY_ID) REFERENCES GALLERY(ID) ON DELETE CASCADE,
    FOREIGN KEY(USER_ID) REFERENCES USER(ID) ON DELETE CASCADE
);