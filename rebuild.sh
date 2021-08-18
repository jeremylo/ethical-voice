docker-compose down --rmi local
docker volume rm ethical-voice_app-build
docker volume rm ethical-voice_dashboard-build
docker-compose up --build -d
