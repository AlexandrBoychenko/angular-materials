FROM mysql:5.7

ENV MYSQL_DATABASE="todo"
ENV MYSQL_USER="root"
ENV MYSQL_ROOT_PASSWORD="root"
ENV MYSQL_PASSWORD="root"

ADD ./init.sql /docker-entrypoint-initdb.d

CMD /bin/bash -c "/usr/bin/mysqld_safe --skip-grant-tables &" && \
  sleep 5 && \
  mysql -u root --password="root" todo < /docker-entrypoint-initdb.d/init.sql