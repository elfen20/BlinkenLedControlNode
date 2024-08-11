# make file

.PHONY: up down build bash logs

# builds + starts the containers in the background
up:
	docker compose up -d

# shuts down all containers
down:
	docker compose down

# builds all containers
build:
	docker compose build --no-cache --force-rm

# gets you a shell in the container
bash:
	docker compose exec app "bash"

# executes the program interactive
start:
	docker compose exec app "bash"

# prints logs
logs:
	docker compose logs

.DEFAULT_GOAL :=
# Show this help prompt.
help:
	@ echo
	@ echo '  Usage:'
	@ echo ''
	@ echo '    make <target> [flags...]'
	@ echo ''
	@ echo '  Targets:'
	@ echo ''
	@ awk '/^#/{ comment = substr($$0,3) } comment && /^[a-zA-Z][a-zA-Z0-9_-]+ ?:/{ print "   ", $$1, comment }' $(MAKEFILE_LIST) | column -t -s ':' | sort
	@ echo ''
	@ echo '  Flags:'
	@ echo ''
	@ awk '/^#/{ comment = substr($$0,3) } comment && /^[a-zA-Z][a-zA-Z0-9_-]+ ?\?=/{ print "   ", $$1, $$2, comment }' $(MAKEFILE_LIST) | column -t -s '?=' | sort
	@ echo ''

