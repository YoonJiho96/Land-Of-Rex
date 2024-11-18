# 포팅 매뉴얼

## 목차
- [개발 환경](#개발-환경)
- [서버 환경](#서버-환경)
- [배포 환경](#배포-환경)
- [데이터베이스](#데이터베이스)
- [특이사항](#특이사항)

## 개발 환경

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

## 서버 환경

### 웹서버
| 항목 | 상세 내용 |
|------|-----------|
| 종류 | Nginx |
| 버전 | 1.24.0 |
| 설정 파일 경로 | /etc/nginx/sites-available/default |
| 주요 설정값 | 
```nginx
server {
   root /usr/share/nginx/html;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name k11e102.p.ssafy.io;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ /index.html;
	}

	location /api/ {
        	proxy_pass http://localhost:8081;  # Spring 서버 주소와 포트
        	proxy_set_header Host $host;
        	proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        	proxy_set_header X-Forwarded-Proto $scheme;
    	}
	# /oauth2/ 경로를 스프링 컨테이너로 프록시
   	location /oauth2/ {
        	proxy_pass http://localhost:8081;  # 스프링 컨테이너 주소
        	proxy_set_header Host $host;
        	proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        	proxy_set_header X-Forwarded-Proto $scheme;
   	}
}
```

## 배포 환경


### 환경변수
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
### ERD
![image.png](./erd.png)



