# 🎮 Land Of Rex 포팅 메뉴얼

## 🕹️ 게임

### Unity

| 항목 | 버전 |
|------|------|
| Unity | 6000.0.23f1 |

### 실행 방법

- 유니티 Editor에서 빌드
    - File -> Build Profiles -> Windows  -> Build
    - LandOfRex 폴더에 빌드
    - 빌드된 유니티 파일 실행

## 🚀 Game Launcher

### 프레임워크
| 항목     | 버전   |
|----------|--------|
| Electron | 33.0.1 |

### 라이브러리
| 항목             | 버전     |
|------------------|----------|
| electron-builder | 24.3.0 |
| electron-updater | 6.3.9    |
| aws-sdk          | 2.1691.0 |
| dotenv           | 16.4.5   |
| node-fetch       | 3.3.2    |

### 환경 변수 - **.env**
```.env
AWS_ACCESS_KEY_ID= 
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
GAME_FOLDER_NAME=
GAME_LOCAL_FOLDER_NAME=
GAME_EXE_NAME=
```
* Root 디렉터리에 .env 환경 변수 작성

### 실행
```
npm i
npm run start
```

### 빌드
```
npm i
npm run build
```

## 💻 Backend

### IDE
| 항목 | 버전 | 설정값 |
|------|------|--------|
| IntelliJ IDEA | 2024.1.4 | - Java 21 <br> - Encoding: UTF-8 |

### JVM
| 항목 | 버전 |
|------|------|
| BellSoft Liberica | 21.0.3 |

### 프레임워크
| 항목 | 버전 |
|------|------|
| Spring Boot | 3.3.5 |
| Spring Security | 6.3.4 |

### 환경변수 - **application.yml**
```yml
# application.yml 설정
spring:
  application:
    name: landOfRex
  servlet:
    multipart:
      max-file-size: 2MB
      max-request-size: 2MB
      enabled: true

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        time_zone: Asia/Seoul
        default_batch_fetch_size: 10
        format_sql: true
        jdbc:
          lob:
            non_contextual_creation: true
#        show_sql: true

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://k11e102.p.ssafy.io:3306/land_of_rex?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
    username: 비밀
    password: 비밀
    hikari: # HikariCP
      maximum-pool-size: 10 
    
logging.level:
  org.hibernate.SQL: debug
  org.hibernate.orm.jdbc.bind: trace

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    prometheus:
      enabled: true
jwt:
  secretKey: 비밀
  access:
    expiration: 3600000 # 1시간(60분) (1000L(ms -> s) * 60L(s -> m) * 60L(m -> h))
    header: Authorization

  refresh:
    expiration: 1209600000 #  (1000L(ms -> s) * 60L(s -> m) * 60L(m -> h) * 24L(h -> 하루) * 14(2주))
    header: Authorization-refresh

cloud:
  aws:
    s3:
      minIO:
        access-key: 비밀     # MinIO의 액세스 키
        secret-key: 비밀   # MinIO의 시크릿 키
        region: ap-northeast-2 # MinIO에서 사용하는 리전 설정 (임의 값)
      post-image:
        access-key: 비밀
        secret-key: 비밀
        bucket: 비밀
        bucket-url: https://비밀.s3.region.amazonaws.com
      app:
        access-key: 비밀
        secret-key: 비밀
        bucket: 비밀
        bucket-url: https://비밀.s3.region.amazonaws.com

    region:
      name: ap-northeast-2
    stack:
      auto: false
```

## 🎨 Frontend

### 프레임워크
| 항목 | 버전 |
|------|------|
| React | 18.3.1 |

### 빌드
```
npm i
npm run build
```

## 🎬 시연 시나리오
### 1. 시나리오1
1. 로그인
<img src="../docs/Image/Scenario/1.png">

2. 게임 로비 맵
<img src="../docs/Image/Scenario/2.png">

3. 스테이지 선택
<img src="../docs/Image/Scenario/3.png">

4. 캐릭터 움직이기
<img src="../docs/Image/Scenario/4.png">

5. 건물 짓기
<img src="../docs/Image/Scenario/5.png">

6. 병과 선택하기
<img src="../docs/Image/Scenario/6.png">

7. 유닛 뽑기
<img src="../docs/Image/Scenario/7.png">

8. 몬스터 웨이브 막기
<img src="../docs/Image/Scenario/8.png">

9. 건물 업그레이드 하기
<img src="../docs/Image/Scenario/9.png">

10. 환경요소로 몬스터 저지하기
<img src="../docs/Image/Scenario/10.png">
<img src="../docs/Image/Scenario/11.png">

11. 스테이지 클리어
<img src="../docs/Image/Scenario/12.png">



### 2. 시나리오2
1. 랭킹 확인
<img src="../docs/Image/Scenario/3.png">

2. 런처로 게임 실행
<img src="../docs/Image/Scenario/13.png">