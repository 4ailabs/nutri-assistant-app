#!/bin/bash

# Inicializar Git en el directorio actual
git init

# Agregar todos los archivos al staging area
git add .

# Hacer el primer commit
git commit -m "Initial commit"

# Agregar el repositorio remoto
git remote add origin https://github.com/4ailabs/nutri-assistant-app.git

# Cambiar el nombre de la rama master a main si es necesario
git branch -M main

# Hacer push al repositorio remoto
git push -u origin main
