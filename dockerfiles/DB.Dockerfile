FROM mariadb

COPY maria/my.cnf /etc/mysql

RUN chmod 755 /etc/mysql/my.cnf 

EXPOSE 3306