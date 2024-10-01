FROM node:20-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    locales

# 한국어 UTF-8 로케일 생성
RUN locale-gen ko_KR.UTF-8

# 환경 변수 설정
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR:kr
ENV LC_ALL ko_KR.UTF-8
ENV NODE_ENV production
ENV TZ Asia/Seoul

# package.json과 yarn.lock만 복사하여 의존성 설치
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --production

# 모든 소스 파일을 복사
COPY . .

# 빌드 명령 실행
RUN yarn build

# 앱이 사용하는 포트 설정
EXPOSE 4000

# 애플리케이션 시작 명령
CMD node ./dist/main.js
