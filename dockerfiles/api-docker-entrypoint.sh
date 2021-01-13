dockerize -wait tcp://maria-database:3306 -timeout 20s

echo "Start server"
npx nodemon bin/www &
sleep 2
npx sequelize-cli db:seed:all

while true; do sleep 1; done