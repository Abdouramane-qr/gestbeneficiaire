-- Création des tables
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE
);

CREATE TABLE communes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    province_id INT REFERENCES provinces(id) ON DELETE CASCADE
);

-- Insertion des régions
INSERT INTO regions (nom) VALUES
('Boucle du Mouhoun'), ('Cascades'), ('Centre'), ('Centre-Est'), ('Centre-Nord'),
('Centre-Ouest'), ('Centre-Sud'), ('Est'), ('Hauts-Bassins'), ('Nord'),
('Plateau-Central'), ('Sahel'), ('Sud-Ouest');

-- Insertion des provinces
INSERT INTO provinces (nom, region_id) VALUES
('Balé', 1), ('Banwa', 1), ('Kossi', 1), ('Mouhoun', 1), ('Nayala', 1), ('Sourou', 1),
('Comoé', 2), ('Léraba', 2),
('Kadiogo', 3),
('Boulgou', 4), ('Koulpélogo', 4), ('Kouritenga', 4),
('Bam', 5), ('Namentenga', 5), ('Sanmatenga', 5),
('Boulkiemdé', 6), ('Sanguie', 6), ('Sissili', 6), ('Ziro', 6),
('Bazèga', 7), ('Nahouri', 7), ('Zoundwéogo', 7),
('Gnagna', 8), ('Gourma', 8), ('Komondjari', 8), ('Kompiembiga', 8), ('Tapoa', 8),
('Houet', 9), ('Kénédougou', 9), ('Tuy', 9),
('Loroum', 10), ('Passoré', 10), ('Yatenga', 10), ('Zondoma', 10),
('Ganzourgou', 11), ('Kourwéogo', 11), ('Oubritenga', 11),
('Oudalan', 12), ('Séno', 12), ('Soum', 12), ('Yagha', 12),
('Bougouriba', 13), ('Ioba', 13), ('Noumbiel', 13), ('Poni', 13);

-- Insertion de toutes les communes du Burkina Faso
INSERT INTO communes (nom, province_id) VALUES
('Boromo', 1), ('Bagassi', 1), ('Fara', 1), ('Gassan', 1), ('Pompoï', 1), ('Siby', 1),
('Solenzo', 2), ('Balavé', 2), ('Kouka', 2), ('Tansila', 2), ('Sami', 2), ('Sô', 2),
('Nouna', 3), ('Djibasso', 3), ('Dokuy', 3), ('Madouba', 3), ('Sono', 3),
('Dédougou', 4), ('Douroula', 4), ('Kona', 4), ('Ouarkoye', 4), ('Tchériba', 4),
('Toma', 5), ('Gossina', 5), ('Yaba', 5), ('Yé', 5),
('Tougan', 6), ('Di', 6), ('Gomboro', 6), ('Kassoum', 6), ('Kiembara', 6), ('Lanfiéra', 6),
('Banfora', 7), ('Niangoloko', 7), ('Soubakaniédougou', 7), ('Toussiana', 7), ('Mangodara', 7),
('Sindou', 8), ('Douna', 8), ('Kankalaba', 8), ('Loumana', 8), ('Niofila', 8),
('Ouagadougou', 9),
('Tenkodogo', 10), ('Bittou', 10), ('Garango', 10), ('Zabré', 10), ('Boussouma', 10),
('Pouytenga', 11), ('Koupéla', 11), ('Yargatenga', 11),
('Kaya', 12), ('Pissila', 12), ('Dablo', 12), ('Namissiguima', 12),
('Boussé', 13), ('Ziniaré', 13), ('Kokologo', 13), ('Saponé', 13),
('Dori', 14), ('Gorom-Gorom', 14), ('Sebba', 14), ('Djibo', 14),
('Gaoua', 15), ('Diébougou', 15), ('Batié', 15), ('Kampti', 15);
