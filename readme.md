## Описание

Backend для АРМ Управления

<pre>
docker run -d --rm --env-file ./.env --name manager-arm-release -p 3000:3000 akrasnov87/manager-arm:0.0.1
</pre>

Где в .env файле хранятся следующие настройки:
<pre>
# тип стенда
app_env=release
# внешний порт
extend_port=3000
# виртуальный каталог
virtual_dir_path=/release
# строка подключения к БД
connection_string=host:host_name;port:5432;user:******;password:********;database:manager-release-db
# режим запуска
debug=true
# версия контейнера NodeJS
container_version=0.0.1
# папка с логами от NodeJS
container_version=0.0.1

# версия контейнера АРМ
arm_version=1.0
# порт для АРМ
arm_port=81
</pre>

### Docker compose

<pre>
docker compose -p arm-release --env-file .env up -d
</pre>

### Сборка

<pre>
docker build -t akrasnov87/manager-arm:0.0.1 .
</pre>

### Активация
```
http://localhost:3000/manager/dev/activate?key=A0-A000-A0000
```