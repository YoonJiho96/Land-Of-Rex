-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: k11e102.p.ssafy.io    Database: land_of_rex
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqm52p1v3o13hy268he0wcngr5` (`user_id`),
  KEY `FKs1slvnkuemjsq2kj4h3vhx7i1` (`post_id`),
  CONSTRAINT `FKqm52p1v3o13hy268he0wcngr5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKs1slvnkuemjsq2kj4h3vhx7i1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (2,'2024-11-12 17:20:00.370209','2024-11-12 17:20:00.370209','dfgh',17,4),(3,'2024-11-12 17:58:59.414587','2024-11-12 17:58:59.414587','adsf',17,4),(4,'2024-11-12 17:59:16.619864','2024-11-12 17:59:16.619864','zzz',17,4),(5,'2024-11-13 09:52:42.250692','2024-11-13 09:52:42.250692','댓글내용',17,15),(7,'2024-11-13 12:38:46.848417','2024-11-13 12:38:46.848417','az',17,17),(8,'2024-11-13 15:42:53.931099','2024-11-13 15:42:53.931099','ㅎㅇㅎㅇ',17,31),(9,'2024-11-15 15:28:13.928878','2024-11-15 15:28:13.928878','그만해',35,32),(10,'2024-11-15 15:28:28.721306','2024-11-15 15:28:28.721306','확인',35,65),(11,'2024-11-15 16:50:35.853930','2024-11-15 16:50:35.853930','ㅎㅎ',35,31),(12,'2024-11-18 10:15:51.855412','2024-11-18 10:15:51.855412','테스트',17,69),(13,'2024-11-18 15:29:19.631128','2024-11-18 15:29:19.631128','랭킹 시스템은 시간/죽은 횟수/ 소모 골드량에 따라 달라집니다.',35,76);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patch`
--

DROP TABLE IF EXISTS `patch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patch` (
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patch`
--

