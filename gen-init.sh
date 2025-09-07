#!/bin/bash
export $(grep -v '^#' .env | xargs)
PGUSER=${PGUSER:-postgres}
sed "s/{{PGUSER}}/$PGUSER/g" init.sql.template > init.sql