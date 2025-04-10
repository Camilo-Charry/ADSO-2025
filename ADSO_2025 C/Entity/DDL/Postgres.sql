CREATE TABLE "User"
(
	Id SERIAL PRIMARY KEY,
	UserName VARCHAR(100) nOT NULL ,
	Email VARCHAR(100) NOT NULL UNIQUE,
	Password VARCHAR(100) NOT NULL,
	CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	Active BOOLEAN,
	IsDeleted BOOLEAN,
	PersonId INT UNIQUE
);

CREATE TABLE Person
(
	Id SERIAL PRIMARY KEY,
	FirstName VARCHAR(100) NOT NULL,
	LastName VARCHAR(100) NOT NULL,
	phonenumber VARCHAR(20) NOT NULL,
	Active BOOLEAN,
	IsDeleted BOOLEAN
);

CREATE TABLE RolUser
(
	Id SERIAL PRIMARY KEY,
	RolId INT,
	UserId INT,
	IsDeleted BOOLEAN
);

CREATE TABLE Rol
(
	Id SERIAL PRIMARY KEY,
	Name VARCHAR(100) NOT NULL,
	Description TEXT,
	Active BOOLEAN,
	IsDeleted BOOLEAN
);

CREATE TABLE RolFormPermission
(
	Id SERIAL PRIMARY KEY,
	RolId INT,
	FormId INT,
	PermissionId INT,
	IsDeleted BOOLEAN
);

CREATE TABLE "Permission"
(
	Id SERIAL PRIMARY KEY,
	NAME VARCHAR(100) NOT NULL,
	Description TEXT,
	Active BOOLEAN,
	IsDeleted BOOLEAN
);

CREATE TABLE Form
(
	Id SERIAL PRIMARY KEY,
	NAME VARCHAR(100) NOT NULL,
	Description TEXT,
	CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	Active BOOLEAN,
	IsDeleted BOOLEAN
);

CREATE TABLE FormModule
(
	Id SERIAL PRIMARY KEY,
	ModuleId INT,
	FormId INT,
	IsDeleted BOOLEAN
);

CREATE TABLE "Module"
(
	Id SERIAL PRIMARY KEY,
	Name VARCHAR(100) NOT NULL,
	Description TEXT,
	CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	Active BOOLEAN,
	IsDeleted BOOLEAN
);



-- Relaciones

-- User - Person
ALTER TABLE "User" ADD CONSTRAINT FK_User_Person FOREIGN KEY (PersonId) REFERENCES Person(Id);



-- RolUser - User - Rol
ALTER TABLE RolUser ADD CONSTRAINT FK_RolUser_User FOREIGN KEY (UserId) REFERENCES "User"(Id);
ALTER TABLE RolUser ADD CONSTRAINT FK_RolUser_Rol FOREIGN KEY (RolId) REFERENCES Rol(Id);


-- FormModule - Module -  Form

ALTER TABLE FormModule ADD CONSTRAINT FK_FormModule_Module FOREIGN KEY (ModuleId) REFERENCES "Module"(Id);
ALTER TABLE FormModule ADD CONSTRAINT FK_FormModule_Form FOREIGN KEY (FormId) REFERENCES Form(Id);

-- RolFormPermission - Rol- Form- permission

ALTER TABLE RolFormPermission ADD CONSTRAINT FK_RolFormPermission_Rol FOREIGN KEY (RolId) REFERENCES Rol(Id);
ALTER TABLE RolFormPermission ADD CONSTRAINT FK_RolFormPermission_Form FOREIGN KEY (FormId) REFERENCES Form(Id);
ALTER TABLE RolFormPermission ADD CONSTRAINT FK_RolFormPermission_Permission FOREIGN KEY (PermissionId) REFERENCES "Permission"(Id);