LOCK TABLES `patch` WRITE;
/*!40000 ALTER TABLE `patch` DISABLE KEYS */;
INSERT INTO `patch` VALUES ('2024-11-08 16:28:52.530837',7,'2024-11-08 16:28:52.530837','0.0.11');
/*!40000 ALTER TABLE `patch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `dtype` varchar(31) NOT NULL,
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `content` text NOT NULL,
  `status` enum('ACTIVE','DELETED','HIDDEN') DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `importance` enum('HIGH','NORMAL','URGENT') DEFAULT NULL,
  `is_pinned` bit(1) DEFAULT NULL,
  `inquiry_status` enum('CHECKED','IN_PROGRESS','REJECTED','RESOLVED','UNCHECKED') DEFAULT NULL,
  `post_type` enum('ACCOUNT_ISSUE','GAME_FEEDBACK','BUG_REPORT','SUGGESTION') DEFAULT NULL,
  `author_id` bigint NOT NULL,
  `patch_id` bigint DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  UNIQUE KEY `UK87k7judj6gj6f16pweemc9n2y` (`patch_id`),
  KEY `FK1mpebp1ayl0twrwm7ruiof778` (`author_id`),
  CONSTRAINT `FK1mpebp1ayl0twrwm7ruiof778` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKl6jotjyipol888ybaykx79qud` FOREIGN KEY (`patch_id`) REFERENCES `patch` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES ('NOTICE',4,'2024-11-11 17:16:39.839483','2024-11-11 17:16:39.839483','<p>공지사항 테스트 1</p>','ACTIVE','안녕하세요. E102 팀 입니다.','NORMAL',_binary '\0',NULL,NULL,17,NULL),('GENERAL',11,'2024-11-12 16:34:14.955989','2024-11-12 16:34:14.955989','<p>흠흠</p><p><img src=\"blob:https://k11e102.p.ssafy.io/38b56806-9695-4080-9eda-379778085360\" width=\"343\" height=\"331\">ㅇㅇㅇㅇ</p>','ACTIVE','비밀번호 잊어 버림',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',23,NULL),('GENERAL',12,'2024-11-12 16:37:22.287594','2024-11-12 16:37:22.287594','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','ddd',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',23,NULL),('GENERAL',13,'2024-11-12 16:37:49.815183','2024-11-12 16:37:49.815183','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','dddd',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',23,NULL),('GENERAL',14,'2024-11-12 16:37:52.015766','2024-11-12 16:37:52.015766','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','dddd',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',23,NULL),('GENERAL',15,'2024-11-12 16:37:52.870269','2024-11-12 16:37:52.870269','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','dddd',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',23,NULL),('GENERAL',17,'2024-11-13 12:25:23.832865','2024-11-13 12:25:23.832865','<p>비번 까먹음</p>','ACTIVE','비번 까먹었어요',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',17,NULL),('GENERAL',19,'2024-11-13 12:31:19.681150','2024-11-13 12:31:19.681150','<p>bbbb</p>','ACTIVE','bb',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',18,NULL),('GENERAL',20,'2024-11-13 12:31:20.637582','2024-11-13 12:31:20.637582','<p>bbbb</p>','ACTIVE','bb',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',18,NULL),('GENERAL',31,'2024-11-13 14:35:16.906510','2024-11-14 09:10:13.199877','<p>샐<img src=\"blob:http://localhost:5173/5daf709d-0a1f-45f5-9cac-ea1dfa4a7575\" width=\"129\" height=\"124\">러드<img src=\"https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c960f855-51da-4631-bbf9-918b1055e17a_image-1731542968212-0.jpg\" width=\"152\" height=\"130\" data-image-id=\"undefined\" data-mce-src=\"https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c960f855-51da-4631-bbf9-918b1055e17a_image-1731542968212-0.jpg\"></p>','ACTIVE','샐러드',NULL,NULL,'UNCHECKED','BUG_REPORT',17,NULL),('GENERAL',32,'2024-11-13 15:13:41.751715','2024-11-18 11:00:03.218549','<p>qwerqwer</p>','ACTIVE','qwer',NULL,NULL,'IN_PROGRESS','ACCOUNT_ISSUE',30,NULL),('NOTICE',33,'2024-11-13 17:26:21.671727','2024-11-13 17:26:21.671727','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','Land Of Rex 베타 테스트 예정','NORMAL',_binary '\0',NULL,NULL,17,NULL),('NOTICE',34,'2024-11-13 17:31:57.381606','2024-11-13 17:31:57.381606','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','게임 베타 테스트 실시','NORMAL',_binary '\0',NULL,NULL,17,NULL),('NOTICE',35,'2024-11-13 17:36:38.926490','2024-11-13 17:36:38.926490','<p>* 포탑이 공격을 합니다.</p><p>* 튜토리얼 시작 지점이 변경되었습니다.</p>','ACTIVE','0.0.5 버전 업데이트 - 24.11.13','NORMAL',_binary '\0',NULL,NULL,17,NULL),('GENERAL',36,'2024-11-14 10:49:38.303580','2024-11-14 10:55:19.557297','<p><img src=\"blob:http://localhost:5173/6091d248-79ee-4b89-b7fa-b83226d9ae78\">ㅇㅇ<img src=\"https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c39f6c8f-5eef-4156-972e-ee305f549d1a_image-1731548977935-0.jpg\" width=\"200\" height=\"193\" alt=\"\" data-image-id=\"12\" data-mce-src=\"https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c39f6c8f-5eef-4156-972e-ee305f549d1a_image-1731548977935-0.jpg\">ddddd</p><p>ddddddddddddddddddddddddddddddd</p><p><img src=\"https://e102-post-image.s3.ap-northeast-2.amazonaws.com/bc478e04-2947-4eb2-9414-a9ad0ea6bc70_image-1731548977935-1.jpg\" data-image-id=\"13\" data-sequence=\"1731548972095\" width=\"237\" height=\"202\" data-mce-src=\"https://e102-post-image.s3.ap-northeast-2.amazonaws.com/bc478e04-2947-4eb2-9414-a9ad0ea6bc70_image-1731548977935-1.jpg\"></p>','ACTIVE','업데이트',NULL,NULL,'UNCHECKED','SUGGESTION',17,NULL),('NOTICE',41,'2024-11-14 12:30:19.516188','2024-11-14 12:30:19.516188','<p>- 멋진 사운드가 추가 되었습니다.</p><p>&nbsp; - 인트로 배경음</p><p>&nbsp; - 로그인 화면 배경음</p><p>&nbsp; - 로그인 배경음</p><p>&nbsp; - 밤/낮 배경음</p><p>&nbsp; - 밤/낮 전환 효과음</p>','ACTIVE','0.0.6 버전 업데이트 - 24.11.14','NORMAL',_binary '\0',NULL,NULL,17,NULL),('NOTICE',42,'2024-11-14 12:31:05.142599','2024-11-14 12:31:05.142599','<p><br data-mce-bogus=\"1\"></p>','ACTIVE','0.0.7 버전 업데이트 예정','NORMAL',_binary '\0',NULL,NULL,17,NULL),('NOTICE',43,'2024-11-14 12:41:22.566809','2024-11-14 12:41:22.566809','<p>* 튜토리얼 밸런스가 조절 되었습니다.</p>','ACTIVE','0.0.7 버전 업데이트 - 24.11.14','NORMAL',_binary '\0',NULL,NULL,17,NULL),('GENERAL',65,'2024-11-15 14:47:23.044650','2024-11-18 10:01:57.859110','<p>내용<img src=\"blob:https://k11e102.p.ssafy.io/28db612c-8418-4106-abe7-3a0e89bfcacc\" width=\"125\" height=\"107\"></p>','ACTIVE','계정 이슈',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',17,NULL),('NOTICE',67,'2024-11-15 16:23:48.705055','2024-11-15 16:23:48.705055','<p>- 튜토리얼이 업데이트 되었습니다.</p><p>&nbsp; - 유닛을 생성하여 게임을 진행할 수 있습니다.</p><p>&nbsp; - 게임 클리어 UI 는 업데이트 예정입니다.</p>','ACTIVE','0.0.8 버전 업데이트(튜토리얼 업데이트) - 24.11.15','NORMAL',_binary '\0',NULL,NULL,35,NULL),('GENERAL',69,'2024-11-18 09:40:32.648610','2024-11-18 11:00:06.381193','<p>계정 문제 문의하기</p>','ACTIVE','계정 문제',NULL,NULL,'CHECKED','ACCOUNT_ISSUE',17,NULL),('GENERAL',71,'2024-11-18 11:03:25.800566','2024-11-18 11:29:22.456300','<p>언제 업데이트 되나요ㅠ</p>','ACTIVE','게임 문의',NULL,NULL,'UNCHECKED','SUGGESTION',52,NULL),('NOTICE',72,'2024-11-18 12:00:26.480444','2024-11-18 12:00:26.480444','<p>- 튜토리얼, 스테이지1/2 가 업데이트 되었습니다</p><p>- 사운드 설정이 추가 되었습니다.</p>','ACTIVE','0.0.9 버전 업데이트(베타 정식 릴리즈) - 24.11.18','NORMAL',_binary '\0',NULL,NULL,35,NULL),('NOTICE',73,'2024-11-18 12:27:01.371590','2024-11-18 12:27:01.371590','<p>- 튜토리얼 설정 메뉴 추가</p><p>- 가이드 노출 위치 수정</p>','ACTIVE','0.0.10 버전 업데이트(수정) - 24.11.18','NORMAL',_binary '\0',NULL,NULL,35,NULL),('NOTICE',74,'2024-11-18 12:33:55.081386','2024-11-18 12:33:55.081386','<p>- 일부 스테이지의 밸런스가 조정 되었습니다.</p>','ACTIVE','0.0.11 버전 업데이트(밸런스 패치) - 24.11.18','NORMAL',_binary '\0',NULL,NULL,35,NULL),('GENERAL',75,'2024-11-18 14:10:54.553458','2024-11-18 14:10:54.553458','<p>힘든 인간이라는 분은 운영진의 계정으로 의심됩니다.</p><p>해명 부탁드립니다.</p>','ACTIVE','랭킹 조작 의심',NULL,NULL,'UNCHECKED','ACCOUNT_ISSUE',35,NULL),('GENERAL',76,'2024-11-18 15:09:58.656739','2024-11-18 15:29:24.891052','<p>랭킹 문의드립니다.</p>','ACTIVE','튜토리얼',NULL,NULL,'RESOLVED','ACCOUNT_ISSUE',656,NULL),('NOTICE',78,'2024-11-18 15:28:54.757657','2024-11-18 15:28:54.757657','<p>공지사항 테스트</p>','ACTIVE','공지사항 테스트','NORMAL',_binary '\0',NULL,NULL,35,NULL);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `post_image_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `status` enum('UPLOAD_FAIL','UPLOAD_ING','UPLOAD_SUCCESS') DEFAULT NULL,
  `url_cloud` varchar(255) DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  PRIMARY KEY (`post_image_id`),
  KEY `FK4436mqgshkhub17yvq5ku91f7` (`post_id`),
  CONSTRAINT `FK4436mqgshkhub17yvq5ku91f7` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
INSERT INTO `post_images` VALUES (7,'2024-11-12 16:34:15.476207','2024-11-12 16:34:15.476207','image-1731396855197-0.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/2a1a864a-c747-4efa-a524-08c8fa973d80_image-1731396855197-0.jpg',11,0),(10,'2024-11-14 09:09:29.257321','2024-11-14 09:09:29.257321','image-1731542968212-0.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c960f855-51da-4631-bbf9-918b1055e17a_image-1731542968212-0.jpg',31,0),(11,'2024-11-14 09:10:13.116724','2024-11-14 09:10:13.116724','image-1731543012476-0.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c96c3563-26b7-4deb-9928-70b6da4ab5ae_image-1731543012476-0.jpg',31,0),(12,'2024-11-14 10:49:38.876336','2024-11-14 10:49:38.876336','image-1731548977935-0.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/c39f6c8f-5eef-4156-972e-ee305f549d1a_image-1731548977935-0.jpg',36,0),(13,'2024-11-14 10:49:38.894353','2024-11-14 10:49:38.894353','image-1731548977935-1.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/bc478e04-2947-4eb2-9414-a9ad0ea6bc70_image-1731548977935-1.jpg',36,1),(14,'2024-11-14 10:55:19.465790','2024-11-14 10:55:19.465790','image-1731549318809-0.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/0dfaa104-8cdb-40d4-8c0b-a54405804f43_image-1731549318809-0.jpg',36,0),(23,'2024-11-15 15:28:01.717056','2024-11-15 15:28:01.717056','image-1731652080746-0.jpg','UPLOAD_SUCCESS','https://e102-post-image.s3.ap-northeast-2.amazonaws.com/63277087-455d-4bf5-9c57-c96f0548ea2c_image-1731652080746-0.jpg',65,0);
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking` (
  `ranking_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ranking` int DEFAULT NULL,
  `stage_info_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`ranking_id`),
  UNIQUE KEY `UKp240ce2xk3llbha577x7m098k` (`stage_info_id`),
  KEY `FK3fvvh22u2cwktrkpu73la05yp` (`user_id`),
  CONSTRAINT `FK3fvvh22u2cwktrkpu73la05yp` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKfpinl0s2fe9g3y6stpa6qohi6` FOREIGN KEY (`stage_info_id`) REFERENCES `stage_info` (`stage_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=260 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking`
--

LOCK TABLES `ranking` WRITE;
/*!40000 ALTER TABLE `ranking` DISABLE KEYS */;
INSERT INTO `ranking` VALUES (1,'2024-11-08 17:19:15.653467','2024-11-18 12:31:50.656742',1,3,14),(2,'2024-11-13 11:45:59.947697','2024-11-18 16:59:09.780608',6,4,17),(3,'2024-11-14 09:41:44.881782','2024-11-18 16:59:09.780679',7,15,37),(4,'2024-11-14 12:32:05.430770','2024-11-18 16:59:09.780541',5,9,1),(5,'2024-11-14 12:44:44.742408','2024-11-18 14:18:00.895258',9,16,37),(6,'2024-11-14 12:44:49.757662','2024-11-18 12:18:26.694192',2,11,37),(244,'2024-11-18 11:50:42.556938','2024-11-18 17:06:48.132716',2,317,41),(245,'2024-11-18 12:06:17.990486','2024-11-18 15:16:52.307702',2,319,41),(246,'2024-11-18 12:07:25.702379','2024-11-18 17:06:48.132621',1,326,52),(247,'2024-11-18 12:12:58.029004','2024-11-18 16:04:43.255192',12,296,651),(248,'2024-11-18 12:18:26.689487','2024-11-18 15:25:54.054629',1,320,41),(249,'2024-11-18 12:29:47.764816','2024-11-18 16:04:43.255252',13,298,51),(250,'2024-11-18 13:49:15.645777','2024-11-18 16:41:54.874179',4,324,653),(251,'2024-11-18 13:51:08.097916','2024-11-18 16:35:11.681244',6,302,39),(252,'2024-11-18 13:54:54.750647','2024-11-18 17:06:48.132782',3,308,654),(253,'2024-11-18 13:55:52.991892','2024-11-18 16:35:11.681304',7,304,38),(254,'2024-11-18 13:57:31.954819','2024-11-18 16:35:11.681182',5,305,32),(255,'2024-11-18 13:58:43.647467','2024-11-18 16:04:43.255091',11,306,34),(256,'2024-11-18 14:18:00.888332','2024-11-18 16:35:11.681358',8,311,655),(257,'2024-11-18 16:04:43.249307','2024-11-18 16:04:43.254966',10,321,42),(258,'2024-11-18 16:23:41.865763','2024-11-18 16:23:41.870723',3,322,654),(259,'2024-11-18 16:59:09.775633','2024-11-18 16:59:09.780430',4,325,52);
/*!40000 ALTER TABLE `ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stage_info`
--

DROP TABLE IF EXISTS `stage_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stage_info` (
  `stage_info_id` bigint NOT NULL AUTO_INCREMENT,
  `clear_time` float DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `death_count` int DEFAULT NULL,
  `earn_glod` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `spend_gold` int DEFAULT NULL,
  `stage` int DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`stage_info_id`),
  KEY `FKppjwmmb72nnm8vrs9jqprah6` (`user_id`),
  CONSTRAINT `FKppjwmmb72nnm8vrs9jqprah6` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stage_info`
--

LOCK TABLES `stage_info` WRITE;
/*!40000 ALTER TABLE `stage_info` DISABLE KEYS */;
INSERT INTO `stage_info` VALUES (1,130.5,'2024-11-08 17:17:35.310689',3,800,7500,600,1,14),(2,130.5,'2024-11-08 17:19:15.642714',3,800,7500,600,1,14),(3,130.5,'2024-11-08 17:19:34.378158',3,800,8500,600,1,14),(4,180.5,'2024-11-13 11:45:59.836394',2,1000,950,500,1,17),(5,180.5,'2024-11-13 11:50:04.805431',2,1000,950,500,1,17),(6,180.5,'2024-11-14 09:41:44.672670',2,1000,8500,500,1,37),(7,180.5,'2024-11-14 09:46:30.758546',2,1000,9500,500,1,37),(8,180.5,'2024-11-14 10:20:18.082674',2,1000,1050,500,1,37),(9,180.5,'2024-11-14 12:32:05.214705',2,1000,950,500,1,1),(10,180.5,'2024-11-14 12:44:44.621976',2,1000,950,500,0,37),(11,180.5,'2024-11-14 12:44:49.639748',2,1000,950,500,2,37),(12,180.5,'2024-11-14 14:35:41.369534',2,1000,444,500,1,37),(13,180.5,'2024-11-14 14:35:50.279780',2,1000,444,500,1,37),(14,180.5,'2024-11-14 14:53:38.829146',2,1000,111,500,1,37),(15,180.5,'2024-11-14 14:54:39.128982',2,1000,111,500,1,37),(16,389.32,'2024-11-18 09:35:22.364123',0,152,8277,121,0,37),(17,180.5,'2024-11-18 11:20:28.414384',2,1000,950,500,1,1),(18,200,'2024-11-18 11:24:03.328953',2,1000,0,500,1,1),(293,240.465,'2024-11-18 11:50:42.549539',0,121,8449,90,0,41),(294,928.705,'2024-11-18 12:06:17.984993',0,142,8215,91,1,41),(295,399.376,'2024-11-18 12:07:25.697006',0,114,8270,89,0,52),(296,520.552,'2024-11-18 12:12:58.023755',0,88,8207,80,0,651),(297,712.218,'2024-11-18 12:18:26.683996',1,150,3393,140,2,41),(298,1484.86,'2024-11-18 12:29:47.759454',0,153,8072,124,0,51),(299,200,'2024-11-18 12:31:50.647973',2,1000,0,500,1,1),(300,344.233,'2024-11-18 12:42:39.106291',0,143,8313,102,0,52),(301,435.242,'2024-11-18 13:49:15.640324',0,102,8248,91,0,653),(302,317.763,'2024-11-18 13:51:08.092608',0,91,8339,80,0,39),(303,257.601,'2024-11-18 13:54:54.745425',0,109,8419,84,0,654),(304,343.01,'2024-11-18 13:55:52.986086',0,94,8314,82,0,38),(305,297.848,'2024-11-18 13:57:31.949382',0,82,8362,73,0,32),(306,483.117,'2024-11-18 13:58:43.641859',0,74,8223,68,0,34),(307,518.765,'2024-11-18 13:59:23.040119',0,142,8208,116,0,653),(308,226.564,'2024-11-18 13:59:27.463826',0,104,8476,94,0,654),(309,341.555,'2024-11-18 14:08:02.132574',0,126,8316,109,0,32),(310,375.238,'2024-11-18 14:08:52.156859',0,107,8287,79,0,653),(311,357.647,'2024-11-18 14:18:00.882006',0,120,8301,104,0,655),(312,302.938,'2024-11-18 14:31:43.289224',0,150,8356,116,0,52),(313,311.04,'2024-11-18 14:37:03.862524',0,146,8347,121,0,52),(314,279.214,'2024-11-18 14:42:58.775328',0,122,8386,94,0,52),(315,319.474,'2024-11-18 14:48:32.931644',0,156,8338,91,0,52),(316,256.924,'2024-11-18 14:58:27.242838',0,122,8420,73,0,52),(317,221.257,'2024-11-18 15:00:46.744285',0,121,8488,81,0,41),(318,260.494,'2024-11-18 15:03:55.853651',0,122,8414,73,0,52),(319,619.278,'2024-11-18 15:16:52.302192',0,158,8322,83,1,41),(320,522.15,'2024-11-18 15:25:54.048763',0,166,11536,83,2,41),(321,417.262,'2024-11-18 16:04:43.244519',0,64,8258,58,0,42),(322,595.603,'2024-11-18 16:23:41.860232',1,144,6335,52,1,654),(323,275.348,'2024-11-18 16:35:11.670418',0,94,8392,64,0,653),(324,267.224,'2024-11-18 16:41:54.867659',0,94,8404,64,0,653),(325,828.111,'2024-11-18 16:59:09.770035',2,142,3241,131,1,52),(326,327.115,'2024-11-18 17:06:48.121951',0,130,11330,59,0,52);
/*!40000 ALTER TABLE `stage_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `nickname` varchar(10) NOT NULL,
  `password` varchar(60) NOT NULL,
  `email` varchar(30) DEFAULT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `social_id` varchar(100) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','GUEST','USER') DEFAULT NULL,
  `social_type` enum('GOOGLE','KAKAO','NAVER') DEFAULT NULL,
  `username` varchar(12) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=660 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2024-11-01 15:19:43.533256','2024-11-05 16:55:53.437558',1,'관리자','1','pyh007264@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocLkRN3LJEr9EjYCRSP2KyUrBuR8gyOt6GucKsYrpB8yHyP1Q9er=s96-c','115343209020953945431','eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiVVNFUl9JRCI6MSwiZXhwIjoxNzMyMDAyOTUzLCJUT0tFTl9UWVBFIjoiUkVGUkVTSCJ9.YT-AAvQ5GIrd5HdR87955eHYk2HWnRQily6a_6jdCsoghkYesErHBqPUWrPs-goQch_tbSFXfiU66lMsZml0xA','ADMIN','GOOGLE','1'),('2024-11-01 17:44:11.362586','2024-11-06 17:05:33.717998',2,'test','1','ssafye102@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocJS7hr2_V9YId3H26TzNxDwxPEgxQgo746dLioghSFrEHwkUQ=s96-c','105708654751775922020','eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiVVNFUl9JRCI6MiwiZXhwIjoxNzMyMDg5OTMzLCJUT0tFTl9UWVBFIjoiUkVGUkVTSCJ9.K8S1ki9JYrxXbUfjDl7RwlvUhE9gt6xMm7e2JBM6SjrUjZv1iqD0aLnAiBGGU-uAalpCjLGVpu5jXuyC7YTDZA','USER','GOOGLE','2'),('2024-11-05 10:30:32.806069','2024-11-05 11:47:43.597196',6,'윤지호','1','hoyunji@gs.cwnu.ac.kr','https://lh3.googleusercontent.com/a/ACg8ocIXdxFHt9VNu6GbkXzah2mT_R5-OgSdfT7m3WkxijkoOfElPA=s96-c','100219030387150353631','eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwiVVNFUl9JRCI6NiwiZXhwIjoxNzMxOTg0NDYzLCJUT0tFTl9UWVBFIjoiUkVGUkVTSCJ9.ww6Ey7hUa5WS6o6u9ohIUmjq1eN-goEMBQSLyaEEK6Iacb7-LI4mQoElYMPbZCZPOrH1544STv2J6Rg0yQ6mOg','GUEST','GOOGLE','3'),('2024-11-06 11:50:23.243167','2024-11-06 16:43:27.895001',9,'nick2','$2a$10$QC8XMxThSfi7myzEr8d9gO2WPkayHSV/E/oNcE.7omsvOeY9oZrT.',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwiVVNFUl9JRCI6OSwiZXhwIjoxNzMyMDg4NTkzLCJUT0tFTl9UWVBFIjoiUkVGUkVTSCJ9.Ygxnq5yVzv_hu-g24-hq9hEsktSn0HgktoMxtfiDQn0r8cTqe5fzZBzOYtJHUDh0qI_v7fYtvqsOCSDF7xWqcw','USER',NULL,'kkkk'),('2024-11-06 15:19:59.959848',NULL,11,'nick4','$2a$10$Sw4DJRBzIDInHU.0Ou/yKOVEmJRojK.Vyz2AHqC8EedSumHLTT0qS',NULL,NULL,NULL,NULL,'USER',NULL,'aaaa'),('2024-11-06 17:40:49.750850',NULL,12,'nick41','$2a$10$5O2liD6v2bFWHq/TxlVMruB2.oSKvko5h6d9H5mCzvii2YvSC8Xhm',NULL,NULL,NULL,NULL,'USER',NULL,'aaaa1'),('2024-11-06 17:50:25.624486',NULL,13,'nick5','$2a$10$EeXXVCsARiJebNDXiOQVKuZ/ElyEFfGiVdgTpkbLMyDFO3yf4Fxma',NULL,NULL,NULL,NULL,'USER',NULL,'aaaa5'),('2024-11-06 17:50:33.093745','2024-11-08 17:17:14.251081',14,'난최고야','$2a$10$3ERcTzBlpHVLM5Ikr6.dJeGTaDO7GG6dBFVjIU4upK55Zqyhr9GLK',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNCIsIlVTRVJfSUQiOjE0LCJleHAiOjE3MzIyNjM0MzQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.8AW9i111CPV286BRhWHb0XGOy-ufwuC7MbE7tBk9wK-SOeTtBldNk0U1aXCC6ys0HzrBlC9I57R8RHfNLER_1Q','USER',NULL,'yhpark'),('2024-11-06 17:51:13.148549','2024-11-07 10:04:38.885522',15,'야고최난','$2a$10$56ZNtCMHNair2yFz12c2we0OKfAXMooCXZKXGUdOZsebWnR11UjKm',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNSIsIlVTRVJfSUQiOjE1LCJleHAiOjE3MzIxNTEwNzgsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.-1Q4ypR78uFnn-L9kdeLQQ2U6f-lll9a3q4SikQ2lsKyO00uJmIeKK1PIb0Hv4wg_Usw0tWqiILh3LUbqTIVJQ','USER',NULL,'yhpark1'),('2024-11-07 12:09:18.532689','2024-11-11 09:22:22.970814',16,'dd','$2a$10$PtfDXlvuvwQY.wyGZIV9QeIp1iS1Ro3DsgHSBRosIamprpEAuDjsK',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNiIsIlVTRVJfSUQiOjE2LCJleHAiOjE3MzIyNjIwOTMsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.uNojaxUN_oLgth7UJ_xfdB1DRAxin5mRMI8sUhvG7brYz1Yjlu7dAA_Xb2i8Q9UsiQxZH0jRrF6bv2DC8xk1Gw','ADMIN',NULL,'dddd'),('2024-11-11 09:37:12.474664','2024-11-18 17:21:19.315890',17,'nick66','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNyIsIlVTRVJfSUQiOjE3LCJleHAiOjE3MzMxMjc2NzksIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.BIpQ8TNGQ1PrpuZaeWWBtS6iHjeSMTNX-fUWuSqnK9x35kFBeJGLk5laEw32aOiQr11s5sAhmdHwENlfw8IwaQ','USER',NULL,'abc1'),('2024-11-11 16:37:37.859748','2024-11-18 10:14:30.169470',18,'nick01','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOCIsIlVTRVJfSUQiOjE4LCJleHAiOjE3MzMxMDIwNzAsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.tleN5PY-puDKrt3ej5jVuAcJkHWeoMSzckLv3NrSDDJ6hZickhq-8JoxEGatYD0zinV3GNaN97ysmphRH9iCFg','USER',NULL,'abc2'),('2024-11-11 17:05:17.093790',NULL,19,'nick02','1111',NULL,NULL,NULL,NULL,'USER',NULL,'abc3'),('2024-11-11 21:16:19.401762',NULL,20,'nick68','1111',NULL,NULL,NULL,NULL,'USER',NULL,'abc7'),('2024-11-12 09:32:16.860695',NULL,21,'nick60','1111',NULL,NULL,NULL,NULL,'USER',NULL,'abc0'),('2024-11-12 10:00:41.298000','2024-11-12 10:01:02.532473',22,'test1','asdfqwer',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMiIsIlVTRVJfSUQiOjIyLCJleHAiOjE3MzI1ODI4NjIsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.4JF_fZWEsbtrbbnUCuHpAeLzSlSFDCxZNMohhtfBHeidaT-1kkjHZ0HBr6JVv85JFhQMIv1ajaVaK69TVEX6gQ','USER',NULL,'ssafytest1'),('2024-11-12 16:33:15.346138','2024-11-12 16:33:22.839085',23,'abc','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMyIsIlVTRVJfSUQiOjIzLCJleHAiOjE3MzI2MDY0MDIsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.uevsBaPyxaUKzW7TBVdIVHEuEtafRz-NOlb9MPCKHJb7q82FzP1KazWYYaCU5uve5qbpRYETVfnYIBo6ag4iXg','USER',NULL,'abc11'),('2024-11-12 17:49:00.762821','2024-11-12 17:49:05.348147',24,'asdf','asdf',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNCIsIlVTRVJfSUQiOjI0LCJleHAiOjE3MzI2MTA5NDUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.pAuglf-P3rl70S-EJgkzeldrVaJ9KvFNFILg6I4qBPTLYdRBNKjg4D_BUbotvrm9giza19O7i0OyKvkVTHMNzw','USER',NULL,'asdf'),('2024-11-13 11:06:01.692909',NULL,25,'abc1','abc1',NULL,NULL,NULL,NULL,'USER',NULL,'fffff'),('2024-11-13 11:25:39.246312','2024-11-13 11:25:43.857033',26,'asdfasdf','asdfasdf',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNiIsIlVTRVJfSUQiOjI2LCJleHAiOjE3MzI2NzQzNDMsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.FzXBmrgIgAb7uTnhMNNToKi_pqc41cz2EBEBATutRyog7yuBefz-Gh80Hyf4TNYrWES0IarFTK7PRAhWXCoLpQ','USER',NULL,'asdfasdf'),('2024-11-13 11:35:21.070093','2024-11-13 11:35:31.970374',27,'test2','test',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNyIsIlVTRVJfSUQiOjI3LCJleHAiOjE3MzI2NzQ5MzEsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.yPoo6TMCFhiUZbmsHIvIJeO7kuaXUO7m5QhsepoH0EHX_Qdx9LRpu4mifFr7Yq4KLpS3pNSCk3xgF-U1eMKFbw','USER',NULL,'test'),('2024-11-13 12:00:19.544155',NULL,28,'ffdf','asdf',NULL,NULL,NULL,NULL,'USER',NULL,'asdfasdfsad'),('2024-11-13 15:11:59.226011',NULL,29,'asdf1','qwer1234!',NULL,NULL,NULL,NULL,'USER',NULL,'abd1'),('2024-11-13 15:12:47.412807','2024-11-13 15:13:23.112097',30,'asdfqw','0713',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMCIsIlVTRVJfSUQiOjMwLCJleHAiOjE3MzI2ODgwMDMsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.MzYWdml6j8oCM8iDxhq2o1ueDMQlzLhuoHR5wnlMOCKvZg-xRd5-D7-CDKA4z0W6e0ffB49Oj8nIkREurP47Og','USER',NULL,'qwer123'),('2024-11-13 16:13:02.277934','2024-11-13 16:21:44.335594',31,'1111','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMSIsIlVTRVJfSUQiOjMxLCJleHAiOjE3MzI2OTIxMDQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.TtlbaIeqOFlWSz9evLo2udMad14r_BmSq356oKmz2D5W2x9pYqi5AvsKRU4SlDGIFNUoewO8BeixMHIU_Lyukw','USER',NULL,'abcd'),('2024-11-13 16:19:57.768442','2024-11-18 16:36:19.075186',32,'zzhh','zzhh',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMiIsIlVTRVJfSUQiOjMyLCJleHAiOjE3MzMxMjQ5NzksIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.dgn_LL_0OjulKflCiuEZpg4metQEosIdXYp3sF0olEGm4o7Pkwx9aqysyRF56hULIVBiVvND21y82aEAzy8Whw','USER',NULL,'zzhh'),('2024-11-13 16:54:10.456077','2024-11-15 17:12:54.967706',33,'silverhap','ssa1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMyIsIlVTRVJfSUQiOjMzLCJleHAiOjE3MzI4Njc5NzQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.b2u6eKimH1KIb_2IRP-tYXgnB39_0QAOwfpOiPsg6EE9V_8z57mTaSssd6rUs7hdLIB3QONg3WoDlaNiAaoHBA','USER',NULL,'silverhappy'),('2024-11-13 16:59:03.589227','2024-11-18 13:50:35.015361',34,'컨설턴트','3442',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNCIsIlVTRVJfSUQiOjM0LCJleHAiOjE3MzMxMTUwMzUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.Xr2uo3cyCqItcwzEvwmWAGoMm2VFbUKz9ccyj0xiSijsN82U_yY2d_gYrcljRRUy7GQyT5pLxpdHdHfHStWUsQ','USER',NULL,'ykjeong'),('2024-11-14 08:57:30.321876','2024-11-18 17:18:09.501253',35,'admin','admin102k',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNSIsIlVTRVJfSUQiOjM1LCJleHAiOjE3MzMxMjc0ODksIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.P-P9V2ZJB1Vk_TFeWyZykDrDoPcva6mgL9cddHVq5-LXQI4xOgE1yxwWp8TDXSxxH3kfhhRTCAZjktJnsf4Xzg','ADMIN',NULL,'admin'),('2024-11-14 09:36:33.006179',NULL,36,'nick6000','1111',NULL,NULL,NULL,NULL,'USER',NULL,'abc00'),('2024-11-14 09:38:38.904290','2024-11-18 14:15:41.011392',37,'lhj1','lhj1',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNyIsIlVTRVJfSUQiOjM3LCJleHAiOjE3MzMxMTY1NDEsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.IKByRCfnYBQHa-x6kT6MMOfEnI1ZKwaOB7zDEZaJNhj_weEc_pd9_csW8G8S96xg7VSgxRR1BbQWth683UHBiA','USER',NULL,'lhj1'),('2024-11-14 13:43:01.363513','2024-11-18 13:50:05.735522',38,'qwer','qwer',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOCIsIlVTRVJfSUQiOjM4LCJleHAiOjE3MzMxMTUwMDUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.sLUMi2SheYrQh28u4HG8qQ-hWql8iUQAF0Fl2g3uW268Ss3z_lENpv7i_8ZV2t3BtXYS9n56mF9fNxMqtPBEMA','USER',NULL,'qwer'),('2024-11-14 13:45:12.269371','2024-11-18 13:45:43.207748',39,'jongduck','1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzOSIsIlVTRVJfSUQiOjM5LCJleHAiOjE3MzMxMTQ3NDMsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.314hxRJFoqL0PUPkOrmOCEsMhMTaSsWrOeOyD5mnLFjL_IeLRduUkKxpN9R6A_dTa6kJtoIOic_giRzUYwfThQ','USER',NULL,'jongduckbabo'),('2024-11-14 13:54:32.442091','2024-11-14 13:57:25.200668',40,'2511abab','2511abab',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MCIsIlVTRVJfSUQiOjQwLCJleHAiOjE3MzI3Njk4NDUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.6LX_bi24OjTw6EoCSynB6iDgK4iJq9Rv0OXGGJbCvPnhU92yDtrakJ4eiv9T1HIyu2OwYJvQnflbTX0Al6Hvtw','USER',NULL,'hwlove99'),('2024-11-15 09:17:47.009505','2024-11-18 14:56:44.625236',41,'힘든인간','926511as!',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MSIsIlVTRVJfSUQiOjQxLCJleHAiOjE3MzMxMTkwMDQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.IqfWEXd39pSpLrCKZmZT_3TBABNwFu3K6raOl5E9EaA3fFk5BK-pkT1tIEyP3i-Rrb9gjGlb07mAqzqCSJNebw','USER',NULL,'kimyeong3732'),('2024-11-15 11:18:52.243967','2024-11-18 15:41:15.435457',42,'asdf12','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIlVTRVJfSUQiOjQyLCJleHAiOjE3MzMxMjE2NzUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.jZ3_vwC-Xou1onyQJDUkaH2BsYBoT88lzEEkhxUR0ZhsaDeDMSwXpKE78h7cBVPVVuRsmVmqmzFAtvhMJUPP4A','USER',NULL,'abc111'),('2024-11-15 11:26:43.930098',NULL,43,'내가짱이야','ssafm123',NULL,NULL,NULL,NULL,'USER',NULL,'ssam'),('2024-11-15 11:27:10.664765','2024-11-15 11:27:16.305352',44,'내가짱이야12','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NCIsIlVTRVJfSUQiOjQ0LCJleHAiOjE3MzI4NDcyMzYsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.pw8fr6S_6u7kWNMS1kypY0pMECDp6HEFaOxfRAOH3GCLtQ23c2kej47GRRVJeEY4uQv-M35r3MgAL2EChLIQAg','USER',NULL,'ssam1'),('2024-11-15 11:27:41.393146','2024-11-15 11:28:05.743036',45,'내가짱이야2','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NSIsIlVTRVJfSUQiOjQ1LCJleHAiOjE3MzI4NDcyODUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.1MD76ESyuBe3HEvxQAd_AUd1YYmyMk20zkj5qGwE_BklJUgdbNSnTngkP-axF6xHQCxju6Z9mCELJPQHDhD3dw','USER',NULL,'ssam2'),('2024-11-15 11:33:25.512550','2024-11-17 15:11:14.152621',46,'내가짱이야23','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NiIsIlVTRVJfSUQiOjQ2LCJleHAiOjE3MzMwMzM0NzQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.1bnrdRoRJhTBLSO7fZTdQRpXxujO3_JIZg_P1kzHWmRWk4yuQhjT3ZV81B_C0yUAlPX_AMIHfDmxt0Y8q16aDw','USER',NULL,'ssam3'),('2024-11-15 11:43:38.219898','2024-11-15 11:43:44.651578',47,'내가짱이야123','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NyIsIlVTRVJfSUQiOjQ3LCJleHAiOjE3MzI4NDgyMjQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.jI8l7jhkvfrDY4nWw7zwTJAHA7zOPU_pYnFtrnfnliL8WyodrsO0mtOebpuufIRrq6x68n4CTLTJusN_k54FkA','USER',NULL,'ssam4'),('2024-11-15 13:20:30.372636','2024-11-15 13:23:25.226770',48,'정진우','qwerty123',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OCIsIlVTRVJfSUQiOjQ4LCJleHAiOjE3MzI4NTQyMDUsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.dmcQugsuxXQ0iaEBnmIqDOfTVbMj0KVNvpzJqtCV7eChDEMW8zy69MLkR7tIIwSJYPraxXn7D9QGHg58LLQ4GQ','USER',NULL,'sing0512'),('2024-11-15 14:11:15.919542','2024-11-15 14:13:58.911872',49,'ronaldo','qwer1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OSIsIlVTRVJfSUQiOjQ5LCJleHAiOjE3MzI4NTcyMzgsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.F2X9Z0YVfrT2nB8OLB_6qwsecw9BcQGNCXhG7j6OooP6wDgBpwEg3ZW0goa3XhSAc9FX3RISXUOjpCcQPJqpYQ','USER',NULL,'eungae'),('2024-11-15 16:23:58.360364','2024-11-15 16:24:04.183328',50,'유아이','asdf',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MCIsIlVTRVJfSUQiOjUwLCJleHAiOjE3MzI4NjUwNDQsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.ebLjiV2TP6kJxmSTuolYIl-JSVkU0xv7bsAuGUiPPn_K5RGpAFeaPkufrVb3wRg6ko2jrZmH7pzWla4HGPoPgA','USER',NULL,'wrson'),('2024-11-18 09:41:49.580594','2024-11-18 15:02:39.470933',51,'ui','xptmxm1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MSIsIlVTRVJfSUQiOjUxLCJleHAiOjE3MzMxMTkzNTksIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.K1Pn4O4lAOicKYRX3sLh0tQeaSWRWB0eHIqvBLHRsdNc3IW26lnuJgg5mLiAnn0z_mNT800MUuG6d6_PZbS43w','USER',NULL,'wrson1'),('2024-11-18 11:03:05.862244','2024-11-18 16:45:11.402703',52,'맛있는치킨','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MiIsIlVTRVJfSUQiOjUyLCJleHAiOjE3MzMxMjU1MTEsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.ssrin8OUdKuq-OyP9N9ml0Cfhtgs7eeBtcRwEYj5Hm3cb2c8vXqkLxdrKxuoumwPInI5RE0cCaImYS7u81lNpw','USER',NULL,'summer123'),('2024-11-18 11:12:18.716975','2024-11-18 11:12:27.199721',53,'abcd','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MyIsIlVTRVJfSUQiOjUzLCJleHAiOjE3MzMxMDU1NDcsIlRPS0VOX1RZUEUiOiJSRUZSRVNIIn0.-yv2BytvW3clBeN6wtawPGzpjSTl6KjEhPzdYRL6LTYqCrEhmxPmuwwwDrQJ73gURHTm2AvQb9m4NFnDgSnQvg','USER',NULL,'abab'),('2024-11-18 12:00:32.262859','2024-11-18 12:14:46.152817',651,'socoach','ssafy',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTEiLCJVU0VSX0lEIjo2NTEsImV4cCI6MTczMzEwOTI4NiwiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.q55lbKJsBS8CbX--pKVl-WfjzD8gcApCq0WJc260m9UHzgMyQT9zbEZODqJX2C6otTHKd0qRhhMNCwDzDHSdjA','USER',NULL,'socoach'),('2024-11-18 12:01:38.851929','2024-11-18 12:22:13.410613',652,'silver','ssa1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTIiLCJVU0VSX0lEIjo2NTIsImV4cCI6MTczMzEwOTczMywiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.SgwUiuQJZo1_6kT_48hdHzQ1jhdvI14ti-cPVzp41PLOvyKN4YXgEsiFmu7Dhg703MN0iDsnsoNo7L25N4drFg','USER',NULL,'silver'),('2024-11-18 13:34:00.562895','2024-11-18 16:43:25.510618',653,'캬영수','1q2w3e4r!',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTMiLCJVU0VSX0lEIjo2NTMsImV4cCI6MTczMzEyNTQwNSwiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.V0szUT6OGOuZPhDtKxFXdXonh-jcSrPpXaWJo7l-OFJ3AYkLkolL8yH6oGKqk9MZ_IJIog71O2NBITpLrWWomw','USER',NULL,'hwk216'),('2024-11-18 13:50:10.274932','2024-11-18 15:58:22.580133',654,'호떡장사12년','test123',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTQiLCJVU0VSX0lEIjo2NTQsImV4cCI6MTczMzEyMjcwMiwiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.e4c-05BM9X9QOJ8TO9iwalQwN1avRZexTYcZEN1hmyDtMOJ8mJ3xPZlT1EhM2V2YyOzZlo1ZJwxv6cUBBQ9OZQ','USER',NULL,'joatcode'),('2024-11-18 13:57:06.966594','2024-11-18 14:12:00.610342',655,'guniFF','1q2w3e4r@',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTUiLCJVU0VSX0lEIjo2NTUsImV4cCI6MTczMzExNjMyMCwiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.TABeXhxnRZwcEduAq5jfb027nTg3Il_zOTNTjajonrgVaz6Xmy45cVWYL9y80d7mJ71e-pGggdypYMzLlA66_Q','USER',NULL,'guniFF'),('2024-11-18 15:09:06.805591','2024-11-18 15:09:13.150023',656,'치킨맛마라','qwer1234!',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTYiLCJVU0VSX0lEIjo2NTYsImV4cCI6MTczMzExOTc1MywiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.rtCmXZ-B7E6WbbUxHRymJANJSlMk22byEq9f93nMrZo1elpAx1-M_NFiSQyZL4bXuzfb7Va5TAs45NtrjlVD7Q','USER',NULL,'lol123'),('2024-11-18 15:24:58.368494','2024-11-18 15:25:04.620685',657,'치킨맛마라맛','qwer1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTciLCJVU0VSX0lEIjo2NTcsImV4cCI6MTczMzEyMDcwNCwiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.LVINlAsVmDfamxzzeT9Z5JR0lgX5JAOgIgdHProTU6X5JxhmmoibI6ByWBRZH37G_CsZwrQBMPYfypAC5NdZAg','USER',NULL,'abc12'),('2024-11-18 15:39:25.298810','2024-11-18 15:39:38.659342',658,'nick11','1111',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTgiLCJVU0VSX0lEIjo2NTgsImV4cCI6MTczMzEyMTU3OCwiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.CwU1w0OOUSIgoaw-d-vWpp8JGRcj1Ovs5-TBzMJBq7LF7lNGlwpdB7hRToHpnbb5C4EwdnzIgoFK26xFv6NK5A','USER',NULL,'abc1111'),('2024-11-18 16:38:53.224916','2024-11-18 16:42:17.930425',659,'진라면','qwer1234',NULL,NULL,NULL,'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTkiLCJVU0VSX0lEIjo2NTksImV4cCI6MTczMzEyNTMzNywiVE9LRU5fVFlQRSI6IlJFRlJFU0gifQ.LUCN-Czpaj71onRdPUAGAlpKwbGAug0AH190rb5ZsWRpQkAkKwdCyu1U-C8mu0-23sIvTdtISmU4QBLjcxA69A','USER',NULL,'jah0118');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-18 17:22:19
