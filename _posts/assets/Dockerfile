FROM centos:7.7.1908
MAINTAINER zhouda@2144.cn

WORKDIR /root

# 依赖包和sshd配置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && mkdir -p .ssh php /app/data/site /app/local/nginx/conf/vhosts \
    && yum install -y procps-ng iproute net-tools less wget bzip2 \
    openssh-clients openssh-server \
    gcc gcc-c++ autoconf automake libtool make cmake \
    zlib-devel openssl-devel pcre-devel \
    libaio curl-devel libxml2-devel glibc-devel glib2-devel gd-devel gd2-devel libjpeg-devel libpng-devel freetype-devel \
    && ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key \
    && ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key
COPY authorized_keys /root/.ssh/authorized_keys

# nginx和filebeat安装
COPY nginx/nginx-1.14.2.tar.gz nginx-1.14.2.tar.gz
COPY nginx/openssl-1.1.1c.tar.gz openssl-1.1.1c.tar.gz
COPY filebeat/filebeat-7.5.1-x86_64.rpm filebeat-7.5.1-x86_64.rpm
RUN tar zxf openssl-1.1.1c.tar.gz \
    && tar zxf nginx-1.14.2.tar.gz \
    && cd nginx-1.14.2 \
    && ./configure --user=www --group=www \
    --prefix=/app/local/nginx \
    --with-http_stub_status_module \
    --with-openssl=../openssl-1.1.1c \
    --with-openssl-opt='enable-tls1_3 enable-weak-ssl-ciphers' \
    --with-http_ssl_module \
    --with-http_realip_module \
    --with-http_sub_module \
    --with-pcre \
    --with-http_v2_module \
    && make -j2 && make install \
    && cd && rpm -ivh filebeat-7.5.1-x86_64.rpm \
    && rm -rf nginx-* openssl-1.1.1c* filebeat* \
    && useradd www

COPY nginx/nginx.conf /app/local/nginx/conf/nginx.conf
COPY nginx/ngx_logrotate /etc/logrotate.d/nginx

# php71安装
COPY php/mcrypt-2.6.8.tar.gz php/
COPY php/mhash-0.9.9.9.tar.gz php/
COPY php/libmcrypt-2.5.8.tar.gz php/
COPY php/71/php-7.1.30.tar.gz php/
COPY php/71/libmemcached-1.0.18.tar.gz php/
COPY php/71/freetype-2.7.tar.bz2 php/
COPY php/71/libpng-1.6.32.tar.gz php/
COPY php/71/icu4c-58_2-src.tgz php/
COPY php/71/jpegsrc.v9c.tar.gz php/
COPY php/71/memcached-3.0.4.tgz php/
COPY php/71/mongodb-1.4.3.tgz php/
COPY php/71/redis-4.0.2.tgz php/

RUN cd php \
    && tar -zxf libmcrypt-2.5.8.tar.gz \
    && cd libmcrypt-2.5.8 \
    && ./configure \
    && make && make install \
    && cd .. \
    && tar -zxf mhash-0.9.9.9.tar.gz \
    && cd mhash-0.9.9.9 \
    && ./configure \
    && make && make install \
    && cd .. \ 
    && tar -zxf mcrypt-2.6.8.tar.gz \
    && cd mcrypt-2.6.8 \
    && LD_LIBRARY_PATH=/usr/local/lib ./configure \
    && make && make install \
    && cd .. \
    && tar -zxf libmemcached-1.0.18.tar.gz \
    && cd libmemcached-1.0.18 \
    && ./configure --prefix=/app/local/libs/libmemcached --with-memcached \
    && make && make install \
    && cd .. \
    && tar -xvf freetype-2.7.tar.bz2 \
    && cd freetype-2.7 \
    && ./configure --prefix=/app/local/libs/freetype --enable-shared \
    && make && make install \
    && cd .. \
    && tar -xvf jpegsrc.v9c.tar.gz \
    && cd jpeg-9c \
    && ./configure --prefix=/app/local/libs/jpeg --enable-shared \
    && make && make install \
    && cd .. \
    && tar -xvf libpng-1.6.32.tar.gz \
    && cd libpng-1.6.32 \
    && ./configure --prefix=/app/local/libs/png --enable-shared \
    && make && make install \
    && cd .. \
    && tar -xf icu4c-58_2-src.tgz \
    && cd icu/source \
    && ./configure --prefix=/app/local/libs/icu \
    && make && make install \
    && cd ../.. \
    && tar -zxf php-7.1.30.tar.gz \
    && cp -ar php-7.1.30/ext/zlib/config0.m4 php-7.1.30/ext/zlib/config.m4 \
    && cd php-7.1.30 \
    && ./configure --prefix=/app/local/php \
    --with-config-file-path=/app/local/php/etc \
    --enable-fpm \
    --enable-mbstring \
    --with-mhash \
    --with-mcrypt \
    --with-curl \
    --with-openssl \
    --with-mysqli=mysqlnd \
    --with-pdo-mysql=mysqlnd \
    --with-jpeg-dir=/app/local/libs/jpeg \
    --with-png-dir=/app/local/libs/png \
    --with-freetype-dir=/app/local/libs/freetype \
    --with-gd \
    --with-zlib \
    --enable-ftp \
    --enable-soap \
    --enable-bcmath \
    --with-icu-dir=/app/local/libs/icu \
    --enable-intl \
    && make && make install \
    && cd .. \
    && tar -xf memcached-3.0.4.tgz \
    && cd memcached-3.0.4 \
    && /app/local/php/bin/phpize \
    && ./configure --enable-memcached \
    --with-php-config=/app/local/php/bin/php-config \
    --with-zlib-dir \
    --with-libmemcached-dir=/app/local/libs/libmemcached \
    --disable-memcached-sasl \
    && make && make install \
    && cd .. \
    && tar zxvf mongodb-1.4.3.tgz \
    && cd mongodb-1.4.3 \
    && /app/local/php/bin/phpize \
    && ./configure --with-php-config=/app/local/php/bin/php-config \
    && make && make install \
    && cd .. \
    && tar -xf redis-4.0.2.tgz \
    && cd redis-4.0.2 \
    && /app/local/php/bin/phpize \
    && ./configure --with-php-config=/app/local/php/bin/php-config \
    && make && make install \
    && cd && rm -rf php \
    && yum remove -y gcc gcc-c++ autoconf automake libtool make cmake \
    zlib-devel openssl-devel pcre-devel libaio curl-devel libxml2-devel  \
    glibc-devel glib2-devel gd-devel gd2-devel libjpeg-devel libpng-devel freetype-devel \
    && yum clean all

COPY php/71/php.ini /app/local/php/etc/
COPY php/71/php-fpm.conf /app/local/php/etc/
COPY php/71/logrotate-php-fpm /etc/logrotate.d/php-fpm
COPY nginx/default.conf /app/local/nginx/conf/vhosts/
COPY nginx/info.php /app/data/site/

EXPOSE 22 80

COPY run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

ENTRYPOINT ["/usr/local/bin/run.sh"]
CMD ["/bin/bash"]