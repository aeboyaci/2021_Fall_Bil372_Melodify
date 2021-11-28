CREATE TABLE `activity` (
  `ActivityID` int NOT NULL AUTO_INCREMENT,
  `Date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ActivityType` int NOT NULL,
  `DoneByUserID` int NOT NULL,
  `RecordID` int NOT NULL,
  PRIMARY KEY (`ActivityID`),
  KEY `activity_fk1` (`DoneByUserID`),
  KEY `activity_fk2` (`RecordID`),
  CONSTRAINT `activity_fk1` FOREIGN KEY (`DoneByUserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `activity_fk2` FOREIGN KEY (`RecordID`) REFERENCES `record` (`RecordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `album` (
  `SongListID` int NOT NULL,
  `CreatorID` int NOT NULL,
  KEY `album_fk1` (`SongListID`),
  KEY `album_fk2` (`CreatorID`),
  CONSTRAINT `album_fk1` FOREIGN KEY (`SongListID`) REFERENCES `songlist` (`SongListID`),
  CONSTRAINT `album_fk2` FOREIGN KEY (`CreatorID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `audiobook` (
  `RecordID` int NOT NULL,
  `Author` varchar(255) NOT NULL,
  `VoiceActor` varchar(255) NOT NULL,
  PRIMARY KEY (`RecordID`),
  CONSTRAINT `audiobook_fk1` FOREIGN KEY (`RecordID`) REFERENCES `record` (`RecordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comment` (
  `CommentID` int NOT NULL AUTO_INCREMENT,
  `Content` text NOT NULL,
  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ConsumerID` int NOT NULL,
  `RecordID` int NOT NULL,
  PRIMARY KEY (`CommentID`),
  KEY `comment_fk1` (`ConsumerID`),
  KEY `comment_fk2` (`RecordID`),
  CONSTRAINT `comment_fk1` FOREIGN KEY (`ConsumerID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `comment_fk2` FOREIGN KEY (`RecordID`) REFERENCES `record` (`RecordID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `contains` (
  `SongListID` int NOT NULL,
  `SongID` int NOT NULL,
  `Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `contains_fk2` (`SongID`),
  KEY `contains_fk1` (`SongListID`),
  CONSTRAINT `contains_fk1` FOREIGN KEY (`SongListID`) REFERENCES `songlist` (`SongListID`),
  CONSTRAINT `contains_fk2` FOREIGN KEY (`SongID`) REFERENCES `song` (`RecordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `follows` (
  `FollowerID` int NOT NULL,
  `FollowedID` int NOT NULL,
  KEY `follows_fk1` (`FollowerID`),
  KEY `follows_fk2` (`FollowedID`),
  CONSTRAINT `follows_fk1` FOREIGN KEY (`FollowerID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `follows_fk2` FOREIGN KEY (`FollowedID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `genre` (
  `GenreID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`GenreID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lyrics` (
  `LyricsID` int NOT NULL AUTO_INCREMENT,
  `Content` text NOT NULL,
  PRIMARY KEY (`LyricsID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `playlist` (
  `SongListID` int NOT NULL,
  `PlaylistType` int NOT NULL,
  `ConsumerID` int NOT NULL,
  KEY `playlist_fk1` (`SongListID`),
  KEY `playlist_fk2` (`ConsumerID`),
  CONSTRAINT `playlist_fk1` FOREIGN KEY (`SongListID`) REFERENCES `songlist` (`SongListID`),
  CONSTRAINT `playlist_fk2` FOREIGN KEY (`ConsumerID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `podcast` (
  `RecordID` int NOT NULL,
  `Host` varchar(255) NOT NULL,
  `Guest` varchar(255) DEFAULT NULL,
  `Topic` text NOT NULL,
  PRIMARY KEY (`RecordID`),
  CONSTRAINT `podcast_fk1` FOREIGN KEY (`RecordID`) REFERENCES `record` (`RecordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `record` (
  `RecordID` int NOT NULL AUTO_INCREMENT,
  `RecordFile` text NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Duration` float NOT NULL,
  `PublishDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `GenreID` int NOT NULL,
  `CreatorID` int NOT NULL,
  `RecordPic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `record_fk1` (`GenreID`),
  KEY `record_fk2` (`CreatorID`),
  CONSTRAINT `record_fk1` FOREIGN KEY (`GenreID`) REFERENCES `genre` (`GenreID`),
  CONSTRAINT `record_fk2` FOREIGN KEY (`CreatorID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `song` (
  `RecordID` int NOT NULL,
  `Singer` varchar(255) NOT NULL,
  `LyricsID` int NOT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `song_fk2` (`LyricsID`),
  CONSTRAINT `song_fk1` FOREIGN KEY (`RecordID`) REFERENCES `record` (`RecordID`),
  CONSTRAINT `song_fk2` FOREIGN KEY (`LyricsID`) REFERENCES `lyrics` (`LyricsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `songlist` (
  `SongListID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `PublishDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SongListPic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`SongListID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `UserType` int NOT NULL,
  `ProfilePic` text,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
